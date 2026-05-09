// lib/rateLimit.ts
// ─────────────────────────────────────────────────────────────────────────────
// In-memory rate limiter (sync) for dev/admin routes — resets on cold start.
// Public routes use rateLimitAsync() which uses Upstash Redis when configured:
//   UPSTASH_REDIS_REST_URL=https://...
//   UPSTASH_REDIS_REST_TOKEN=...
// Sign up free at https://upstash.com — generous free tier (10k req/day)
// ─────────────────────────────────────────────────────────────────────────────

const store = new Map<string, number[]>();

/**
 * Synchronous in-memory rate limiter.
 * Use for admin/dev-only routes (they're already blocked in production).
 * Returns true if the request is allowed.
 */
export function rateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const timestamps = (store.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) return false;

  timestamps.push(now);
  store.set(key, timestamps);
  return true;
}

/**
 * Async rate limiter — uses Upstash Redis if env vars are set, otherwise
 * falls back to the in-memory store.
 * Use this for public-facing routes (e.g. /api/subscribe).
 */
export async function rateLimitAsync(
  key: string,
  limit = 10,
  windowMs = 60_000
): Promise<boolean> {
  const redisUrl   = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      // SSRF guard: only allow genuine Upstash hostnames
      const _parsed = new URL(redisUrl);
      if (!_parsed.hostname.endsWith(".upstash.io")) {
        console.warn("[rateLimit] UPSTASH_REDIS_REST_URL is not an Upstash domain — falling back to in-memory");
        return rateLimit(key, limit, windowMs);
      }
    } catch {
      return rateLimit(key, limit, windowMs);
    }
    try {
      // Fixed-window counter keyed by (IP + window slot)
      const windowSlot = Math.floor(Date.now() / windowMs);
      const windowKey  = `rl:${key}:${windowSlot}`;

      // Increment counter
      const incrRes = await fetch(`${redisUrl}/incr/${encodeURIComponent(windowKey)}`, {
        headers: { Authorization: `Bearer ${redisToken}` },
      });
      const { result } = (await incrRes.json()) as { result: number };

      // Set expiry only on first hit so the key auto-deletes
      if (result === 1) {
        await fetch(
          `${redisUrl}/expire/${encodeURIComponent(windowKey)}/${Math.ceil(windowMs / 1000)}`,
          { headers: { Authorization: `Bearer ${redisToken}` } }
        );
      }

      return result <= limit;
    } catch {
      // Redis error → gracefully fall back to in-memory
    }
  }

  return rateLimit(key, limit, windowMs);
}

export function getRateLimitIp(request: Request): string {
  // Works on Vercel, Amplify, and most reverse proxies
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}
