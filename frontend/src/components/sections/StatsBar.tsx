"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteOptions } from "@/types/site-options";

gsap.registerPlugin(ScrollTrigger);

const defaultStats = [
  { value: 14, suffix: " days", label: "Average Delivery" },
  { value: 98, suffix: "%", label: "On-time Rate" },
  { value: 50, suffix: "+", label: "Projects Shipped" },
  { value: 98, suffix: "%", label: "Success Rate" },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || isNaN(target)) return;

    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => setCount(Math.floor(obj.val)),
        });
      },
    });

    return () => { st.kill(); };
  }, [target]);

  return (
    <div ref={ref} className="font-display text-4xl sm:text-5xl font-800 tracking-[-0.04em]">
      {count}
      <span className="text-primary">{suffix}</span>
    </div>
  );
}

interface StatsBarProps {
  data?: Pick<SiteOptions, "stats_items">;
}

export default function StatsBar({ data }: StatsBarProps) {
  const stats = data?.stats_items && data.stats_items.length > 0
    ? data.stats_items.map((s) => ({ value: Number(s.value), suffix: s.suffix, label: s.label }))
    : defaultStats;
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tween1 = gsap.fromTo(
      containerRef.current.children,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.6, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 85%" },
      }
    );

    let tween2: gsap.core.Tween | undefined;
    if (lineRef.current) {
      tween2 = gsap.fromTo(lineRef.current, { scaleX: 0 }, {
        scaleX: 1, duration: 1.2, ease: "power2.inOut",
        scrollTrigger: { trigger: lineRef.current, start: "top 90%" },
      });
    }

    return () => {
      tween1.scrollTrigger?.kill();
      tween1.kill();
      tween2?.scrollTrigger?.kill();
      tween2?.kill();
    };
  }, []);

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div ref={lineRef} className="hr-accent mb-12 origin-left" />
        <div ref={containerRef} className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="num-indicator">{String(i + 1).padStart(2, "0")}</span>
                <div className="h-px w-8 bg-border" />
              </div>
              <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-[10px] text-muted-foreground font-medium tracking-[0.15em] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
