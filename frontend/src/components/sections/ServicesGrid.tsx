"use client";

import { useRef, useEffect } from "react";
import {
  Monitor,
  Palette,
  Search,
  Megaphone,
  Video,
  BarChart3,
  Code,
  Globe,
  Zap,
  Shield,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import type { WPService } from "@/types/service";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fallbackServices = [
  {
    title: "MVP Development",
    icon: Monitor,
    items: ["Web Apps", "Mobile Apps", "API Development"],
  },
  {
    title: "Website Design",
    icon: Palette,
    items: ["WordPress", "Next.js", "Custom Development"],
  },
  {
    title: "SEO & Marketing",
    icon: Search,
    items: ["Search Optimization", "Social Media", "Content Strategy"],
  },
  {
    title: "Paid Ads",
    icon: Megaphone,
    items: ["Google Ads", "Meta Ads", "Campaign Management"],
  },
  {
    title: "Video Production",
    icon: Video,
    items: ["Promo Videos", "Social Content", "Product Demos"],
  },
  {
    title: "Business Consultation",
    icon: BarChart3,
    items: ["Market Research", "Product Strategy", "Growth Planning"],
  },
];

const iconMap: Record<string, typeof Monitor> = {
  monitor: Monitor,
  palette: Palette,
  search: Search,
  megaphone: Megaphone,
  video: Video,
  "bar-chart": BarChart3,
  code: Code,
  globe: Globe,
  zap: Zap,
  shield: Shield,
};

interface ServicesGridProps {
  services?: WPService[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.children;
    const tween1 = gsap.fromTo(
      cards,
      { y: 60, opacity: 0, clipPath: "inset(20% 0 0 0)" },
      {
        y: 0,
        opacity: 1,
        clipPath: "inset(0% 0 0 0)",
        duration: 0.8,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );

    let tween2: gsap.core.Tween | undefined;
    if (sectionRef.current) {
      const lines = sectionRef.current.querySelectorAll(".gradient-line");
      tween2 = gsap.fromTo(lines, { scaleX: 0 }, {
        scaleX: 1, duration: 1.4, ease: "power2.inOut",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
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
    <section ref={sectionRef} data-cursor="services" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-surface/60" />
      <div className="absolute left-0 right-0 top-0 gradient-line origin-left" />
      <div className="absolute left-0 right-0 bottom-0 gradient-line origin-right" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading label="Services" title="Everything you need to launch." />
        <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services && services.filter((s) => s.acf != null).length > 0
            ? services.filter((s) => s.acf != null).map((service, idx) => {
                const Icon = iconMap[service.acf.icon_name] || Monitor;
                return (
                  <div key={service.id} className="craft-card corner-brackets p-7 group">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/8 border border-primary/15">
                        <Icon className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <span className="num-indicator">{String(idx + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="font-display text-base font-700 mb-3 tracking-[-0.02em]">
                      {service.title.rendered}
                    </h3>
                    <ul className="space-y-2">
                      {service.acf.sub_services?.map((sub) => (
                        <li
                          key={sub.name}
                          className="text-sm text-muted-foreground flex items-center gap-2.5"
                        >
                          <span className="h-px w-3 bg-primary/40 shrink-0" />
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            : fallbackServices.map((service, idx) => (
                <div key={service.title} className="craft-card corner-brackets p-7 group">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/8 border border-primary/15">
                      <service.icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <span className="num-indicator">{String(idx + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-display text-base font-700 mb-3 tracking-[-0.02em]">
                    {service.title}
                  </h3>
                  <ul className="space-y-2">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-muted-foreground flex items-center gap-2.5"
                      >
                        <span className="h-px w-3 bg-primary/40 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
