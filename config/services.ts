// config/services.ts
// ─────────────────────────────────────────────────────────────────────────────
// Each entry generates a dedicated SEO page at /services/[slug]
// targeting high-intent buying keywords like "gel nails Las Vegas".
//
// HOW TO CUSTOMISE:
//  • Edit name, slug, tagline, description, benefits, faqs for each service.
//  • Add / remove entries to match what this business actually offers.
//  • price is optional — leave "" if you don't want to show pricing.
//  • keywords[] feeds the page's <meta keywords> and schema.org markup.
// ─────────────────────────────────────────────────────────────────────────────

export interface Service {
  slug:        string;        // URL slug  — e.g. "gel-nails"
  name:        string;        // Display   — e.g. "Gel Nails"
  emoji:       string;        // Emoji icon for cards
  tagline:     string;        // One-line hero subheading
  description: string;        // 160-char meta description (also intro text)
  body:        string;        // 2–4 paragraph rich description shown on page
  price:       string;        // e.g. "Starting at $35" — leave "" to hide
  duration:    string;        // e.g. "45–60 minutes" — leave "" to hide
  benefits:    string[];      // 3–5 bullet points shown on the page
  faqs:        { q: string; a: string }[];  // 3–5 FAQs — add schema.org FAQPage
  keywords:    string[];      // 3–5 LSI keywords for meta + schema
  image:       string;        // path in /public/images/ — or "" for default
}

