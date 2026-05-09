import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRateLimitIp } from "@/lib/rateLimit";

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  return auth === secret;
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Keyword research API disabled in production" }, { status: 403 });
  }

  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getRateLimitIp(req);
  if (!rateLimit(ip, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests — wait a minute" }, { status: 429 });
  }

  const { keyword } = await req.json();
  if (!keyword) return NextResponse.json({ error: "keyword is required" }, { status: 400 });

  const login    = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    return NextResponse.json({
      keyword,
      monthly_volume: null,
      cpc:            null,
      competition:    "UNKNOWN",
      related:        [],
      serp:           [],
      source:         "mock — set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD for real data",
    });
  }

  const auth = Buffer.from(`${login}:${password}`).toString("base64");

  // Run volume + suggestions + SERP in parallel
  const [volRes, suggRes, serpRes] = await Promise.allSettled([
    fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live", {
      method:  "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body:    JSON.stringify([{ keywords: [keyword], location_code: 2840, language_code: "en" }]),
    }),
    fetch("https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live", {
      method:  "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body:    JSON.stringify([{ keyword, location_code: 2840, language_code: "en", limit: 12 }]),
    }),
    fetch("https://api.dataforseo.com/v3/serp/google/organic/live/advanced", {
      method:  "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body:    JSON.stringify([{ keyword, location_code: 2840, language_code: "en", depth: 5, se_domain: "google.com" }]),
    }),
  ]);

  // Parse volume
  let monthly_volume: number | null = null;
  let cpc: number | null = null;
  let competition = "UNKNOWN";
  if (volRes.status === "fulfilled" && volRes.value.ok) {
    const volJson = await volRes.value.json();
    const item = volJson?.tasks?.[0]?.result?.[0];
    if (item) {
      monthly_volume = item.search_volume   ?? null;
      cpc            = item.cpc             ?? null;
      const rawComp  = item.competition ?? item.competition_level ?? "UNKNOWN";
      competition    = typeof rawComp === "string" ? rawComp : String(rawComp);
    }
  }

  // Parse related keywords
  let related: string[] = [];
  if (suggRes.status === "fulfilled" && suggRes.value.ok) {
    const suggJson = await suggRes.value.json();
    related = (suggJson?.tasks?.[0]?.result?.[0]?.items || [])
      .map((i: { keyword: string }) => i.keyword as string)
      .filter((kw: string) => kw && kw !== keyword)
      .slice(0, 12);
  }

  // Parse SERP results (top 5 organic positions)
  interface SerpResult { rank: number; title: string; url: string; description?: string }
  let serp: SerpResult[] = [];
  if (serpRes.status === "fulfilled" && serpRes.value.ok) {
    const serpJson = await serpRes.value.json();
    const items = serpJson?.tasks?.[0]?.result?.[0]?.items ?? [];
    serp = items
      .filter((i: { type: string }) => i.type === "organic")
      .slice(0, 5)
      .map((i: { rank_group: number; title: string; url: string; description?: string }) => ({
        rank:        i.rank_group,
        title:       i.title,
        url:         i.url,
        description: i.description,
      }));
  }

  return NextResponse.json({ keyword, monthly_volume, cpc, competition, related, serp, source: "dataforseo" });
}

