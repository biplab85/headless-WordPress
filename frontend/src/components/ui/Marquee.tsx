"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface MarqueeProps {
  items: string[];
  /** Speed in pixels per second */
  speed?: number;
  /** Separator between items */
  separator?: string;
  className?: string;
  reverse?: boolean;
}

export default function Marquee({
  items,
  speed = 80,
  separator = "\u00A0\u00A0\u2014\u00A0\u00A0",
  className = "",
  reverse = false,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const firstSet = track.children[0] as HTMLElement;
    if (!firstSet) return;

    const width = firstSet.offsetWidth;
    const dur = width / speed;

    gsap.set(track, { x: reverse ? -width : 0 });
    gsap.to(track, {
      x: reverse ? 0 : -width,
      duration: dur,
      ease: "none",
      repeat: -1,
    });

    return () => {
      gsap.killTweensOf(track);
    };
  }, [speed, reverse]);

  const content = items.join(separator) + separator;

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={trackRef} className="inline-flex">
        <span className="inline-block font-display font-800 uppercase tracking-[0.04em]">
          {content}
        </span>
        <span className="inline-block font-display font-800 uppercase tracking-[0.04em]">
          {content}
        </span>
      </div>
    </div>
  );
}
