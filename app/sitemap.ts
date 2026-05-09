import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";
import { locations } from "@/config/locations";
import { services } from "@/config/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.siteUrl,                        lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${siteConfig.siteUrl}/blog`,              lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${siteConfig.siteUrl}/services`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteConfig.siteUrl}/about`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.siteUrl}/contact`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.siteUrl}/tags`,              lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${siteConfig.siteUrl}/write-for-us`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.siteUrl}/advertise`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.siteUrl}/privacy`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url:             `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified:    new Date(post.date),
    changeFrequency: "monthly" as const,
    priority:        0.8,
  }));

  const locationPages: MetadataRoute.Sitemap = locations.map((loc) => ({
    url:             `${siteConfig.siteUrl}/locations/${loc.slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.75,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url:             `${siteConfig.siteUrl}/services/${s.slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.85,
  }));

  return [...staticPages, ...servicePages, ...locationPages, ...postPages];
}

