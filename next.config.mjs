/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better dev warnings
  reactStrictMode: true,

  // Allow images from Unsplash, Pexels, and your own domain
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Trailing slash for consistent URL structure (better for SEO)
  trailingSlash: false,

  // Compress responses
  compress: true,

  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://*.amazonaws.com https://oaidalleapiprodscus.blob.core.windows.net",
      "connect-src 'self' https://www.google-analytics.com https://api.indexnow.org",
      "frame-src 'self' https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",           value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",          value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
          ...(!isDev ? [
            { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
            { key: "Content-Security-Policy",   value: cspDirectives },
          ] : []),
        ],
      },
    ];
  },
};

export default nextConfig;