export const services: Service[] = [
  {
    slug:        "manicure",
    name:        "Manicure",
    emoji:       "💅",
    tagline:     "Classic, Gel & Shellac Manicures in Las Vegas",
    description: "Professional manicures at King Lady Nails & Spa in Las Vegas. Choose from classic polish, gel, or shellac — stunning results every time.",
    body: `A great manicure starts with expert nail care. At King Lady Nails & Spa, every manicure begins with a thorough nail shaping, cuticle care, and hand exfoliation to leave your hands looking and feeling their best.

Choose from our classic polish manicure for a fresh, polished look that lasts up to a week, or upgrade to our gel or shellac options for chip-free color that stays vibrant for 2–3 weeks. We carry hundreds of shades from top brands including OPI, Essie, and CND Shellac.

Our technicians take pride in precision — clean lines, even coverage, and attention to every detail. Whether you prefer a timeless nude or a bold seasonal color, we'll make sure your nails look flawless.

Walk-ins are always welcome, or book ahead to guarantee your preferred time slot.`,
    price:    "Starting at $20",
    duration: "30–45 minutes",
    benefits: [
      "Nail shaping, filing & cuticle care included",
      "Hundreds of polish shades — OPI, Essie, CND",
      "Gel & shellac options available for longer wear",
      "Relaxing hand massage with every service",
      "Walk-ins welcome — no appointment needed",
    ],
    faqs: [
      { q: "How long does a manicure last?", a: "A classic manicure lasts 5–7 days. Gel and shellac manicures last 2–3 weeks without chipping." },
      { q: "Do you offer gel manicures?", a: "Yes — we offer standard gel, shellac, and builder gel options. Gel manicures start at $35." },
      { q: "How do I remove gel nail polish safely?", a: "We recommend professional removal to protect your nails. We offer gel removal for $10, or free with your next service." },
      { q: "Can I walk in for a manicure?", a: "Absolutely — walk-ins are welcome any time. For busy weekends, booking ahead guarantees your slot." },
    ],
    keywords: ["manicure Las Vegas", "gel manicure Las Vegas", "shellac nails Las Vegas", "nail salon manicure Las Vegas NV"],
    image: "",
  },
  {
    slug:        "pedicure",
    name:        "Pedicure",
    emoji:       "🦶",
    tagline:     "Relaxing Spa Pedicures with Hot Stone Massage",
    description: "Luxurious spa pedicures in Las Vegas at King Lady Nails & Spa. Callus removal, hot stone massage, and premium polish — starting at $30.",
    body: `Give your feet the care they deserve. Our spa pedicures go far beyond a simple polish change — we include a warm soak, callus removal, nail shaping, cuticle care, exfoliating scrub, and a relaxing hot stone massage.

Las Vegas's dry desert climate is tough on skin. Our pedicures use moisturizing treatments specifically chosen to combat dryness and cracking, leaving your feet soft and smooth.

Choose from our Classic Pedicure, Deluxe Spa Pedicure with extended massage, or our Luxury Pedicure with paraffin wax treatment. All pedicures include your choice of polish color from our full range of brands.

Perfect for a self-care afternoon, a pre-vacation treat, or a special occasion. Our pedicure chairs are cleaned and sanitized between every client for your peace of mind.`,
    price:    "Starting at $30",
    duration: "45–75 minutes",
    benefits: [
      "Warm soak, callus removal & cuticle care",
      "Hot stone foot and calf massage",
      "Moisturizing scrub and hydrating treatment",
      "Paraffin wax upgrade available",
      "Sanitized liner in every pedicure bowl",
    ],
    faqs: [
      { q: "What is included in a spa pedicure?", a: "Our spa pedicure includes a warm soak, callus removal, nail shaping, cuticle care, scrub, hot stone massage, and polish of your choice." },
      { q: "How often should I get a pedicure?", a: "We recommend every 3–4 weeks to keep your nails healthy and your feet smooth, especially in Las Vegas's dry climate." },
      { q: "Do you offer paraffin wax pedicures?", a: "Yes — paraffin wax is available as an add-on ($10) or included in our Luxury Pedicure package." },
      { q: "Is it safe to get a pedicure if I have diabetes?", a: "We recommend consulting your doctor first. Please let our technicians know and we will take extra care throughout your service." },
    ],
    keywords: ["pedicure Las Vegas", "spa pedicure Las Vegas", "foot massage Las Vegas", "nail salon pedicure Las Vegas NV"],
    image: "",
  },
  {
    slug:        "acrylic-nails",
    name:        "Acrylic Nails",
    emoji:       "✨",
    tagline:     "Full Sets, Fills & Custom Designs — Any Length or Shape",
    description: "Expert acrylic nails in Las Vegas at King Lady Nails & Spa. Full sets, fills, coffin, almond, stiletto shapes. Starting at $45.",
    body: `Acrylic nails are the gold standard for strength and versatility. At King Lady Nails & Spa, our acrylic nail technicians are highly trained in every shape — square, coffin, almond, stiletto, and oval — at any length you prefer.

We use professional-grade acrylic products that are odor-reduced, durable, and flexible, so your nails look natural and last 3–4 weeks between fills. Every full set begins with nail prep, tip or form application, acrylic sculpting, shaping, buffing, and your choice of polish or gel color.

Already have a set? Our fill appointments take 45–60 minutes and keep your nails looking fresh as they grow out. We can change your color, shape, or add nail art at any fill appointment.

Our custom acrylic designs include ombre blends, encapsulated glitter, chrome powder, and hand-painted nail art — just show us an inspiration photo and we'll recreate it.`,
    price:    "Full set from $45 · Fills from $35",
    duration: "60–90 minutes",
    benefits: [
      "All shapes: coffin, almond, stiletto, square, oval",
      "Any length — short and natural to extra long",
      "Odor-reduced professional acrylic products",
      "Gel color, chrome, glitter & nail art available",
      "Fill appointments every 3–4 weeks to maintain",
    ],
    faqs: [
      { q: "How long do acrylic nails last?", a: "Acrylic nails last 3–4 weeks before needing a fill. With regular fills, a full set can last several months." },
      { q: "What shapes can I get for acrylic nails?", a: "We do all popular shapes: coffin, ballerina, almond, stiletto, square, squoval, and oval. Just show us a reference photo." },
      { q: "Do acrylic nails damage natural nails?", a: "Properly applied and removed acrylics cause minimal damage. We always prep and remove gently. Avoid picking or peeling your nails off." },
      { q: "Can I get nail art on acrylic nails?", a: "Yes — hand-painted designs, ombre, chrome powder, and encapsulated glitter are all available. Show us your inspiration photo." },
      { q: "How much do acrylic nails cost in Las Vegas?", a: "A full acrylic set starts at $45 at King Lady Nails & Spa. Fills start at $35. Custom designs and nail art start at an additional $10." },
    ],
    keywords: ["acrylic nails Las Vegas", "acrylic full set Las Vegas", "nail fills Las Vegas", "coffin nails Las Vegas NV"],
    image: "",
  },
  {
    slug:        "gel-nails",
    name:        "Gel Nails",
    emoji:       "💎",
    tagline:     "Chip-Free Gel Nails That Last 2–3 Weeks",
    description: "Long-lasting gel nails at King Lady Nails & Spa in Las Vegas. Hard gel, builder gel & gel-X extensions. Chip-free for 2–3 weeks. From $35.",
    body: `Gel nails are perfect for anyone who wants flawless, chip-free color that holds up to daily life. Unlike traditional polish, gel is cured under UV/LED light for an ultra-glossy finish that won't chip, smudge, or dull for 2–3 weeks.

We offer three types of gel services: soft gel (gel polish over natural nails), hard gel (strengthening overlay or extension), and gel-X nail extensions (full coverage tips bonded with gel for extra length without acrylic).

Gel nails are lighter and more flexible than acrylics, making them an excellent choice for clients who prefer a more natural feel. They are also easier to soak off, reducing stress on your natural nail plate.

At King Lady Nails & Spa, we use top-quality gel brands cured under professional LED lamps, giving you a long-lasting result from your very first appointment.`,
    price:    "Gel polish from $35 · Gel-X extensions from $55",
    duration: "45–75 minutes",
    benefits: [
      "Chip-free color for 2–3 weeks guaranteed",
      "Gel polish, hard gel & Gel-X extensions available",
      "Lighter and more flexible than acrylic",
      "Professional LED cure for lasting gloss",
      "Gentle soak-off removal included when ready",
    ],
    faqs: [
      { q: "What is the difference between gel and acrylic nails?", a: "Gel nails are lighter, more flexible, and soak off more gently. Acrylics are stronger and better for very long lengths. Both last 3–4 weeks." },
      { q: "How long do gel nails last?", a: "Gel polish lasts 2–3 weeks without chipping. Hard gel and Gel-X extensions last 3–4 weeks with proper care." },
      { q: "Can I get gel nails on short nails?", a: "Yes — gel polish works great on short natural nails. We can also use builder gel to add a little length and strength." },
      { q: "Are gel nails safe?", a: "Yes. We use professional-grade gel products and cured under safe LED lamps. Always have gel removed professionally to protect your nails." },
    ],
    keywords: ["gel nails Las Vegas", "gel manicure Las Vegas", "gel-X nails Las Vegas", "builder gel Las Vegas NV"],
    image: "",
  },
  {
    slug:        "nail-art",
    name:        "Nail Art",
    emoji:       "🎨",
    tagline:     "Custom Hand-Painted Nail Art, Ombre, Chrome & More",
    description: "Creative nail art in Las Vegas at King Lady Nails & Spa. Ombre, chrome powder, hand-painted designs & seasonal themes. Bring your inspiration photo.",
    body: `Express your personality through your nails. Our nail art technicians specialize in custom hand-painted designs, ombre gradients, French tips, chrome mirror powder, foil accents, stamping, and intricate seasonal nail art.

Whether you have a specific design in mind or want our artists to get creative, we work with you to bring your vision to life. Just show us an Instagram or Pinterest photo and we'll recreate it — or create something entirely unique.

We offer nail art on natural nails, acrylic, gel, or press-ons. Popular requests include floral designs, geometric patterns, holiday themes, bridal nail art, and celebrity-inspired looks. Chrome powder and cat-eye gel effects are especially popular right now.

Nail art pricing varies by complexity and the number of nails. Simple accent nails start at $5 extra. Full-hand intricate designs start at $25 extra.`,
    price:    "Accent nail from +$5 · Full design from +$25",
    duration: "Varies by design",
    benefits: [
      "Hand-painted custom designs — bring a photo",
      "Ombre gradients, French tips & color fades",
      "Chrome mirror powder & cat-eye gel effects",
      "Seasonal, holiday & bridal nail art",
      "Works on natural nails, acrylic, or gel",
    ],
    faqs: [
      { q: "Can I bring a photo of the nail art I want?", a: "Absolutely — we encourage it. Show us any inspiration photo and our artists will recreate it or create something similar." },
      { q: "How much does nail art cost?", a: "Simple accent nails start at $5 extra. Full-hand intricate designs start at $25 extra. Pricing depends on complexity and detail." },
      { q: "What nail art styles do you offer?", a: "Ombre, French, chrome powder, cat-eye gel, stamping, hand-painted florals, geometric, holiday themes, and custom designs." },
      { q: "How long does nail art take?", a: "Simple accent nails add 10–15 minutes. Full intricate designs can take an additional 30–60 minutes depending on complexity." },
    ],
    keywords: ["nail art Las Vegas", "chrome nails Las Vegas", "ombre nails Las Vegas", "custom nail design Las Vegas NV"],
    image: "",
  },
  {
    slug:        "waxing",
    name:        "Waxing",
    emoji:       "🌸",
    tagline:     "Eyebrow, Lip & Body Waxing with Gentle Formula",
    description: "Professional waxing services at King Lady Nails & Spa in Las Vegas. Eyebrow shaping, lip, chin, and body waxing. Gentle formula for all skin types.",
    body: `Smooth, hair-free skin starts with a professional wax. At King Lady Nails & Spa, we offer a full range of waxing services for the face and body, performed by experienced estheticians using a gentle wax formula suitable for sensitive skin.

Our most popular waxing service is eyebrow shaping — we sculpt your brows to frame your face perfectly, removing unwanted hair cleanly and precisely. Most clients are in and out in under 10 minutes.

We also offer lip and chin waxing, and select body waxing services. All waxing services are performed in a clean, private setting with fresh wax and applicators for every client. We never double-dip.

Waxing results last 3–6 weeks. With regular waxing, hair grows back finer and sparser over time.`,
    price:    "Eyebrow wax from $12 · Lip wax from $8",
    duration: "10–30 minutes",
    benefits: [
      "Eyebrow shaping, lip, chin & body waxing",
      "Gentle formula — suitable for sensitive skin",
      "Results last 3–6 weeks",
      "No double-dipping — fresh applicator every time",
      "Quick service — eyebrow wax in under 10 minutes",
    ],
    faqs: [
      { q: "Does waxing hurt?", a: "There is a brief sting, but most clients find it very manageable. The discomfort is over in seconds and fades quickly after." },
      { q: "How long does waxing last?", a: "Results typically last 3–6 weeks. With regular waxing, hair grows back finer and slower over time." },
      { q: "Can I wax if I have sensitive skin?", a: "Yes — we use a gentle wax formula designed for sensitive skin. Please let your technician know about any sensitivities or skin conditions." },
      { q: "How long does hair need to be before waxing?", a: "Hair should be at least ¼ inch (about 6mm) long for the wax to grip it. About 2–3 weeks of growth after shaving is ideal." },
    ],
    keywords: ["waxing Las Vegas", "eyebrow waxing Las Vegas", "body waxing Las Vegas NV", "eyebrow shaping Las Vegas"],
    image: "",
  },
];
