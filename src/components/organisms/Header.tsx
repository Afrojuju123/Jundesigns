"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { navigationLinks } from "@/content/site";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  onBookClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workshopsDropdownOpen, setWorkshopsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-brown-200/30 shadow-sm transition-all">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between">
        {/* Logo Left - Displays the authentic attached logo with high contrast on white */}
        <Link
          href="/"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber group"
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
          className="hidden md:flex items-center gap-8"
        >
          {navigationLinks.map((link) => {
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
                    className="flex items-center gap-1.5 font-display text-xs lg:text-sm font-bold tracking-button uppercase text-brown-950 hover:text-amber py-2 transition-colors focus-visible:outline-none cursor-pointer"
                    aria-expanded={workshopsDropdownOpen}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 stroke-[2] transition-transform duration-quick group-hover:rotate-180" />
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
                    {link.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => setWorkshopsDropdownOpen(false)}
                        className="block p-2.5 rounded-sm hover:bg-stone-50 transition-colors text-left group/item"
                      >
                        <span className="block font-display font-semibold text-xs uppercase tracking-wide text-brown-950 group-hover/item:text-amber transition-colors">
                          {child.name}
                        </span>
                        <span className="block font-sans text-[11px] text-brown-600 line-clamp-1 mt-0.5">
                          {child.desc}
                        </span>
                      </Link>
                    ))}
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
                className="inline-flex items-center gap-1 font-display text-xs lg:text-sm font-bold tracking-button uppercase text-brown-950 hover:text-amber transition-colors"
              >
                <span>{link.name}</span>
                {link.isExternal && (
                  <ArrowUpRight className="w-3.5 h-3.5 text-brown-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={onBookClick}
            size="default"
            className="h-[46px] px-6 text-xs"
          >
            Book a workshop
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-4 pb-6 space-y-4 animate-reveal text-left shadow-lg">
          <div className="space-y-1">
            <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block mb-2">
              — Navigation
            </span>
            <Link
              href="/workshops"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 font-display text-sm font-bold uppercase tracking-button text-brown-950 hover:text-amber"
            >
              All Workshops
            </Link>
            <div className="pl-4 space-y-2 border-l border-amber-400/30 my-2">
              <Link
                href="/workshops/imigongo-painting"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-sans text-brown-800 hover:text-amber"
              >
                Imigongo Painting
              </Link>
              <Link
                href="/workshops/traditional-dance"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-sans text-brown-800 hover:text-amber"
              >
                Traditional Dance
              </Link>
              <Link
                href="/workshops/hand-weaving"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-sans text-brown-800 hover:text-amber"
              >
                Hand Weaving
              </Link>
              <Link
                href="/workshops/igisoro-game"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-sans text-brown-800 hover:text-amber"
              >
                Igisoro Game
              </Link>
            </div>

            <Link
              href="/schools"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 font-display text-sm font-bold uppercase tracking-button text-brown-950 hover:text-amber"
            >
              Schools &amp; Groups
            </Link>

            <Link
              href="https://jundesigns.rw/shop/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 font-display text-sm font-bold uppercase tracking-button text-brown-950 hover:text-amber"
            >
              <span>Store</span>
              <ArrowUpRight className="w-4 h-4 text-brown-400" />
            </Link>

            <Link
              href="https://jundesigns.rw/custom-work/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 font-display text-sm font-bold uppercase tracking-button text-brown-950 hover:text-amber"
            >
              <span>Custom Orders</span>
              <ArrowUpRight className="w-4 h-4 text-brown-400" />
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 font-display text-sm font-bold uppercase tracking-button text-brown-950 hover:text-amber"
            >
              Contact & Location
            </Link>
          </div>

          <div className="pt-4 border-t border-stone-200">
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onBookClick) onBookClick();
              }}
              className="w-full h-[48px] text-xs"
            >
              Book a workshop
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
