"use client";

import { useRef, useEffect } from "react";
import { Search, PenTool, Code, Rocket, type LucideIcon } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteOptions } from "@/types/site-options";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  search: Search,
  "pen-tool": PenTool,
  code: Code,
  rocket: Rocket,
};

interface ProcessTimelineProps {
  data?: Pick<SiteOptions, "process_label" | "process_title" | "process_subtitle" | "process_steps">;
}

const defaults = {
  process_label: "Process",
  process_title: "From Idea to Launch in 4 Weeks",
  process_subtitle: "Delivery before your visa deadline. Guaranteed.",
  process_steps: [
    { icon: "search", week: "Week 1", title: "Discovery & Planning", description: "We understand your vision and define the MVP scope." },
    { icon: "pen-tool", week: "Week 2", title: "Design & Architecture", description: "UI/UX design finalization and technical architecture planning." },
    { icon: "code", week: "Week 3", title: "Development Sprint", description: "Core feature development with regular progress updates." },
    { icon: "rocket", week: "Week 4", title: "Testing & Launch", description: "Quality assurance, deployment, and product launch." },
  ],
};

export default function ProcessTimeline({ data }: ProcessTimelineProps) {
  const d = { ...defaults, ...data };
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate progress bar as you scroll through the section
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: 0.5,
            },
          }
        );
      }

      // Each step reveals on scroll
      const steps = sectionRef.current!.querySelectorAll(".process-step");
      steps.forEach((step, i) => {
        // Step content slides in
        gsap.fromTo(
          step,
          { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );

        // Icon pops in with bounce
        const icon = step.querySelector(".process-icon");
        if (icon) {
          gsap.fromTo(
            icon,
            { scale: 0, rotation: -30 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.8,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: step,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24">
          <span className="tag-pill tag-pill--primary mb-5 inline-block">{d.process_label}</span>
          <TextReveal
            as="h2"
            className="font-display text-3xl font-800 tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem] leading-[1.05]"
            scroll
            split="words"
            duration={1}
            stagger={0.06}
          >
            {d.process_title}
          </TextReveal>
          {d.process_subtitle && (
            <p className="mt-5 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed tracking-wide">
              {d.process_subtitle}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical progress line */}
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-border/30 lg:-translate-x-px">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 w-full h-full bg-primary origin-top"
            />
          </div>

          {/* Steps */}
          <div className="space-y-16 lg:space-y-24">
            {d.process_steps?.map((step, i) => {
              const Icon = iconMap[step.icon] || Search;
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={step.title}
                  className={`process-step relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 ${isLeft ? "" : "lg:direction-rtl"}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 lg:left-1/2 top-0 -translate-x-1/2 z-10">
                    <div className="process-icon flex h-12 w-12 items-center justify-center rounded-full bg-card border-2 border-primary/30">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  {/* Content - alternating sides on desktop */}
                  <div className={`pl-16 lg:pl-0 ${isLeft ? "lg:pr-16 lg:text-right" : "lg:col-start-2 lg:pl-16"}`}>
                    <span className="num-indicator block mb-2 text-xs">
                      {step.week}
                    </span>
                    <h3 className="font-display text-xl font-700 mb-3 tracking-[-0.02em]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm inline-block">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
