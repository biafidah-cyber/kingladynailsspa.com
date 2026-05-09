/**
 * lib/localDb.ts — Filesystem JSON fallback for subscribers & contacts
 *
 * Used when Supabase is NOT configured.
 * Data is stored in /data/subscribers.json and /data/contacts.json
 * relative to the project root (process.cwd()).
 *
 * NOTE: On serverless platforms (Vercel, Amplify Lambda) the filesystem
 * is ephemeral. For production persistence configure Supabase env vars.
 */

import fs   from "fs";
import path from "path";
import type { DbSubscriber, DbContact, DbComment } from "./db";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(file: string): T[] {
  ensureDir();
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) return [];
  try { return JSON.parse(fs.readFileSync(fp, "utf-8")); }
  catch { return []; }
}

function writeJson<T>(file: string, data: T[]) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

// ── Subscribers ───────────────────────────────────────────────────────────────

export function localSaveSubscriber(email: string, name?: string): void {
  const list = readJson<DbSubscriber>("subscribers.json");
  if (list.some(s => s.email.toLowerCase() === email.toLowerCase())) return;
  list.unshift({ email, name: name ?? "", subscribed_at: new Date().toISOString() });
  writeJson("subscribers.json", list);
}

export function localGetAllSubscribers(): DbSubscriber[] {
  return readJson<DbSubscriber>("subscribers.json");
}

export function localDeleteSubscriber(email: string): void {
  const list = readJson<DbSubscriber>("subscribers.json")
    .filter(s => s.email.toLowerCase() !== email.toLowerCase());
  writeJson("subscribers.json", list);
}

// ── Contacts ──────────────────────────────────────────────────────────────────

export function localSaveContact(contact: Omit<DbContact, "id" | "submitted_at" | "read">): void {
  const list = readJson<DbContact>("contacts.json");
  list.unshift({
    id:           Date.now().toString(),
    ...contact,
    submitted_at: new Date().toISOString(),
    read:         false,
  });
  writeJson("contacts.json", list);
}

export function localGetAllContacts(): DbContact[] {
  return readJson<DbContact>("contacts.json");
}

export function localMarkContactRead(id: string): void {
  const list = readJson<DbContact>("contacts.json").map(c =>
    c.id === id ? { ...c, read: true } : c
  );
  writeJson("contacts.json", list);
}

// ── Comments ──────────────────────────────────────────────────────────────────

export function localSaveComment(
  comment: Omit<DbComment, "id" | "submitted_at" | "approved">,
): void {
  const list = readJson<DbComment>("comments.json");
  list.unshift({
    id:           Date.now().toString() + Math.random().toString(36).slice(2),
    ...comment,
    submitted_at: new Date().toISOString(),
    approved:     false,
  });
  writeJson("comments.json", list);
}

/** Approved comments for a slug, oldest first (for SSR rendering) */
export function localGetCommentsBySlug(slug: string): DbComment[] {
  return readJson<DbComment>("comments.json")
    .filter(c => c.post_slug === slug && c.approved === true)
    .sort((a, b) =>
      new Date(a.submitted_at ?? 0).getTime() - new Date(b.submitted_at ?? 0).getTime()
    );
}

/** All comments including pending, newest first (admin use) */
export function localGetAllComments(): DbComment[] {
  return readJson<DbComment>("comments.json")
    .sort((a, b) =>
      new Date(b.submitted_at ?? 0).getTime() - new Date(a.submitted_at ?? 0).getTime()
    );
}

export function localApproveComment(id: string): void {
  const list = readJson<DbComment>("comments.json").map(c =>
    c.id === id ? { ...c, approved: true } : c
  );
  writeJson("comments.json", list);
}

export function localDeleteComment(id: string): void {
  const list = readJson<DbComment>("comments.json").filter(c => c.id !== id);
  writeJson("comments.json", list);
}
