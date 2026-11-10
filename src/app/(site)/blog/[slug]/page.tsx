import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts, BlogPost } from "@/content/blog";
import { ArrowLeft, Clock, Calendar, User, ArrowRight, Sparkles, Share2 } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
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
    title: `${post.title} | Jun Designs Kigali Cultural Journal`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Jun Designs`,
      description: post.excerpt,
      images: [{ url: post.coverImage, alt: post.title }],
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

  // Separate body paragraphs and the final signature line
  const bodyParagraphs = post.content.slice(0, -1);
  const closingSignature = post.content[post.content.length - 1];

  // Get other blog posts for the "More from the Journal" section
  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug);

  return (
    <div className="bg-brown-900 text-sand-primary text-left min-h-screen py-16 md:py-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-button text-sand-muted hover:text-amber transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal Index</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-pill text-[11px] font-mono font-semibold bg-amber/15 text-amber border border-amber/30 inline-block">
              {post.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-sand-bright leading-tight">
              {post.title}
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-amber pt-1">
              {post.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-sand-muted border-y border-amber-400/20 py-3.5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber" />
              <span>{post.publishedAt}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber" />
              <span>{post.readTime}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber" />
              <span>{post.author.name} ({post.author.role})</span>
            </span>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="relative aspect-[16/10] sm:aspect-[21/10] rounded-hero overflow-hidden border border-amber-400/30 shadow-warm-low">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="max-w-3xl mx-auto space-y-6 font-sans text-base sm:text-lg text-sand-primary leading-relaxed pt-4">
          {/* Paragraphs with secondary image woven gracefully into reading flow */}
          {bodyParagraphs.map((paragraph, idx) => {
            // Render first 3 paragraphs, then insert secondary image (if exists) for editorial balance
            const showSecondaryImage = idx === 2 && post.secondaryImage;
            // Render a callout highlight for the penultimate paragraph
            const isCallout = idx === bodyParagraphs.length - 1;

            return (
              <React.Fragment key={idx}>
                {isCallout ? (
                  <div className="my-8 p-6 sm:p-8 rounded-card bg-brown-950 border-l-4 border-amber border-y border-r border-amber-400/20 shadow-warm-low">
                    <p className="font-serif italic text-lg sm:text-xl text-sand-bright leading-relaxed">
                      &ldquo;{paragraph}&rdquo;
                    </p>
                  </div>
                ) : (
                  <p className={idx === 0 ? "text-lg sm:text-xl font-medium text-sand-bright leading-relaxed" : ""}>
                    {paragraph}
                  </p>
                )}

                {showSecondaryImage && (
                  <figure className="my-8 space-y-2">
                    <div className="relative aspect-[16/10] rounded-hero overflow-hidden border border-amber-400/25 shadow-warm-low">
                      <Image
                        src={post.secondaryImage!}
                        alt={`${post.title} craft exploration and cultural demonstration`}
                        fill
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="text-xs font-mono text-sand-muted text-center italic">
                      Traditional craftsmanship and natural materials preserved at Jun Designs, Kigali.
                    </figcaption>
                  </figure>
                )}
              </React.Fragment>
            );
          })}

          {/* Signature Closing Tagline */}
          <div className="pt-6 border-t border-amber-400/20 text-center sm:text-left">
            <p className="font-serif italic font-bold text-base sm:text-lg text-amber">
              {closingSignature}
            </p>
          </div>
        </div>

        {/* Author Bio Box */}
        <div className="max-w-3xl mx-auto rounded-hero bg-brown-950 border border-amber-400/25 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-warm-low">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-amber shrink-0">
            <Image
              src="/images/about/founder-fred-workshop.jpg"
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
              WRITTEN BY
            </span>
            <h3 className="font-serif text-xl font-bold text-sand-bright">
              {post.author.name}
            </h3>
            <p className="font-sans text-xs text-sand-muted">
              {post.author.role} &bull; Jun Designs Kigali
            </p>
            <p className="font-sans text-xs text-sand-primary pt-2 leading-relaxed">
              Passionate advocate for Rwandan arts, crafts and living cultural heritage. Leading workshops and artisan employment initiatives from Kigali Culture Village on Rebero hill.
            </p>
          </div>
        </div>

        {/* Related Workshop & Call to Action */}
        {post.relatedWorkshopSlug && (
          <div className="max-w-3xl mx-auto rounded-hero bg-brown-950 border border-amber-400/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-warm-low">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wider text-amber">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hands-On Experience</span>
              </div>
              <h4 className="font-serif text-xl font-bold text-sand-bright">
                Experience {post.relatedWorkshopName}
              </h4>
              <p className="font-sans text-xs text-sand-muted max-w-md">
                Learn the techniques from resident master artisans with views overlooking the hills of Kigali.
              </p>
            </div>
            <Link
              href={`/workshops/${post.relatedWorkshopSlug}`}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-pill bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 transition-colors shrink-0"
            >
              <span>Explore Workshop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* More Stories from the Cultural Journal */}
        {otherPosts.length > 0 && (
          <section className="pt-12 border-t border-amber-400/20 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block">
                  — FROM THE CULTURAL JOURNAL
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright">
                  More Stories &amp; Living Heritage
                </h3>
                <p className="font-sans text-xs sm:text-sm text-sand-muted max-w-xl leading-relaxed">
                  Explore ancestral Rwandan craftsmanship, natural textile histories, and living geometric traditions from Rebero hill.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-button text-amber hover:text-amber-300 transition-colors shrink-0"
              >
                <span>View All Journal Entries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherPosts.map((other) => (
                <article
                  key={other.slug}
                  className="bg-brown-950 rounded-hero border border-amber-400/25 overflow-hidden group flex flex-col hover:border-amber-400/60 transition-all duration-smooth shadow-warm-low"
                >
                  <Link href={`/blog/${other.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={other.coverImage}
                      alt={other.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-slow"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-pill text-[10px] font-mono font-semibold bg-brown-950/80 backdrop-blur-sm text-amber border border-amber-400/30">
                        {other.category}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-sand-muted">
                        <span>{other.publishedAt}</span>
                        <span>&bull;</span>
                        <span>{other.readTime}</span>
                      </div>
                      <h4 className="font-serif text-xl font-bold text-sand-bright group-hover:text-amber transition-colors leading-snug">
                        <Link href={`/blog/${other.slug}`}>{other.title}</Link>
                      </h4>
                      <p className="font-sans text-xs text-sand-primary line-clamp-2 leading-relaxed">
                        {other.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-amber-400/15 flex items-center justify-between">
                      <span className="text-[11px] font-sans text-sand-muted">
                        By {other.author.name}
                      </span>
                      <Link
                        href={`/blog/${other.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-display font-bold uppercase tracking-wider text-amber hover:text-amber-300 transition-colors"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
