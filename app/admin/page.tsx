"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

type Tab = "dashboard" | "generate" | "bulk" | "images" | "edit" | "analytics" | "leads" | "business" | "reviews" | "indexing";

interface SavedPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  primaryKeyword: string;
  wordCount: number;
  publishDate?: string | null;
}

interface KeywordData {
  keyword: string;
  monthly_volume: number | null;
  cpc: number | null;
  competition: string;
  related: string[];
  serp?: SerpResult[];
}

interface SerpResult {
  rank: number;
  title: string;
  url: string;
  description?: string;
}

interface GeneratedPost {
  title: string;
  slug: string;
  description: string;
  html: string;
  primaryKeyword: string;
  tags: string[];
  wordCount?: number;
}

interface BulkJob {
  keyword: string;
  status: "pending" | "running" | "done" | "error";
  slug?: string;
  error?: string;
}

interface LinkSuggestion {
  anchorText: string;
  slug: string;
  targetTitle: string;
  reason: string;
}

interface AnalyticsSummary {
  pageViews: number;
  sessions: number;
  bounceRate: number;
  avgDuration: number;
  newUsers: number;
}

interface TopPage {
  path: string;
  views: number;
  sessions: number;
}

interface EditState {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishDate: string;
}

interface Subscriber {
  email: string;
  name?: string;
  subscribed_at?: string;
}

interface ContactMsg {
  id?: string;
  name: string;
  email: string;
  message: string;
  submitted_at?: string;
  read?: boolean;
}

interface CommentEntry {
  id?: string;
  post_slug: string;
  author_name: string;
  author_email: string;
  body: string;
  submitted_at?: string;
  approved?: boolean;
}

interface ParsedReview {
  name: string;
  initials: string;
  rating: number;
  text: string;
  service: string;
  source: string;
}

interface DBReview extends ParsedReview {
  id: string;
  featured: boolean;
  created_at: string;
}

interface IndexResult {
  url: string;
  status: "success" | "error";
  message?: string;
}

interface IndexNowResult {
  engine: string;
  status: "success" | "error";
  message?: string;
}

interface SeoScore {
  total: number;
  wordCount: number;
  hasKeywordInH1: boolean;
  keywordDensity: number;
  hasFaq: boolean;
  hasExternalLinks: number;
  hasInternalLinks: number;
  hasImages: number;
}

