"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      setStatus("ok");
      setForm({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      setStatus("err");
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "ok") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <p className="text-4xl mb-3">✅</p>
        <p className="font-semibold text-green-800 text-lg">Message sent!</p>
        <p className="text-green-700 text-sm mt-1">We&apos;ll get back to you as soon as possible.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-green-600 underline hover:no-underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handle}
          placeholder="Jane Smith"
          disabled={status === "loading"}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handle}
          placeholder="jane@example.com"
          disabled={status === "loading"}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handle}
          placeholder="Ask about our services, prices, or availability..."
          disabled={status === "loading"}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white resize-none disabled:opacity-50"
        />
      </div>
      {status === "err" && (
        <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-2">{errMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-pink-600 text-white font-semibold py-3 rounded-xl hover:bg-pink-700 transition-colors disabled:opacity-50 text-sm"
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Your message is saved securely. We do not share your information.
      </p>
    </form>
  );
}
