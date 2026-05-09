"use client";
// components/CommentForm.tsx — Client-side comment submission form
// Email is collected for moderation only and is never shown publicly.

import { useState } from "react";

interface CommentFormProps {
  slug: string;
}

export default function CommentForm({ slug }: CommentFormProps) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [body,    setBody]    = useState("");
  const [status,  setStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/comments", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          post_slug:    slug,
          author_name:  name,
          author_email: email,
          comment_body: body,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Failed to submit. Please try again.");
        setStatus("error");
      } else {
        setMessage(data.message);
        setStatus("success");
        setName(""); setEmail(""); setBody("");
      }
    } catch {
      setMessage("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
        ✅ {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-gray-800 text-lg">Leave a Comment</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1" htmlFor="comment-name">
            Name <span className="text-pink-500">*</span>
          </label>
          <input
            id="comment-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            minLength={2}
            maxLength={100}
            placeholder="Your name"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1" htmlFor="comment-email">
            Email <span className="text-pink-500">*</span>
            <span className="text-gray-400 text-xs ml-1">(not shown publicly)</span>
          </label>
          <input
            id="comment-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            maxLength={254}
            placeholder="you@example.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1" htmlFor="comment-body">
          Comment <span className="text-pink-500">*</span>
        </label>
        <textarea
          id="comment-body"
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          minLength={5}
          maxLength={2000}
          rows={4}
          placeholder="Share your thoughts…"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
        />
        <div className="text-right text-xs text-gray-400 mt-1">{body.length}/2000</div>
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm">{message}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-pink-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "Submitting…" : "Post Comment"}
        </button>
        <p className="text-xs text-gray-400">Comments are moderated before appearing.</p>
      </div>
    </form>
  );
}
