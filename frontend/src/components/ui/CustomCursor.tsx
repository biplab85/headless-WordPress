"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";

const SECTION_CURSORS: Record<string, { label: string; scale: number }> = {
  hero: { label: "", scale: 1 },
  portfolio: { label: "View", scale: 2.5 },
  gallery: { label: "Explore", scale: 2.5 },
  services: { label: "", scale: 1 },
  testimonials: { label: "Drag", scale: 2 },
};

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
      setIsDesktop(hasFinePointer);
    }
  }, []);

  const onMove = useCallback((e: MouseEvent) => {
    pos.current = { x: e.clientX, y: e.clientY };

    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      });
    }
    if (innerRef.current) {
      gsap.to(innerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        overwrite: true,
      });
    }

    // Detect section for contextual cursor
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;

    const section = el.closest("[data-cursor]");
    const key = section?.getAttribute("data-cursor") || "";
    const cfg = SECTION_CURSORS[key];

    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: cfg?.scale || 1,
        duration: 0.5,
        ease: "power3.out",
      });
    }
    if (labelRef.current) {
      const newLabel = cfg?.label || "";
      if (labelRef.current.textContent !== newLabel) {
        labelRef.current.textContent = newLabel;
        gsap.to(labelRef.current, {
          opacity: newLabel ? 1 : 0,
          duration: 0.3,
        });
      }
    }

    // Detect hoverable elements
    const hoverable = el.closest("a, button, [data-magnetic], input, textarea, select");
    if (hoverable) {
      gsap.to(cursorRef.current, { scale: 2.5, duration: 0.4, ease: "power3.out" });
      gsap.to(innerRef.current, { scale: 0, duration: 0.3 });
    } else if (!cfg?.label) {
      gsap.to(innerRef.current, { scale: 1, duration: 0.3 });
    }

    // Magnetic buttons
    const btn = el.closest("[data-magnetic]") as HTMLElement | null;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      gsap.to(btn, { x: dx, y: dy, duration: 0.5, ease: "power3.out" });
    }
  }, []);

  const onLeaveElement = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const btn = target.closest("[data-magnetic]") as HTMLElement | null;
    if (btn) {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    }
  }, []);

  const onLeave = useCallback(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 });
    }
    if (innerRef.current) {
      gsap.to(innerRef.current, { opacity: 0, duration: 0.3 });
    }
  }, []);

  const onEnter = useCallback(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 });
    }
    if (innerRef.current) {
      gsap.to(innerRef.current, { opacity: 1, duration: 0.3 });
    }
  }, []);

  const onClick = useCallback(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 0.8,
        duration: 0.1,
        onComplete: () => {
          gsap.to(cursorRef.current, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("click", onClick);
    document.addEventListener("mouseout", onLeaveElement);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("click", onClick);
      document.removeEventListener("mouseout", onLeaveElement);
    };
  }, [isDesktop, onMove, onLeave, onEnter, onClick, onLeaveElement]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Outer circle - follows with delay, mix-blend for visibility on all backgrounds */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[10001] flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          marginLeft: -20,
          marginTop: -20,
          mixBlendMode: "exclusion",
        }}
      >
        <div
          className="w-full h-full rounded-full border-[1.5px] border-white flex items-center justify-center"
        >
          <span
            ref={labelRef}
            className="text-[9px] font-bold uppercase tracking-[0.12em] text-white opacity-0 whitespace-nowrap"
          />
        </div>
      </div>
      {/* Inner dot - follows instantly */}
      <div
        ref={innerRef}
        className="pointer-events-none fixed top-0 left-0 z-[10002]"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          mixBlendMode: "exclusion",
        }}
      >
        <div className="w-full h-full rounded-full bg-white" />
      </div>
    </>
  );
}
