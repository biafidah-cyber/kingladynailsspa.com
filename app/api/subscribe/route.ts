import { NextResponse } from "next/server";
import { rateLimitAsync, getRateLimitIp } from "@/lib/rateLimit";
import { isSupabaseEnabled, dbSaveSubscriber } from "@/lib/db";
import { localSaveSubscriber } from "@/lib/localDb";

export async function POST(request: Request) {
  const ip = getRateLimitIp(request);
  if (!await rateLimitAsync(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  try {
    const body  = await request.json();
    const email: unknown = body?.email;
    const name:  unknown = body?.name;

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName  = typeof name === "string" ? name.slice(0, 120).trim() : undefined;
    const source     = typeof body?.source === "string" ? body.source : "site";

    // ── Primary: self-hosted DB ───────────────────────────────────────────────
    if (isSupabaseEnabled()) {
      await dbSaveSubscriber(cleanEmail, cleanName, source);
    } else {
      // Filesystem fallback (works in dev; ephemeral on serverless prod)
      localSaveSubscriber(cleanEmail, cleanName);
    }

    // ── Optional: also forward to ConvertKit if configured ───────────────────
    const FORM_ID = process.env.CONVERTKIT_FORM_ID;
    const CK_KEY  = process.env.CONVERTKIT_API_KEY;
    if (FORM_ID && CK_KEY) {
      try {
        await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: CK_KEY, email: cleanEmail }),
        });
      } catch { /* non-fatal */ }
    }

    // ── Optional: also forward to Mailchimp if configured ────────────────────
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;
    const MC_KEY  = process.env.MAILCHIMP_API_KEY;
    if (LIST_ID && MC_KEY) {
      try {
        const dc = MC_KEY.split("-")[1] ?? "us1";
        await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`any:${MC_KEY}`).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email_address: cleanEmail, status: "subscribed" }),
        });
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
