import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  ArrowUpRight,
  Facebook,
  Instagram,
  Compass,
} from "lucide-react";
import { siteConfig, footerLinkGroups, STORE_LINKS_ENABLED } from "@/content/site";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-brown-200/40 text-left pt-16 pb-12 mt-20 text-brown-950">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-stone-200">
          {/* Brand & Studio Location Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block" aria-label="Jun Designs Home">
              <Image
                src="/brand/logo.png"
                alt="Jun Designs"
                width={200}
                height={194}
                className="h-20 sm:h-24 w-auto object-contain"
              />
            </Link>

            <p className="font-sans text-sm text-brown-800 leading-relaxed max-w-sm pt-1">
              Authentic cultural workshops and artisan furniture studio located at the
              Kigali Culture Village on Rebero hill, overlooking the capital.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-brown-900">
                <MapPin className="w-4 h-4 text-amber shrink-0 mt-0.5 stroke-[1.5]" />
                <span>{siteConfig.address.full}</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-brown-900">
                <Phone className="w-4 h-4 text-amber shrink-0 stroke-[1.5]" />
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="hover:text-amber transition-colors font-medium"
                >
                  {siteConfig.phone}
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jun Designs on Instagram"
                className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-brown-900 hover:bg-amber hover:text-brown-950 hover:border-amber transition-colors"
              >
                <Instagram className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jun Designs on Facebook"
                className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-brown-900 hover:bg-amber hover:text-brown-950 hover:border-amber transition-colors"
              >
                <Facebook className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a
                href={siteConfig.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jun Designs on TikTok"
                className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-brown-900 hover:bg-amber hover:text-brown-950 hover:border-amber transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.96-4.49V8.52a8.27 8.27 0 0 0 4.81 1.54V6.69z" />
                </svg>
              </a>
              <a
                href={siteConfig.socials.googleBusiness}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jun Designs on Google Business"
                className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-brown-900 hover:bg-amber hover:text-brown-950 hover:border-amber transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Groups */}
          {footerLinkGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="font-display font-bold text-xs uppercase tracking-eyebrow text-amber">
                — {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => {
                  const isStoreLink =
                    link.href === siteConfig.externalLinks.shop ||
                    link.href === siteConfig.externalLinks.customOrders;

                  if (isStoreLink && !STORE_LINKS_ENABLED) {
                    return (
                      <li key={link.name}>
                        <span
                          aria-disabled="true"
                          tabIndex={-1}
                          className="inline-flex items-center gap-1 font-sans text-xs md:text-sm text-stone-400 cursor-default select-none"
                        >
                          <span>{link.name}</span>
                          <span className="sr-only">(Coming soon)</span>
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        target={link.isExternal ? "_blank" : undefined}
                        rel={link.isExternal ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 font-sans text-xs md:text-sm text-brown-800 hover:text-amber transition-colors"
                      >
                        <span>{link.name}</span>
                        {link.isExternal && (
                          <ArrowUpRight className="w-3.5 h-3.5 text-brown-400" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-stone-600">
          <p>{siteConfig.copyright}</p>
          <div className="flex items-center gap-6">
            <span>Kigali, Rwanda</span>
            <span>&bull;</span>
            <Link
              href="/style-guide"
              className="text-stone-600 hover:text-amber transition-colors underline underline-offset-4"
            >
              Design System / Style Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
