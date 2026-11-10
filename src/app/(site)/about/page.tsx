import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { siteConfig } from "@/content/site";
import { blogPosts } from "@/content/blog";
import { ArrowRight, Compass, HeartHandshake, Sparkles, MapPin, BookOpen, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Jun Designs — Celebrating Heritage Through Art, Creativity and Culture",
  description:
    "Learn about Jun Designs, founded in 2022 by Musemakweri Fred Junior in Kigali, Rwanda. Discover our mission celebrating Rwandan heritage through art, artisan craftsmanship, and cultural workshops.",
  openGraph: {
    title: "About Jun Designs | Rwandan Art, Craftsmanship & Culture",
    description:
      "Jun Designs brings together creative production, art and craft workshops, and cultural education in Kigali, Rwanda.",
    images: [
      {
        url: "/images/about/founder-fred-workshop.jpg",
        width: 800,
        height: 1067,
        alt: "Musemakweri Fred Junior holding Imigongo board in workshop",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="bg-brown-900 text-sand-primary text-left min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16 border-b border-amber-400/20 max-w-content mx-auto">
        <div className="max-w-3xl space-y-4">
          <Eyebrow>ABOUT JUN DESIGNS &bull; KIGALI, RWANDA</Eyebrow>
          <SectionHeading
            level="h1"
            title="Celebrating Heritage Through *Art, Creativity and Culture*"
          />
          <p className="font-sans text-lg sm:text-xl text-sand-bright leading-relaxed pt-2">
            Founded in 2022 by Musemakweri Fred Junior with a vision of transforming creativity into opportunities, empowering Rwandan artisans, and keeping living cultural traditions vibrant.
          </p>
        </div>
      </section>

      {/* 2. SECTION 1: OUR STORY */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Text Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <Eyebrow>OUR STORY</Eyebrow>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-bright leading-tight">
                Jun Designs &mdash; Celebrating Heritage Through Art, Creativity and Culture
              </h2>
            </div>

            <div className="space-y-5 font-sans text-base sm:text-lg text-sand-primary leading-relaxed">
              <p>
                Jun Designs was founded in 2022 by Musemakweri Fred Junior with a vision of transforming creativity into opportunities. The idea began with adding value to raw materials through the creation of handmade craft products, artistic furniture and interior design. Beyond producing unique products, Jun Designs was established with a commitment to creating employment opportunities by empowering talented individuals and local artisans to use their craftsmanship and creative skills to earn a living.
              </p>

              <p>
                In 2024, the vision expanded beyond production and product design into creating a space where people could come together to explore their creativity, learn different art and craft techniques, make their own creations and take them home. This development introduced a cultural and educational dimension to Jun Designs, with a particular interest in sharing the history of Rwanda through traditional craftsmanship and artistic practices.
              </p>

              <p>
                Today, Jun Designs brings together creative production, art and craft workshops, and cultural education. Through painting, pottery, weaving, Imigongo art, artistic design and other traditional and contemporary creative activities, the brand seeks to reconnect people with cultural knowledge and craftsmanship passed down through generations while encouraging new forms of artistic expression. It also aims to provide opportunities for local artisans, inspire creativity and make cultural experiences accessible to both local and international audiences.
              </p>

              <p>
                The name Jun Designs, derived from the founder’s name, Junior, represents a personal creative journey that has grown into a wider vision of connecting people through art, craftsmanship and cultural heritage.
              </p>

              <p>
                Looking ahead, Jun Designs aspires to become an internationally recognised Rwandan art and cultural brand, with creative workshops and a dedicated centre for learning, experiencing and celebrating arts, crafts and culture. Its ambition is to bring people from different backgrounds together, create meaningful experiences and give traditional craftsmanship new life in the modern world.
              </p>

              <div className="p-6 rounded-card bg-brown-950 border border-amber-400/30 shadow-warm-low mt-6">
                <p className="font-serif italic text-base sm:text-lg text-sand-bright leading-relaxed">
                  &ldquo;At Jun Designs, we believe creativity is more than making things; it is about sharing knowledge, creating opportunities, celebrating identity and keeping culture alive for generations to come.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Visual Side Images (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[3/4] rounded-hero overflow-hidden border border-amber-400/25 shadow-warm-low group">
              <Image
                src="/images/about/founder-fred-students.jpg"
                alt="Musemakweri Fred Junior teaching school students Rwandan cultural history with traditional artifacts"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-slow"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-transparent to-transparent flex items-end p-5">
                <span className="font-sans text-xs text-sand-bright font-medium">
                  Cultural education &amp; storytelling sessions on Rebero hill
                </span>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-hero overflow-hidden border border-amber-400/25 shadow-warm-low group">
              <Image
                src="/images/about/founder-fred-outdoors.jpg"
                alt="Fred Junior at the cultural workshop space with traditional royal spears"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-slow"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-transparent to-transparent flex items-end p-5">
                <span className="font-sans text-xs text-sand-bright font-medium">
                  Living heritage and traditional warrior regalia
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: THE STORY OF MUSEMAKWERI FRED JUNIOR */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-brown-950 border-y border-amber-400/20">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Founder Portrait & Highlights (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="relative aspect-[3/4] rounded-hero overflow-hidden border border-amber-400/30 shadow-warm-low group">
                <Image
                  src="/images/about/founder-fred-workshop.jpg"
                  alt="Musemakweri Fred Junior, Founder & Managing Director of Jun Designs, in apron holding handcrafted Imigongo board"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-slow"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-brown-950/20 to-transparent flex flex-col justify-end p-6">
                  <span className="font-display text-xs uppercase tracking-eyebrow text-amber font-bold">
                    FOUNDER &amp; MANAGING DIRECTOR
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-sand-bright">
                    Musemakweri Fred Junior
                  </h3>
                  <span className="text-xs font-sans text-sand-muted mt-1">
                    Known as &ldquo;Junior&rdquo; &bull; Jun Designs Kigali
                  </span>
                </div>
              </div>

              {/* Speech & Conference snapshots */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[4/3] rounded-card overflow-hidden border border-amber-400/20 shadow-sm">
                  <Image
                    src="/images/about/founder-fred-speech.jpg"
                    alt="Junior speaking at youth and creative industry podium"
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] rounded-card overflow-hidden border border-amber-400/20 shadow-sm">
                  <Image
                    src="/images/about/founder-fred-conference.jpg"
                    alt="Junior addressing conference with traditional Agaseke peace basket"
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Founder Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <Eyebrow>FOUNDER &amp; MANAGING DIRECTOR</Eyebrow>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-bright leading-tight">
                  THE STORY OF MUSEMAKWERI FRED JUNIOR
                </h2>
                <p className="font-display text-xs sm:text-sm uppercase tracking-eyebrow text-amber font-semibold pt-1">
                  Founder &amp; Managing Director of Jun Designs
                </p>
              </div>

              <div className="space-y-5 font-sans text-base sm:text-lg text-sand-primary leading-relaxed">
                <p>
                  Musemakweri Fred Junior, known as Junior, is an entrepreneur, creative designer and passionate advocate for Rwandan arts, crafts and culture. His journey with Jun Designs began with a passion for creative expression and a strong belief that Rwandan craftsmanship and raw materials carry immense value that can be transformed into meaningful products and experiences.
                </p>

                <p>
                  From an early stage, Junior was driven by the desire to innovate within Rwanda’s creative sector. What started as producing handmade interior design pieces, artistic furniture and crafts gradually evolved into a larger cultural and educational mission. Recognizing that traditional artistic practices were at risk of disappearing, he made it his mission to revive and share Rwanda’s cultural heritage through interactive learning and creative workshops.
                </p>

                <p>
                  Under his leadership, Jun Designs has grown from a product design venture into a recognised creative space offering cultural workshops, educational programmes for schools, and authentic cultural experiences for visitors from around the world. Through hands-on activities such as Imigongo painting, pottery, weaving and traditional dance, Junior and his team have created an engaging way for people to experience and appreciate Rwandan history and traditions.
                </p>

                <p>
                  Beyond preserving culture, Junior is deeply committed to empowering local artisans, supporting youth in developing creative skills and creating sustainable employment opportunities in the creative economy. He continues to lead Jun Designs with the vision of expanding its impact locally and internationally, establishing it as a centre for creativity, cultural exchange and artistic innovation.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-amber-400/20">
                <div className="p-5 rounded-card bg-brown-900 border border-amber-400/20 space-y-2">
                  <div className="w-9 h-9 rounded-full bg-amber/15 flex items-center justify-center text-amber">
                    <HeartHandshake className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-sand-bright">Artisan Empowerment</h4>
                  <p className="text-xs text-sand-muted leading-relaxed">
                    Creating fair, dignified livelihoods for local craftsmen and empowering Rwandan youth with creative career skills.
                  </p>
                </div>

                <div className="p-5 rounded-card bg-brown-900 border border-amber-400/20 space-y-2">
                  <div className="w-9 h-9 rounded-full bg-amber/15 flex items-center justify-center text-amber">
                    <Sparkles className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-sand-bright">Living Heritage</h4>
                  <p className="text-xs text-sand-muted leading-relaxed">
                    Giving 18th-century geometric art, sisal weaving, and royal dance new vitality in contemporary life and education.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CULTURAL JOURNAL SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-content mx-auto text-left space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <Eyebrow>OUR CULTURAL JOURNAL</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-bright">
              Stories of Ancestral Craft &amp; Heritage
            </h2>
            <p className="font-sans text-sm sm:text-base text-sand-primary max-w-xl leading-relaxed">
              Discover historical reflections, traditional textile methods, and artisan field notes documented by our creative team.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-button text-amber hover:text-amber-300 transition-colors shrink-0"
          >
            <span>Explore All Journal Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-brown-950 rounded-hero border border-amber-400/25 overflow-hidden group flex flex-col hover:border-amber-400/60 transition-all duration-smooth shadow-warm-low"
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
                  <span className="px-3 py-1 rounded-pill text-[10px] font-mono font-semibold bg-brown-950/80 backdrop-blur-sm text-amber border border-amber-400/30">
                    {post.category}
                  </span>
                </div>
              </Link>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-sand-muted">
                    <Calendar className="w-3.5 h-3.5 text-amber" />
                    <span>{post.publishedAt}</span>
                    <span>&bull;</span>
                    <Clock className="w-3.5 h-3.5 text-amber" />
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-sand-bright group-hover:text-amber transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="font-serif italic text-xs text-amber font-medium">
                    {post.subtitle}
                  </p>

                  <p className="font-sans text-xs sm:text-sm text-sand-primary line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-400/15 flex items-center justify-between">
                  <span className="text-xs font-sans text-sand-muted">
                    By {post.author.name}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-amber hover:text-amber-300 transition-colors"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. STUDIO LOCATION & CTA SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 max-w-content mx-auto">
        <div className="rounded-hero bg-brown-950 border border-amber-400/30 p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-warm-low">
          <div className="inline-flex items-center gap-2 text-xs font-display font-semibold uppercase tracking-wider text-amber">
            <MapPin className="w-4 h-4" />
            <span>Kigali Culture Village &bull; Rebero Hill</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-sand-bright max-w-2xl mx-auto">
            Experience Rwandan Heritage Firsthand
          </h2>

          <p className="font-sans text-base sm:text-lg text-sand-primary max-w-2xl mx-auto leading-relaxed">
            Join us for daily cultural workshops overlooking the hills of Kigali, book a school cohort programme, or collaborate on custom handcrafted decor.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/workshops"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-pill bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 transition-colors shadow-sm"
            >
              <span>Explore Workshops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/schools"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-pill bg-brown-900 border border-amber-400/30 text-sand-bright font-display text-xs font-bold uppercase tracking-button hover:bg-brown-850 hover:border-amber transition-colors"
            >
              <span>Schools &amp; Groups</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-pill bg-transparent border border-sand-muted/30 text-sand-primary font-display text-xs font-bold uppercase tracking-button hover:text-amber hover:border-amber transition-colors"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
