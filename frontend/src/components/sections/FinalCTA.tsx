"use client";

import { useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/ui/TextReveal";
import Marquee from "@/components/ui/Marquee";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteOptions } from "@/types/site-options";

gsap.registerPlugin(ScrollTrigger);

interface FinalCTAProps {
  data?: Pick<SiteOptions, "fcta_label" | "fcta_title" | "fcta_description" | "fcta_primary_text" | "fcta_primary_url" | "fcta_secondary_text" | "fcta_secondary_url">;
}

const defaults = {
  fcta_label: "Get Started",
  fcta_title: "Ready to launch?",
  fcta_description: "Book a free 30-minute consultation. Tell us your idea \u2014 we\u2019ll tell you how fast we can build it.",
  fcta_primary_text: "Book My Free Consultation",
  fcta_primary_url: "https://calendly.com/sklentr",
  fcta_secondary_text: "See Pricing",
  fcta_secondary_url: "/pricing",
};

export default function FinalCTA({ data }: FinalCTAProps) {
  const d = { ...defaults, ...data };
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Section reveal wipe from bottom
      gsap.fromTo(
        sectionRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      // Content fades
      const fades = contentRef.current!.querySelectorAll(".fcta-fade");
      gsap.fromTo(fades, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Marquee before final CTA */}
      <div className="marquee-band">
        <Marquee
          items={["Let\u2019s Build Something", "Book a Call", "Launch Your MVP", "Start Today", "Get Funded"]}
          speed={70}
          className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground/15"
        />
      </div>

      <section ref={sectionRef} className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 mesh-gradient opacity-50" />

        {/* Diagonal accents */}
        <div
          className="absolute top-1/4 -right-10 w-[200px] h-[1px] bg-primary/10 origin-center"
          style={{ transform: "rotate(-45deg)" }}
        />
        <div
          className="absolute bottom-1/4 -left-10 w-[200px] h-[1px] bg-primary/10 origin-center"
          style={{ transform: "rotate(-45deg)" }}
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div ref={contentRef} className="text-center max-w-2xl mx-auto">
            <span className="fcta-fade tag-pill tag-pill--primary mb-5 inline-block opacity-0">
              {d.fcta_label}
            </span>
            <TextReveal
              as="h2"
              className="font-display text-4xl font-800 tracking-[-0.035em] sm:text-5xl lg:text-[4rem] leading-[1]"
              scroll
              split="chars"
              duration={0.6}
              stagger={0.02}
            >
              {d.fcta_title}
            </TextReveal>
            <p className="fcta-fade mt-6 text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto tracking-wide opacity-0">
              {d.fcta_description}
            </p>
            <div className="fcta-fade mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
              <Button href={d.fcta_primary_url} external size="lg">
                {d.fcta_primary_text}
              </Button>
              <Button href={d.fcta_secondary_url} variant="outline" size="lg">
                {d.fcta_secondary_text}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
