"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  /** "words" splits by word, "lines" splits by line (\n), "chars" splits by character */
  split?: "words" | "lines" | "chars";
  /** If true, triggers on scroll instead of immediately */
  scroll?: boolean;
  /** Duration per element */
  duration?: number;
  /** Stagger between elements */
  stagger?: number;
}

export default function TextReveal({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  split = "words",
  scroll = false,
  duration = 0.8,
  stagger = 0.04,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll(".tr-unit");
    if (!spans.length) return;

    const animConfig: gsap.TweenVars = {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration,
      stagger,
      ease: "power4.out",
      delay: scroll ? 0 : delay,
    };

    const fromConfig: gsap.TweenVars = {
      y: split === "chars" ? 20 : 60,
      opacity: 0,
      rotateX: split === "chars" ? 0 : -15,
    };

    if (scroll) {
      gsap.fromTo(spans, fromConfig, {
        ...animConfig,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    } else {
      gsap.fromTo(spans, fromConfig, animConfig);
    }

    return () => {
      gsap.killTweensOf(spans);
    };
  }, [delay, split, scroll, duration, stagger]);

  const units = (() => {
    switch (split) {
      case "lines":
        return children.split("\n");
      case "chars":
        return children.split("");
      case "words":
      default:
        return children.split(" ");
    }
  })();

  return (
    <Tag
      ref={containerRef as React.RefObject<never>}
      className={className}
      style={{ perspective: "600px" }}
    >
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          className="tr-unit inline-block opacity-0"
          style={{ willChange: "transform, opacity" }}
        >
          {unit}
          {split === "words" && i < units.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}
