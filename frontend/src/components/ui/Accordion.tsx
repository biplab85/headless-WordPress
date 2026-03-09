"use client";

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export default function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (index: number) => {
    const isClosing = openIndex === index;
    const target = contentRefs.current[index];

    if (isClosing && target) {
      gsap.to(target, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
      setOpenIndex(null);
    } else {
      if (openIndex !== null) {
        const prev = contentRefs.current[openIndex];
        if (prev) {
          gsap.to(prev, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" });
        }
      }
      if (target) {
        gsap.set(target, { height: "auto", opacity: 1 });
        const h = target.offsetHeight;
        gsap.fromTo(
          target,
          { height: 0, opacity: 0 },
          { height: h, opacity: 1, duration: 0.35, ease: "power2.out" }
        );
      }
      setOpenIndex(index);
    }
  };

  return (
    <div className={cn("divide-y divide-border/50", className)}>
      {items.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => toggle(index)}
            className="flex w-full items-center justify-between py-5 text-left group"
          >
            <div className="flex items-center gap-3 pr-4">
              <span className="num-indicator">{String(index + 1).padStart(2, "0")}</span>
              <span className="font-display text-sm font-700 tracking-[-0.01em]">
                {item.question}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground",
                openIndex === index && "rotate-180 text-primary"
              )}
              style={{ transition: "transform 0.3s ease, color 0.3s" }}
            />
          </button>
          <div
            ref={(el) => { contentRefs.current[index] = el; }}
            className="overflow-hidden"
            style={{ height: 0, opacity: 0 }}
          >
            <div
              className="pb-5 pl-10 text-sm text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
