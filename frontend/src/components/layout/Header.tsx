"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS, CONTACT } from "@/lib/constants";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MobileMenu from "./MobileMenu";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import type { NavItem } from "@/types/site-options";

interface HeaderProps {
  logoUrl?: string;
  navItems?: NavItem[];
  calendlyUrl?: string;
  siteName?: string;
  ctaText?: string;
}

export default function Header({ logoUrl, navItems, calendlyUrl, siteName, ctaText }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const links = navItems && navItems.length > 0 ? navItems : NAV_ITEMS;
  const bookingUrl = calendlyUrl || CONTACT.calendly;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
    );

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 opacity-0",
        scrolled
          ? "bg-background/80 backdrop-blur-2xl border-b border-border/50"
          : "bg-transparent"
      )}
      style={{ transition: "background 0.4s, border-color 0.4s" }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={siteName || "Sklentr"}
                width={140}
                height={38}
                className="h-9 w-auto object-contain"
                style={{ height: "36px", width: "auto" }}
                priority
                unoptimized
              />
            ) : (
              <span className="font-display text-lg font-800 tracking-[-0.04em] uppercase flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                {siteName || "Sklentr"}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.1em]",
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
                style={{ transition: "color 0.25s" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center rounded-sm bg-primary px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-foreground hover:shadow-[0_4px_24px_rgba(255,77,0,0.3)]"
              style={{ transition: "box-shadow 0.3s" }}
              data-magnetic
            >
              {ctaText || "Book a Call"}
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-sm hover:bg-muted"
              style={{ transition: "background 0.2s" }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navItems={links} calendlyUrl={bookingUrl} ctaText={ctaText} pathname={pathname} />
    </header>
  );
}
