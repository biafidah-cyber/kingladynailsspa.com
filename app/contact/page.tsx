import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.businessName} — ${siteConfig.city}`,
  description: `Contact ${siteConfig.businessName} in ${siteConfig.city}, ${siteConfig.stateCode}. Call ${siteConfig.phone}, visit us at ${siteConfig.address}, or send us an email.`,
  alternates: { canonical: `${siteConfig.siteUrl}/contact` },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3 text-center">
        Contact {siteConfig.businessName}
      </h1>
      <p className="text-center text-gray-500 mb-12 text-lg">
        {siteConfig.city}'s favourite {siteConfig.category.toLowerCase()} — we'd love to hear from you
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact info (NAP — must be consistent with Google Business Profile) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Visit or Call Us</h2>
          <address className="not-italic text-gray-600 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-semibold text-gray-800">{siteConfig.businessName}</p>
                <p>{siteConfig.address}</p>
                <p>{siteConfig.city}, {siteConfig.stateCode} {siteConfig.zip}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <a
                href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`}
                className="text-pink-600 hover:underline font-medium text-lg"
              >
                {siteConfig.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <a href={`mailto:${siteConfig.email}`} className="text-pink-600 hover:underline">
                {siteConfig.email}
              </a>
            </div>
          </address>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Hours</h2>
            <div className="space-y-2">
              {Object.entries(siteConfig.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between text-sm border-b border-gray-100 pb-1">
                  <span className="font-medium text-gray-700">{day}</span>
                  <span className="text-gray-500">{hours}</span>
                </div>
              ))}
            </div>
          </div>

          <a
            href={siteConfig.mapEmbedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors"
          >
            📍 Get Directions on Google Maps
          </a>
        </div>

        {/* Self-hosted contact form — submissions stored in admin Leads panel */}
        <div className="bg-pink-50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
