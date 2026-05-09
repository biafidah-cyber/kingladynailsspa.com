import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  return auth === secret;
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }

  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not set" }, { status: 500 });
  }

  const { prompt, style } = await req.json();

  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
    return NextResponse.json({ error: "prompt is required (min 5 chars)" }, { status: 400 });
  }

  // Sanitize: strip any potential injection attempts from user prompt
  const safePrompt = prompt.replace(/[<>]/g, "").slice(0, 500);
  const safeStyle  = (style ?? "photorealistic professional photography").slice(0, 100);

  const fullPrompt = `${safePrompt}. Style: ${safeStyle}. High quality, sharp focus, professional lighting. No text, no watermarks.`;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.images.generate({
    model:   "dall-e-3",
    prompt:  fullPrompt,
    n:       1,
    size:    "1792x1024",   // Wide format — perfect for blog headers
    quality: "standard",   // "hd" for $0.08 — switch if you want ultra quality
    style:   "natural",    // "vivid" for more dramatic
  });

  const url = response.data?.[0]?.url;
  if (!url) {
    return NextResponse.json({ error: "No image URL returned from DALL-E" }, { status: 500 });
  }

  return NextResponse.json({
    url,
    revisedPrompt: response.data?.[0]?.revised_prompt ?? fullPrompt,
    size: "1792x1024",
    cost: "$0.04",
  });
}