function calcSeoScore(html: string, keyword: string): SeoScore {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(/\s+/);
  const wordCount = words.length;
  const kw = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const keywordMatches = (text.toLowerCase().match(new RegExp(kw, "g")) || []).length;
  const keywordDensity = wordCount > 0 ? Math.round((keywordMatches / wordCount) * 1000) / 10 : 0;
  const hasKeywordInH1 = new RegExp(`<h1[^>]*>[^<]*${kw}[^<]*<\/h1>`, "i").test(html);
  const hasFaq = /frequently asked questions|<h2[^>]*>.*faq/i.test(html);
  const hasExternalLinks = (html.match(/rel="nofollow/g) || []).length;
  const hasInternalLinks = (html.match(/\[INTERNAL_LINK/g) || []).length;
  const hasImages = (html.match(/<!-- IMAGE:/g) || []).length + (html.match(/<img/gi) || []).length;

  let total = 0;
  if (wordCount >= 1500) total += 20; else if (wordCount >= 1000) total += 10;
  if (hasKeywordInH1) total += 15;
  if (keywordDensity >= 1 && keywordDensity <= 2) total += 15; else if (keywordDensity > 0) total += 7;
  if (hasFaq) total += 10;
  if (hasExternalLinks >= 3) total += 10; else if (hasExternalLinks >= 1) total += 5;
  if (hasInternalLinks >= 2) total += 10; else if (hasInternalLinks >= 1) total += 5;
  if (hasImages >= 3) total += 10; else if (hasImages >= 1) total += 5;
  if (wordCount >= 1500) total += 10;
  return { total: Math.min(total, 100), wordCount, hasKeywordInH1, keywordDensity, hasFaq, hasExternalLinks, hasInternalLinks, hasImages };
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  const map: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <div className={`rounded-xl border p-3 text-center ${map[color] ?? map.blue}`}>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs mt-0.5 opacity-70">{label}</div>
    </div>
  );
}

function ScoreBar({ label, value, max, unit = "" }: { label: string; value: number; max: number; unit?: string }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const color = pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 w-36 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-gray-700 w-12 text-right">{value}{unit}</span>
    </div>
  );
}

/** Returns Authorization header when NEXT_PUBLIC_ADMIN_SECRET is set in .env.local */
function authHeaders(): Record<string, string> {
  const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET;
  return secret ? { Authorization: `Bearer ${secret}` } : {};
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("dashboard");

  // Dashboard
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Generate
  const [keyword, setKeyword] = useState("");
  const [businessCtx, setBusinessCtx] = useState("");
  const [kwData, setKwData] = useState<KeywordData | null>(null);
  const [post, setPost] = useState<GeneratedPost | null>(null);
  const [seoScore, setSeoScore] = useState<SeoScore | null>(null);
  const [loadingKw, setLoadingKw] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [publishDate, setPublishDate] = useState("");

  // Bulk
  const [bulkKeywords, setBulkKeywords] = useState("");
  const [bulkJobs, setBulkJobs] = useState<BulkJob[]>([]);
  const [bulkRunning, setBulkRunning] = useState(false);

  // Images
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgStyle, setImgStyle] = useState("photorealistic professional photography");
  const [imgUrl, setImgUrl] = useState("");
  const [loadingImg, setLoadingImg] = useState(false);
  const [imgMsg, setImgMsg] = useState("");

  // Auto-image (generated alongside post)
  const [autoImgUrl, setAutoImgUrl] = useState("");
  const [autoImgStatus, setAutoImgStatus] = useState<"idle"|"generating"|"ready"|"saved"|"error">("idle");

  // Edit
  const [editState, setEditState] = useState<EditState | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState("");

  // Internal links
  const [linkSuggestions, setLinkSuggestions] = useState<LinkSuggestion[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [linksApplied, setLinksApplied] = useState(false);

  // Analytics
  const [analytics, setAnalytics] = useState<{ configured: boolean; summary?: AnalyticsSummary; topPages?: TopPage[]; error?: string; message?: string } | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Business Info
  const [bizInfo, setBizInfo] = useState({
    businessName: "King Lady Nails & Spa",
    phone:        "(702) 750-9050",
    address:      "6241 N Decatur Blvd #130",
    city:         "Las Vegas",
    state:        "Nevada",
    zip:          "89130",
    email:        "hello@kingladynailsspa.com",
    tagline:         "Las Vegas' Premier Nail Salon — Luxury Nails, Happy Clients",
    priceRange:      "$$",
    rating:          "4.6",
    reviewCount:     "1384",
    yearEstablished: "2018",
    category:        "Nail Salon",
    schemaBizType:   "BeautySalon",
  });
  const [bizSaving, setBizSaving] = useState(false);
  const [bizMsg, setBizMsg] = useState("");

  // Leads (subscribers + contacts + comments)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [contacts, setContacts] = useState<ContactMsg[]>([]);
  const [comments, setComments] = useState<CommentEntry[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [expandedContact, setExpandedContact] = useState<string | null>(null);

  // Reviews
  const [reviewPaste, setReviewPaste] = useState("");
  const [parsedReviews, setParsedReviews] = useState<ParsedReview[]>([]);
  const [featuredReviews, setFeaturedReviews] = useState<DBReview[]>([]);
  const [reviewMsg, setReviewMsg] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Google Indexing API
  const [gscCredentials, setGscCredentials] = useState("");
  const [gscSiteUrl, setGscSiteUrl] = useState("https://kingladynailsspa.com");
  const [gscUrls, setGscUrls] = useState("");
  const [gscUrlType, setGscUrlType] = useState<"URL_UPDATED" | "URL_DELETED">("URL_UPDATED");
  const [indexResults, setIndexResults] = useState<IndexResult[]>([]);
  const [indexLoading, setIndexLoading] = useState(false);
  const [indexMsg, setIndexMsg] = useState("");

  // IndexNow (Bing + Yandex + Naver)
  const [indexNowUrls,    setIndexNowUrls]    = useState("");
  const [indexNowKey,     setIndexNowKey]     = useState(() =>
    Array.from(new TextEncoder().encode("kingladynailsspa.com"))
      .map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32)
  );
  const [indexNowEngines, setIndexNowEngines] = useState<string[]>(["hub"]);
  const [indexNowResults, setIndexNowResults] = useState<IndexNowResult[]>([]);
  const [indexNowLoading, setIndexNowLoading] = useState(false);
  const [indexNowMsg,     setIndexNowMsg]     = useState("");

  // ── Dashboard ───────────────────────────────────────────────────────────────
  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setSavedPosts(data.posts ?? []);
    } catch { setSavedPosts([]); }
    finally { setLoadingPosts(false); }
  }, []);

  useEffect(() => { if (tab === "dashboard") loadPosts(); }, [tab, loadPosts]);

  async function deletePost(slug: string) {
    if (!confirm(`Delete post "${slug}"? This cannot be undone.`)) return;
    await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`, { method: "DELETE", headers: authHeaders() });
    setSavedPosts(p => p.filter(x => x.slug !== slug));
  }

  // ── Generate ────────────────────────────────────────────────────────────────
  async function handleKwResearch() {
    if (!keyword.trim()) return;
    setLoadingKw(true); setKwData(null);
    try {
      const res = await fetch("/api/keyword-research", {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setKwData(data);
    } catch (e: unknown) {
      setMessage(`❌ KW error: ${(e as Error).message}`);
    } finally { setLoadingKw(false); }
  }

  async function handleGenerate() {
    if (!keyword.trim()) return;
    setLoadingPost(true); setPost(null); setSeoScore(null); setMessage(""); setShowPreview(false);
    setAutoImgUrl(""); setAutoImgStatus("idle");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ keyword, businessContext: businessCtx, kwData }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPost(data);
      setSeoScore(calcSeoScore(data.html, keyword));
      setShowPreview(true);
      // Auto-generate cover image in background
      setAutoImgStatus("generating");
      fetch("/api/generate-image", {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          prompt: `${keyword} professional photography, blog cover image, local business`,
          style: "photorealistic professional photography, Canon DSLR, bright clean studio",
        }),
      }).then(r => r.json()).then(img => {
        if (img.url) { setAutoImgUrl(img.url); setAutoImgStatus("ready"); }
        else { setAutoImgStatus("error"); }
      }).catch(() => setAutoImgStatus("error"));
    } catch (e: unknown) {
      setMessage(`❌ ${(e as Error).message}`);
    } finally { setLoadingPost(false); }
  }

  async function handleSave() {
    if (!post) return;
    setSaving(true); setMessage("");
    try {
      // Save cover image first if auto-generated and ready
      if (autoImgUrl && autoImgStatus === "ready") {
        try {
          await fetch("/api/save-image", {
            method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ url: autoImgUrl, slug: post.slug }),
          });
          setAutoImgStatus("saved");
        } catch { /* non-blocking — image save failure shouldn't block post save */ }
      }
      const res = await fetch("/api/save-post", {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ...post, publishDate }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const indexed = data.indexed ? " 📡 IndexNow pinged." : "";
      const imgNote = autoImgStatus === "saved" ? " 🎨 Cover image saved." : "";
      setMessage(`✅ Saved! ${post.slug}.md${indexed}${imgNote}`);
      setTimeout(() => {
        setPost(null); setSeoScore(null); setShowPreview(false);
        setKeyword(""); setKwData(null); setMessage("");
        setAutoImgUrl(""); setAutoImgStatus("idle");
      }, 4000);
    } catch (e: unknown) {
      setMessage(`❌ ${(e as Error).message}`);
    } finally { setSaving(false); }
  }

  // ── Bulk generate ───────────────────────────────────────────────────────────
  async function runBulk() {
    const kws = bulkKeywords.split("\n").map(k => k.trim()).filter(Boolean).slice(0, 20);
    if (!kws.length) return;
    const jobs: BulkJob[] = kws.map(k => ({ keyword: k, status: "pending" }));
    setBulkJobs(jobs); setBulkRunning(true);
    for (let i = 0; i < jobs.length; i++) {
      setBulkJobs(prev => { const u = [...prev]; u[i] = { ...u[i], status: "running" }; return u; });
      try {
        const genRes = await fetch("/api/generate", {
          method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ keyword: jobs[i].keyword }),
        });
        const gen = await genRes.json();
        if (gen.error) throw new Error(gen.error);
        const saveRes = await fetch("/api/save-post", {
          method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(gen),
        });
        const save = await saveRes.json();
        if (save.error) throw new Error(save.error);
        setBulkJobs(prev => { const u = [...prev]; u[i] = { ...u[i], status: "done", slug: gen.slug }; return u; });
      } catch (e: unknown) {
        setBulkJobs(prev => { const u = [...prev]; u[i] = { ...u[i], status: "error", error: (e as Error).message }; return u; });
      }
      if (i < jobs.length - 1) await new Promise(r => setTimeout(r, 2500));
    }
    setBulkRunning(false);
  }

  // ── Image generation ────────────────────────────────────────────────────────
  async function handleGenImg() {
    if (!imgPrompt.trim()) return;
    setLoadingImg(true); setImgUrl(""); setImgMsg("");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ prompt: imgPrompt, style: imgStyle }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setImgUrl(data.url);
      setImgMsg("✅ Done! Right-click → Save As → public/images/posts/");
    } catch (e: unknown) {
      setImgMsg(`❌ ${(e as Error).message}`);
    } finally { setLoadingImg(false); }
  }


  // -- Edit post ---------------------------------------------------------------
  async function openEdit(slug: string) {
    const res = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`, { headers: authHeaders() });
    const data = await res.json();
    if (data.error) { alert(data.error); return; }
    setEditState({
      slug,
      title: data.frontmatter?.title ?? "",
      description: data.frontmatter?.description ?? "",
      content: data.content ?? "",
      publishDate: data.frontmatter?.publishDate ?? "",
    });
    setEditMsg("");
    setLinkSuggestions([]);
    setLinksApplied(false);
    setTab("edit");
  }

  async function handleEditSave() {
    if (!editState) return;
    setEditSaving(true); setEditMsg("");
    try {
      const res = await fetch("/api/edit-post", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(editState),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEditMsg(`✅ Saved! (${data.wordCount?.toLocaleString()} words)`);
    } catch (e: unknown) {
      setEditMsg(`❌ ${(e as Error).message}`);
    } finally { setEditSaving(false); }
  }

  // -- Internal link suggestions -----------------------------------------------
  async function handleGetLinks() {
    if (!editState?.content) return;
    setLoadingLinks(true); setLinkSuggestions([]); setEditMsg("");
    try {
      const res = await fetch("/api/internal-links", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ html: editState.content, keyword: editState.title }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const suggestions = data.suggestions ?? [];
      setLinkSuggestions(suggestions);
      if (suggestions.length === 0) {
        setEditMsg(data.message ?? "ℹ️ No linking opportunities found. Publish more posts to enable this feature.");
      }
    } catch (e: unknown) {
      setEditMsg(`❌ Links error: ${(e as Error).message}`);
    } finally { setLoadingLinks(false); }
  }

  function applyLinks() {
    if (!editState || linkSuggestions.length === 0) return;
    let updated = editState.content;
    for (const s of linkSuggestions) {
      const escaped = s.anchorText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(escaped, "");
      if (re.test(updated)) {
        updated = updated.replace(re, `[${s.anchorText}](/blog/${s.slug})`);
      }
    }
    setEditState({ ...editState, content: updated });
    setLinksApplied(true);
  }

  // -- Analytics ---------------------------------------------------------------
  const loadAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch("/api/analytics", { headers: authHeaders() });
      setAnalytics(await res.json());
    } catch { setAnalytics({ configured: false, message: "Failed to fetch analytics." }); }
    finally { setLoadingAnalytics(false); }
  }, []);

  useEffect(() => { if (tab === "analytics") loadAnalytics(); }, [tab, loadAnalytics]);

  // -- Leads (subscribers + contacts) ----------------------------------------
  const loadLeads = useCallback(async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch("/api/leads", { headers: authHeaders() });
      const data = await res.json();
      setSubscribers(data.subscribers ?? []);
      setContacts(data.contacts ?? []);
      setComments(data.comments ?? []);
    } catch {
      setSubscribers([]); setContacts([]);
    } finally { setLoadingLeads(false); }
  }, []);

  useEffect(() => { if (tab === "leads") loadLeads(); }, [tab, loadLeads]);

  const loadFeaturedReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch("/api/testimonials", { headers: authHeaders() });
      const data = await res.json();
      setFeaturedReviews(data.testimonials ?? []);
    } catch {
      setFeaturedReviews([]);
    } finally { setLoadingReviews(false); }
  }, []);

  useEffect(() => { if (tab === "reviews") loadFeaturedReviews(); }, [tab, loadFeaturedReviews]);

  // ── Business Info auto-fill ─────────────────────────────────────────────────
  async function handleAutoFillBiz() {
    setBizSaving(true);
    setBizMsg("🔍 Fetching from Google Places…");
    try {
      const res = await fetch("/api/google-business", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ name: bizInfo.businessName, address: bizInfo.address, city: bizInfo.city, state: bizInfo.state }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBizInfo(prev => ({
        ...prev,
        ...(data.phone           != null && { phone:           data.phone }),
        ...(data.rating          != null && { rating:          String(data.rating) }),
        ...(data.reviewCount     != null && { reviewCount:     String(data.reviewCount) }),
        ...(data.priceRange      != null && { priceRange:      data.priceRange }),
        ...(data.category        != null && { category:        data.category }),
        ...(data.schemaBizType   != null && { schemaBizType:   data.schemaBizType }),
        ...(data.yearEstablished != null && { yearEstablished: String(data.yearEstablished) }),
      }));
      setBizMsg(`✅ Auto-filled! ${data.rating}★ · ${Number(data.reviewCount).toLocaleString()} reviews · ${data.source}`);
      setTimeout(() => setBizMsg(""), 6000);
    } catch (e: unknown) {
      setBizMsg(`❌ ${(e as Error).message}`);
    } finally { setBizSaving(false); }
  }

  // ── Google Indexing ──────────────────────────────────────────────────────────
  async function handleIndexSubmit() {
    if (!gscCredentials.trim()) { setIndexMsg("❌ Paste your service account JSON first."); return; }
    const urls = gscUrls.split("\n").map(u => u.trim()).filter(u => u.startsWith("http")).slice(0, 200);
    if (urls.length === 0) { setIndexMsg("❌ Enter at least one valid URL starting with https://"); return; }
    setIndexLoading(true); setIndexMsg(`Submitting ${urls.length} URL(s)…`); setIndexResults([]);
    try {
      let credentials: Record<string, string>;
      try { credentials = JSON.parse(gscCredentials); }
      catch { throw new Error("Invalid JSON — verify your service account file"); }
      const res = await fetch("/api/google-indexing", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ action: "submit", urls, type: gscUrlType, credentials }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setIndexResults(data.results ?? []);
      const ok = (data.results ?? []).filter((r: IndexResult) => r.status === "success").length;
      setIndexMsg(`✅ Done — ${ok}/${urls.length} accepted.`);
    } catch (e: unknown) {
      setIndexMsg(`❌ ${(e as Error).message}`);
    } finally { setIndexLoading(false); }
  }

  async function handleAddSite() {
    if (!gscCredentials.trim() || !gscSiteUrl.trim()) { setIndexMsg("❌ Enter credentials and site URL."); return; }
    setIndexLoading(true); setIndexMsg("Adding site to Search Console…");
    try {
      let credentials: Record<string, string>;
      try { credentials = JSON.parse(gscCredentials); }
      catch { throw new Error("Invalid JSON — verify your service account file"); }
      const res = await fetch("/api/google-indexing", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ action: "add-site", siteUrl: gscSiteUrl, credentials }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setIndexMsg("✅ Site added! Now verify ownership in Google Search Console.");
    } catch (e: unknown) {
      setIndexMsg(`❌ ${(e as Error).message}`);
    } finally { setIndexLoading(false); }
  }

  async function handleIndexNow() {
    const urls = indexNowUrls.split("\n").map(u => u.trim()).filter(u => u.startsWith("http")).slice(0, 10000);
    if (!urls.length) { setIndexNowMsg("❌ Enter at least one valid URL starting with https://"); return; }
    if (!indexNowKey.trim()) { setIndexNowMsg("❌ IndexNow key is required"); return; }
    if (indexNowEngines.length === 0) { setIndexNowMsg("❌ Select at least one engine"); return; }
    setIndexNowLoading(true);
    setIndexNowMsg(`Submitting ${urls.length} URL(s) via IndexNow…`);
    setIndexNowResults([]);
    try {
      const res = await fetch("/api/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ key: indexNowKey, host: "kingladynailsspa.com", urls, engines: indexNowEngines }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setIndexNowResults(data.results ?? []);
      const ok = (data.results ?? []).filter((r: IndexNowResult) => r.status === "success").length;
      setIndexNowMsg(`✅ Done — ${ok}/${(data.results ?? []).length} engine(s) accepted.`);
    } catch (e: unknown) {
      setIndexNowMsg(`❌ ${(e as Error).message}`);
    } finally { setIndexNowLoading(false); }
  }

  function parseGoogleReviews(raw: string): ParsedReview[] {
    const lines = raw.split("\n").map(l => l.trim());
    const TIME_RE = /^(Edited\s+)?(\d+|a|an)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i;
    const SKIP_RE = /^(Photo \d+|…More|More)$|^\$[\d,]+/;
    const BADGE_RE = /\d+\s+reviews?|Local Guide|\d+\s+photos?/i;
    const results: ParsedReview[] = [];
    const timePositions: number[] = [];
    lines.forEach((line, idx) => { if (TIME_RE.test(line)) timePositions.push(idx); });
    for (let t = 0; t < timePositions.length; t++) {
      const timeIdx = timePositions[t];
      let name = "";
      for (let k = timeIdx - 1; k >= Math.max(0, timeIdx - 4); k--) {
        const l = lines[k];
        if (l && !BADGE_RE.test(l) && !TIME_RE.test(l) && l.length > 1 && l.length < 60 && !/^\d+$/.test(l)) {
          name = l; break;
        }
      }
      if (!name) continue;
      let startIdx = timeIdx + 1;
      if (startIdx < lines.length && /^\$/.test(lines[startIdx] ?? "")) startIdx++;
      const nextTimeIdx = timePositions[t + 1] ?? (lines.length + 4);
      const endIdx = nextTimeIdx - 3;
      const textLines: string[] = [];
      for (let k = startIdx; k < Math.min(endIdx, lines.length); k++) {
        const l = lines[k];
        if (l && !SKIP_RE.test(l)) textLines.push(l);
      }
      const text = textLines.join(" ").replace(/\s+/g, " ").replace(/…More$/i, "").trim();
      if (text.length > 20) {
        const initials = name.split(/\s+/).filter(w => /^[A-Za-z]/.test(w)).map(w => w[0]).slice(0, 2).join("").toUpperCase();
        results.push({ name, initials: initials || name.slice(0, 2).toUpperCase(), rating: 5, text, service: "Nail Service", source: "Google" });
      }
    }
    return results;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "generate",  label: "✨ Generate Post" },
    { id: "bulk",      label: "⚡ Bulk Generate" },
    { id: "images",    label: "🎨 AI Images" },
    { id: "edit",      label: "✏️ Edit Post" },
    { id: "analytics", label: "📈 Analytics" },
    { id: "leads",     label: "📥 Leads" },
    { id: "business",  label: "🏪 Business Info" },
    { id: "reviews",   label: "⭐ Reviews" },
    { id: "indexing",  label: "📡 Indexing" },
  ];

  const doneCount = bulkJobs.filter(j => j.status === "done").length;
  const errCount  = bulkJobs.filter(j => j.status === "error").length;
  const bulkKwCount = bulkKeywords.split("\n").filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚙️</span>
          <span className="font-bold">Admin CMS</span>
          <span className="text-gray-400 text-sm hidden md:block">AI Blog Manager</span>
        </div>
        <div className="flex items-center gap-4">
          {session?.user?.name && (
            <span className="text-gray-400 text-xs hidden md:block">Signed in as {session.user.name}</span>
          )}
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-gray-400 hover:text-white text-xs border border-gray-600 px-3 py-1 rounded-lg">
            Sign out
          </button>
          <Link href="/" className="text-gray-300 hover:text-white text-sm">← View Site</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tab pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t.id ? "bg-pink-600 text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100"
              }`}>{t.label}</button>
          ))}
        </div>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                All Posts <span className="text-gray-400 font-normal text-base">({savedPosts.length})</span>
              </h2>
              <button onClick={() => setTab("generate")}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700">
                + New Post
              </button>
            </div>

            {loadingPosts && <p className="text-gray-400 animate-pulse text-sm">Loading posts…</p>}

            {!loadingPosts && savedPosts.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <p className="text-gray-400 text-4xl mb-3">📝</p>
                <p className="text-gray-500 mb-4">No blog posts yet.</p>
                <button onClick={() => setTab("generate")}
                  className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700">
                  Generate your first post →
                </button>
              </div>
            )}

            {!loadingPosts && savedPosts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-5 text-xs font-semibold text-gray-500 uppercase tracking-wide p-4 bg-gray-50 border-b border-gray-100">
                  <span className="col-span-2">Title / Slug</span>
                  <span className="hidden md:block">Keyword</span>
                  <span className="hidden md:block">Words / Date</span>
                  <span className="text-right">Actions</span>
                </div>
                {savedPosts.map((p, i) => (
                  <div key={p.slug}
                    className={`grid grid-cols-5 items-center p-4 border-b border-gray-50 hover:bg-gray-50 ${
                      i % 2 === 1 ? "bg-gray-50/40" : ""
                    }`}>
                    <div className="col-span-2 min-w-0 pr-4">
                      <Link href={`/blog/${p.slug}`} target="_blank"
                        className="font-medium text-gray-900 hover:text-pink-600 text-sm line-clamp-1">
                        {p.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 font-mono truncate">{p.slug}</span>
                        {p.publishDate && new Date(p.publishDate) > new Date() && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full shrink-0">
                            🕐 {p.publishDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full line-clamp-1">
                        {p.primaryKeyword}
                      </span>
                    </div>
                    <div className="hidden md:block text-right pr-4">
                      <div className="text-xs font-semibold text-gray-700">{p.wordCount?.toLocaleString() ?? "—"} w</div>
                      <div className="text-xs text-gray-400">{p.date}</div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p.slug)}
                        className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-50 shrink-0">
                        Edit
                      </button>
                      <button onClick={() => deletePost(p.slug)}
                        className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 shrink-0">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GENERATE */}
        {tab === "generate" && (
          <div className="space-y-6">
            {!showPreview ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input */}
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="font-bold text-gray-900">1. Keyword & Settings</h2>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Primary Keyword</label>
                    <input value={keyword} onChange={e => setKeyword(e.target.value)}
                      placeholder="e.g. [your service] [city]"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
                      onKeyDown={e => e.key === "Enter" && handleKwResearch()}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Business Context (optional)</label>
                    <textarea value={businessCtx} onChange={e => setBusinessCtx(e.target.value)}
                      placeholder="[Business Name], [city] [category]…"
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Schedule Publish Date <span className="text-gray-400 font-normal">(leave blank to publish now)</span>
                    </label>
                    <input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleKwResearch} disabled={loadingKw || !keyword.trim()}
                      className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 text-sm">
                      {loadingKw ? "Checking…" : "🔍 KW Data"}
                    </button>
                    <button onClick={handleGenerate} disabled={loadingPost || !keyword.trim()}
                      className="flex-1 bg-pink-600 text-white font-bold py-2.5 rounded-lg hover:bg-pink-700 disabled:opacity-40 text-sm">
                      {loadingPost ? "✨ Writing…" : "✨ Generate"}
                    </button>
                  </div>
                  {message && (
                    <div className={`text-sm p-3 rounded-lg ${
                      message.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>{message}</div>
                  )}
                </div>

                {/* KW Intelligence */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 mb-4">2. Keyword Intelligence</h2>
                  {!kwData && !loadingKw && <p className="text-gray-400 text-sm">Run KW Data first to see DataForSEO metrics</p>}
                  {loadingKw && <p className="text-blue-500 text-sm animate-pulse">Fetching from DataForSEO…</p>}
                  {kwData && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <Metric label="Monthly Vol" value={kwData.monthly_volume?.toLocaleString() ?? "—"} color="blue" />
                        <Metric label="CPC (USD)" value={kwData.cpc ? `$${kwData.cpc.toFixed(2)}` : "—"} color="green" />
                        <Metric label="Competition" value={kwData.competition || "—"} color="orange" />
                      </div>
                      {kwData.related?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">Related — click to use</p>
                          <div className="flex flex-wrap gap-1.5">
                            {kwData.related.map(kw => (
                              <button key={kw} onClick={() => setKeyword(kw)}
                                className="bg-gray-100 hover:bg-pink-100 hover:text-pink-700 text-gray-600 text-xs px-2.5 py-1 rounded-full transition-colors">
                                {kw}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {kwData.serp && kwData.serp.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">🏆 Current Top Results</p>
                          <div className="space-y-2">
                            {kwData.serp.slice(0, 3).map(r => (
                              <div key={r.rank} className="flex gap-2 text-xs p-2 bg-gray-50 rounded-lg">
                                <span className="text-gray-400 font-mono w-4">#{r.rank}</span>
                                <div className="min-w-0">
                                  <div className="font-medium text-gray-800 truncate">{r.title}</div>
                                  <div className="text-gray-400 truncate">{r.url}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              post && (
                <div className="space-y-4">
                  {/* Action bar */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-gray-900 text-xl truncate">{post.title}</h2>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.description}</p>
                      {publishDate && (
                        <p className="text-amber-600 text-xs mt-1">🕐 Scheduled: {publishDate}</p>
                      )}
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {post.tags?.slice(0, 5).map(t => (
                          <span key={t} className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSave} disabled={saving}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
                        {saving ? "Saving…" : "💾 Save & Index"}
                      </button>
                      <button onClick={() => { setShowPreview(false); setPost(null); setSeoScore(null); }}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">← Back</button>
                    </div>
                  </div>

                  {message && (
                    <div className={`text-sm p-3 rounded-lg ${
                      message.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>{message}</div>
                  )}

                  {/* Auto cover image status */}
                  {autoImgStatus !== "idle" && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-800">🎨 Cover Image</span>
                        {autoImgStatus === "generating" && <span className="text-xs text-blue-500 animate-pulse">Generating with DALL-E 3…</span>}
                        {autoImgStatus === "ready"      && <span className="text-xs text-green-600">✅ Ready — saves automatically when you click Save & Index</span>}
                        {autoImgStatus === "saved"      && <span className="text-xs text-green-700">✅ Saved to /images/posts/{post?.slug}.jpg</span>}
                        {autoImgStatus === "error"      && <span className="text-xs text-orange-500">⚠️ Image generation failed — generate manually in AI Images tab</span>}
                      </div>
                      {autoImgUrl && (autoImgStatus === "ready" || autoImgStatus === "saved") && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={autoImgUrl} alt="Auto cover" className="w-full rounded-xl max-h-48 object-cover" />
                      )}
                    </div>
                  )}
                  {seoScore && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">SEO Score</h3>
                        <div className={`text-4xl font-black ${
                          seoScore.total >= 80 ? "text-green-600" :
                          seoScore.total >= 60 ? "text-yellow-600" : "text-red-500"
                        }`}>{seoScore.total}<span className="text-sm font-normal text-gray-400">/100</span></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                          <ScoreBar label="Word count" value={seoScore.wordCount} max={2000} />
                          <ScoreBar label="Keyword density" value={seoScore.keywordDensity} max={3} unit="%" />
                          <ScoreBar label="External links" value={seoScore.hasExternalLinks} max={3} />
                          <ScoreBar label="Internal links" value={seoScore.hasInternalLinks} max={2} />
                          <ScoreBar label="Image placeholders" value={seoScore.hasImages} max={3} />
                        </div>
                        <div className="space-y-2">
                          {[
                            { ok: seoScore.wordCount >= 1500, text: `${seoScore.wordCount.toLocaleString()} words${seoScore.wordCount >= 1500 ? " ✅" : " ⚠️ need 1500+"}` },
                            { ok: seoScore.hasKeywordInH1, text: seoScore.hasKeywordInH1 ? "Keyword in H1 ✅" : "Keyword missing from H1 ⚠️" },
                            { ok: seoScore.keywordDensity >= 1 && seoScore.keywordDensity <= 2, text: `Density ${seoScore.keywordDensity}%${seoScore.keywordDensity >= 1 && seoScore.keywordDensity <= 2 ? " ✅" : " ⚠️ (target 1–2%)"}` },
                            { ok: seoScore.hasFaq, text: seoScore.hasFaq ? "FAQ section ✅" : "No FAQ section ⚠️" },
                            { ok: seoScore.hasExternalLinks >= 3, text: `${seoScore.hasExternalLinks} external links${seoScore.hasExternalLinks >= 3 ? " ✅" : " ⚠️ need 3"}` },
                          ].map((item, i) => (
                            <div key={i} className={`text-xs px-3 py-2 rounded-lg ${
                              item.ok ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                            }`}>{item.text}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Article preview */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <div className="text-xs text-gray-400 mb-4 font-mono">content/posts/<strong>{post.slug}</strong>.md</div>
                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.html }} />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* BULK GENERATE */}
        {tab === "bulk" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-900">Bulk Post Generator</h2>
              <p className="text-sm text-gray-500">
                Enter up to 20 keywords (one per line). Each generates a full 1500+ word SEO article and saves automatically.
              </p>
              <textarea
                value={bulkKeywords}
                onChange={e => setBulkKeywords(e.target.value)}
                placeholder={"[service 1] [city]\n[service 2] [city]\n[service 3] [city]\n[service 4] [nearby city]\n[service 5] [nearby city]"}
                rows={12}
                disabled={bulkRunning}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none disabled:opacity-50 disabled:bg-gray-50"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {bulkKwCount} keywords · ≈${(bulkKwCount * 0.025).toFixed(2)} AI cost
                </span>
                <button onClick={runBulk} disabled={bulkRunning || !bulkKeywords.trim()}
                  className="bg-pink-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-40">
                  {bulkRunning ? `⚡ Running (${doneCount}/${bulkKwCount})…` : "⚡ Generate All"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Queue</h2>
                {bulkJobs.length > 0 && !bulkRunning && (
                  <button onClick={() => { setBulkJobs([]); setBulkKeywords(""); }}
                    className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
                )}
              </div>
              {bulkJobs.length === 0 && (
                <p className="text-gray-400 text-sm">Queue is empty. Enter keywords and click Generate All.</p>
              )}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {bulkJobs.map((job, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                    job.status === "done" ? "bg-green-50" :
                    job.status === "error" ? "bg-red-50" :
                    job.status === "running" ? "bg-blue-50 animate-pulse" : "bg-gray-50"
                  }`}>
                    <span className="text-base">
                      {job.status === "done" ? "✅" : job.status === "error" ? "❌" : job.status === "running" ? "⏳" : "⏸️"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{job.keyword}</div>
                      {job.slug && <div className="text-xs text-green-600 font-mono">{job.slug}.md</div>}
                      {job.error && <div className="text-xs text-red-600">{job.error}</div>}
                    </div>
                  </div>
                ))}
              </div>
              {bulkJobs.length > 0 && !bulkRunning && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-sm">
                  <span className="text-green-600 font-semibold">✅ {doneCount} saved</span>
                  {errCount > 0 && <span className="text-red-500">❌ {errCount} errors</span>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI IMAGES */}
        {tab === "images" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h2 className="font-bold text-gray-900">DALL-E 3 Blog Images</h2>
                <p className="text-sm text-gray-500 mt-1">Generate professional photos for blog posts. ~$0.04/image.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Describe the image</label>
                <textarea value={imgPrompt} onChange={e => setImgPrompt(e.target.value)}
                  placeholder="A professional specialist at work in a clean, well-lit studio setting, shallow depth of field, photorealistic"
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Style</label>
                <select value={imgStyle} onChange={e => setImgStyle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none">
                  <option value="photorealistic professional photography, Canon DSLR">Photorealistic (Recommended)</option>
                  <option value="professional stock photography, clean white background">Stock Photo Style</option>
                  <option value="bright and airy lifestyle photography">Lifestyle Photography</option>
                  <option value="flat design illustration, minimal, colorful">Flat Illustration</option>
                  <option value="watercolor illustration">Watercolor</option>
                </select>
              </div>
              <button onClick={handleGenImg} disabled={loadingImg || !imgPrompt.trim()}
                className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 disabled:opacity-40 text-sm">
                {loadingImg ? "🎨 Generating (~10s)…" : "🎨 Generate Image ($0.04)"}
              </button>
              {imgMsg && (
                <div className={`text-sm p-3 rounded-lg ${
                  imgMsg.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>{imgMsg}</div>
              )}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                <strong>Pro tip:</strong> Save to <code>public/images/posts/slug-name.jpg</code>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">Preview</h2>
              {loadingImg && (
                <div className="aspect-video bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center animate-pulse">
                  <span className="text-5xl">🎨</span>
                </div>
              )}
              {imgUrl && !loadingImg && (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt="AI Generated" className="w-full rounded-xl shadow" />
                  <a href={imgUrl} download="blog-image.png" target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 text-sm">
                    ⬇️ Download Image
                  </a>
                </div>
              )}
              {!imgUrl && !loadingImg && (
                <div className="aspect-video bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-300 gap-3">
                  <span className="text-5xl">🖼️</span>
                  <span className="text-sm">Image appears here</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EDIT POST */}
        {tab === "edit" && (
          <div className="space-y-6">
            {!editState ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4">Edit a Post</h2>
                <p className="text-gray-500 text-sm mb-6">Click <strong>Edit</strong> on any post in the Dashboard to load it here.</p>
                {loadingPosts && <p className="text-gray-400 animate-pulse text-sm">Loading posts…</p>}
                {!loadingPosts && savedPosts.length > 0 && (
                  <div className="space-y-2">
                    {savedPosts.map(p => (
                      <button key={p.slug} onClick={() => openEdit(p.slug)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-pink-300 hover:bg-pink-50 text-left transition-colors">
                        <span className="font-medium text-gray-800 text-sm">{p.title}</span>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">{p.date}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-gray-900">Editing: <span className="font-mono text-pink-600">{editState.slug}</span></h2>
                    <p className="text-xs text-gray-400 mt-0.5">content/posts/{editState.slug}.md</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleEditSave} disabled={editSaving}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 text-sm">
                      {editSaving ? "Saving…" : "💾 Save Changes"}
                    </button>
                    <button onClick={() => { setEditState(null); setLinkSuggestions([]); setEditMsg(""); }}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm">
                      ← Back
                    </button>
                  </div>
                </div>

                {editMsg && (
                  <div className={`text-sm p-3 rounded-lg ${editMsg.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {editMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="font-semibold text-gray-800">Metadata</h3>
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Title</label>
                      <input value={editState.title}
                        onChange={e => setEditState({ ...editState, title: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Meta Description</label>
                      <textarea value={editState.description}
                        onChange={e => setEditState({ ...editState, description: e.target.value })}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none"
                      />
                      <div className={`text-xs mt-1 ${editState.description.length > 160 ? "text-red-500" : "text-gray-400"}`}>
                        {editState.description.length}/160 chars
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">
                        Scheduled Publish Date <span className="text-gray-400 font-normal">(blank = live now)</span>
                      </label>
                      <input type="date" value={editState.publishDate}
                        onChange={e => setEditState({ ...editState, publishDate: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
                      />
                      {editState.publishDate && (
                        <button onClick={() => setEditState({ ...editState, publishDate: "" })}
                          className="text-xs text-red-400 hover:text-red-600 mt-1">
                          × Remove schedule (publish now)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Internal Links */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">🔗 AI Internal Links</h3>
                      <button onClick={handleGetLinks} disabled={loadingLinks}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-40">
                        {loadingLinks ? "Analyzing…" : "Suggest Links"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">GPT-4o scans your existing posts and finds natural linking opportunities in this article.</p>
                    {linkSuggestions.length === 0 && !loadingLinks && (
                      <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-400 text-xs">
                        Click &quot;Suggest Links&quot; to find internal linking opportunities
                      </div>
                    )}
                    {linkSuggestions.length > 0 && (
                      <div className="space-y-2">
                        {linkSuggestions.map((s, i) => (
                          <div key={i} className="bg-blue-50 rounded-lg p-3 text-xs space-y-1">
                            <div className="font-mono text-blue-800">&quot;{s.anchorText}&quot;</div>
                            <div className="text-blue-600">→ /blog/{s.slug}</div>
                            <div className="text-gray-500">{s.reason}</div>
                          </div>
                        ))}
                        <button onClick={applyLinks} disabled={linksApplied}
                          className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors ${
                            linksApplied
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}>
                          {linksApplied ? "✅ Links applied to content" : `Apply ${linkSuggestions.length} links to content`}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content editor */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">Article Content (Markdown)</h3>
                    <span className="text-xs text-gray-400">
                      {editState.content.split(/\s+/).filter(Boolean).length.toLocaleString()} words
                    </span>
                  </div>
                  <textarea
                    value={editState.content}
                    onChange={e => setEditState({ ...editState, content: e.target.value })}
                    rows={30}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-pink-400 focus:outline-none resize-y leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {tab === "analytics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Google Analytics (Last 30 Days)</h2>
              <button onClick={loadAnalytics} disabled={loadingAnalytics}
                className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg disabled:opacity-40">
                {loadingAnalytics ? "Loading…" : "↻ Refresh"}
              </button>
            </div>

            {loadingAnalytics && (
              <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                <p className="text-gray-400 animate-pulse">Fetching from Google Analytics…</p>
              </div>
            )}

            {!loadingAnalytics && analytics && !analytics.configured && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">Setup Required</h3>
                <p className="text-gray-500 text-sm mb-4">{analytics.message}</p>
                <div className="bg-gray-50 rounded-xl p-4 text-xs font-mono space-y-1 text-gray-600">
                  <p className="font-semibold text-gray-800 mb-2">Add to .env.local:</p>
                  <p>GA4_PROPERTY_ID=123456789</p>
                  <p>{`GA4_SERVICE_ACCOUNT_KEY={"type":"service_account",...}`}</p>
                </div>
                <div className="mt-4 text-xs text-gray-400 space-y-1">
                  <p>1. Go to <strong>Google Cloud Console</strong> → Create service account</p>
                  <p>2. Grant it <strong>Viewer</strong> role on your GA4 property</p>
                  <p>3. Create a JSON key → paste entire JSON as GA4_SERVICE_ACCOUNT_KEY</p>
                  <p>4. Find Property ID in GA4: Admin → Property Settings → Property ID</p>
                </div>
              </div>
            )}

            {!loadingAnalytics && analytics?.configured && analytics.error && (
              <div className="bg-red-50 rounded-2xl p-6 shadow-sm">
                <p className="text-red-700 text-sm">❌ {analytics.error}</p>
              </div>
            )}

            {!loadingAnalytics && analytics?.configured && analytics.summary && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: "Page Views", value: analytics.summary.pageViews.toLocaleString(), color: "blue" },
                    { label: "Sessions", value: analytics.summary.sessions.toLocaleString(), color: "green" },
                    { label: "New Users", value: analytics.summary.newUsers.toLocaleString(), color: "purple" },
                    { label: "Bounce Rate", value: `${analytics.summary.bounceRate}%`, color: "orange" },
                    { label: "Avg Duration", value: `${Math.floor(analytics.summary.avgDuration / 60)}m ${analytics.summary.avgDuration % 60}s`, color: "green" },
                  ].map(m => <Metric key={m.label} label={m.label} value={m.value} color={m.color} />)}
                </div>

                {analytics.topPages && analytics.topPages.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 grid grid-cols-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <span className="col-span-1">Page</span>
                      <span className="text-right">Views</span>
                      <span className="text-right">Sessions</span>
                    </div>
                    {analytics.topPages.map((page, i) => (
                      <div key={i} className={`grid grid-cols-3 items-center p-4 border-b border-gray-50 ${i % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                        <span className="text-sm text-gray-700 font-mono truncate">{page.path}</span>
                        <span className="text-right text-sm font-semibold text-gray-800">{page.views.toLocaleString()}</span>
                        <span className="text-right text-sm text-gray-500">{page.sessions.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* LEADS */}
        {tab === "leads" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Leads &amp; Inbox
                <span className="ml-2 text-gray-400 font-normal text-base">
                  {subscribers.length} subscribers · {contacts.length} messages · {comments.filter(c => !c.approved).length} pending comments
                </span>
              </h2>
              <button onClick={loadLeads} disabled={loadingLeads}
                className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg disabled:opacity-40">
                {loadingLeads ? "Loading…" : "↻ Refresh"}
              </button>
            </div>

            {loadingLeads && <p className="text-gray-400 animate-pulse text-sm">Loading leads…</p>}

            {/* Subscribers */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">
                  📧 Newsletter Subscribers
                  <span className="ml-2 bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded-full font-normal">{subscribers.length}</span>
                </h3>
                {subscribers.length > 0 && (
                  <button
                    onClick={() => {
                      const csv = ["email,name,subscribed_at", ...subscribers.map(s =>
                        `${s.email},${s.name ?? ""},${s.subscribed_at ?? ""}`)].join("\n");
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
                      a.download = "subscribers.csv";
                      a.click();
                    }}
                    className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg">
                    ⬇️ Export CSV
                  </button>
                )}
              </div>
              {subscribers.length === 0 && !loadingLeads ? (
                <div className="p-10 text-center text-gray-400 text-sm">
                  No subscribers yet. Visitors who sign up via the footer newsletter form appear here.
                </div>
              ) : (
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {subscribers.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-xs font-bold shrink-0">
                        {s.email[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{s.email}</div>
                        {s.name && <div className="text-xs text-gray-400">{s.name}</div>}
                      </div>
                      <div className="text-xs text-gray-400 shrink-0">
                        {s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString() : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact messages */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">
                  💬 Contact Messages
                  <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-normal">{contacts.length}</span>
                  {contacts.filter(c => !c.read).length > 0 && (
                    <span className="ml-1 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-normal">
                      {contacts.filter(c => !c.read).length} unread
                    </span>
                  )}
                </h3>
              </div>
              {contacts.length === 0 && !loadingLeads ? (
                <div className="p-10 text-center text-gray-400 text-sm">
                  No contact submissions yet. Messages from the contact page form appear here.
                </div>
              ) : (
                <div className="divide-y divide-gray-50 max-h-[32rem] overflow-y-auto">
                  {contacts.map((c) => (
                    <div key={c.id ?? c.email + c.submitted_at}
                      className={`px-5 py-4 hover:bg-gray-50 cursor-pointer ${!c.read ? "bg-blue-50/30" : ""}`}
                      onClick={() => setExpandedContact(expandedContact === c.id ? null : (c.id ?? null))}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0 mt-0.5">
                          {c.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-sm font-medium ${!c.read ? "text-gray-900" : "text-gray-700"}`}>
                              {c.name}
                            </span>
                            <span className="text-xs text-gray-400 shrink-0">
                              {c.submitted_at ? new Date(c.submitted_at).toLocaleDateString() : ""}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">{c.email}</div>
                          {expandedContact !== c.id ? (
                            <div className="text-sm text-gray-600 mt-1 line-clamp-1">{c.message}</div>
                          ) : (
                            <div className="mt-2 bg-gray-50 rounded-xl p-3 text-sm text-gray-700 whitespace-pre-wrap">
                              {c.message}
                            </div>
                          )}
                        </div>
                        {!c.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Blog Comments — moderation */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">
                  💬 Blog Comments
                  <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-normal">{comments.length}</span>
                  {comments.filter(c => !c.approved).length > 0 && (
                    <span className="ml-1 bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-normal">
                      {comments.filter(c => !c.approved).length} pending
                    </span>
                  )}
                </h3>
              </div>
              {comments.length === 0 && !loadingLeads ? (
                <div className="p-10 text-center text-gray-400 text-sm">
                  No comments yet. Readers who submit comments on blog posts appear here for moderation.
                </div>
              ) : (
                <div className="divide-y divide-gray-50 max-h-[40rem] overflow-y-auto">
                  {comments.map((c) => (
                    <div key={c.id ?? `${c.author_name}-${c.submitted_at}`}
                      className={`px-5 py-4 ${!c.approved ? "bg-orange-50/30" : ""}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold shrink-0 mt-0.5">
                          {c.author_name[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{c.author_name}</span>
                              <span className="text-xs text-gray-400 ml-2">{c.author_email}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-gray-400">
                                {c.submitted_at ? new Date(c.submitted_at).toLocaleDateString() : ""}
                              </span>
                              {!c.approved && (
                                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">pending</span>
                              )}
                              {c.approved && (
                                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">approved</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            on <span className="font-mono">/blog/{c.post_slug}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-2 bg-gray-50 rounded-xl p-3 whitespace-pre-line">{c.body}</p>
                          <div className="flex gap-2 mt-3">
                            {!c.approved && (
                              <button
                                onClick={async () => {
                                  if (!c.id) return;
                                  await fetch("/api/comments", {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json", ...authHeaders() },
                                    body: JSON.stringify({ id: c.id }),
                                  });
                                  setComments(prev => prev.map(x => x.id === c.id ? { ...x, approved: true } : x));
                                }}
                                className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
                                ✓ Approve
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (!c.id || !confirm("Delete this comment?")) return;
                                await fetch(`/api/comments?id=${encodeURIComponent(c.id)}`, {
                                  method: "DELETE",
                                  headers: authHeaders(),
                                });
                                setComments(prev => prev.filter(x => x.id !== c.id));
                              }}
                              className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BUSINESS INFO */}
        {tab === "business" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🏪 Business Information</h2>
                  <p className="text-sm text-gray-400 mt-0.5">NAP data used across all pages, schema, and SEO</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <button
                    onClick={handleAutoFillBiz}
                    disabled={bizSaving}
                    className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                  >
                    {bizSaving && bizMsg.includes("Fetching") ? "🔄 Fetching…" : "🤖 Auto-fill from Google"}
                  </button>
                  {bizMsg && (
                    <div className={`text-sm px-4 py-2 rounded-lg ${
                      bizMsg.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>{bizMsg}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([
                  { key: "businessName", label: "Business Name", placeholder: "King Lady Nails & Spa" },
                  { key: "phone",        label: "Phone Number",  placeholder: "(702) 750-9050" },
                  { key: "address",      label: "Street Address", placeholder: "6241 N Decatur Blvd #130" },
                  { key: "city",         label: "City",          placeholder: "Las Vegas" },
                  { key: "state",        label: "State",         placeholder: "Nevada" },
                  { key: "zip",          label: "ZIP Code",      placeholder: "89130" },
                  { key: "email",        label: "Email Address", placeholder: "hello@kingladynailsspa.com" },
                  { key: "priceRange",      label: "Price Range",         placeholder: "$, $$, $$$, $$$$" },
                  { key: "rating",          label: "Star Rating",          placeholder: "4.6" },
                  { key: "reviewCount",     label: "Review Count",         placeholder: "1384" },
                  { key: "yearEstablished", label: "Year Established",     placeholder: "2018" },
                  { key: "category",        label: "Business Category",    placeholder: "Nail Salon" },
                  { key: "schemaBizType",   label: "Schema.org Biz Type",  placeholder: "BeautySalon" },
                ] as { key: keyof typeof bizInfo; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      value={bizInfo[key]}
                      onChange={e => setBizInfo(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input
                    value={bizInfo.tagline}
                    onChange={e => setBizInfo(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="[Business tagline here]…"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  disabled={bizSaving}
                  onClick={async () => {
                    setBizSaving(true); setBizMsg("");
                    try {
                      const res = await fetch("/api/site-config", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...authHeaders() },
                        body: JSON.stringify(bizInfo),
                      });
                      const data = await res.json();
                      if (data.error) throw new Error(data.error);
                      setBizMsg("✅ Saved! Changes are live immediately.");
                      setTimeout(() => setBizMsg(""), 4000);
                    } catch (e: unknown) {
                      setBizMsg(`❌ ${(e as Error).message}`);
                    } finally { setBizSaving(false); }
                  }}
                  className="bg-pink-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-pink-700 disabled:opacity-50 text-sm">
                  {bizSaving ? "Saving…" : "💾 Save Changes"}
                </button>
                <p className="text-xs text-gray-400">Changes are stored and override the static site config immediately.</p>
              </div>
            </div>

            {/* Current NAP preview */}
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5">
              <h3 className="font-semibold text-pink-800 mb-3">📍 Current NAP (Name, Address, Phone)</h3>
              <div className="text-sm text-pink-700 space-y-1 font-mono">
                <p>{bizInfo.businessName}</p>
                <p>{bizInfo.phone}</p>
                <p>{bizInfo.address}, {bizInfo.city}, {bizInfo.state} {bizInfo.zip}</p>
                <p>{bizInfo.email}</p>
              </div>
              <p className="text-xs text-pink-500 mt-3">⚠️ Keep NAP identical across Google Business Profile, Yelp, and your website for maximum local SEO benefit.</p>
            </div>

            {/* Services summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">💅 Active Services (12)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "Manicure", "Pedicure", "Spa Pedicure", "Manicure and Pedicure",
                  "Acrylic Nails", "Dip Powder Nails", "Gel Nails", "Gel Nail Extensions",
                  "Nail Extensions", "Nail Art", "Nail Polish", "Men's Pedicure",
                ].map(s => (
                  <div key={s} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-green-500">✓</span> {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {tab === "reviews" && (
          <div className="space-y-6">
            {/* Import section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">⭐ Import Google Reviews</h2>
              <p className="text-sm text-gray-400 mb-4">Copy reviews from Google Maps (Ctrl+A in the reviews panel) and paste below. Click Extract to parse them.</p>
              <textarea
                value={reviewPaste}
                onChange={e => setReviewPaste(e.target.value)}
                rows={8}
                placeholder={`Paste raw copied Google review text here...\n\nExample:\nDee Hanzy\n2 reviews\n5 months ago\nI have been going to the salon for the past 5 years...`}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-pink-400 focus:outline-none resize-y"
              />
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <button
                  onClick={() => {
                    const results = parseGoogleReviews(reviewPaste);
                    setParsedReviews(results);
                    setReviewMsg(results.length > 0 ? `✅ Extracted ${results.length} reviews` : "❌ No reviews found — check the paste format");
                  }}
                  disabled={!reviewPaste.trim()}
                  className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 text-sm"
                >
                  🔍 Extract Reviews
                </button>
                {parsedReviews.length > 0 && (
                  <button
                    onClick={() => { setParsedReviews([]); setReviewPaste(""); setReviewMsg(""); }}
                    className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    Clear
                  </button>
                )}
                {reviewMsg && (
                  <span className={`text-sm ${reviewMsg.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{reviewMsg}</span>
                )}
              </div>
            </div>

            {/* Parsed reviews */}
            {parsedReviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Extracted Reviews ({parsedReviews.length}) — click ⭐ Feature to save to DB</h3>
                <div className="space-y-3">
                  {parsedReviews.map((r, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-pink-200 text-pink-700 font-bold text-sm flex items-center justify-center shrink-0">
                        {r.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">{r.name}</span>
                          <span className="text-yellow-500 text-xs">★★★★★</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">{r.text}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <label className="text-xs text-gray-500">Service:</label>
                          <input
                            value={r.service}
                            onChange={e => {
                              const updated = [...parsedReviews];
                              updated[i] = { ...updated[i], service: e.target.value };
                              setParsedReviews(updated);
                            }}
                            className="border border-gray-200 rounded px-2 py-0.5 text-xs w-44 focus:outline-none focus:ring-1 focus:ring-pink-300"
                          />
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          setReviewMsg("");
                          try {
                            const res = await fetch("/api/testimonials", {
                              method: "POST",
                              headers: { "Content-Type": "application/json", ...authHeaders() },
                              body: JSON.stringify({ ...r, featured: true }),
                            });
                            const data = await res.json();
                            if (data.error) throw new Error(data.error);
                            setReviewMsg(`✅ "${r.name}" featured!`);
                            loadFeaturedReviews();
                            setParsedReviews(prev => prev.filter((_, idx) => idx !== i));
                            setTimeout(() => setReviewMsg(""), 3000);
                          } catch (e: unknown) {
                            setReviewMsg(`❌ ${(e as Error).message}`);
                          }
                        }}
                        className="shrink-0 bg-pink-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-pink-700 font-semibold"
                      >
                        ⭐ Feature
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured reviews from DB */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">⭐ Featured on Homepage ({featuredReviews.length}/6)</h3>
                  <p className="text-xs text-gray-400 mt-0.5">These override the static testimonials in site.ts when the Neon database has featured reviews.</p>
                </div>
                <button onClick={loadFeaturedReviews} disabled={loadingReviews}
                  className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1 rounded-lg">
                  {loadingReviews ? "Loading…" : "↻ Refresh"}
                </button>
              </div>
              {featuredReviews.length === 0 && !loadingReviews && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-3xl mb-2">⭐</p>
                  <p className="text-sm">No featured reviews yet.</p>
                  <p className="text-xs mt-1">Paste Google reviews above and click ⭐ Feature to add them here.</p>
                </div>
              )}
              {loadingReviews && <p className="text-sm text-gray-400 animate-pulse">Loading…</p>}
              <div className="space-y-3">
                {featuredReviews.map((r) => (
                  <div key={r.id} className="border border-pink-100 rounded-xl p-4 bg-pink-50 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-pink-300 text-pink-800 font-bold text-sm flex items-center justify-center shrink-0">
                      {r.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">{r.name}</span>
                        <span className="text-yellow-500 text-xs">★★★★★</span>
                        <span className="text-xs bg-pink-200 text-pink-700 px-1.5 py-0.5 rounded-full">{r.service}</span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{r.text}</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (!confirm(`Remove "${r.name}" from featured reviews?`)) return;
                        try {
                          await fetch(`/api/testimonials?id=${r.id}`, { method: "DELETE", headers: authHeaders() });
                          setFeaturedReviews(prev => prev.filter(x => x.id !== r.id));
                        } catch (e: unknown) {
                          setReviewMsg(`❌ ${(e as Error).message}`);
                        }
                      }}
                      className="shrink-0 text-red-400 hover:text-red-600 text-xs border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INDEXING */}
        {tab === "indexing" && (
          <div className="space-y-6">

            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">📡 Search Engine Indexing</h2>
              <p className="text-sm text-gray-500">
                Two methods: <strong>⚡ IndexNow</strong> (instant, no auth needed — covers Bing, Yandex &amp; Naver)
                and <strong>📡 Google Indexing API</strong> (requires a service account, quota 200 URLs/day).
              </p>
            </div>

            {/* ── IndexNow section ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">⚡ IndexNow — Bing, Yandex &amp; Naver</h3>
                <p className="text-xs text-gray-400 mt-0.5">No credentials required. One request notifies all participating search engines instantly.</p>
              </div>

              {/* Key setup */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-xs text-green-800 space-y-1.5">
                <p className="font-semibold">⚙️ One-time setup (30 seconds)</p>
                <p>1. Click <strong>Download key file</strong> below</p>
                <p>2. Place the downloaded <code className="bg-green-100 px-1 rounded font-mono">{indexNowKey}.txt</code> into your <code className="bg-green-100 px-1 rounded font-mono">public/</code> folder</p>
                <p>3. Deploy — search engines verify the key at <code className="bg-green-100 px-1 rounded font-mono">https://kingladynailsspa.com/{indexNowKey}.txt</code></p>
                <p>4. Submit URLs below — engines crawl within minutes to hours</p>
              </div>

              {/* Key row */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">IndexNow Key (auto-generated from domain — change if needed)</label>
                <div className="flex gap-2">
                  <input
                    value={indexNowKey}
                    onChange={e => setIndexNowKey(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-green-400 focus:outline-none"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(indexNowKey)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-xs font-medium shrink-0"
                  >
                    Copy
                  </button>
                  <a
                    href={`data:text/plain;charset=utf-8,${indexNowKey}`}
                    download={`${indexNowKey}.txt`}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1"
                  >
                    📥 Download key file
                  </a>
                </div>
              </div>

              {/* Engine checkboxes */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">Submit to</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: "hub",    label: "IndexNow Hub",  desc: "Recommended — covers Bing, Yandex, Naver, Seznam & all partners" },
                    { id: "bing",   label: "Bing directly",  desc: "Direct Bing endpoint" },
                    { id: "yandex", label: "Yandex directly", desc: "Direct Yandex endpoint" },
                  ].map(({ id, label, desc }) => (
                    <label key={id} className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={indexNowEngines.includes(id)}
                        onChange={e => setIndexNowEngines(prev =>
                          e.target.checked ? [...new Set([...prev, id])] : prev.filter(x => x !== id)
                        )}
                        className="mt-0.5 accent-green-600"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-700">{label}</div>
                        <div className="text-xs text-gray-400">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* URLs */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">URLs to submit (one per line)</label>
                <textarea
                  value={indexNowUrls}
                  onChange={e => setIndexNowUrls(e.target.value)}
                  rows={5}
                  placeholder={"https://kingladynailsspa.com\nhttps://kingladynailsspa.com/blog/gel-nails-las-vegas"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-green-400 focus:outline-none resize-y"
                />
              </div>

              {/* Quick-add */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Quick-add</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Home",    url: "https://kingladynailsspa.com" },
                    { label: "Blog",    url: "https://kingladynailsspa.com/blog" },
                    { label: "About",   url: "https://kingladynailsspa.com/about" },
                    { label: "Contact", url: "https://kingladynailsspa.com/contact" },
                  ].map(({ label, url }) => (
                    <button
                      key={label}
                      onClick={() => setIndexNowUrls(prev => prev.includes(url) ? prev : (prev ? prev + "\n" + url : url))}
                      className="bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-600 text-xs px-2.5 py-1 rounded-full transition-colors"
                    >+ {label}</button>
                  ))}
                  <button
                    onClick={() => {
                      const allPosts = savedPosts.map(p => `https://kingladynailsspa.com/blog/${p.slug}`).join("\n");
                      setIndexNowUrls(prev => prev ? prev + "\n" + allPosts : allPosts);
                    }}
                    className="bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-600 text-xs px-2.5 py-1 rounded-full transition-colors"
                  >+ All Blog Posts ({savedPosts.length})</button>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleIndexNow}
                  disabled={indexNowLoading || !indexNowUrls.trim() || indexNowEngines.length === 0}
                  className="bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-40 text-sm"
                >
                  {indexNowLoading ? "Submitting…" : `⚡ Submit via IndexNow (${indexNowEngines.length} engine${indexNowEngines.length !== 1 ? "s" : ""})`}
                </button>
                {indexNowMsg && (
                  <span className={`text-sm ${indexNowMsg.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
                    {indexNowMsg}
                  </span>
                )}
              </div>

              {indexNowResults.length > 0 && (
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <div className="grid grid-cols-3 text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-2.5 border-b border-gray-100 bg-white">
                    <span>Engine</span><span>Status</span><span>Message</span>
                  </div>
                  {indexNowResults.map((r, i) => (
                    <div key={i} className="grid grid-cols-3 items-center px-4 py-2.5 border-b border-gray-100 text-sm last:border-0">
                      <span className="text-gray-700 font-medium">{r.engine}</span>
                      <span className={r.status === "success" ? "text-green-600 font-semibold" : "text-red-500"}>
                        {r.status === "success" ? "✓ Accepted" : "✗ Error"}
                      </span>
                      <span className="text-xs text-gray-400">{r.message ?? ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Google Indexing API ──────────────────────────────────────── */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-800">
              <p className="font-semibold mb-2">📡 Google Indexing API — One-time Setup</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Google Cloud Console → Library → Enable <strong>Web Search Indexing API</strong></li>
                <li>IAM &amp; Admin → Service Accounts → Create account → Keys tab → Add Key → JSON → Download</li>
                <li>Google Search Console → Settings → Users &amp; permissions → Add service account email as <strong>Owner</strong></li>
                <li>Paste the downloaded JSON contents into the credentials field below</li>
              </ol>
            </div>

            {/* Credentials */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
              <h3 className="font-semibold text-gray-800">🔑 Service Account Credentials (JSON)</h3>
              <p className="text-xs text-gray-400">Paste the full contents of your downloaded service account .json file.</p>
              <textarea
                value={gscCredentials}
                onChange={e => setGscCredentials(e.target.value)}
                rows={5}
                placeholder={`{\n  "type": "service_account",\n  "project_id": "...",\n  "private_key": "-----BEGIN PRIVATE KEY-----\\n...",\n  "client_email": "your-account@project.iam.gserviceaccount.com"\n}`}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-xs font-mono focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y bg-gray-50"
              />
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                🔒 Credentials are sent over HTTPS, used server-side to sign requests only, and are never stored or logged.
              </p>
            </div>

            {/* Two-column: Submit URLs + Add Site */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submit URLs */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <h3 className="font-semibold text-gray-800">📤 Submit URLs to Google</h3>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">URLs to submit (one per line, max 200/day)</label>
                  <textarea
                    value={gscUrls}
                    onChange={e => setGscUrls(e.target.value)}
                    rows={7}
                    placeholder={"https://kingladynailsspa.com\nhttps://kingladynailsspa.com/about\nhttps://kingladynailsspa.com/services/manicure\nhttps://kingladynailsspa.com/blog/your-post-slug"}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Quick-add pages</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Home",      url: "https://kingladynailsspa.com" },
                      { label: "About",    url: "https://kingladynailsspa.com/about" },
                      { label: "Contact",  url: "https://kingladynailsspa.com/contact" },
                      { label: "Blog",     url: "https://kingladynailsspa.com/blog" },
                      { label: "Services", url: "https://kingladynailsspa.com/services" },
                    ].map(p => (
                      <button key={p.url}
                        onClick={() => setGscUrls(prev => prev ? prev.trimEnd() + "\n" + p.url : p.url)}
                        className="text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 px-2.5 py-1 rounded-full transition-colors">
                        + {p.label}
                      </button>
                    ))}
                    <button onClick={() => setGscUrls("")}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-400 px-2.5 py-1 rounded-full">Clear</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Notification type</label>
                  <div className="flex gap-4">
                    {(["URL_UPDATED", "URL_DELETED"] as const).map(t => (
                      <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <input type="radio" checked={gscUrlType === t} onChange={() => setGscUrlType(t)} className="accent-blue-600" />
                        <span className={gscUrlType === t ? "font-semibold text-blue-700" : "text-gray-600"}>{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleIndexSubmit}
                  disabled={indexLoading || !gscCredentials.trim()}
                  className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 text-sm"
                >
                  {indexLoading ? "Submitting…" : "📡 Submit to Google"}
                </button>
              </div>

              {/* Add Site */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <h3 className="font-semibold text-gray-800">➕ Add Site to Search Console</h3>
                <p className="text-xs text-gray-500">Register your domain so the service account can manage it programmatically. Verify ownership separately (DNS TXT record or HTML file).</p>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Site URL</label>
                  <input
                    value={gscSiteUrl}
                    onChange={e => setGscSiteUrl(e.target.value)}
                    placeholder="https://kingladynailsspa.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1.5">
                  <p className="font-medium text-gray-700 mb-1">📋 Ownership verification methods</p>
                  <p>• <strong>DNS:</strong> Add a TXT record at your domain registrar</p>
                  <p>• <strong>HTML file:</strong> Upload a google*.html file to your site root</p>
                  <p>• <strong>HTML meta tag:</strong> Add a meta tag to your &lt;head&gt;</p>
                  <p>• <strong>Google Analytics:</strong> Already connected to your site</p>
                </div>
                <button
                  onClick={handleAddSite}
                  disabled={indexLoading || !gscCredentials.trim() || !gscSiteUrl.trim()}
                  className="w-full bg-gray-800 text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 disabled:opacity-40 text-sm"
                >
                  {indexLoading ? "Adding…" : "➕ Add Site to Search Console"}
                </button>
              </div>
            </div>

            {/* Status */}
            {indexMsg && (
              <div className={`text-sm p-4 rounded-xl border ${
                indexMsg.startsWith("✅") ? "bg-green-50 text-green-700 border-green-200"
                  : indexMsg.startsWith("❌") ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}>{indexMsg}</div>
            )}

            {/* Results table */}
            {indexResults.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Submission Results</h3>
                  <div className="flex gap-4 text-xs font-semibold">
                    <span className="text-green-600">{indexResults.filter(r => r.status === "success").length} accepted ✓</span>
                    <span className="text-red-500">{indexResults.filter(r => r.status === "error").length} failed ✗</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {indexResults.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
                      <span className={`text-base mt-0.5 ${r.status === "success" ? "text-green-500" : "text-red-400"}`}>
                        {r.status === "success" ? "✓" : "✗"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-gray-700 truncate">{r.url}</p>
                        {r.message && <p className="text-xs text-gray-400 mt-0.5">{r.message}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
