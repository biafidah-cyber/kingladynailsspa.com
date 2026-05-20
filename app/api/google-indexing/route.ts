import { NextRequest, NextResponse } from "next/server";
import { createSign } from "crypto";

interface ServiceAccountCredentials {
  type: string;
  client_email: string;
  private_key: string;
  project_id?: string;
}

interface IndexResult {
  url: string;
  status: "success" | "error";
  message?: string;
}

/** Sign a JWT with the service account private key using Node.js built-in crypto */
function buildServiceAccountJWT(
  clientEmail: string,
  privateKey: string,
  scope: string
): string {
  const now = Math.floor(Date.now() / 1000);
  const header  = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: clientEmail,
    sub: clientEmail,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })).toString("base64url");

  const signingInput = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = sign.sign(privateKey, "base64url");
  return `${signingInput}.${signature}`;
}

async function getAccessToken(credentials: ServiceAccountCredentials, scope: string): Promise<string> {
  const jwt = buildServiceAccountJWT(credentials.client_email, credentials.private_key, scope);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion:  jwt,
    }),
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(data.error_description ?? data.error ?? "Failed to get access token from Google");
  }
  return data.access_token as string;
}

function validateCredentials(raw: unknown): ServiceAccountCredentials {
  if (!raw || typeof raw !== "object") throw new Error("Credentials must be a JSON object");
  const c = raw as Record<string, unknown>;
  if (c.type !== "service_account")  throw new Error("Credentials must be a service_account JSON (type field must be 'service_account')");
  if (!c.client_email || typeof c.client_email !== "string") throw new Error("Missing client_email in credentials");
  if (!c.private_key  || typeof c.private_key  !== "string") throw new Error("Missing private_key in credentials");
  return c as unknown as ServiceAccountCredentials;
}

/** POST /api/google-indexing
 * Body: { action: "submit" | "add-site", credentials: {...}, urls?: string[], type?: string, siteUrl?: string }
 */
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    action: string;
    credentials: unknown;
    urls?: string[];
    type?: string;
    siteUrl?: string;
  };

  let credentials: ServiceAccountCredentials;
  try {
    credentials = validateCredentials(body.credentials);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  try {
    // ── Submit URLs to Indexing API ───────────────────────────────────────────
    if (body.action === "submit") {
      const urls = (body.urls ?? []).filter(u => typeof u === "string" && u.startsWith("http")).slice(0, 200);
      if (urls.length === 0) return NextResponse.json({ error: "No valid URLs provided" }, { status: 400 });

      const notificationType = body.type === "URL_DELETED" ? "URL_DELETED" : "URL_UPDATED";
      const token = await getAccessToken(credentials, "https://www.googleapis.com/auth/indexing");

      const results: IndexResult[] = [];
      for (const url of urls) {
        try {
          const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ url, type: notificationType }),
            signal: AbortSignal.timeout(8000),
          });
          const data = await res.json();
          if (!res.ok) {
            results.push({ url, status: "error", message: data.error?.message ?? `HTTP ${res.status}` });
          } else {
            results.push({ url, status: "success" });
          }
        } catch (e: unknown) {
          results.push({ url, status: "error", message: (e as Error).message });
        }
      }

      return NextResponse.json({ results });
    }

    // ── Add site to Search Console ────────────────────────────────────────────
    if (body.action === "add-site") {
      const siteUrl = body.siteUrl?.trim();
      if (!siteUrl) return NextResponse.json({ error: "siteUrl is required" }, { status: 400 });

      const token = await getAccessToken(
        credentials,
        "https://www.googleapis.com/auth/webmasters"
      );

      const encoded = encodeURIComponent(siteUrl);
      const res = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encoded}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(8000),
        }
      );

      if (res.status === 204 || res.ok) {
        return NextResponse.json({ ok: true, siteUrl });
      }

      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message ?? `Search Console returned HTTP ${res.status}`);
    }

    return NextResponse.json({ error: "Unknown action. Use 'submit' or 'add-site'." }, { status: 400 });

  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
