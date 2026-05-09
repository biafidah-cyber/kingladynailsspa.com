import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  return auth === secret;
}

/**
 * POST /api/save-image
 * Downloads a DALL-E image URL to /public/images/posts/[slug].jpg
 * so it is permanently stored before the DALL-E URL expires (~1 hour).
 *
 * Body: { url: string, slug: string }
 * Returns: { path: "/images/posts/[slug].jpg", bytes: number }
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }

  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { url, slug } = body as { url?: string; slug?: string };

  if (!url || typeof url !== "string" || !url.startsWith("https://")) {
    return NextResponse.json({ error: "Valid HTTPS URL required" }, { status: 400 });
  }

  if (!slug || typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Valid slug required (lowercase letters, numbers, hyphens)" }, { status: 400 });
  }

  // Download image from DALL-E blob storage
  let imageRes: Response;
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 30_000);
  try {
    imageRes = await fetch(url, { signal: controller.signal });
  } catch {
    return NextResponse.json({ error: "Failed to reach image URL — it may have expired" }, { status: 502 });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!imageRes.ok) {
    return NextResponse.json(
      { error: `Image download failed: ${imageRes.status} ${imageRes.statusText}` },
      { status: 502 }
    );
  }

  const buffer = Buffer.from(await imageRes.arrayBuffer());

  // Reject unreasonably large files (max 15 MB)
  if (buffer.length > 15_000_000) {
    return NextResponse.json({ error: "Image exceeds 15 MB limit" }, { status: 413 });
  }

  // Ensure /public/images/posts/ directory exists
  const dir = join(process.cwd(), "public", "images", "posts");
  await mkdir(dir, { recursive: true });

  const fileName = `${slug}.jpg`;
  await writeFile(join(dir, fileName), buffer);

  return NextResponse.json({
    path:  `/images/posts/${fileName}`,
    bytes: buffer.length,
    slug,
  });
}
