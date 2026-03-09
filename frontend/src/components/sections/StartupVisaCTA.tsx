"use client";

import { useRef, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/ui/TextReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteOptions } from "@/types/site-options";

gsap.registerPlugin(ScrollTrigger);

interface StartupVisaCTAProps {
  data?: Pick<SiteOptions, "sv_label" | "sv_title" | "sv_highlight" | "sv_benefits" | "sv_cta_text" | "sv_cta_url">;
}

const defaults = {
  sv_label: "Startup Visa",
  sv_title: "Need an MVP for your Startup Visa?",
  sv_highlight: "We\u2019ve got you.",
  sv_benefits: [
    { text: "Working Product \u2014 Prove business viability" },
    { text: "Meet Deadlines \u2014 Timeline that fits your visa process" },
    { text: "Budget Friendly \u2014 Pricing that respects your runway" },
  ],
  sv_cta_text: "Learn More",
  sv_cta_url: "/startup-visa",
};

export default function StartupVisaCTA({ data }: StartupVisaCTAProps) {
  const d = { ...defaults, ...data };
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Card entrance with horizontal wipe
      gsap.fromTo(cardRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.5, ease: "power4.inOut",
          scrollTrigger: { trigger: cardRef.current, start: "top 80%" },
        }
      );

      // Inner content stagger after card reveals
      const items = cardRef.current!.querySelectorAll(".sv-fade");
      gsap.fromTo(items, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 70%" },
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div ref={cardRef} className="craft-card p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute inset-0 mesh-gradient opacity-40" />
          <div
            className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(-45deg, var(--primary), var(--primary) 1px, transparent 1px, transparent 20px)",
            }}
          />

          <div className="relative max-w-2xl">
            <span className="sv-fade tag-pill tag-pill--primary mb-5 inline-block opacity-0">
              {d.sv_label}
            </span>
            <TextReveal
              as="h2"
              className="font-display text-3xl font-800 tracking-[-0.035em] sm:text-4xl leading-[1.05]"
              scroll
              split="words"
              duration={1}
              stagger={0.06}
            >
              {`${d.sv_title} ${d.sv_highlight}`}
            </TextReveal>
            <ul className="mt-8 space-y-4">
              {d.sv_benefits?.map((benefit) => (
                <li key={benefit.text} className="sv-fade flex items-start gap-3 opacity-0">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-sm leading-relaxed">{benefit.text}</span>
                </li>
              ))}
            </ul>
            <div className="sv-fade mt-8 opacity-0">
              <Button href={d.sv_cta_url} size="lg">
                {d.sv_cta_text}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
