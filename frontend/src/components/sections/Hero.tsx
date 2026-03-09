"use client";

import { useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import HeroIllustration from "@/components/ui/HeroIllustration";
import TextReveal from "@/components/ui/TextReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteOptions } from "@/types/site-options";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  data?: Pick<
    SiteOptions,
    | "hero_label"
    | "hero_headline"
    | "hero_highlight_word"
    | "hero_muted_text"
    | "hero_subheading"
    | "hero_tagline"
    | "hero_cta_primary_text"
    | "hero_cta_primary_url"
    | "hero_cta_secondary_text"
    | "hero_cta_secondary_url"
    | "hero_stats"
  >;
}

const defaults = {
  hero_label: "Toronto-based MVP Studio",
  hero_headline: "Launch-ready MVPs\nin weeks, not months.",
  hero_highlight_word: "weeks,",
  hero_muted_text: "not months.",
  hero_subheading:
    "We build MVPs that get you funded, validated, and to market \u2014 fast.",
  hero_tagline:
    "Canadian expertise \u00b7 Competitive pricing \u00b7 No excuses",
  hero_cta_primary_text: "Book My Free Consultation",
  hero_cta_primary_url: "https://calendly.com/sklentr",
  hero_cta_secondary_text: "See Pricing",
  hero_cta_secondary_url: "/pricing",
  hero_stats: [
    { value: "2-Week", label: "MVPs" },
    { value: "50+", label: "Projects" },
    { value: "#1", label: "SEO Rankings" },
    { value: "100%", label: "Canadian Mgmt" },
  ],
};

export default function Hero({ data }: HeroProps) {
  const d = { ...defaults, ...data };
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Slow, premium entrance — label first
      tl.fromTo(
        ".hero-label",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.6 }
      )
        // Subheading and tagline
        .fromTo(
          ".hero-sub",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15 },
          "+=0.4"
        )
        // CTAs
        .fromTo(
          ".hero-cta",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
          "-=0.4"
        )
        // Divider line draws
        .fromTo(
          ".hero-divider",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.5, ease: "power2.inOut" },
          "-=0.5"
        )
        // Stats stagger
        .fromTo(
          ".hero-stat",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
          "-=0.8"
        )
        // Illustration
        .fromTo(
          ".hero-illustration",
          { opacity: 0, scale: 0.9, x: 40 },
          { opacity: 1, scale: 1, x: 0, duration: 1.2 },
          1.0
        );

      // Parallax on scroll for background elements
      gsap.to(".hero-bg-grid", {
        y: 150,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Hero content fades out on scroll for a premium feel
      gsap.to(".hero-content", {
        y: -60,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineParts = d.hero_headline.split("\n");

  return (
    <section
      ref={sectionRef}
      data-cursor="hero"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background mesh */}
      <div className="absolute inset-0 mesh-gradient" />

      {/* Grid pattern with parallax */}
      <div
        className="hero-bg-grid absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Diagonal accent lines */}
      <div
        className="absolute top-1/4 -right-20 w-[400px] h-[1px] bg-primary/10 origin-center"
        style={{ transform: "rotate(-45deg)" }}
      />
      <div
        className="absolute bottom-1/3 -left-20 w-[300px] h-[1px] bg-primary/10 origin-center"
        style={{ transform: "rotate(-45deg)" }}
      />

      <div className="hero-content relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center">
          {/* Left - Text content */}
          <div className="max-w-xl">
            <div className="hero-label opacity-0 mb-8">
              <span className="tag-pill tag-pill--primary">{d.hero_label}</span>
            </div>

            {/* TextReveal headline */}
            {headlineParts.map((part, i) => (
              <TextReveal
                key={i}
                as="h1"
                className="font-display text-[clamp(2.8rem,7.5vw,5.5rem)] font-800 leading-[0.92] tracking-[-0.045em]"
                delay={0.8 + i * 0.4}
                split="words"
                duration={1.2}
                stagger={0.08}
              >
                {part}
              </TextReveal>
            ))}

            <p className="hero-sub opacity-0 mt-8 text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
              {d.hero_subheading}
            </p>

            <p className="hero-sub opacity-0 mt-4 text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/60">
              {d.hero_tagline}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <div className="hero-cta opacity-0">
                <Button href={d.hero_cta_primary_url} external size="lg">
                  {d.hero_cta_primary_text}
                </Button>
              </div>
              <div className="hero-cta opacity-0">
                <Button href={d.hero_cta_secondary_url} variant="outline" size="lg">
                  {d.hero_cta_secondary_text}
                </Button>
              </div>
            </div>
          </div>

          {/* Right - SVG Illustration */}
          <div className="hero-illustration hidden lg:block opacity-0">
            <HeroIllustration />
          </div>
        </div>

        {/* Divider with accent */}
        <div className="hero-divider mt-16 origin-left hr-accent" />

        <div className="mt-10 flex flex-wrap gap-10 sm:gap-14">
          {d.hero_stats?.map((stat, i) => (
            <div key={stat.label} className="hero-stat opacity-0">
              <div className="flex items-baseline gap-2">
                <span className="num-indicator">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-display text-2xl sm:text-3xl font-800 tracking-tight">
                  {stat.value}
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase mt-1.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
