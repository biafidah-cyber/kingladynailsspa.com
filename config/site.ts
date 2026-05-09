// config/site.ts
// ─────────────────────────────────────────────────────────────────────────────
// ← EDIT THIS FILE for every new domain you buy. Everything else auto-adapts.
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  // ── BUSINESS ────────────────────────────────────────────────────────────────
  businessName:    "King Lady Nails & Spa",
  tagline:         "Las Vegas' Premier Nail Salon — Luxury Nails, Happy Clients",
  description:     "King Lady Nails & Spa in Las Vegas offers expert manicures, pedicures, acrylic nails, gel nails, and nail art at affordable prices. Walk-ins welcome.",

  // ── PRIMARY KEYWORD (exact match to your domain) ────────────────────────────
  primaryKeyword:  "nail salon Las Vegas",

  // ── LSI / SEMANTIC KEYWORDS (10–15 variations) ──────────────────────────────
  lsiKeywords: [
    "nail spa Las Vegas",
    "manicure Las Vegas",
    "pedicure Las Vegas NV",
    "gel nails Las Vegas",
    "acrylic nails Las Vegas",
    "nail art Las Vegas",
    "best nail salon Las Vegas",
    "affordable nail salon Las Vegas",
    "nail salon near me Las Vegas",
    "luxury nail salon Las Vegas Nevada",
  ],

  // ── LOCATION (must be 100% consistent everywhere — NAP) ─────────────────────
  address:      "3500 S Las Vegas Blvd Suite 101",
  city:         "Las Vegas",
  state:        "Nevada",
  stateCode:    "NV",
  country:      "US",
  countryCode:  "US",
  zip:          "89109",
  phone:        "(702) 750-9000",
  email:        "hello@kingladynailsspa.com",
  mapEmbedUrl:  "https://maps.google.com/?q=King+Lady+Nails+Spa+Las+Vegas",

  // ── GEO COORDINATES (for LocalBusiness schema — improves Maps ranking) ───────
  lat:          "36.1699",
  lng:          "-115.1398",

  // ── DOMAIN & URLS ────────────────────────────────────────────────────────────
  siteUrl:      "https://kingladynailsspa.com",
  domain:       "kingladynailsspa.com",

  // ── SCHEMA.ORG TYPE ──────────────────────────────────────────────────────────
  // Full list: https://schema.org/LocalBusiness
  category:       "Nail Salon",
  schemaBizType:  "BeautySalon",
  priceRange:     "$$",
  rating:         4.8,
  reviewCount:    312,
  yearEstablished: 2018,

  // ── SERVICES (shows on homepage and feeds schema) ────────────────────────────
  services: [
    { name: "Manicure",        description: "Classic, gel, and shellac manicures with premium nail polish brands." },
    { name: "Pedicure",        description: "Relaxing spa pedicures with callus removal and hot stone massage." },
    { name: "Acrylic Nails",   description: "Full sets and fills — any length, shape, or custom design." },
    { name: "Gel Nails",       description: "Long-lasting gel nails that stay chip-free for 2–3 weeks." },
    { name: "Nail Art",        description: "Hand-painted nail art, ombre, chrome powder, and seasonal designs." },
    { name: "Waxing",          description: "Eyebrow, lip, and full body waxing with gentle wax formula." },
  ],

  // ── TESTIMONIALS (shown on homepage — update with real client reviews) ────────
  testimonials: [
    {
      name:     "Sarah M.",
      initials: "SM",
      service:  "Gel Nails",
      rating:   5,
      text:     "Best nail salon I've found in Las Vegas! The staff is so friendly and my nails came out perfectly. I've already booked my next appointment.",
    },
    {
      name:     "Jennifer R.",
      initials: "JR",
      service:  "Acrylic Full Set",
      rating:   5,
      text:     "Impeccable cleanliness and attention to detail. Worth every penny. This is the only place I trust for my acrylics now.",
    },
    {
      name:     "Michelle T.",
      initials: "MT",
      service:  "Custom Nail Art",
      rating:   5,
      text:     "My nail art design came out exactly as I imagined. The technician listened carefully and executed it flawlessly. Will 100% be back.",
    },
  ],

  // ── BUSINESS HOURS ───────────────────────────────────────────────────────────
  hours: {
    Monday:    "9:00 AM – 7:00 PM",
    Tuesday:   "9:00 AM – 7:00 PM",
    Wednesday: "9:00 AM – 7:00 PM",
    Thursday:  "9:00 AM – 7:00 PM",
    Friday:    "9:00 AM – 8:00 PM",
    Saturday:  "9:00 AM – 8:00 PM",
    Sunday:    "10:00 AM – 6:00 PM",
  },

  // ── SOCIAL ───────────────────────────────────────────────────────────────────
  social: {
    facebook:  "",
    instagram: "",
    twitter:   "",
    youtube:   "",
  },

  // ── TRACKING ─────────────────────────────────────────────────────────────────
  googleAnalyticsId:  "",   // GA4 → G-XXXXXXXXXX
  gscVerification:    "",   // Google Search Console HTML meta verification tag

  // ── IMAGES (put files in /public/images/) ────────────────────────────────────
  logo:       "/images/logo.png",
  ogImage:    "/images/og-image.jpg",   // 1200×630 for social preview
  heroImage:  "/images/hero.jpg",

  // ── BLOG ─────────────────────────────────────────────────────────────────────
  postsPerPage: 10,
  defaultAuthor: "Editorial Team",

  // ── CONTACT FORM ─────────────────────────────────────────────────────────────
  // Sign up free at https://formspree.io — set NEXT_PUBLIC_FORMSPREE_ID in .env.local
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "",

  // ── UI THEME ─────────────────────────────────────────────────────────────────
  // Tailwind color name — change to: pink | rose | violet | blue | green | amber
  themeColor: "pink",
} as const;

export type SiteConfig = typeof siteConfig;
