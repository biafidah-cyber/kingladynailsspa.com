import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.businessName} — ${siteConfig.city}`,
  description: `Learn about ${siteConfig.businessName} — ${siteConfig.city}'s trusted ${siteConfig.category.toLowerCase()} since ${siteConfig.yearEstablished}. Meet our team, our story, and our commitment to excellence.`,
  alternates: { canonical: `${siteConfig.siteUrl}/about` },
};

const team = [
  {
    name: "Lily Tran",
    role: "Lead Nail Technician",
    bio: "15+ years experience, specializing in nail art and acrylics.",
    emoji: "💅",
  },
  {
    name: "Jenny Kim",
    role: "Senior Esthetician",
    bio: "Waxing, pedicure specialist, and certified skin care expert.",
    emoji: "✨",
  },
  {
    name: "Maria Nguyen",
    role: "Nail Artist",
    bio: "Ombre, chrome, and 3D nail design — the creative visionary.",
    emoji: "🎨",
  },
];

const certifications = [
  "Nevada State Board of Cosmetology Licensed",
  "All technicians state-licensed (current)",
  "Exceeds Nevada health & sanitation standards",
  "Autoclave sterilization — tools sterilized between every client",
  "Professionally insured — general liability coverage",
  "Continuing education — annual training program",
];

export default function AboutPage() {
  const yearsOpen = new Date().getFullYear() - siteConfig.yearEstablished;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-pink-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">About Us</span>
      </nav>

      {/* Hero */}
      <header className="mb-14">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          About {siteConfig.businessName}
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          {siteConfig.city}&apos;s most trusted {siteConfig.category.toLowerCase()} — serving the community
          with passion and expertise since {siteConfig.yearEstablished}.
        </p>
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="bg-pink-50 border border-pink-100 rounded-xl px-5 py-3 text-center">
            <p className="text-2xl font-black text-pink-600">{yearsOpen}+</p>
            <p className="text-xs text-gray-500 mt-0.5">Years Open</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-5 py-3 text-center">
            <p className="text-2xl font-black text-yellow-600">{siteConfig.rating}★</p>
            <p className="text-xs text-gray-500 mt-0.5">Google Rating</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 text-center">
            <p className="text-2xl font-black text-green-600">{siteConfig.reviewCount}+</p>
            <p className="text-xs text-gray-500 mt-0.5">Happy Clients</p>
          </div>
        </div>
      </header>

      {/* Our Story */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
          <p>
            {siteConfig.businessName} opened its doors in {siteConfig.yearEstablished} with one simple
            mission: to give every person who walked in the door a premium nail experience at a fair price.
            What started as a small salon on {siteConfig.city}&apos;s Strip has grown into one of the most
            reviewed and trusted {siteConfig.category.toLowerCase()} destinations in the Las Vegas valley.
          </p>
          <p>
            We built our reputation one client at a time. We listen to what you want, use only top-shelf
            products (OPI, CND Shellac, Gelish), and maintain the strictest sanitation standards in the
            industry. Every tool is autoclave-sterilized. Every station is fully disinfected between
            appointments. We don&apos;t cut corners — ever.
          </p>
          <p>
            Today, our team of {team.length + 3}+ licensed technicians serves hundreds of loyal clients
            each week, from locals to tourists visiting the Las Vegas Strip. Whether it&apos;s a quick
            manicure or an elaborate nail art design, we bring the same level of care and precision to
            every service.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
              <div className="text-4xl mb-3">{member.emoji}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-0.5">{member.name}</h3>
              <p className="text-pink-600 text-sm font-medium mb-3">{member.role}</p>
              <p className="text-gray-500 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Licenses & Certifications */}
      <section className="mb-14 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Licenses &amp; Certifications</h2>
        <ul className="space-y-3">
          {certifications.map((cert) => (
            <li key={cert} className="flex items-start gap-3 text-gray-700">
              <span className="text-green-500 mt-0.5 font-bold">✓</span>
              <span>{cert}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Values */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitment to You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { icon: "🧼", title: "Sanitation First", body: "Every tool autoclave-sterilized. Liner changed with every pedicure. We exceed state health code." },
            { icon: "💅", title: "Premium Products Only", body: "OPI, CND Shellac, Gelish, and Kiara Sky. Never cheap knock-offs that chip in 2 days." },
            { icon: "👩‍🎨", title: "Skilled Technicians", body: "All staff are state-licensed with ongoing education. Your nails are in expert hands." },
            { icon: "💬", title: "Listen Before We Work", body: "We take time to understand exactly what you want before picking up a brush." },
          ].map((v) => (
            <div key={v.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <span className="text-3xl flex-shrink-0">{v.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Come See Us in {siteConfig.city}</h2>
        <p className="text-pink-100 mb-6">Walk-ins welcome · No appointment needed</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`}
            className="bg-white text-pink-600 font-bold px-8 py-3 rounded-full hover:bg-pink-50 transition-colors"
          >
            📞 {siteConfig.phone}
          </a>
          <Link
            href="/contact"
            className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            Get Directions →
          </Link>
        </div>
      </div>
    </div>
  );
}
