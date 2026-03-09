"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function HeroIllustration() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const ctx = gsap.context(() => {
      // Fade in the whole illustration
      gsap.fromTo(svgRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.2, delay: 0.8, ease: "power3.out" });

      // Animate code lines typing in
      gsap.fromTo(
        ".code-line",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.6, stagger: 0.15, delay: 1.4, ease: "power2.out", transformOrigin: "left center" }
      );

      // Cursor blinking
      gsap.to(".cursor-blink", {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        ease: "steps(1)",
        delay: 2,
      });

      // Floating particles
      gsap.to(".float-particle", {
        y: -8,
        repeat: -1,
        yoyo: true,
        duration: 2,
        stagger: 0.3,
        ease: "sine.inOut",
      });

      // Screen glow pulse
      gsap.to(".screen-glow", {
        opacity: 0.15,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "sine.inOut",
      });

      // Gear rotation
      gsap.to(".gear-spin", {
        rotation: 360,
        repeat: -1,
        duration: 8,
        ease: "linear",
        transformOrigin: "center center",
      });

      // Progress bar fill
      gsap.fromTo(
        ".progress-fill",
        { scaleX: 0 },
        { scaleX: 1, duration: 2, delay: 1.8, ease: "power2.inOut", transformOrigin: "left center" }
      );
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 480 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto opacity-0"
    >
      {/* Screen glow */}
      <ellipse className="screen-glow" cx="240" cy="200" rx="160" ry="120" fill="var(--primary)" opacity="0.06" />

      {/* Laptop base */}
      <rect x="100" y="280" width="280" height="12" rx="4" fill="var(--foreground)" opacity="0.15" />
      <rect x="190" y="280" width="100" height="4" rx="2" fill="var(--foreground)" opacity="0.08" />

      {/* Laptop screen frame */}
      <rect x="120" y="90" width="240" height="196" rx="8" fill="var(--foreground)" opacity="0.1" />
      <rect x="128" y="96" width="224" height="178" rx="4" fill="var(--card)" />

      {/* Screen content - code editor */}
      {/* Title bar */}
      <rect x="128" y="96" width="224" height="20" rx="4" fill="var(--surface)" />
      <circle cx="142" cy="106" r="3" fill="#ff5f57" opacity="0.7" />
      <circle cx="152" cy="106" r="3" fill="#febc2e" opacity="0.7" />
      <circle cx="162" cy="106" r="3" fill="#28c840" opacity="0.7" />

      {/* Line numbers */}
      <text x="136" y="132" fontSize="7" fill="var(--muted-foreground)" opacity="0.3" fontFamily="monospace">1</text>
      <text x="136" y="146" fontSize="7" fill="var(--muted-foreground)" opacity="0.3" fontFamily="monospace">2</text>
      <text x="136" y="160" fontSize="7" fill="var(--muted-foreground)" opacity="0.3" fontFamily="monospace">3</text>
      <text x="136" y="174" fontSize="7" fill="var(--muted-foreground)" opacity="0.3" fontFamily="monospace">4</text>
      <text x="136" y="188" fontSize="7" fill="var(--muted-foreground)" opacity="0.3" fontFamily="monospace">5</text>
      <text x="136" y="202" fontSize="7" fill="var(--muted-foreground)" opacity="0.3" fontFamily="monospace">6</text>
      <text x="136" y="216" fontSize="7" fill="var(--muted-foreground)" opacity="0.3" fontFamily="monospace">7</text>
      <text x="136" y="230" fontSize="7" fill="var(--muted-foreground)" opacity="0.3" fontFamily="monospace">8</text>

      {/* Code lines */}
      <rect className="code-line" x="150" y="126" width="80" height="6" rx="2" fill="var(--primary)" opacity="0.4" />
      <rect className="code-line" x="150" y="140" width="120" height="6" rx="2" fill="var(--accent)" opacity="0.3" />
      <rect className="code-line" x="160" y="154" width="100" height="6" rx="2" fill="var(--foreground)" opacity="0.12" />
      <rect className="code-line" x="160" y="168" width="140" height="6" rx="2" fill="var(--primary)" opacity="0.25" />
      <rect className="code-line" x="160" y="182" width="90" height="6" rx="2" fill="var(--foreground)" opacity="0.1" />
      <rect className="code-line" x="150" y="196" width="60" height="6" rx="2" fill="var(--accent)" opacity="0.3" />
      <rect className="code-line" x="150" y="210" width="110" height="6" rx="2" fill="var(--foreground)" opacity="0.12" />
      <rect className="code-line" x="150" y="224" width="70" height="6" rx="2" fill="var(--primary)" opacity="0.3" />

      {/* Blinking cursor */}
      <rect className="cursor-blink" x="220" y="224" width="1.5" height="8" rx="0.5" fill="var(--primary)" />

      {/* Developer person sitting */}
      {/* Chair */}
      <rect x="215" y="310" width="50" height="6" rx="3" fill="var(--foreground)" opacity="0.08" />
      <rect x="237" y="316" width="6" height="24" rx="2" fill="var(--foreground)" opacity="0.06" />

      {/* Person body */}
      <ellipse cx="240" cy="308" rx="18" ry="10" fill="var(--primary)" opacity="0.15" />

      {/* Person head */}
      <circle cx="240" cy="288" r="10" fill="var(--foreground)" opacity="0.12" />

      {/* Floating elements */}
      {/* React logo */}
      <g className="float-particle" transform="translate(60, 140)">
        <circle r="14" fill="var(--primary)" opacity="0.06" />
        <circle r="3" fill="var(--primary)" opacity="0.3" />
        <ellipse rx="10" ry="4" fill="none" stroke="var(--primary)" strokeWidth="0.8" opacity="0.2" />
        <ellipse rx="10" ry="4" fill="none" stroke="var(--primary)" strokeWidth="0.8" opacity="0.2" transform="rotate(60)" />
        <ellipse rx="10" ry="4" fill="none" stroke="var(--primary)" strokeWidth="0.8" opacity="0.2" transform="rotate(-60)" />
      </g>

      {/* Gear icon */}
      <g className="float-particle gear-spin" transform="translate(400, 120)">
        <circle r="10" fill="var(--accent)" opacity="0.08" />
        <circle r="6" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.2" />
        <rect x="-1" y="-9" width="2" height="4" rx="1" fill="var(--accent)" opacity="0.2" />
        <rect x="-1" y="5" width="2" height="4" rx="1" fill="var(--accent)" opacity="0.2" />
        <rect x="-9" y="-1" width="4" height="2" rx="1" fill="var(--accent)" opacity="0.2" />
        <rect x="5" y="-1" width="4" height="2" rx="1" fill="var(--accent)" opacity="0.2" />
      </g>

      {/* Code brackets */}
      <g className="float-particle" transform="translate(80, 240)">
        <text fontSize="18" fill="var(--primary)" opacity="0.15" fontFamily="monospace">&lt;/&gt;</text>
      </g>

      {/* Terminal window mini */}
      <g className="float-particle" transform="translate(380, 230)">
        <rect x="-20" y="-14" width="40" height="28" rx="3" fill="var(--card)" stroke="var(--border)" strokeWidth="0.5" />
        <rect x="-18" y="-12" width="36" height="6" rx="2" fill="var(--surface)" />
        <circle cx="-14" cy="-9" r="1.5" fill="#ff5f57" opacity="0.6" />
        <circle cx="-9" cy="-9" r="1.5" fill="#febc2e" opacity="0.6" />
        <rect x="-16" y="-2" width="20" height="2" rx="1" fill="var(--accent)" opacity="0.2" />
        <rect x="-16" y="4" width="14" height="2" rx="1" fill="var(--foreground)" opacity="0.08" />
      </g>

      {/* Star particles */}
      <circle className="float-particle" cx="90" cy="100" r="2" fill="var(--primary)" opacity="0.2" />
      <circle className="float-particle" cx="420" cy="180" r="1.5" fill="var(--accent)" opacity="0.25" />
      <circle className="float-particle" cx="370" cy="80" r="2" fill="var(--primary)" opacity="0.15" />
      <circle className="float-particle" cx="50" cy="200" r="1" fill="var(--accent)" opacity="0.2" />

      {/* Progress bar */}
      <g transform="translate(155, 250)">
        <rect width="170" height="6" rx="3" fill="var(--surface)" />
        <rect className="progress-fill" width="170" height="6" rx="3" fill="var(--primary)" opacity="0.3" />
        <text x="175" y="8" fontSize="7" fill="var(--muted-foreground)" opacity="0.4" fontFamily="var(--font-body)">Building...</text>
      </g>

      {/* Connection lines (dotted) */}
      <line x1="74" y1="140" x2="120" y2="160" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.15" />
      <line x1="400" y1="120" x2="360" y2="140" stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.15" />
      <line x1="380" y1="230" x2="352" y2="220" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.2" />
    </svg>
  );
}
