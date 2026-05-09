import Link from "next/link";
import { siteConfig } from "@/config/site";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  const year = new Date().getFullYear();
  const { social } = siteConfig;

  return (
    <footer className="bg-gray-900 text-gray-300 py-14 px-4 mt-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand + NAP */}
        <div className="md:col-span-1">
          <p className="font-bold text-white text-lg mb-2">{siteConfig.businessName}</p>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">{siteConfig.tagline}</p>
          <address className="not-italic text-sm text-gray-400 space-y-1.5">
            <p>📍 {siteConfig.address}</p>
            <p>{siteConfig.city}, {siteConfig.stateCode} {siteConfig.zip}</p>
            <p>
              📞{" "}
              <a href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`} className="hover:text-white transition-colors">
                {siteConfig.phone}
              </a>
            </p>
            <p>
              📧{" "}
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white transition-colors">
                {siteConfig.email}
              </a>
            </p>
          </address>

          {/* Social links */}
          {(social.facebook || social.instagram || social.twitter || social.youtube) && (
            <div className="flex gap-3 mt-4">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center text-xs transition-colors" aria-label="Facebook">f</a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center text-xs transition-colors" aria-label="Instagram">ig</a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center text-xs transition-colors" aria-label="Twitter / X">𝕏</a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center text-xs transition-colors" aria-label="YouTube">▶</a>
              )}
            </div>
          )}
        </div>

        {/* Services */}
        <div>
          <p className="font-semibold text-white mb-3">Services</p>
          <ul className="space-y-1.5 text-sm text-gray-400">
            {siteConfig.services.slice(0, 6).map((s) => (
              <li key={s.name}>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div>
          <p className="font-semibold text-white mb-3">Quick Links</p>
          <ul className="space-y-1.5 text-sm text-gray-400">
            <li><Link href="/"             className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/blog"         className="hover:text-white transition-colors">Blog &amp; Tips</Link></li>
            <li><Link href="/contact"      className="hover:text-white transition-colors">Contact &amp; Directions</Link></li>
            <li><Link href="/write-for-us" className="hover:text-white transition-colors">Write for Us</Link></li>
            <li><Link href="/advertise"    className="hover:text-white transition-colors">Advertise</Link></li>
            <li><Link href="/privacy"      className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li>
              <a href={siteConfig.mapEmbedUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Google Maps
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="font-semibold text-white mb-1">Weekly Beauty Tips</p>
          <p className="text-xs text-gray-500 mb-3">
            Get the latest {siteConfig.category.toLowerCase()} trends, deals, and how-to guides straight to your inbox. No spam.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
        <p>© {year} {siteConfig.businessName}. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/advertise" className="hover:text-gray-400 transition-colors">Advertise</Link>
          <Link href="/write-for-us" className="hover:text-gray-400 transition-colors">Write for Us</Link>
        </div>
      </div>
    </footer>
  );
}
