"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (result?.error) {
      setError("Incorrect password. Check ADMIN_PASSWORD in .env.local.");
    } else if (result?.url) {
      window.location.href = result.url;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⚙️</div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your admin password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter ADMIN_PASSWORD from .env.local"
              required
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-pink-600 text-white font-semibold py-3 rounded-xl hover:bg-pink-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">
          Set <code className="bg-gray-100 px-1 rounded">ADMIN_PASSWORD</code> in{" "}
          <code className="bg-gray-100 px-1 rounded">.env.local</code> to require a password.
          <br />
          Leave it unset to skip authentication in development.
        </p>
      </div>
    </div>
  );
}
