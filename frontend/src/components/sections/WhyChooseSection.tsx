"use client";

import { useRef, useEffect } from "react";
import { Zap, Users, Globe, Layers, type LucideIcon } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteOptions } from "@/types/site-options";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  users: Users,
  globe: Globe,
  layers: Layers,
};

interface WhyChooseSectionProps {
  data?: Pick<SiteOptions, "why_label" | "why_title" | "why_items">;
}

const defaults = {
  why_label: "Why Sklentr",
  why_title: "We ship while others plan.",
  why_items: [
    { icon: "zap", num: "01", title: "2-Week MVPs", description: "Launch fast. Iterate faster. We\u2019ve shipped products in as little as 14 days." },
    { icon: "users", num: "02", title: "One Team, Full Service", description: "Dev, design, SEO, marketing, video \u2014 no juggling vendors." },
    { icon: "globe", num: "03", title: "Canadian Quality, Smart Pricing", description: "Toronto-managed, globally powered. Premium work without the premium markup." },
    { icon: "layers", num: "04", title: "Built to Scale", description: "Real architecture, not duct tape. Your MVP becomes your product." },
  ],
};

export default function WhyChooseSection({ data }: WhyChooseSectionProps) {
  const d = { ...defaults, ...data };
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      // Pin the left text while cards scroll on the right
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: ".why-pin-left",
        pinSpacing: false,
      });

      // Stagger cards as they enter viewport
      const cards = cardsRef.current!.children;
      Array.from(cards).forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Top/bottom gradient lines animate
      const lines = sectionRef.current!.querySelectorAll(".gradient-line");
      gsap.fromTo(lines, { scaleX: 0 }, {
        scaleX: 1, duration: 1.4, ease: "power2.inOut",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[200vh]">
      <div className="absolute inset-0 bg-surface/60" />
      <div className="absolute left-0 right-0 top-0 gradient-line origin-left" />
      <div className="absolute left-0 right-0 bottom-0 gradient-line origin-right" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: sticky text */}
          <div className="why-pin-left pt-24 lg:pt-32 lg:h-screen flex flex-col justify-center">
            <span className="tag-pill tag-pill--primary mb-6 inline-block w-fit">{d.why_label}</span>
            <TextReveal
              as="h2"
              className="font-display text-3xl font-800 tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem] leading-[1.05]"
              scroll
              split="words"
              duration={1}
              stagger={0.06}
            >
              {d.why_title}
            </TextReveal>
            <p className="mt-6 text-muted-foreground text-sm leading-relaxed max-w-md">
              We combine Canadian management with global talent to deliver premium results at competitive prices. Every project gets our full attention.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-12 bg-primary/40" />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/60">
                4 reasons to choose us
              </span>
            </div>
          </div>

          {/* Right: scrolling cards */}
          <div ref={cardsRef} className="py-24 lg:py-32 space-y-6">
            {d.why_items?.map((reason) => {
              const Icon = iconMap[reason.icon] || Zap;
              return (
                <div key={reason.title} className="craft-card corner-brackets p-8 group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/8 border border-primary/15">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="num-indicator text-base">
                      {reason.num}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-700 mb-3 tracking-[-0.02em]">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
