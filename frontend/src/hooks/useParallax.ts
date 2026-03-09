"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax scroll effect - moves element at a different rate than scroll.
 * speed > 0 = element moves slower (lags behind), speed < 0 = moves faster.
 */
export function useParallax<T extends HTMLElement>(speed: number = 50) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const tween = gsap.to(ref.current, {
      y: speed,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, [speed]);

  return ref;
}

/**
 * Reveal-on-scroll with configurable animation.
 */
export function useScrollReveal<T extends HTMLElement>(
  options?: {
    y?: number;
    opacity?: number;
    duration?: number;
    delay?: number;
    ease?: string;
  }
) {
  const ref = useRef<T>(null);
  const {
    y = 60,
    opacity = 0,
    duration = 0.8,
    delay = 0,
    ease = "power3.out",
  } = options ?? {};

  useEffect(() => {
    if (!ref.current) return;

    const tween = gsap.fromTo(
      ref.current,
      { y, opacity },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, [y, opacity, duration, delay, ease]);

  return ref;
}
