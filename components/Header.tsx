import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Business name */}
        <Link href="/" className="flex items-center gap-2 group" aria-label={`${siteConfig.businessName} — home`}>
          <span className="text-2xl" aria-hidden="true">💅</span>
          <span className="font-extrabold text-gray-900 text-lg leading-tight group-hover:text-pink-600 transition-colors">
            {siteConfig.businessName}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600" aria-label="Main navigation">
          <Link href="/"          className="hover:text-pink-600 transition-colors">Home</Link>
          <Link href="/services"   className="hover:text-pink-600 transition-colors">Services</Link>
          <Link href="/blog"       className="hover:text-pink-600 transition-colors">Blog</Link>
          <Link href="/contact"    className="hover:text-pink-600 transition-colors">Contact</Link>
        </nav>

        {/* CTA */}
        <a
          href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`}
          className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors hidden sm:inline-block"
        >
          📞 {siteConfig.phone}
        </a>
      </div>
    </header>
  );
}
