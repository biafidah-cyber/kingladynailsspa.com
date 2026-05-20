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
  address:      "6241 N Decatur Blvd #130",
  city:         "Las Vegas",
  state:        "Nevada",
  stateCode:    "NV",
  country:      "US",
  countryCode:  "US",
  zip:          "89130",
  phone:        "(702) 750-9050",
  email:        "hello@kingladynailsspa.com",
  mapEmbedUrl:  "https://maps.google.com/?q=6241+N+Decatur+Blvd+%23130+Las+Vegas+NV+89130",

  // ── GEO COORDINATES (for LocalBusiness schema — improves Maps ranking) ───────
  lat:          "36.2724",
  lng:          "-115.2042",

  // ── DOMAIN & URLS ────────────────────────────────────────────────────────────
  siteUrl:      "https://kingladynailsspa.com",
  domain:       "kingladynailsspa.com",

  // ── SCHEMA.ORG TYPE ──────────────────────────────────────────────────────────
  // Full list: https://schema.org/LocalBusiness
  category:       "Nail Salon",
  schemaBizType:  "BeautySalon",
  priceRange:     "$$",
  rating:         4.6,
  reviewCount:    1384,
  yearEstablished: 2018,

  // ── SERVICES (shows on homepage and feeds schema) ────────────────────────────
  services: [
    { name: "Manicure",               description: "Classic, gel, and shellac manicures with premium nail polish brands." },
    { name: "Pedicure",               description: "Relaxing spa pedicures with callus removal and hot stone massage." },
    { name: "Spa Pedicure",           description: "Luxury spa pedicure with extended massage, scrub, and paraffin treatment." },
    { name: "Manicure and Pedicure",  description: "The ultimate combo — full manicure and pedicure service together." },
    { name: "Acrylic Nails",          description: "Full sets and fills — any length, shape, or custom design." },
    { name: "Dip Powder Nails",       description: "Odorless, long-lasting dip powder nails that strengthen natural nails." },
    { name: "Gel Nails",              description: "Long-lasting gel nails that stay chip-free for 2–3 weeks." },
    { name: "Gel Nail Extensions",    description: "Gel extensions for extra length with a natural, flexible feel." },
    { name: "Nail Extensions",        description: "Custom nail extensions in any length and shape using acrylic or gel." },
    { name: "Nail Art",               description: "Hand-painted nail art, ombre, chrome powder, and seasonal designs." },
    { name: "Nail Polish",            description: "Express polish change in hundreds of shades — OPI, Essie, and more." },
    { name: "Men's Pedicure",         description: "Pedicure tailored for men — nail trim, callus removal, and relaxing massage." },
  ],

  // ── TESTIMONIALS (real Google reviews — also manageable via admin Reviews tab) ─
  testimonials: [
    {
      name:     "Laura Cerrone Amarillas",
      initials: "LC",
      service:  "Nails & Pedicures",
      rating:   5,
      text:     "They are all amazing the owner really cares about making her customers happy. They do wonderful nails and pedicures. They go above and beyond to please you! Best nail salon in town.",
    },
    {
      name:     "Dee Hanzy",
      initials: "DH",
      service:  "Regular Client — 5 Years",
      rating:   5,
      text:     "I have been going to the salon for the past 5 years and I am never disappointed they always do exactly what I asked them to do which is really important. They are meticulous, they are perfection, they are customer focused — love them!",
    },
    {
      name:     "Tiara Manibusan",
      initials: "TM",
      service:  "Nail Fills",
      rating:   5,
      text:     "Miss Hannah is GREAT! I absolutely enjoy getting my nails done here regularly. Miss Hannah runs a tight ship and accommodates her clients as efficiently as possible. I am always pleased and satisfied with my experience.",
    },
    {
      name:     "Yancell Mejia",
      initials: "YM",
      service:  "Mani & Pedicure",
      rating:   5,
      text:     "Lived in Las Vegas for over 9 years and had a hard time finding a nail salon. I absolutely loved my experience here! I brought my 4 year old daughter for her first mani and pedicure — the nail tech was very careful with her.",
    },
    {
      name:     "Natasha Mestas",
      initials: "NM",
      service:  "Nails",
      rating:   5,
      text:     "Mya always does an incredible job on my nails! Always exactly how I want it! She doesn't over bulge the nail which is really hard to find at a nail salon.",
    },
    {
      name:     "Dana Coursey",
      initials: "DC",
      service:  "Manicure",
      rating:   5,
      text:     "Mimi did a wonderful job on my nails. She evened them to a uniform, short length, cleaned up my cuticles and actually did a massage on my hands. I even made an appointment for 3 weeks and I never do that!",
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

  // ── ABOUT PAGE (fully drives about/page.tsx — no hardcoding there) ───────────
  about: {
    ctaTagline: "Walk-ins welcome · No appointment needed",
    storyParagraphs: [
      "King Lady Nails & Spa opened its doors in 2018 with one simple mission: to give every person who walked in the door a premium nail experience at a fair price. What started as a boutique salon on the north side of Las Vegas has grown into one of the most reviewed and trusted nail salons in the valley.",
      "We built our reputation one client at a time. We listen to what you want, use only top-shelf products (OPI, CND Shellac, Gelish, Kiara Sky), and maintain the strictest sanitation standards in the industry. Every tool is autoclave-sterilized. Every station is fully disinfected between appointments. We don't cut corners — ever.",
      "Today, our team of 12+ licensed technicians serves hundreds of loyal clients each week, from locals who've been with us since day one to first-timers looking for the best nail salon in Las Vegas. Whether it's a quick express manicure or an elaborate seasonal nail art design, we bring the same level of care and precision to every single service.",
    ],
    team: [
      { name: "Hannah Nguyen",  role: "Owner & Master Nail Technician", bio: "20+ years experience, specializing in acrylic full sets and salon management.", emoji: "👑" },
      { name: "Mya Le",         role: "Senior Nail Technician",          bio: "Expert in natural nail overlays and custom gel nail art designs.",             emoji: "💅" },
      { name: "Mimi Tran",      role: "Nail Artist",                     bio: "Ombre, chrome powder, and 3D nail design — the creative force of the salon.",  emoji: "🎨" },
    ],
    certifications: [
      "Nevada State Board of Cosmetology Licensed — all technicians",
      "Current state licenses posted at front desk",
      "Exceeds Nevada health & sanitation code requirements",
      "Autoclave sterilization — every metal tool, every client",
      "Single-use pedicure liners — changed with every pedicure",
      "Professionally insured — general liability & professional liability",
      "Annual continuing education program — all staff",
    ],
    values: [
      { icon: "🧼", title: "Sanitation First",       body: "Every metal tool autoclave-sterilized. Fresh liner on every pedicure basin. We don't just meet Nevada code — we exceed it." },
      { icon: "💎", title: "Premium Products Only",  body: "OPI, CND Shellac, Gelish, and Kiara Sky. We never use cheap knock-offs — your nails stay chip-free for weeks." },
      { icon: "👩‍🎨", title: "Skilled & Licensed",    body: "Every technician is Nevada-state-licensed with hands-on ongoing education. You're in expert hands." },
      { icon: "💬", title: "We Listen First",        body: "We spend time understanding exactly what you want before we begin. No guessing. No surprises." },
    ],
  },

  // ── CONTACT FORM ─────────────────────────────────────────────────────────────
  // Sign up free at https://formspree.io — set NEXT_PUBLIC_FORMSPREE_ID in .env.local
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "",

  // ── UI THEME ─────────────────────────────────────────────────────────────────
  // Tailwind color name — change to: pink | rose | violet | blue | green | amber
  themeColor: "pink",
} as const;

export type SiteConfig = typeof siteConfig;
