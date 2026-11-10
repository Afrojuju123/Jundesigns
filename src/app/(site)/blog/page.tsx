import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { blogPosts } from "@/content/blog";
import { BookOpen, ArrowRight, Clock, Calendar, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Cultural Journal & Stories | Jun Designs Kigali",
  description:
    "Explore Rwandan barkcloth heritage, 18th-century Imigongo geometric art, and artisan stories from Jun Designs at Kigali Culture Village on Rebero hill, Rwanda.",
  openGraph: {
    title: "Cultural Journal | Jun Designs Kigali",
    description: "Stories, craft histories, and artisan reflections from Kigali, Rwanda.",
  },
};

export default function BlogIndexPage() {
  return (
    <div className="bg-brown-900 text-sand-primary text-left min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16 border-b border-amber-400/20 max-w-content mx-auto">
        <div className="max-w-3xl space-y-4">
          <Eyebrow>STORIES &amp; CRAFT HISTORIES &bull; KIGALI, RWANDA</Eyebrow>
          <SectionHeading
            level="h1"
            title="The Cultural *Journal*"
          />
          <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed pt-2">
            Field notes, craft histories, and the living ancestral heritage behind Rwandan barkcloth, Imigongo geometric relief art, sisal fiber weaving, and traditional craftsmanship.
          </p>
        </div>
      </section>

      {/* 2. POSTS GRID */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-content mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-brown-950 rounded-hero border border-amber-400/25 overflow-hidden group flex flex-col shadow-warm-low hover:border-amber-400/60 transition-all duration-smooth"
              >
                <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-slow"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-pill text-[11px] font-mono font-semibold bg-brown-950/80 backdrop-blur-sm text-amber border border-amber-400/30">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-sand-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber" />
                        <span>{post.publishedAt}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright group-hover:text-amber transition-colors leading-snug">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="font-serif italic text-sm text-amber font-medium">
                      {post.subtitle}
                    </p>

                    <p className="font-sans text-sm text-sand-primary leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-amber-400/15 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-sans text-sand-muted">
                      <User className="w-3.5 h-3.5 text-amber" />
                      <span>{post.author.name}</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-amber hover:text-amber-300 transition-colors"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
