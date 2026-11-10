"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ArrowUpRight, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { navigationLinks, STORE_LINKS_ENABLED, siteConfig } from "@/content/site";
import { useBookingDrawer } from "@/context/BookingDrawerContext";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  onBookClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workshopsDropdownOpen, setWorkshopsDropdownOpen] = useState(false);
  const [mobileWorkshopsOpen, setMobileWorkshopsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Consume global booking drawer context
  let drawerContext: ReturnType<typeof useBookingDrawer> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    drawerContext = useBookingDrawer();
  } catch {
    // Fallback if rendered outside provider (e.g. isolated test)
    drawerContext = null;
  }

  const handleBook = () => {
    if (onBookClick) {
      onBookClick();
    } else if (drawerContext) {
      drawerContext.openBooking();
    }
  };

  // Helper to check if a navigation link is currently active
  const isLinkActive = (href: string, isDropdown?: boolean) => {
    if (!pathname) return false;
    if (isDropdown || href.startsWith("/workshops")) {
      return pathname.startsWith("/workshops");
    }
    if (href === "/schools") {
      return pathname.startsWith("/schools");
    }
    if (href === "/blog") {
      return pathname.startsWith("/blog");
    }
    if (href === "/contact") {
      return pathname === "/contact";
    }
    return pathname === href;
  };

  // Close mobile menu and sub-menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setWorkshopsDropdownOpen(false);
    setMobileWorkshopsOpen(false);
  }, [pathname]);

  // Mobile menu: Lock body scroll, handle Escape key, focus restoration, and trap focus
  useEffect(() => {
    if (!mobileMenuOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the first focusable element inside drawer
    const focusTimer = setTimeout(() => {
      if (mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }, 50);

    // Handle Escape and Focus Trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileMenuOpen(false);
        hamburgerButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenuAndFocus = () => {
    setMobileMenuOpen(false);
    hamburgerButtonRef.current?.focus();
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-brown-200/30 shadow-sm transition-all"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between">
        {/* Logo Left */}
        <Link
          href="/"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber group shrink-0"
          aria-label="Jun Designs Home"
        >
          <Image
            src="/brand/logo.png"
            alt="Jun Designs"
            width={180}
            height={174}
            priority
            className="h-14 sm:h-16 md:h-18 w-auto object-contain group-hover:opacity-95 transition-opacity"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-7 lg:gap-8"
        >
          {navigationLinks.map((link) => {
            const isStoreOrCustom =
              link.name === "Store" || link.name === "Custom Orders";

            // If store links are disabled, render as non-interactive disabled text
            if (isStoreOrCustom && !STORE_LINKS_ENABLED) {
              return (
                <span
                  key={link.name}
                  aria-disabled="true"
                  tabIndex={-1}
                  className="inline-flex items-center gap-1 font-display text-xs lg:text-sm font-bold tracking-button uppercase py-2 text-stone-400 cursor-default select-none relative"
                >
                  <span>{link.name}</span>
                  <span className="sr-only">(Coming soon)</span>
                </span>
              );
            }

            const active = isLinkActive(link.href, !!link.children);

            if (link.children) {
              return (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setWorkshopsDropdownOpen(true)}
                  onMouseLeave={() => setWorkshopsDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setWorkshopsDropdownOpen(!workshopsDropdownOpen)
                    }
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-1.5 font-display text-xs lg:text-sm font-bold tracking-button uppercase py-2 transition-colors focus-visible:outline-none cursor-pointer",
                      active
                        ? "text-amber font-extrabold"
                        : "text-brown-950 hover:text-amber"
                    )}
                    aria-expanded={workshopsDropdownOpen}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 stroke-[2] transition-transform duration-quick",
                        workshopsDropdownOpen ? "rotate-180" : "group-hover:rotate-180"
                      )}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={cn(
                      "absolute top-full left-0 w-72 rounded-card bg-white border border-amber-400/30 p-2 shadow-drawer transition-all duration-quick z-50",
                      workshopsDropdownOpen
                        ? "opacity-100 translate-y-1 visible pointer-events-auto"
                        : "opacity-0 translate-y-3 invisible pointer-events-none"
                    )}
                  >
                    <div className="p-2 border-b border-stone-100 mb-1">
                      <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber">
                        — Cultural Workshops
                      </span>
                    </div>
                    {link.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          aria-current={childActive ? "page" : undefined}
                          onClick={() => setWorkshopsDropdownOpen(false)}
                          className={cn(
                            "block p-2.5 rounded-sm hover:bg-stone-50 transition-colors text-left group/item",
                            childActive ? "bg-stone-50/80 font-bold" : ""
                          )}
                        >
                          <span
                            className={cn(
                              "block font-display text-xs uppercase tracking-wide transition-colors",
                              childActive
                                ? "text-amber font-bold"
                                : "font-semibold text-brown-950 group-hover/item:text-amber"
                            )}
                          >
                            {child.name}
                          </span>
                          <span className="block font-sans text-[11px] text-brown-600 line-clamp-1 mt-0.5">
                            {child.desc}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1 font-display text-xs lg:text-sm font-bold tracking-button uppercase transition-colors py-2 relative",
                  active
                    ? "text-amber font-extrabold"
                    : "text-brown-950 hover:text-amber"
                )}
              >
                <span>{link.name}</span>
                {link.isExternal && (
                  <ArrowUpRight className="w-3.5 h-3.5 text-brown-400" />
                )}
                {active && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-amber rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button & Socials (Desktop) */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <div className="hidden xl:flex items-center gap-1.5 pr-2 border-r border-stone-200">
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Jun Designs on Instagram"
              className="w-8 h-8 rounded-full flex items-center justify-center text-brown-700 hover:text-amber hover:bg-stone-100 transition-colors"
            >
              <Instagram className="w-4 h-4 stroke-[1.5]" />
            </a>
            <a
              href={siteConfig.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Jun Designs on Facebook"
              className="w-8 h-8 rounded-full flex items-center justify-center text-brown-700 hover:text-amber hover:bg-stone-100 transition-colors"
            >
              <Facebook className="w-4 h-4 stroke-[1.5]" />
            </a>
            <a
              href={siteConfig.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Jun Designs on TikTok"
              className="w-8 h-8 rounded-full flex items-center justify-center text-brown-700 hover:text-amber hover:bg-stone-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.96-4.49V8.52a8.27 8.27 0 0 0 4.81 1.54V6.69z" />
              </svg>
            </a>
            <a
              href={siteConfig.socials.googleBusiness}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Jun Designs on Google Business"
              className="w-8 h-8 rounded-full flex items-center justify-center text-brown-700 hover:text-amber hover:bg-stone-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </a>
          </div>
          <Button
            onClick={handleBook}
            size="default"
            className="h-[46px] px-6 text-xs"
          >
            Book a workshop
          </Button>
        </div>

        {/* Mobile Right Controls: Book Button + Hamburger */}
        <div className="flex md:hidden items-center gap-2 sm:gap-3">
          <Button
            onClick={handleBook}
            size="sm"
            className="h-[38px] px-3.5 text-[11px]"
          >
            Book
          </Button>

          <button
            ref={hamburgerButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-sm bg-stone-100 border border-stone-200 flex items-center justify-center text-brown-950 hover:text-amber hover:border-amber transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[1.5]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Full-Height Drawer Rendered Via Portal */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div
            id="mobile-navigation-drawer"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="fixed inset-x-0 top-20 md:top-24 bottom-0 z-[45] bg-white border-t border-stone-200 px-6 py-6 overflow-y-auto text-left shadow-2xl flex flex-col justify-between motion-reduce:transition-none transition-all pb-[calc(2.5rem+env(safe-area-inset-bottom))]"
          >
            <div className="space-y-3">
              <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block mb-2">
                — Navigation
              </span>

              {/* Workshops Accordion in Mobile */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileWorkshopsOpen(!mobileWorkshopsOpen)}
                  aria-expanded={mobileWorkshopsOpen}
                  aria-controls="mobile-workshops-menu"
                  className="w-full flex items-center justify-between py-2.5 font-display text-base font-bold uppercase tracking-button text-brown-950 hover:text-amber transition-colors text-left cursor-pointer"
                >
                  <span
                    className={cn(
                      isLinkActive("/workshops") ? "text-amber" : ""
                    )}
                  >
                    Workshops
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 stroke-[2] transition-transform duration-200 text-brown-600",
                      mobileWorkshopsOpen ? "rotate-180 text-amber" : ""
                    )}
                  />
                </button>

                {mobileWorkshopsOpen && (
                  <div
                    id="mobile-workshops-menu"
                    className="pl-4 space-y-2.5 border-l-2 border-amber-400/40 my-2 animate-reveal"
                  >
                    <Link
                      href="/workshops"
                      aria-current={pathname === "/workshops" ? "page" : undefined}
                      onClick={closeMobileMenuAndFocus}
                      className={cn(
                        "block py-1 text-sm font-sans transition-colors font-semibold",
                        pathname === "/workshops"
                          ? "text-amber font-bold"
                          : "text-brown-900 hover:text-amber"
                      )}
                    >
                      All Workshops &rarr;
                    </Link>
                    {[
                      {
                        name: "Imigongo Painting",
                        href: "/workshops/imigongo-painting",
                      },
                      {
                        name: "Traditional Dance",
                        href: "/workshops/traditional-dance",
                      },
                      {
                        name: "Carpet Hand-Weaving",
                        href: "/workshops/hand-weaving",
                      },
                      {
                        name: "Igisoro Game",
                        href: "/workshops/igisoro-game",
                      },
                    ].map((sub) => {
                      const subActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          aria-current={subActive ? "page" : undefined}
                          onClick={closeMobileMenuAndFocus}
                          className={cn(
                            "block py-1 text-sm font-sans transition-colors",
                            subActive
                              ? "text-amber font-bold"
                              : "text-brown-800 hover:text-amber"
                          )}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Schools */}
              <Link
                href="/schools"
                aria-current={
                  pathname?.startsWith("/schools") ? "page" : undefined
                }
                onClick={closeMobileMenuAndFocus}
                className={cn(
                  "block py-2.5 font-display text-base font-bold uppercase tracking-button",
                  pathname?.startsWith("/schools")
                    ? "text-amber"
                    : "text-brown-950 hover:text-amber"
                )}
              >
                Schools &amp; Groups
              </Link>

              {/* Journal / Blog */}
              <Link
                href="/blog"
                aria-current={
                  pathname?.startsWith("/blog") ? "page" : undefined
                }
                onClick={closeMobileMenuAndFocus}
                className={cn(
                  "block py-2.5 font-display text-base font-bold uppercase tracking-button",
                  pathname?.startsWith("/blog")
                    ? "text-amber"
                    : "text-brown-950 hover:text-amber"
                )}
              >
                Cultural Journal
              </Link>

              {/* Store */}
              {!STORE_LINKS_ENABLED ? (
                <span
                  aria-disabled="true"
                  tabIndex={-1}
                  className="flex items-center justify-between py-2.5 font-display text-base font-bold uppercase tracking-button text-stone-400 cursor-default select-none"
                >
                  <span>Store</span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400/80">
                    Coming soon
                  </span>
                </span>
              ) : (
                <Link
                  href="https://jundesigns.rw/shop/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenuAndFocus}
                  className="flex items-center justify-between py-2.5 font-display text-base font-bold uppercase tracking-button text-brown-950 hover:text-amber"
                >
                  <span>Store</span>
                  <ArrowUpRight className="w-4 h-4 text-brown-400" />
                </Link>
              )}

              {/* Custom Orders */}
              {!STORE_LINKS_ENABLED ? (
                <span
                  aria-disabled="true"
                  tabIndex={-1}
                  className="flex items-center justify-between py-2.5 font-display text-base font-bold uppercase tracking-button text-stone-400 cursor-default select-none"
                >
                  <span>Custom Orders</span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400/80">
                    Coming soon
                  </span>
                </span>
              ) : (
                <Link
                  href="https://jundesigns.rw/custom-work/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenuAndFocus}
                  className="flex items-center justify-between py-2.5 font-display text-base font-bold uppercase tracking-button text-brown-950 hover:text-amber"
                >
                  <span>Custom Orders</span>
                  <ArrowUpRight className="w-4 h-4 text-brown-400" />
                </Link>
              )}

              {/* Contact */}
              <Link
                href="/contact"
                aria-current={pathname === "/contact" ? "page" : undefined}
                onClick={closeMobileMenuAndFocus}
                className={cn(
                  "block py-2.5 font-display text-base font-bold uppercase tracking-button",
                  pathname === "/contact"
                    ? "text-amber"
                    : "text-brown-950 hover:text-amber"
                )}
              >
                Contact &amp; Location
              </Link>
            </div>

            {/* Social Links in Mobile Drawer */}
            <div className="pt-6 pb-2 border-t border-stone-200 mt-4">
              <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block mb-3">
                — Connect With Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Jun Designs on Instagram"
                  className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-brown-900 hover:bg-amber hover:text-brown-950 transition-colors"
                >
                  <Instagram className="w-4 h-4 stroke-[1.5]" />
                </a>
                <a
                  href={siteConfig.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Jun Designs on Facebook"
                  className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-brown-900 hover:bg-amber hover:text-brown-950 transition-colors"
                >
                  <Facebook className="w-4 h-4 stroke-[1.5]" />
                </a>
                <a
                  href={siteConfig.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Jun Designs on TikTok"
                  className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-brown-900 hover:bg-amber hover:text-brown-950 transition-colors"
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
                  className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-brown-900 hover:bg-amber hover:text-brown-950 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Bottom Book Button */}
            <div className="pt-6 border-t border-stone-200">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleBook();
                }}
                className="w-full h-[52px] text-xs"
              >
                Book a workshop
              </Button>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};
