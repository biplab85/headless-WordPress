"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import type { WPTestimonial } from "@/types/testimonial";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fallbackTestimonials = [
  {
    quote:
      "Sklentr understood our vision for AI-powered caregiving matching from day one. They asked the right questions during discovery and built exactly what we needed to test our concept.",
    client_name: "Tanzila Rawnack",
    client_role: "CEO",
    company_name: "KindredCare",
  },
  {
    quote:
      "Our regulatory compliance platform seemed daunting until Sklentr simplified complexity into a functional, client-ready MVP.",
    client_name: "Sudhir Biswas",
    client_role: "CEO",
    company_name: "Roboreg",
  },
  {
    quote:
      "Sklentr transformed our food waste concept into a touchable product with seamless urban farming guides and community features.",
    client_name: "Monzur Khan",
    client_role: "CEO",
    company_name: "AI Farming",
  },
];

interface TestimonialSliderProps {
  testimonials?: WPTestimonial[];
}

export default function TestimonialSlider({
  testimonials,
}: TestimonialSliderProps) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  const validTestimonials = testimonials?.filter((t) => t.acf != null);
  const items =
    validTestimonials && validTestimonials.length > 0
      ? validTestimonials.map((t) => ({
          quote: t.acf.quote,
          client_name: t.acf.client_name,
          client_role: t.acf.client_role,
          company_name: t.acf.company_name,
          photo: t.acf.client_photo || null,
        }))
      : fallbackTestimonials.map((t) => ({ ...t, photo: null }));

  useEffect(() => {
    if (!containerRef.current) return;
    const tween = gsap.fromTo(
      containerRef.current,
      { y: 40, opacity: 0, clipPath: "inset(0 0 30% 0)" },
      {
        y: 0,
        opacity: 1,
        clipPath: "inset(0 0 0% 0)",
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const animateSlide = useCallback(() => {
    if (!quoteRef.current) return;
    // Split-style reveal for quote text
    gsap.fromTo(
      quoteRef.current,
      { y: 30, opacity: 0, clipPath: "inset(0 0 100% 0)" },
      { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.out" }
    );
  }, []);

  const prev = () => {
    setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
    animateSlide();
  };
  const next = () => {
    setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));
    animateSlide();
  };

  const item = items[current];

  return (
    <section data-cursor="testimonials" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-surface/60" />
      <div className="absolute left-0 right-0 top-0 gradient-line" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading label="Testimonials" title="What Our Clients Say" />
        <div ref={containerRef} className="max-w-3xl mx-auto text-center">
          {/* Large quote mark */}
          <div className="font-display text-7xl text-primary/15 leading-none mb-6 select-none">&ldquo;</div>
          <div ref={quoteRef}>
            <blockquote className="font-display text-lg sm:text-xl font-500 leading-relaxed mb-8 tracking-[-0.01em]">
              {item.quote}
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              {item.photo && typeof item.photo === "object" && "url" in item.photo && (
                <Image
                  src={item.photo.url}
                  alt={item.client_name}
                  width={44}
                  height={44}
                  className="rounded-sm border border-border"
                />
              )}
              <div className="text-left">
                <p className="font-display font-700 text-sm tracking-tight">{item.client_name}</p>
                <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  {item.client_role}, {item.company_name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-border/50 bg-card/50 text-muted-foreground hover:text-primary hover:border-primary/40"
              style={{ transition: "all 0.3s" }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrent(i);
                    animateSlide();
                  }}
                  className="h-1 rounded-sm"
                  style={{
                    width: i === current ? "24px" : "8px",
                    background: i === current ? "var(--primary)" : "var(--border)",
                    transition: "width 0.3s, background 0.3s",
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-border/50 bg-card/50 text-muted-foreground hover:text-primary hover:border-primary/40"
              style={{ transition: "all 0.3s" }}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
