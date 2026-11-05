import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts } from "@/content/blog";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Story Not Found | Jun Designs Cultural Journal",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${post.title} | Jun Designs Kigali`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[70vh] bg-brown-900 text-sand-primary flex items-center justify-center py-20 px-4 text-left">
        <div className="max-w-md w-full bg-brown-950 p-8 rounded-card border border-amber-400/25 space-y-4 shadow-warm-low text-center">
          <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block">
            — CULTURAL JOURNAL
          </span>
          <h1 className="font-serif text-2xl font-bold text-sand-bright">
            Article Not Found
          </h1>
          <p className="font-sans text-xs text-sand-muted leading-relaxed">
            This article has not been published yet or the link may be outdated.
          </p>
          <div className="pt-2">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 h-11 px-5 rounded-button font-display text-xs font-bold uppercase tracking-button bg-amber text-brown-950 hover:bg-amber-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Journal Index</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brown-900 text-sand-primary text-left min-h-screen py-16">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-button text-sand-muted hover:text-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        <header className="space-y-4">
          <span className="font-serif italic text-amber text-sm font-semibold">
            {post.subtitle}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-sand-bright leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-sand-muted border-y border-amber-400/15 py-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber" />
              <span>{post.publishedAt}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber" />
              <span>{post.readTime}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber" />
              <span>{post.author.name}</span>
            </span>
          </div>
        </header>

        {/* Cover Image */}
        <div className="relative aspect-[16/10] rounded-card overflow-hidden border border-amber-400/30">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Post Body Content */}
        <div className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed space-y-6 pt-4">
          {post.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
