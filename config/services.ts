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
    slug:        "dip-powder-nails",
    name:        "Dip Powder Nails",
    emoji:       "✨",
    tagline:     "Odorless, Long-Lasting Dip Powder Nails in Las Vegas",
    description: "Dip powder nails at King Lady Nails & Spa in Las Vegas. Stronger than gel, odorless, and chip-free for 3–5 weeks. Starting at $45.",
    body: `Dip powder nails are the fastest-growing nail trend — and for good reason. The dip system uses a bonding powder that's stronger than traditional gel, completely odorless, and can last 3–5 weeks without chipping.

At King Lady Nails & Spa, our dip powder service includes nail prep, base coat application, color dipping (2–3 coats), activator, and a protective top coat. The result is a smooth, even finish that looks and feels natural.

Choose from our extensive color library — neutrals, nudes, vivid brights, and seasonal collections. We also offer ombre and two-tone dip options for added flair.

Dip powder is also excellent for nail health. It strengthens thin or brittle nails and doesn't require UV light to cure, making it a great alternative if you prefer to avoid gel lamps.`,
    price:    "Starting at $45",
    duration: "45–60 minutes",
    benefits: [
      "Lasts 3–5 weeks without chipping",
      "No UV light needed — healthier for nails",
      "Stronger than traditional gel polish",
      "Odorless — no harsh fumes",
      "Huge color selection including ombre options",
    ],
    faqs: [
      { q: "Is dip powder better than gel?", a: "Dip powder typically lasts longer (3–5 weeks vs 2–3 for gel) and doesn't require UV curing. Many clients prefer it for nail health." },
      { q: "Does dip powder damage nails?", a: "Done properly with professional removal, dip powder is gentle on nails. We always use professional soak-off removal — never pry or file aggressively." },
      { q: "Can I get dip powder with extensions?", a: "Yes — we can apply dip powder over natural nails or over tips/forms for added length." },
      { q: "How do I remove dip powder nails?", a: "Soak in acetone for 10–15 minutes. We recommend professional removal to keep your natural nails healthy." },
    ],
    keywords: ["dip powder nails Las Vegas", "dip nails Las Vegas", "SNS nails Las Vegas", "powder nails Las Vegas NV"],
    image: "",
  },
  {
    slug:        "gel-nail-extensions",
    name:        "Gel Nail Extensions",
    emoji:       "💎",
    tagline:     "Natural-Looking Gel Extensions for Extra Length",
    description: "Gel nail extensions at King Lady Nails & Spa in Las Vegas. Flexible, natural-feeling length with a flawless gel finish. Starting at $55.",
    body: `Gel nail extensions give you beautiful length without the bulk of traditional acrylics. At King Lady Nails & Spa, we sculpt gel extensions using soft gel or hard gel over forms or tips, creating a natural, flexible nail that moves with your hand.

The result is a nail that looks and feels almost like your own — just longer, stronger, and perfectly shaped. We offer every shape: square, round, oval, almond, coffin, and stiletto.

Gel extensions are cured under a UV/LED lamp at each stage, bonding directly to your natural nail for exceptional hold. Finished with gel color of your choice, your nails will be salon-perfect for 3–4 weeks.

Ideal for clients who want length and strength without the weight or odor of acrylic, gel extensions are our most natural-looking nail enhancement service.`,
    price:    "Starting at $55",
    duration: "60–90 minutes",
    benefits: [
      "Natural, flexible feel — lighter than acrylic",
      "Any shape: coffin, almond, stiletto, oval",
      "No strong odor — gentle formula",
      "Lasts 3–4 weeks with fills",
      "Compatible with gel, dip, or regular polish",
    ],
    faqs: [
      { q: "What is the difference between gel extensions and acrylic?", a: "Gel extensions are lighter, more flexible, and odorless compared to acrylic. They're cured under UV/LED and look more natural." },
      { q: "How long do gel extensions last?", a: "With proper care, gel extensions last 3–4 weeks before needing a fill or new set." },
      { q: "Can I get gel extensions on very short nails?", a: "Yes — we use forms to build extensions over even very short nails, adding length safely." },
      { q: "Do gel extensions damage natural nails?", a: "With professional application and removal, the damage is minimal. We always use safe removal techniques with no aggressive filing." },
    ],
    keywords: ["gel nail extensions Las Vegas", "nail extensions Las Vegas", "gel extensions Las Vegas NV", "long nails Las Vegas"],
    image: "",
  },
  {
    slug:        "nail-extensions",
    name:        "Nail Extensions",
    emoji:       "💅",
    tagline:     "Custom Nail Extensions — Any Length, Shape & Style",
    description: "Nail extensions in Las Vegas at King Lady Nails & Spa. Acrylic, gel, or dip — any shape and length. Expert technicians, stunning results.",
    body: `Nail extensions let you achieve any length or shape you've ever wanted. At King Lady Nails & Spa, we offer extensions in acrylic, gel, and dip powder — so you can choose the system that best suits your lifestyle and preferences.

Our technicians are skilled in sculpting extensions using both tips and forms, giving you precise control over length and shape. Whether you want a dramatic stiletto, a trendy coffin, a classic square, or a natural oval, we'll create the perfect set.

All extension services include nail prep, tip or form application, your chosen enhancement system, shaping, buffing, and your choice of color finish. We use professional-grade products for maximum durability and a flawless look.

Regular fills are recommended every 2–3 weeks to maintain the appearance and structural integrity of your extensions.`,
    price:    "Starting at $45",
    duration: "60–90 minutes",
    benefits: [
      "Acrylic, gel, or dip powder available",
      "All shapes and lengths — coffin, almond, stiletto",
      "Tips or sculpted forms for precise results",
      "Choice of polish, gel, or dip color finish",
      "Fills available every 2–3 weeks",
    ],
    faqs: [
      { q: "What types of nail extensions do you offer?", a: "We offer acrylic extensions, gel extensions, and dip powder extensions. Our team will recommend the best option for your nail goals." },
      { q: "How often do I need fills?", a: "Fills are recommended every 2–3 weeks as your natural nails grow. Full removal and resets every 2–3 months." },
      { q: "Which extension type lasts longest?", a: "Acrylic extensions are typically the most durable. Gel extensions look more natural. Dip powder is odorless with excellent longevity." },
      { q: "Can I shower and swim with nail extensions?", a: "Yes — our extensions are water-resistant. Extended soaking (long baths, hot tubs) can loosen them over time, so we recommend wearing gloves for chores." },
    ],
    keywords: ["nail extensions Las Vegas", "fake nails Las Vegas", "acrylic extensions Las Vegas", "gel extensions Las Vegas NV"],
    image: "",
  },
  {
    slug:        "manicure-and-pedicure",
    name:        "Manicure and Pedicure",
    emoji:       "🌸",
    tagline:     "The Ultimate Mani-Pedi Combo in Las Vegas",
    description: "Mani-pedi combo at King Lady Nails & Spa in Las Vegas. Full manicure and spa pedicure together — the perfect self-care treat. Starting at $55.",
    body: `The classic mani-pedi is the ultimate beauty treat — and at King Lady Nails & Spa, we make it an experience you'll want to repeat every month.

Our combo service includes a full manicure: nail shaping, cuticle care, hand exfoliation, hand massage, and polish of your choice. Combined with a full spa pedicure: warm soak, callus removal, nail shaping, cuticle care, foot scrub, calf massage, and polish.

Choose from classic polish, gel, or shellac for either service. Our cozy pedicure chairs and relaxing atmosphere make this the perfect way to unwind after a long week, celebrate a special occasion, or treat yourself just because.

Walk-ins are welcome, but we recommend booking ahead for the combo service to ensure two technicians can serve you simultaneously and get you out faster.`,
    price:    "Starting at $55",
    duration: "75–105 minutes",
    benefits: [
      "Full manicure + full spa pedicure in one visit",
      "Hand and calf massage included",
      "Gel upgrade available for both services",
      "Relaxing pedicure chairs with massage function",
      "Perfect for special occasions or regular self-care",
    ],
    faqs: [
      { q: "How long does a mani-pedi take?", a: "Our combo service takes 75–105 minutes. With two technicians working simultaneously, we can often finish faster." },
      { q: "Can I get gel on both my hands and feet?", a: "Yes — we offer gel or shellac upgrades for both the manicure and pedicure portions." },
      { q: "Should I book ahead for a mani-pedi?", a: "We recommend booking ahead, especially on weekends. Walk-ins are welcome but may have a wait." },
      { q: "What polish brands do you use?", a: "We carry OPI, Essie, CND Shellac, Gelish, and more — with hundreds of shades to choose from." },
    ],
    keywords: ["mani pedi Las Vegas", "manicure pedicure Las Vegas", "mani pedi combo Las Vegas NV", "nail salon combo Las Vegas"],
    image: "",
  },
  {
    slug:        "spa-pedicure",
    name:        "Spa Pedicure",
    emoji:       "🛁",
    tagline:     "Luxury Spa Pedicure with Extended Massage & Paraffin",
    description: "Luxury spa pedicure at King Lady Nails & Spa in Las Vegas. Extended massage, paraffin wax, and premium polish. The ultimate foot treatment.",
    body: `Our Spa Pedicure is the most indulgent foot treatment we offer — and the perfect escape from a busy Las Vegas day. It's everything in our classic pedicure, elevated with premium add-ons and extra relaxation time.

The spa pedicure includes a warm aromatherapy soak, thorough callus removal, nail shaping and cuticle care, a sugar scrub exfoliation, hot stone massage of the feet and calves, a nourishing paraffin wax dip for deep moisturizing, and your choice of polish.

Las Vegas's dry desert heat is notorious for leaving skin cracked and rough. Our spa pedicure is specifically designed to reverse that damage, leaving your feet silky soft with long-lasting moisture.

Treat yourself, gift it to someone special, or make it your monthly ritual. A full spa pedicure from King Lady Nails & Spa is an experience that stays with you.`,
    price:    "Starting at $55",
    duration: "60–75 minutes",
    benefits: [
      "Aromatherapy soak + thorough callus removal",
      "Extended hot stone foot and calf massage",
      "Sugar scrub + paraffin wax deep moisturizing",
      "Nourishing treatment for Las Vegas dry skin",
      "Choice of regular or gel polish finish",
    ],
    faqs: [
      { q: "What's the difference between a regular pedicure and a spa pedicure?", a: "The spa pedicure adds extended massage time, a sugar scrub exfoliation, and a paraffin wax dip for deep moisturizing — not included in the basic pedicure." },
      { q: "Is paraffin wax safe for everyone?", a: "Paraffin is safe for most people. Those with very sensitive skin or open wounds should skip the paraffin dip — please let your technician know." },
      { q: "How long does a spa pedicure last?", a: "The service takes 60–75 minutes. Results (smooth skin, polished nails) last 3–4 weeks with regular maintenance." },
      { q: "Do I need to bring anything?", a: "Just yourself! We provide everything. Wearing or bringing open-toed shoes or sandals is recommended so your polish stays fresh." },
    ],
    keywords: ["spa pedicure Las Vegas", "luxury pedicure Las Vegas", "paraffin pedicure Las Vegas NV", "hot stone pedicure Las Vegas"],
    image: "",
  },
  {
    slug:        "nail-polish",
    name:        "Nail Polish",
    emoji:       "💅",
    tagline:     "Express Polish Change — Hundreds of Shades",
    description: "Quick nail polish change at King Lady Nails & Spa in Las Vegas. OPI, Essie, Gelish, and more — hundreds of shades. Starting at $12.",
    body: `Sometimes all you need is a fresh coat of color. Our express nail polish service is perfect when you want a quick refresh without the full manicure treatment.

We carry hundreds of shades from top brands including OPI, Essie, CND, Gelish, and more — from timeless nudes and classic reds to seasonal trends and bold brights. Our technicians apply polish with precision for clean, even coverage every time.

The express service includes nail cleaning, light file if needed, base coat, two color coats, and top coat. Quick, clean, and beautiful.

Want something longer-lasting? Upgrade to gel polish for a chip-free finish that lasts 2–3 weeks with the same quick application time.`,
    price:    "Starting at $12",
    duration: "15–20 minutes",
    benefits: [
      "Hundreds of shades — OPI, Essie, Gelish, CND",
      "Quick service — in and out in 15–20 minutes",
      "Gel polish upgrade available for longer wear",
      "Clean, precise application every time",
      "Walk-ins always welcome",
    ],
    faqs: [
      { q: "How long does nail polish last?", a: "Regular polish lasts 5–7 days. Gel polish lasts 2–3 weeks without chipping." },
      { q: "What brands of polish do you carry?", a: "We carry OPI, Essie, CND, Gelish, and several other professional brands with hundreds of shades." },
      { q: "Can I bring my own nail polish?", a: "Yes — you're welcome to bring your own polish. We'll apply it for you at the standard express polish price." },
      { q: "Do you offer gel polish?", a: "Yes — gel polish upgrade is available for both hands and feet. It lasts 2–3 weeks and is cured under a UV/LED lamp." },
    ],
    keywords: ["nail polish Las Vegas", "polish change Las Vegas", "nail color Las Vegas NV", "OPI nails Las Vegas"],
    image: "",
  },
  {
    slug:        "mens-pedicure",
    name:        "Men's Pedicure",
    emoji:       "🦶",
    tagline:     "Pedicure for Men — Nail Care, Callus Removal & Massage",
    description: "Men's pedicure at King Lady Nails & Spa in Las Vegas. Nail trim, callus removal, and relaxing massage — no polish required. Starting at $35.",
    body: `Foot care isn't just for women. At King Lady Nails & Spa, our Men's Pedicure is designed for guys who want clean, well-maintained feet without the fuss.

The service includes a warm soak, nail trimming and shaping, cuticle care, thorough callus and dead skin removal, a relaxing foot and calf massage, and a moisturizing lotion application. No colored polish required — we finish with a clear buff for a clean, natural look.

Las Vegas men are on their feet — whether working, gaming, or hitting the Strip. Our pedicure relieves foot fatigue, removes painful calluses, and leaves your feet feeling renewed.

A 45-minute men's pedicure is one of the most underrated forms of self-care. Our team is professional, efficient, and completely judgment-free. Many of our male clients make it a monthly habit.`,
    price:    "Starting at $35",
    duration: "45–60 minutes",
    benefits: [
      "Nail trim, shaping & cuticle care",
      "Thorough callus and dead skin removal",
      "Relaxing foot and calf massage",
      "No colored polish — clean natural buff finish",
      "Judgment-free, professional service",
    ],
    faqs: [
      { q: "Do men get pedicures?", a: "Absolutely — foot health matters for everyone. Many men get regular pedicures for callus removal, nail care, and foot relaxation." },
      { q: "Will there be colored polish?", a: "Not unless you want it. Our men's pedicure finishes with a clear buff for a clean, natural appearance." },
      { q: "How long does a men's pedicure take?", a: "About 45–60 minutes. It's one of the most relaxing 45 minutes you'll spend." },
      { q: "How often should men get a pedicure?", a: "Every 4–6 weeks is ideal for maintaining healthy feet, preventing calluses, and keeping nails trimmed properly." },
    ],
    keywords: ["mens pedicure Las Vegas", "men pedicure Las Vegas NV", "male pedicure Las Vegas", "foot care Las Vegas men"],
    image: "",
  },
];

