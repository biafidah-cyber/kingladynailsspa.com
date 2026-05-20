import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/neonDb";

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  return auth === secret;
}

/** GET /api/testimonials — returns featured (or all) testimonials */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "1";

    const sql = all
      ? `SELECT * FROM testimonials ORDER BY created_at DESC`
      : `SELECT * FROM testimonials WHERE featured = true ORDER BY created_at DESC LIMIT 6`;

    const rows = await query(sql);
    return NextResponse.json({ testimonials: rows });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/** POST /api/testimonials — insert a new testimonial */
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    name?: string; initials?: string; rating?: number;
    text?: string; service?: string; source?: string; featured?: boolean;
  };

  if (!body.name || !body.text)
    return NextResponse.json({ error: "name and text are required" }, { status: 400 });

  const initials = (body.initials ?? body.name.split(/\s+/).map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()).trim();
  const rating   = typeof body.rating === "number" ? body.rating : 5;
  const service  = (body.service ?? "Google Review").trim();
  const source   = (body.source  ?? "Google").trim();
  const featured = body.featured ?? false;

  try {
    const rows = await query(
      `INSERT INTO testimonials (name, initials, rating, text, service, source, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [body.name.trim(), initials, rating, body.text.trim(), service, source, featured]
    );
    return NextResponse.json({ testimonial: rows[0] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/** DELETE /api/testimonials?id=<uuid> — remove a testimonial */
export async function DELETE(req: NextRequest) {
  if (!isAdminAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  try {
    await query(`DELETE FROM testimonials WHERE id = $1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
