import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  return auth === secret;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** PUT /api/edit-post — update frontmatter fields (title, description, publishDate) + raw markdown body */
export async function PUT(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }

  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, title, description, content, publishDate } = await req.json();

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }
  if (content.length > 1_000_000) {
    return NextResponse.json({ error: "Content too large (max 1 MB)" }, { status: 413 });
  }

  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Read existing frontmatter and merge updates
  const existing = fs.readFileSync(filePath, "utf8");
  const { data } = matter(existing);

  if (title) data.title = title;
  if (description) data.description = description;

  if (publishDate && /^\d{4}-\d{2}-\d{2}$/.test(publishDate)) {
    data.publishDate = publishDate;
  } else if (publishDate === "") {
    delete data.publishDate; // remove schedule
  }

  data.wordCount = content.replace(/\s+/g, " ").trim().split(" ").length;

  // Rebuild file: serialize frontmatter + new body
  const updatedFile = matter.stringify(content, data);

  if (updatedFile.length > 1_000_000) {
    return NextResponse.json({ error: "Content too large (max 1 MB)" }, { status: 413 });
  }

  fs.writeFileSync(filePath, updatedFile, "utf8");

  return NextResponse.json({ success: true, slug, wordCount: data.wordCount });
}
