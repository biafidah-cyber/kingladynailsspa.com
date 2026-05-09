import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// ── Root Metadata (overridden per-page) ─────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.businessName} | ${siteConfig.city}, ${siteConfig.stateCode}`,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: siteConfig.description,
  keywords: [siteConfig.primaryKeyword, ...siteConfig.lsiKeywords].join(", "),
  authors: [{ name: siteConfig.businessName, url: siteConfig.siteUrl }],
  creator: siteConfig.businessName,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: { canonical: siteConfig.siteUrl },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.siteUrl,
    siteName: siteConfig.businessName,
    title: `${siteConfig.businessName} | ${siteConfig.city}, ${siteConfig.stateCode}`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.businessName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.businessName,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  verification: siteConfig.gscVerification
    ? { google: siteConfig.gscVerification }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#be185d",
};

// ── Organization + LocalBusiness JSON-LD ────────────────────────────────────
function RootSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": siteConfig.schemaBizType,
        "@id": `${siteConfig.siteUrl}/#business`,
        name: siteConfig.businessName,
        url: siteConfig.siteUrl,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        address: {
          "@type": "PostalAddress",
          streetAddress:   siteConfig.address,
          addressLocality: siteConfig.city,
          addressRegion:   siteConfig.stateCode,
          postalCode:      siteConfig.zip,
          addressCountry:  siteConfig.countryCode,
        },
        geo: {
          "@type":    "GeoCoordinates",
          latitude:   siteConfig.lat  ?? "36.1699",
          longitude:  siteConfig.lng  ?? "-115.1398",
        },
        openingHoursSpecification: Object.entries(siteConfig.hours).map(([day, hours]) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: `https://schema.org/${day}`,
          opens:  hours.split("–")[0]?.trim().replace(" AM", "").replace(" PM", "") || "09:00",
          closes: hours.split("–")[1]?.trim().replace(" AM", "").replace(" PM", "") || "19:00",
        })),
        priceRange: siteConfig.priceRange,
        aggregateRating: {
          "@type":       "AggregateRating",
          ratingValue:   siteConfig.rating,
          reviewCount:   siteConfig.reviewCount,
          bestRating:    5,
          worstRating:   1,
        },
        hasMap: siteConfig.mapEmbedUrl,
        image:  [siteConfig.ogImage, siteConfig.heroImage].filter(Boolean),
        description: siteConfig.description,
        contactPoint: {
          "@type":             "ContactPoint",
          telephone:           siteConfig.phone,
          contactType:         "customer service",
          availableLanguage:   "English",
          areaServed:          siteConfig.stateCode,
        },
        sameAs: [
          siteConfig.social?.facebook,
          siteConfig.social?.instagram,
          siteConfig.social?.twitter
            ? `https://twitter.com/${(siteConfig.social.twitter as string).replace(/^@/, "")}`
            : "",
          siteConfig.social?.youtube,
        ].filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id":   `${siteConfig.siteUrl}/#website`,
        url:     siteConfig.siteUrl,
        name:    siteConfig.businessName,
        potentialAction: {
          "@type":       "SearchAction",
          target:        `${siteConfig.siteUrl}/blog?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Google Analytics ─────────────────────────────────────────────────────────
function GoogleAnalytics({ id }: { id: string }) {
  if (!id) return null;
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`,
        }}
      />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <RootSchema />
        <GoogleAnalytics id={siteConfig.googleAnalyticsId} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-white text-gray-800 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
