"use client";
import { useState } from "react";

export default function NewsletterForm({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("err");
    }
  };

  if (status === "ok") {
    return (
      <p className="text-green-400 text-sm font-semibold py-2">
        ✅ You&apos;re on the list! Check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === "loading"}
        className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-pink-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe Free"}
      </button>
      {status === "err" && (
        <p className="text-red-400 text-xs w-full mt-1">
          Something went wrong — please try again.
        </p>
      )}
    </form>
  );
}
