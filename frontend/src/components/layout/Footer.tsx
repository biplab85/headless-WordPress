"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_NAME, SITE_DESCRIPTION, CONTACT, SOCIAL_LINKS } from "@/lib/constants";
import { Linkedin, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const defaultCompanyLinks = [
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
];

const defaultServiceLinks = [
  { label: "MVP Development", href: "/services" },
  { label: "Website Design", href: "/services" },
  { label: "SEO & Marketing", href: "/services" },
  { label: "Paid Ads", href: "/services" },
  { label: "Video Production", href: "/services" },
];

const defaultLegalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

interface FooterProps {
  logoUrl?: string;
  siteName?: string;
  siteDescription?: string;
  contact?: { email: string; phone: string; location: string; calendly: string };
  socialLinks?: { linkedin: string; facebook: string; instagram: string; twitter: string };
  companyLinks?: { label: string; href: string }[];
  serviceLinks?: { label: string; href: string }[];
  legalLinks?: { label: string; href: string }[];
}

export default function Footer({
  logoUrl,
  siteName,
  siteDescription,
  contact,
  socialLinks: socialLinksProp,
  companyLinks: companyLinksProp,
  serviceLinks: serviceLinksProp,
  legalLinks: legalLinksProp,
}: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  const name = siteName || SITE_NAME;
  const description = siteDescription || SITE_DESCRIPTION;
  const contactInfo = contact || CONTACT;
  const socials = socialLinksProp || SOCIAL_LINKS;
  const compLinks = companyLinksProp?.length ? companyLinksProp : defaultCompanyLinks;
  const svcLinks = serviceLinksProp?.length ? serviceLinksProp : defaultServiceLinks;
  const legLinks = legalLinksProp?.length ? legalLinksProp : defaultLegalLinks;

  const socialIcons = [
    { href: socials.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: socials.facebook, icon: Facebook, label: "Facebook" },
    { href: socials.instagram, icon: Instagram, label: "Instagram" },
    { href: socials.twitter, icon: Twitter, label: "X/Twitter" },
  ];

  useEffect(() => {
    if (!footerRef.current) return;
    const cols = footerRef.current.querySelectorAll(".footer-col");
    const tween = gsap.fromTo(
      cols,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <footer ref={footerRef} className="border-t border-border/50 bg-card/50">
      <div className="absolute left-0 right-0 gradient-line" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="footer-col space-y-4">
            <Link href="/" className="font-display text-xl font-800 tracking-[-0.03em] flex items-center gap-1.5">
              {logoUrl ? (
                <Image src={logoUrl} alt={name} width={120} height={32} className="h-8 w-auto" />
              ) : (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  {name}
                </>
              )}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
            <div className="flex gap-2">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-border/50 bg-card/50 text-muted-foreground hover:text-primary hover:border-primary/40"
                  style={{ transition: "all 0.3s" }}
                  aria-label={social.label}
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h3 className="text-[10px] font-700 uppercase tracking-[0.15em] text-muted-foreground mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {compLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/60 hover:text-primary"
                    style={{ transition: "color 0.3s" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="text-[10px] font-700 uppercase tracking-[0.15em] text-muted-foreground mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {svcLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/60 hover:text-primary"
                    style={{ transition: "color 0.3s" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="text-[10px] font-700 uppercase tracking-[0.15em] text-muted-foreground mb-5">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2.5 text-sm text-foreground/60 hover:text-primary"
                  style={{ transition: "color 0.3s" }}
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-sm text-foreground/60 hover:text-primary"
                  style={{ transition: "color 0.3s" }}
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2.5 text-sm text-foreground/60">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {contactInfo.location}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 hr-accent" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {legLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] text-muted-foreground hover:text-primary tracking-[0.1em] uppercase"
                style={{ transition: "color 0.3s" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
