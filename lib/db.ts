/**
 * lib/db.ts — Supabase client with filesystem fallback
 *
 * When NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set,
 * posts are read from / written to Supabase. Otherwise the template falls
 * back to the original markdown-file approach transparently.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface DbPost {
  id?:             string;
  slug:            string;
  title:           string;
  description:     string;
  content:         string;          // raw markdown body (no frontmatter)
  primary_keyword: string;
  category:        string;
  tags:            string[];
  image:           string;
  author:          string;
  word_count:      number;
  publish_date?:   string | null;   // ISO date, null = publish immediately
  created_at?:     string;
  updated_at?:     string;
}

export interface DbSubscriber {
  id?:             string;
  email:           string;
  name?:           string;
  source?:         string;          // e.g. "footer", "blog-post", "popup"
  subscribed_at?:  string;
}

export interface DbContact {
  id?:             string;
  name:            string;
  email:           string;
  message:         string;
  submitted_at?:   string;
  read?:           boolean;
}

export interface DbComment {
  id?:             string;
  post_slug:       string;
  author_name:     string;
  author_email:    string;   // stored but never returned publicly
  body:            string;
  submitted_at?:   string;
  approved?:       boolean;
}

let _client: SupabaseClient | null = null;

/** Returns the Supabase client or null if not configured */
export function getDb(): SupabaseClient | null {
  if (_client) return _client;

  const url   = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key   = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  _client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return _client;
}

/** Returns true when Supabase is configured and available */
export function isSupabaseEnabled(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ── Convenience query helpers ─────────────────────────────────────────────────

export async function dbGetAllPosts(): Promise<DbPost[]> {
  const db = getDb();
  if (!db) return [];

  const now = new Date().toISOString();
  const { data, error } = await db
    .from("posts")
    .select("*")
    .or(`publish_date.is.null,publish_date.lte.${now}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[db] getAllPosts error:", error.message);
    return [];
  }
  return (data ?? []) as DbPost[];
}

export async function dbGetPostBySlug(slug: string): Promise<DbPost | null> {
  const db = getDb();
  if (!db) return null;

  const { data, error } = await db
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as DbPost;
}

export async function dbSavePost(post: DbPost): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return { error: "Supabase not configured" };

  const payload: DbPost = {
    ...post,
    updated_at: new Date().toISOString(),
  };

  const { error } = await db
    .from("posts")
    .upsert(payload, { onConflict: "slug" });

  return error ? { error: error.message } : {};
}

export async function dbDeletePost(slug: string): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return { error: "Supabase not configured" };

  const { error } = await db.from("posts").delete().eq("slug", slug);
  return error ? { error: error.message } : {};
}

// ── Subscribers ───────────────────────────────────────────────────────────────

export async function dbSaveSubscriber(
  email: string,
  name?: string,
  source?: string,
): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return { error: "Supabase not configured" };

  const { error } = await db
    .from("subscribers")
    .upsert(
      { email, name: name ?? "", source: source ?? "site", subscribed_at: new Date().toISOString() },
      { onConflict: "email" },
    );
  return error ? { error: error.message } : {};
}

export async function dbGetAllSubscribers(): Promise<DbSubscriber[]> {
  const db = getDb();
  if (!db) return [];

  const { data, error } = await db
    .from("subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error) {
    console.error("[db] getSubscribers error:", error.message);
    return [];
  }
  return (data ?? []) as DbSubscriber[];
}

export async function dbDeleteSubscriber(email: string): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return { error: "Supabase not configured" };

  const { error } = await db.from("subscribers").delete().eq("email", email);
  return error ? { error: error.message } : {};
}

// ── Contacts ──────────────────────────────────────────────────────────────────

export async function dbSaveContact(
  contact: Omit<DbContact, "id" | "submitted_at" | "read">,
): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return { error: "Supabase not configured" };

  const { error } = await db
    .from("contacts")
    .insert({ ...contact, submitted_at: new Date().toISOString(), read: false });
  return error ? { error: error.message } : {};
}

export async function dbGetAllContacts(): Promise<DbContact[]> {
  const db = getDb();
  if (!db) return [];

  const { data, error } = await db
    .from("contacts")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("[db] getContacts error:", error.message);
    return [];
  }
  return (data ?? []) as DbContact[];
}

export async function dbMarkContactRead(id: string): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return { error: "Supabase not configured" };

  const { error } = await db.from("contacts").update({ read: true }).eq("id", id);
  return error ? { error: error.message } : {};
}

// ── Comments ──────────────────────────────────────────────────────────────────

/** Approved comments for a post slug — safe to return publicly (no author_email) */
export async function dbGetCommentsBySlug(slug: string): Promise<DbComment[]> {
  const db = getDb();
  if (!db) return [];

  const { data, error } = await db
    .from("comments")
    .select("id, post_slug, author_name, body, submitted_at")
    .eq("post_slug", slug)
    .eq("approved", true)
    .order("submitted_at", { ascending: true });

  if (error) { console.error("[db] getComments error:", error.message); return []; }
  return (data ?? []) as DbComment[];
}

/** All comments including pending — admin use only */
export async function dbGetAllComments(): Promise<DbComment[]> {
  const db = getDb();
  if (!db) return [];

  const { data, error } = await db
    .from("comments")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) { console.error("[db] getAllComments error:", error.message); return []; }
  return (data ?? []) as DbComment[];
}

export async function dbSaveComment(
  comment: Omit<DbComment, "id" | "submitted_at" | "approved">,
): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return { error: "Supabase not configured" };

  const { error } = await db
    .from("comments")
    .insert({ ...comment, submitted_at: new Date().toISOString(), approved: false });
  return error ? { error: error.message } : {};
}

export async function dbApproveComment(id: string): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return { error: "Supabase not configured" };

  const { error } = await db.from("comments").update({ approved: true }).eq("id", id);
  return error ? { error: error.message } : {};
}

export async function dbDeleteComment(id: string): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) return { error: "Supabase not configured" };

  const { error } = await db.from("comments").delete().eq("id", id);
  return error ? { error: error.message } : {};
}
