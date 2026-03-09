"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ImageRevealProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  /** Direction of the wipe reveal */
  direction?: "up" | "left" | "right";
  /** Parallax amount (0 = none) */
  parallax?: number;
  sizes?: string;
  priority?: boolean;
}

export default function ImageReveal({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  direction = "up",
  parallax = 30,
  sizes,
  priority,
}: ImageRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !imgRef.current) return;

    const clipStart =
      direction === "up"
        ? "inset(100% 0 0 0)"
        : direction === "left"
        ? "inset(0 100% 0 0)"
        : "inset(0 0 0 100%)";

    gsap.fromTo(
      wrapperRef.current,
      { clipPath: clipStart },
      {
        clipPath: "inset(0 0 0 0)",
        duration: 1.2,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    // Scale-down on reveal
    gsap.fromTo(
      imgRef.current,
      { scale: 1.3 },
      {
        scale: 1,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    // Parallax on scroll
    if (parallax) {
      gsap.to(imgRef.current, {
        y: -parallax,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === wrapperRef.current) t.kill();
      });
    };
  }, [direction, parallax]);

  return (
    <div ref={wrapperRef} className={`overflow-hidden ${className}`} style={{ clipPath: "inset(100% 0 0 0)" }}>
      <div ref={imgRef} className="w-full h-full" style={{ willChange: "transform" }}>
        {fill ? (
          <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />
        ) : (
          <Image src={src} alt={alt} width={width || 800} height={height || 600} className="w-full h-auto object-cover" sizes={sizes} priority={priority} />
        )}
      </div>
    </div>
  );
}
