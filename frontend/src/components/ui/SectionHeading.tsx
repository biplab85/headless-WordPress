"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import TextReveal from "@/components/ui/TextReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  label?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
  label,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const extras = el.querySelectorAll(".sh-fade");
    let tween: gsap.core.Tween | undefined;
    if (extras.length) {
      tween = gsap.fromTo(
        extras,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <div ref={ref} className={cn(centered && "text-center", "mb-16 lg:mb-20", className)}>
      {label && (
        <span className="sh-fade tag-pill tag-pill--primary mb-5 inline-block opacity-0">{label}</span>
      )}
      <TextReveal
        as="h2"
        className="font-display text-3xl font-800 tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem] leading-[1.05]"
        scroll
        split="words"
        duration={0.9}
        stagger={0.05}
      >
        {title}
      </TextReveal>
      {subtitle && (
        <p className="sh-fade mt-5 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed tracking-wide opacity-0">
          {subtitle}
        </p>
      )}
    </div>
  );
}
