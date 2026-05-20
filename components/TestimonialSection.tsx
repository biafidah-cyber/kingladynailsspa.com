import { createClient } from "@supabase/supabase-js";
import { siteConfig } from "@/config/site";

interface Testimonial {
  name: string;
  initials: string;
  service: string;
  rating: number;
  text: string;
}

async function getTestimonials(): Promise<Testimonial[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    try {
      const sb = createClient(url, key);
      const { data } = await sb
        .from("testimonials")
        .select("name, initials, service, rating, text")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (data && data.length > 0) return data as Testimonial[];
    } catch {
      // fall through to static config
    }
  }
  return siteConfig.testimonials;
}

function Stars({ count }: { count: number }) {
  return (
    <span aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : "text-gray-200"}>★</span>
      ))}
    </span>
  );
}

export default async function TestimonialSection() {
  const testimonials = await getTestimonials();

  return (
    <section className="py-16 px-4 bg-pink-50" aria-label="Customer testimonials">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-pink-600 font-semibold text-sm tracking-widest uppercase mb-2">Testimonials</p>
          <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
          <p className="text-gray-500 mt-2">
            <strong>{siteConfig.rating}★</strong> average across{" "}
            <strong>{siteConfig.reviewCount.toLocaleString()}+</strong> Google reviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm flex flex-col"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm" itemProp="author">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.service}</p>
                </div>
              </div>
              <div className="mb-3" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <Stars count={t.rating} />
                <meta itemProp="ratingValue" content={String(t.rating)} />
                <meta itemProp="bestRating" content="5" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1" itemProp="reviewBody">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href={siteConfig.mapEmbedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pink-600 font-semibold text-sm hover:text-pink-800 transition-colors"
          >
            Read all reviews on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
