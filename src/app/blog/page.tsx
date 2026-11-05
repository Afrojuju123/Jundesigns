import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { blogPosts } from "@/content/blog";
import { BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Cultural Journal & Stories | Jun Designs Kigali",
  description:
    "Stories, craft histories, and artisan field notes from Jun Designs at Kigali Culture Village on Rebero hill, Rwanda.",
  openGraph: {
    title: "Cultural Journal | Jun Designs",
    description: "Stories, craft histories, and artisan reflections from Kigali, Rwanda.",
  },
};

export default function BlogIndexPage() {
  return (
    <main className="bg-brown-900 text-sand-primary text-left min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 border-b border-amber-400/20 max-w-content mx-auto">
        <div className="max-w-3xl space-y-4">
          <Eyebrow>STORIES &amp; CRAFT HISTORIES &bull; KIGALI, RWANDA</Eyebrow>
          <SectionHeading
            level="h1"
            title="The Cultural *Journal*"
          />
          <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed pt-2">
            Field notes, artisan profiles, and the living history behind Imigongo geometric art, sisal fiber weaving, royal dance, and traditional games in Rwanda.
          </p>
        </div>
      </section>

      {/* 2. POSTS GRID OR AUTHENTIC EMPTY STATE */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 max-w-content mx-auto">
        {blogPosts.length === 0 ? (
          <div className="bg-brown-950 rounded-hero p-8 sm:p-14 border border-amber-400/25 text-center max-w-2xl mx-auto space-y-5 shadow-warm-low">
            <div className="w-14 h-14 rounded-full bg-amber/15 border border-amber text-amber flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6 stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block">
                — FORTHCOMING ARTICLES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-sand-bright">
                No posts yet
              </h2>
            </div>

            <p className="font-sans text-sm sm:text-base text-sand-muted leading-relaxed max-w-lg mx-auto">
              Our resident artisans and guides will share craft histories, cultural reflections, and studio notes from Rebero hill here soon.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/workshops"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-button font-display text-xs font-bold uppercase tracking-button bg-amber text-brown-950 hover:bg-amber-400 transition-colors"
              >
                <span>Experience Workshops in Person</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-brown-950 rounded-card border border-amber-400/25 overflow-hidden group flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-slow"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-amber">
                      {post.publishedAt} &bull; {post.readTime}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-sand-bright group-hover:text-amber transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="font-sans text-xs text-sand-muted leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-display font-bold uppercase tracking-wider text-amber hover:text-amber-300"
                  >
                    <span>Read story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
