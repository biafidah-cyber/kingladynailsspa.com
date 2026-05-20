"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/",        label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog",    label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)}
          className="flex items-center gap-2 group shrink-0"
          aria-label={`${siteConfig.businessName} — home`}>
          <span className="text-2xl" aria-hidden="true">{siteConfig.logoEmoji}</span>
          <span className="font-extrabold text-gray-900 text-lg leading-tight group-hover:text-pink-600 transition-colors">
            {siteConfig.businessName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`hover:text-pink-600 transition-colors ${pathname === href ? "text-pink-600 font-semibold" : ""}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          <a href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`}
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors hidden sm:inline-block whitespace-nowrap">
            📞 {siteConfig.phone}
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 my-1 transition-all duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col py-2" aria-label="Mobile navigation">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                onClick={() => setOpen(false)}
                className={`px-5 py-3 text-sm font-medium transition-colors hover:bg-pink-50 hover:text-pink-600 ${
                  pathname === href ? "text-pink-600 bg-pink-50 font-semibold" : "text-gray-700"
                }`}>
                {label}
              </Link>
            ))}
            <div className="px-5 py-3 border-t border-gray-100 mt-1">
              <a href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`}
                className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors w-full">
                📞 Call {siteConfig.phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
