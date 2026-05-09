import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  return auth === secret;
}

// ── Google Analytics Data API v1beta ─────────────────────────────────────────
// Uses a service account JSON (base64-encoded) from GA4_SERVICE_ACCOUNT_KEY env var
// and a GA4 property ID from GA4_PROPERTY_ID env var.

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getGoogleAccessToken(serviceAccountJson: string): Promise<string> {
  let creds: Record<string, string>;
  try {
    creds = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error("GA4_SERVICE_ACCOUNT_KEY is not valid JSON");
  }

  const { client_email, private_key } = creds;
  if (!client_email || !private_key) {
    throw new Error("Service account JSON missing client_email or private_key");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = base64url(
    Buffer.from(
      JSON.stringify({
        iss: client_email,
        scope: "https://www.googleapis.com/auth/analytics.readonly",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      })
    )
  );

  const signingInput = `${header}.${payload}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signingInput);
  // PEM key may have escaped newlines
  const pemKey = private_key.replace(/\\n/g, "\n");
  const signature = base64url(sign.sign(pemKey));
  const jwt = `${signingInput}.${signature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };
  if (!tokenData.access_token) {
    throw new Error(tokenData.error ?? "Failed to obtain access token");
  }
  return tokenData.access_token;
}

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }

  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const propertyId = process.env.GA4_PROPERTY_ID;
  const serviceAccountKey = process.env.GA4_SERVICE_ACCOUNT_KEY;

  if (!propertyId || !serviceAccountKey) {
    return NextResponse.json({
      configured: false,
      message:
        "Add GA4_PROPERTY_ID and GA4_SERVICE_ACCOUNT_KEY to .env.local to enable analytics. " +
        "See DOCUMENTATION.md § 14 for setup instructions.",
    });
  }

  try {
    const token = await getGoogleAccessToken(serviceAccountKey);

    const body = {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
      dimensions: [{ name: "pagePath" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 20,
    };

    const [pageReport, summaryReport] = await Promise.all([
      // Top pages breakdown
      fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      ),
      // Site-wide totals
      fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            metrics: [
              { name: "screenPageViews" },
              { name: "sessions" },
              { name: "bounceRate" },
              { name: "averageSessionDuration" },
              { name: "newUsers" },
            ],
          }),
        }
      ),
    ]);

    const [pageData, summaryData] = await Promise.all([
      pageReport.json() as Promise<GAReportResponse>,
      summaryReport.json() as Promise<GAReportResponse>,
    ]);

    // Parse top pages
    const topPages = (pageData.rows ?? []).map((row) => ({
      path:     row.dimensionValues?.[0]?.value ?? "",
      views:    Number(row.metricValues?.[0]?.value ?? 0),
      sessions: Number(row.metricValues?.[1]?.value ?? 0),
    }));

    // Parse summary totals
    const summaryRow = summaryData.rows?.[0];
    const summary = {
      pageViews:    Number(summaryRow?.metricValues?.[0]?.value ?? 0),
      sessions:     Number(summaryRow?.metricValues?.[1]?.value ?? 0),
      bounceRate:   parseFloat((Number(summaryRow?.metricValues?.[2]?.value ?? 0) * 100).toFixed(1)),
      avgDuration:  Math.round(Number(summaryRow?.metricValues?.[3]?.value ?? 0)),
      newUsers:     Number(summaryRow?.metricValues?.[4]?.value ?? 0),
    };

    return NextResponse.json({ configured: true, summary, topPages });
  } catch (err) {
    return NextResponse.json(
      { configured: true, error: (err as Error).message },
      { status: 500 }
    );
  }
}

interface GAReportResponse {
  rows?: Array<{
    dimensionValues?: Array<{ value: string }>;
    metricValues?: Array<{ value: string }>;
  }>;
}
