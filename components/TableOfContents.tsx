"use client";
import { useEffect, useState } from "react";

export interface TocHeading {
  level: number;
  text: string;
  id: string;
}

export default function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav
      className="bg-pink-50 border border-pink-100 rounded-2xl p-6 mb-10"
      aria-label="Table of contents"
    >
      <p className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Contents</p>
      <ol className="space-y-2 text-sm">
        {headings.map(({ level, text, id }) => (
          <li
            key={id}
            style={{ paddingLeft: `${(level - 2) * 1.25}rem` }}
          >
            <a
              href={`#${id}`}
              className={`hover:text-pink-600 transition-colors leading-snug block ${
                activeId === id
                  ? "text-pink-600 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
