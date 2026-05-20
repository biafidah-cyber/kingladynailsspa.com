import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/neonDb";

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  return auth === secret;
}

export async function GET() {
  try {
    const rows = await query<{ key: string; value: string }>(
      `SELECT key, value FROM site_config`
    );
    const config: Record<string, string> = {};
    for (const row of rows) config[row.key] = row.value;
    return NextResponse.json(config);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as Record<string, string>;

  try {
    // Upsert each key-value pair
    for (const [key, value] of Object.entries(body)) {
      await query(
        `INSERT INTO site_config (key, value, updated_at)
         VALUES ($1, $2, now())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, value]
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
