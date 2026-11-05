"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { navigationLinks } from "@/content/site";
import { useBookingDrawer } from "@/context/BookingDrawerContext";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  onBookClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workshopsDropdownOpen, setWorkshopsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

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
    if (href === "/contact") {
      return pathname === "/contact";
    }
    return pathname === href;
  };

  // Mobile menu: Lock body scroll, handle Escape key, and trap focus
  useEffect(() => {
    if (!mobileMenuOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Handle Escape and Focus Trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setWorkshopsDropdownOpen(false);
  }, [pathname]);

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

        {/* Right CTA Button (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
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
            className="w-11 h-11 rounded-sm bg-stone-100 border border-stone-200 flex items-center justify-center text-brown-950 hover:text-amber hover:border-amber transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[1.5]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Full-Height Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-x-0 top-20 md:top-24 bottom-0 z-50 bg-white border-t border-stone-200 px-6 py-6 space-y-6 overflow-y-auto animate-reveal text-left shadow-2xl"
        >
          <div className="space-y-2">
            <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block mb-2">
              — Navigation
            </span>

            {/* Workshops Accordion in Mobile */}
            <Link
              href="/workshops"
              aria-current={pathname === "/workshops" ? "page" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block py-2 font-display text-base font-bold uppercase tracking-button",
                pathname === "/workshops" ? "text-amber" : "text-brown-950 hover:text-amber"
              )}
            >
              All Workshops
            </Link>

            <div className="pl-4 space-y-2.5 border-l-2 border-amber-400/40 my-2">
              {[
                { name: "Imigongo Painting", href: "/workshops/imigongo-painting" },
                { name: "Traditional Dance", href: "/workshops/traditional-dance" },
                { name: "Hand Weaving", href: "/workshops/hand-weaving" },
                { name: "Igisoro Game", href: "/workshops/igisoro-game" },
              ].map((sub) => {
                const subActive = pathname === sub.href;
                return (
                  <Link
                    key={sub.name}
                    href={sub.href}
                    aria-current={subActive ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block text-sm font-sans transition-colors",
                      subActive ? "text-amber font-bold" : "text-brown-800 hover:text-amber"
                    )}
                  >
                    {sub.name}
                  </Link>
                );
              })}
            </div>

            <Link
              href="/schools"
              aria-current={pathname?.startsWith("/schools") ? "page" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block py-2.5 font-display text-base font-bold uppercase tracking-button",
                pathname?.startsWith("/schools") ? "text-amber" : "text-brown-950 hover:text-amber"
              )}
            >
              Schools &amp; Groups
            </Link>

            <Link
              href="https://jundesigns.rw/shop/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 font-display text-base font-bold uppercase tracking-button text-brown-950 hover:text-amber"
            >
              <span>Store</span>
              <ArrowUpRight className="w-4 h-4 text-brown-400" />
            </Link>

            <Link
              href="https://jundesigns.rw/custom-work/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 font-display text-base font-bold uppercase tracking-button text-brown-950 hover:text-amber"
            >
              <span>Custom Orders</span>
              <ArrowUpRight className="w-4 h-4 text-brown-400" />
            </Link>

            <Link
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block py-2.5 font-display text-base font-bold uppercase tracking-button",
                pathname === "/contact" ? "text-amber" : "text-brown-950 hover:text-amber"
              )}
            >
              Contact &amp; Location
            </Link>
          </div>

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
        </div>
      )}
    </header>
  );
};
