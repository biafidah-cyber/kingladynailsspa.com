/**
 * app/api/comments/route.ts — Self-hosted blog comment system
 *
 * GET  /api/comments?slug=xxx        — public: approved comments for a post
 * GET  /api/comments?all=1           — admin only: all comments incl. pending
 * POST /api/comments                 — submit new comment (rate limited, goes to moderation)
 * PATCH  /api/comments               — admin: approve a comment by id
 * DELETE /api/comments?id=xxx        — admin: delete a comment by id
 *
 * Comments are server-rendered on blog posts so Google can crawl them.
 * New comments start as approved=false — approve in Admin → Leads → Comments tab.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  isSupabaseEnabled,
  dbGetCommentsBySlug,
  dbGetAllComments,
  dbSaveComment,
  dbApproveComment,
  dbDeleteComment,
} from "@/lib/db";
import {
  localGetCommentsBySlug,
  localGetAllComments,
  localSaveComment,
  localApproveComment,
  localDeleteComment,
} from "@/lib/localDb";
import { rateLimitAsync } from "@/lib/rateLimit";

function checkAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const all  = searchParams.get("all") === "1";

  if (all) {
    if (!checkAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const comments = isSupabaseEnabled()
      ? await dbGetAllComments()
      : localGetAllComments();
    return NextResponse.json({ comments });
  }

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  // Strip author_email before returning publicly
  const raw = isSupabaseEnabled()
    ? await dbGetCommentsBySlug(slug)
    : localGetCommentsBySlug(slug);

  const comments = raw.map(({ author_email: _e, ...rest }) => rest);
  return NextResponse.json({ comments });
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limit: 3 comments per IP per 10 minutes
  const ip      = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = await rateLimitAsync(`comment:${ip}`, 3, 600);
  if (limited) {
    return NextResponse.json(
      { error: "Too many comments. Please wait before commenting again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try   { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { post_slug, author_name, author_email, comment_body } =
    body as Record<string, unknown>;

  // Validate
  if (!post_slug || typeof post_slug !== "string" || post_slug.length > 200) {
    return NextResponse.json({ error: "Invalid post" }, { status: 400 });
  }
  if (
    !author_name ||
    typeof author_name !== "string" ||
    author_name.trim().length < 2 ||
    author_name.length > 100
  ) {
    return NextResponse.json({ error: "Name must be 2–100 characters" }, { status: 400 });
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  if (
    !author_email ||
    typeof author_email !== "string" ||
    !emailRe.test(author_email) ||
    author_email.length > 254
  ) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (
    !comment_body ||
    typeof comment_body !== "string" ||
    comment_body.trim().length < 5 ||
    comment_body.length > 2000
  ) {
    return NextResponse.json({ error: "Comment must be 5–2,000 characters" }, { status: 400 });
  }

  const payload = {
    post_slug:    post_slug.trim(),
    author_name:  author_name.trim(),
    author_email: (author_email as string).toLowerCase().trim(),
    body:         comment_body.trim(),
  };

  if (isSupabaseEnabled()) {
    const { error } = await dbSaveComment(payload);
    if (error) {
      console.error("[comments] save error:", error);
      return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
    }
  } else {
    localSaveComment(payload);
  }

  return NextResponse.json({
    ok:      true,
    message: "Your comment has been submitted and is awaiting moderation. Thank you!",
  });
}

// ── PATCH — approve ───────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try   { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { id } = body as Record<string, unknown>;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing comment id" }, { status: 400 });
  }

  if (isSupabaseEnabled()) {
    const { error } = await dbApproveComment(id);
    if (error) return NextResponse.json({ error }, { status: 500 });
  } else {
    localApproveComment(id);
  }

  return NextResponse.json({ ok: true });
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (isSupabaseEnabled()) {
    const { error } = await dbDeleteComment(id);
    if (error) return NextResponse.json({ error }, { status: 500 });
  } else {
    localDeleteComment(id);
  }

  return NextResponse.json({ ok: true });
}
