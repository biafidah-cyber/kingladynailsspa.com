import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  return auth === secret;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/** GET /api/testimonials — returns featured (or all) testimonials */
export async function GET(req: NextRequest) {
  const sb = getSupabase();
  if (!sb) return NextResponse.json({ testimonials: [] });

  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";

  const query = sb
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (!all) query.eq("featured", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ testimonials: data ?? [] });
}

/** POST /api/testimonials — insert a new testimonial */
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabase();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const body = await req.json() as {
    name?: string;
    initials?: string;
    rating?: number;
    text?: string;
    service?: string;
    source?: string;
    featured?: boolean;
  };

  if (!body.name || !body.text) {
    return NextResponse.json({ error: "name and text are required" }, { status: 400 });
  }

  const row = {
    name:     body.name.trim(),
    initials: (body.initials ?? body.name.split(/\s+/).map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()).trim(),
    rating:   typeof body.rating === "number" ? body.rating : 5,
    text:     body.text.trim(),
    service:  (body.service ?? "Google Review").trim(),
    source:   (body.source  ?? "Google").trim(),
    featured: body.featured ?? false,
  };

  const { data, error } = await sb.from("testimonials").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ testimonial: data });
}

/** DELETE /api/testimonials?id=<uuid> — remove a testimonial */
export async function DELETE(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabase();
  if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await sb.from("testimonials").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
