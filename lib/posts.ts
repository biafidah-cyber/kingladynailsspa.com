import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface Post {
  slug:           string;
  title:          string;
  date:           string;
  publishDate?:   string;
  description:    string;
  primaryKeyword: string;
  category:       string;
  tags:           string[];
  image:          string;
  author:         string;
  content:        string;
  html?:          string;
  readingTime?:   number;
  faqs?:          Array<{ question: string; answer: string }>;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const now = new Date();
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((filename) => parsePostFile(filename.replace(".md", "")))
    .filter((p): p is Post => p !== null)
    // Filter out scheduled posts that haven't reached their publish date yet
    .filter((p) => !p.publishDate || new Date(p.publishDate) <= now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  return parsePostFile(slug, true);
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getRelatedPosts(current: Post, limit = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== current.slug)
    .filter(
      (p) =>
        p.category === current.category ||
        p.tags.some((t) => current.tags.includes(t))
    )
    .slice(0, limit);
}

// ── Internal helpers ─────────────────────────────────────────────────────────
function parsePostFile(slug: string, withHtml = false): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  // Extract FAQs from markdown (### Q: ... / **A:** ... pattern)
  const faqs = extractFAQs(content);

  const post: Post = {
    slug,
    title:          data.title          || "",
    date:           data.date           || new Date().toISOString().split("T")[0],
    publishDate:    data.publishDate    || undefined,
    description:    data.description    || "",
    primaryKeyword: data.primaryKeyword || "",
    category:       data.category       || "",
    tags:           Array.isArray(data.tags) ? data.tags : [],
    image:          data.image          || "/images/default-post.jpg",
    author:         data.author         || "Editorial Team",
    content,
    readingTime:    Math.ceil(content.split(/\s+/).length / 200),
    faqs,
  };

  if (withHtml) {
    // Replace [IMAGE: ...] placeholders with styled figure elements
    const processedContent = content.replace(
      /\[IMAGE:\s*([^\]]+)\]/g,
      (_, altText) =>
        `<figure><img src="/images/placeholder.jpg" alt="${altText}" loading="lazy" /><figcaption>${altText}</figcaption></figure>`
    );
    post.html = marked(processedContent) as string;
  }

  return post;
}

function extractFAQs(content: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  // Match patterns like: ### Q: ... or ## FAQ: ...
  const qPattern = /#{2,3}\s+(?:Q:|FAQ:)?\s*(.+?)\n+([\s\S]+?)(?=#{2,3}|\n---|\Z)/g;
  let match;
  // Simple FAQ section extraction
  const faqSection = content.match(/##\s+(?:FAQ|Frequently Asked Questions)([\s\S]+?)(?=\n##\s|$)/i);
  if (!faqSection) return [];

  const lines = faqSection[1].split("\n").filter((l) => l.trim());
  let currentQ = "";
  for (const line of lines) {
    if (line.startsWith("###") || line.startsWith("**Q:")) {
      currentQ = line.replace(/^#+\s*/, "").replace(/\*\*Q:\*\*\s*/i, "").replace(/\?$/, "?").trim();
    } else if (currentQ && line.trim() && !line.startsWith("#")) {
      faqs.push({ question: currentQ, answer: line.replace(/\*\*A:\*\*\s*/i, "").trim() });
      currentQ = "";
    }
  }
  return faqs.slice(0, 8);
}

// ── Table of Contents generator ───────────────────────────────────────────────
export interface TocHeading {
  level: number;
  text:  string;
  id:    string;
}

export function generateTableOfContents(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split("\n");

  lines.forEach((line) => {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text  = match[2].replace(/\*\*/g, "").trim();
      const id    = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      headings.push({ level, text, id });
    }
  });

  return headings;
}
