"use client";

import { useRef, useEffect } from "react";
import { Clock, DollarSign, AlertTriangle, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteOptions } from "@/types/site-options";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  clock: Clock,
  "dollar-sign": DollarSign,
  "alert-triangle": AlertTriangle,
};

interface ProblemSectionProps {
  data?: Pick<SiteOptions, "problem_label" | "problem_title" | "problem_items">;
}

const defaults = {
  problem_label: "The Problem",
  problem_title: 'Your idea deserves better than "coming soon."',
  problem_items: [
    { icon: "clock", title: "Slow delivery", text: "They take months while your window closes." },
    { icon: "dollar-sign", title: "Overpriced", text: "They charge a fortune before you\u2019ve validated anything." },
    { icon: "alert-triangle", title: "Wrong scope", text: "They deliver what you didn\u2019t ask for and call it \u2018scope.\u2019" },
  ],
};

export default function ProblemSection({ data }: ProblemSectionProps) {
  const d = { ...defaults, ...data };
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.children;
    const tween1 = gsap.fromTo(
      cards,
      { y: 80, opacity: 0, rotateX: -10 },
      {
        y: 0, opacity: 1, rotateX: 0,
        duration: 0.8, stagger: 0.15, ease: "power4.out",
        scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
      }
    );

    // Stagger the red accent lines within each card
    const accents = cardsRef.current.querySelectorAll(".card-accent-line");
    const tween2 = gsap.fromTo(accents, { scaleX: 0 }, {
      scaleX: 1, duration: 0.8, stagger: 0.15, ease: "power2.inOut",
      scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
    });

    return () => {
      tween1.scrollTrigger?.kill();
      tween1.kill();
      tween2.scrollTrigger?.kill();
      tween2.kill();
    };
  }, []);

  return (
    <section className="py-24 lg:py-32" style={{ perspective: "1000px" }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading label={d.problem_label} title={d.problem_title} />
        <div ref={cardsRef} className="grid grid-cols-1 gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
          {d.problem_items?.map((problem, i) => {
            const Icon = iconMap[problem.icon] || AlertTriangle;
            return (
              <div key={problem.title} className="craft-card corner-brackets p-8 text-center group">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="num-indicator">{String(i + 1).padStart(2, "0")}</span>
                  <div className="card-accent-line h-px flex-1 bg-red-500/15 origin-left" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-red-500/8 border border-red-500/15 mx-auto mb-5">
                  <Icon className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="font-display text-sm font-700 uppercase tracking-[0.1em] text-red-400 mb-3">
                  {problem.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
