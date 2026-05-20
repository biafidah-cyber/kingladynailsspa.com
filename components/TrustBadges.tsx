import { siteConfig } from "@/config/site";

const badges = [
  { icon: "⭐", value: `${siteConfig.rating}`,              label: "Google Rating" },
  { icon: "👥", value: `${siteConfig.reviewCount}+`,        label: "Happy Clients" },
  { icon: "📅", value: `Since ${siteConfig.yearEstablished}`, label: "Est." },
  { icon: "✅", value: "Licensed",                           label: "& Insured" },
  { icon: "🏆", value: `Top Rated`,                         label: `${siteConfig.city} ${siteConfig.category}` },
  { icon: "🔒", value: "Certified",                          label: "Professionals" },
];

export default function TrustBadges() {
  return (
    <section className="py-10 px-4 bg-white border-y border-gray-100" aria-label="Trust indicators">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 items-center">
          {badges.map((b) => (
            <div key={b.label} className="text-center flex-shrink-0">
              <span className="text-2xl block mb-1">{b.icon}</span>
              <p className="font-bold text-gray-900 text-sm leading-tight">{b.value}</p>
              <p className="text-gray-400 text-xs">{b.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
