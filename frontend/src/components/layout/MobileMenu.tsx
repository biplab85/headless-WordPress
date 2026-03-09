"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { CONTACT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navItems?: readonly NavItem[] | NavItem[];
  calendlyUrl?: string;
  ctaText?: string;
  pathname?: string;
}

export default function MobileMenu({ open, onClose, navItems = [], calendlyUrl, ctaText, pathname = "" }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuRef.current || !navRef.current) return;

    if (open) {
      gsap.set(menuRef.current, { display: "block" });
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, height: 0 },
        { opacity: 1, height: "auto", duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        navRef.current.children,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out", delay: 0.1 }
      );
    } else {
      gsap.to(menuRef.current, {
        opacity: 0,
        height: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (menuRef.current) gsap.set(menuRef.current, { display: "none" });
        },
      });
    }
  }, [open]);

  return (
    <div
      ref={menuRef}
      className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden"
      style={{ display: "none" }}
    >
      <nav ref={navRef} className="mx-auto max-w-7xl px-5 py-6 space-y-1">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "block rounded-sm px-4 py-3 font-display text-sm font-600",
                active
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
              style={{ transition: "color 0.3s, background 0.3s" }}
            >
              {item.label}
            </Link>
          );
        })}
        <div className="pt-4">
          <a
            href={calendlyUrl || CONTACT.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-sm bg-primary px-5 py-3 text-center text-xs font-display font-700 uppercase tracking-[0.1em] text-primary-foreground hover:shadow-[0_4px_24px_rgba(255,77,0,0.3)]"
            style={{ transition: "box-shadow 0.3s" }}
          >
            {ctaText || "Book a Call"}
          </a>
        </div>
      </nav>
    </div>
  );
}
