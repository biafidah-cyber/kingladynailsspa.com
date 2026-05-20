import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { siteConfig } from "@/config/site";
import { marked } from "marked";
import { rateLimit, getRateLimitIp } from "@/lib/rateLimit";

// Lazy-initialize so build-time module evaluation doesn't throw without a key
function getClaude() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });
}

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true; // dev mode: no secret set = allow
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  return auth === secret;
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Admin API disabled in production" }, { status: 403 });
  }

  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getRateLimitIp(req);
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests — wait a minute" }, { status: 429 });
  }

  const { keyword, businessContext, kwData } = await req.json();

  if (!keyword) {
    return NextResponse.json({ error: "keyword is required" }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set in .env.local" }, { status: 500 });
  }

  const lsiKws = kwData?.related?.slice(0, 8).join(", ") || siteConfig.lsiKeywords.slice(0, 6).join(", ");
  const bizCtx = businessContext || `${siteConfig.businessName} in ${siteConfig.city}, ${siteConfig.stateCode}`;

  const systemPrompt = `You are an expert SEO content writer in 2026. Write fully SEO-optimized, human-like articles following Google Helpful Content, E-E-A-T, and Semantic SEO guidelines. Output ONLY clean HTML — no markdown, no preamble, no AI disclaimers.`;

  const userPrompt = `Write a complete SEO article for this keyword: "${keyword}"

Business context: ${bizCtx}
LSI/semantic keywords to use naturally: ${lsiKws}
${kwData?.monthly_volume ? `Monthly search volume: ${kwData.monthly_volume.toLocaleString()} searches/month` : ""}

MANDATORY RULES — never skip any:

1. HUMAN-LIKE WRITING
   - Natural, conversational tone. Simple vocabulary.
   - No robotic phrases, no keyword stuffing, no generic filler.
   - Write like a real expert sharing genuine knowledge.

2. STRUCTURE (use these HTML tags)
   - <h1> once for the main title (must include primary keyword)
   - <h2> for main sections (3-6 sections)
   - <h3> for subsections
   - Short paragraphs (2-3 lines max), <p> tags
   - Use <ul>/<ol>/<li> for lists
   - Use <strong> to bold important terms

3. KEYWORD USAGE
   - Primary keyword "${keyword}" in: H1, first paragraph, one H2, conclusion
   - Use LSI keywords naturally (never forced)
   - Keyword density: 1-2% (not more)

4. CONTENT LENGTH & DEPTH
   - Minimum 1,500 words
   - Cover all relevant subtopics
   - Include real examples, practical tips, statistics
   - First paragraph must hook the reader AND include the keyword in first 100 words

5. EXTERNAL LINKS — MANDATORY (include exactly 3)
   - Format: <a href="URL" rel="nofollow noopener" target="_blank">anchor text</a>
   - Use real, reputable URLs (Wikipedia, gov sites, major publications)
   - Place naturally within paragraphs

6. INTERNAL LINKS — MANDATORY (include exactly 2)
   - Format: <a href="[INTERNAL_LINK_1]" title="related topic">anchor text</a>
   - Use [INTERNAL_LINK_1] and [INTERNAL_LINK_2] as placeholder URLs

7. IMAGES — MANDATORY (include exactly 3 placeholders)
   - Format: <!-- IMAGE: detailed alt text with keyword -->
   - One near top, one middle, one near end

8. FAQ SECTION — MANDATORY
   - Add a <h2>Frequently Asked Questions</h2> section
   - Include exactly 5 FAQs
   - Format: <h3>Question here?</h3><p>Answer here (concise, 30-50 words)</p>

9. E-E-A-T
   - Write with authority: include specific facts, numbers, years
   - No vague statements — everything must be concrete

10. OUTPUT FORMAT
    - Clean HTML only: h1, h2, h3, p, ul, ol, li, a, strong, em, blockquote
    - Do NOT include <html>, <head>, <body> tags
    - Do NOT mention AI, ChatGPT, or that content is AI-generated
    - Do NOT add explanations outside the article HTML
    - Tone: Expert, slightly conversational, trustworthy, friendly

START WRITING NOW:`;

  try {
    const message = await getClaude().messages.create({
      model:      "claude-opus-4-5",
      max_tokens: 8000,
      system:     systemPrompt,
      messages:   [{ role: "user", content: userPrompt }],
    });

    const block = message.content[0];
    const rawHtml = block.type === "text" ? block.text : "";

    // Extract title from <h1> tag
    const titleMatch = rawHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const title = titleMatch
      ? titleMatch[1].replace(/<[^>]+>/g, "").trim()
      : `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} — Complete Guide`;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);

    // Generate meta description (first <p> text, truncated to 155 chars)
    const firstParagraph = rawHtml.match(/<p>([\s\S]*?)<\/p>/);
    const description = firstParagraph
      ? firstParagraph[1].replace(/<[^>]+>/g, "").slice(0, 155) + "…"
      : `${keyword} — expert guide by ${siteConfig.businessName}`;

    // Auto-generate tags from LSI keywords
    const tags = [keyword, ...siteConfig.lsiKeywords.slice(0, 4)];

    return NextResponse.json({
      title,
      slug,
      description,
      html:           rawHtml,
      primaryKeyword: keyword,
      tags,
      wordCount:      rawHtml.replace(/<[^>]+>/g, " ").split(/\s+/).length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
