import { NextRequest, NextResponse } from "next/server";

interface IndexNowResult {
  engine: string;
  status: "success" | "error";
  message?: string;
}

const ENGINES: { id: string; name: string; endpoint: string }[] = [
  { id: "hub",    name: "IndexNow Hub (Bing+Yandex+Naver+all)", endpoint: "https://api.indexnow.org/indexnow" },
  { id: "bing",   name: "Bing",    endpoint: "https://www.bing.com/indexnow" },
  { id: "yandex", name: "Yandex",  endpoint: "https://yandex.com/indexnow" },
];

/** POST /api/indexnow
 *  Body: { key, host, urls: string[], engines?: ("hub"|"bing"|"yandex")[] }
 *  Submits URLs to IndexNow-compatible engines (no credentials required).
 *  Status 200/202 = accepted; 403 = key file not found; 422 = URL/host mismatch.
 */
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    key?: string;
    host?: string;
    urls?: unknown[];
    engines?: string[];
  };

  const { key, host } = body;
  const urls = (body.urls ?? []).filter((u): u is string => typeof u === "string" && u.startsWith("http")).slice(0, 10000);
  const engineIds = body.engines ?? ["hub"];

  if (!key || typeof key !== "string" || key.trim().length < 8)
    return NextResponse.json({ error: "key must be at least 8 characters" }, { status: 400 });
  if (!host || typeof host !== "string")
    return NextResponse.json({ error: "host is required" }, { status: 400 });
  if (urls.length === 0)
    return NextResponse.json({ error: "At least one valid URL is required" }, { status: 400 });

  const keyLocation = `https://${host.replace(/^https?:\/\//, "")}/${key.trim()}.txt`;
  const selected = ENGINES.filter(e => engineIds.includes(e.id));
  if (selected.length === 0)
    return NextResponse.json({ error: "Select at least one engine" }, { status: 400 });

  const results: IndexNowResult[] = [];

  for (const engine of selected) {
    try {
      const res = await fetch(engine.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: host.replace(/^https?:\/\//, "").replace(/\/$/, ""),
          key:  key.trim(),
          keyLocation,
          urlList: urls,
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (res.status === 200 || res.status === 202) {
        results.push({ engine: engine.name, status: "success" });
      } else if (res.status === 400) {
        results.push({ engine: engine.name, status: "error", message: "Invalid format or host mismatch (400)" });
      } else if (res.status === 403) {
        results.push({ engine: engine.name, status: "error", message: `Key file not found — create public/${key.trim()}.txt (403)` });
      } else if (res.status === 422) {
        results.push({ engine: engine.name, status: "error", message: "URLs don't belong to the declared host (422)" });
      } else if (res.status === 429) {
        results.push({ engine: engine.name, status: "error", message: "Rate limited — try again tomorrow (429)" });
      } else {
        const text = await res.text().catch(() => "");
        results.push({ engine: engine.name, status: "error", message: `HTTP ${res.status}${text ? ": " + text.slice(0, 80) : ""}` });
      }
    } catch (e: unknown) {
      results.push({ engine: engine.name, status: "error", message: (e as Error).message });
    }
  }

  return NextResponse.json({ results });
}
