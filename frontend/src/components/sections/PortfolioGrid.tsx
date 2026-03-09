"use client";

import { useRef, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageReveal from "@/components/ui/ImageReveal";
import type { WPPortfolio } from "@/types/portfolio";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fallbackProjects = [
  {
    title: "Horizon Trials",
    industry: "Healthcare / AI",
    excerpt: "AI platform matching cancer patients with clinical trials across Canada.",
    tech: ["Laravel", "Next.js", "Google Gemini", "PostgreSQL"],
  },
  {
    title: "AI Farming",
    industry: "AgriTech / AI",
    excerpt: "Comprehensive AI plant management system for urban farmers in Canada.",
    tech: ["Laravel", "Next.js", "WordPress", "Google Gemini"],
  },
  {
    title: "Get Takaful",
    industry: "FinTech / Blockchain",
    excerpt: "Shariah-compliant insurance alternative for Canadian Muslims.",
    tech: ["Laravel", "Next.js", "Blockchain", "WordPress"],
  },
  {
    title: "KindredCare",
    industry: "Healthcare",
    excerpt: "AI-powered marketplace connecting families with pre-vetted caregivers.",
    tech: ["Laravel", "Next.js", "ChatGPT", "Google Gemini"],
  },
  {
    title: "Agile Sourcing",
    industry: "Fashion / Sustainability",
    excerpt: "Design validation platform for sustainable fashion designers.",
    tech: ["Laravel", "Next.js", "AI", "Instagram API"],
  },
  {
    title: "GAinData",
    industry: "SaaS / Data Analytics",
    excerpt: "AI-powered data intelligence platform for startups and SMEs.",
    tech: ["Laravel", "Next.js", "ChatGPT", "Gemini", "Claude"],
  },
];

interface PortfolioGridProps {
  projects?: WPPortfolio[];
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".portfolio-card-body");
    const tween = gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const directions: Array<"up" | "left" | "right"> = ["up", "left", "right"];

  return (
    <section data-cursor="portfolio" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading label="Portfolio" title="Work That Speaks" />
        <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects && projects.filter((p) => p.acf != null).length > 0
            ? projects.filter((p) => p.acf != null).map((project, idx) => {
                const image =
                  project._embedded?.["wp:featuredmedia"]?.[0];
                return (
                  <div
                    key={project.id}
                    className="craft-card overflow-hidden group"
                  >
                    {image ? (
                      <ImageReveal
                        src={image.source_url}
                        alt={image.alt_text || project.title.rendered}
                        fill
                        direction={directions[idx % 3]}
                        parallax={20}
                        className="aspect-video"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="relative aspect-video bg-surface flex items-center justify-center border-b border-border/30">
                        <span className="font-display text-5xl font-800 text-primary/8">
                          {project.title.rendered[0]}
                        </span>
                      </div>
                    )}
                    <div className="portfolio-card-body p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="num-indicator">{String(idx + 1).padStart(2, "0")}</span>
                        <Badge variant="primary">
                          {project.acf.industry}
                        </Badge>
                      </div>
                      <h3 className="font-display text-base font-700 mb-2 tracking-[-0.02em]">
                        {project.title.rendered}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                        {project.excerpt.rendered.replace(/<[^>]*>/g, "")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.acf.tech_stack?.map((t) => (
                          <Badge key={t.technology}>{t.technology}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            : fallbackProjects.map((project, idx) => (
                <div
                  key={project.title}
                  className="craft-card overflow-hidden group"
                >
                  <div className="relative aspect-video bg-surface flex items-center justify-center border-b border-border/30">
                    <span className="font-display text-5xl font-800 text-primary/8">
                      {project.title[0]}
                    </span>
                  </div>
                  <div className="portfolio-card-body p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="num-indicator">{String(idx + 1).padStart(2, "0")}</span>
                      <Badge variant="primary">
                        {project.industry}
                      </Badge>
                    </div>
                    <h3 className="font-display text-base font-700 mb-2 tracking-[-0.02em]">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {project.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
