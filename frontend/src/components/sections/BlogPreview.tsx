"use client";

import { useRef, useEffect } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogCard from "@/components/blog/BlogCard";
import Button from "@/components/ui/Button";
import type { WPPost } from "@/types/post";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BlogPreviewProps {
  posts?: WPPost[];
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const tween1 = gsap.fromTo(
      gridRef.current.children,
      { y: 50, opacity: 0, clipPath: "inset(20% 0 0 0)" },
      {
        y: 0,
        opacity: 1,
        clipPath: "inset(0% 0 0 0)",
        duration: 0.8,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );

    let tween2: gsap.core.Tween | undefined;
    if (sectionRef.current) {
      const cta = sectionRef.current.querySelector(".blog-cta");
      if (cta) {
        tween2 = gsap.fromTo(cta, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: cta, start: "top 90%" },
        });
      }
    }

    return () => {
      tween1.scrollTrigger?.kill();
      tween1.kill();
      tween2?.scrollTrigger?.kill();
      tween2?.kill();
    };
  }, []);

  if (!posts || posts.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-surface/60" />
      <div className="absolute left-0 right-0 top-0 gradient-line" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          label="Blog"
          title="Insights for Founders."
          subtitle="Strategies, guides, and lessons from building MVPs for startups across Canada."
        />
        <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <div className="blog-cta mt-12 text-center opacity-0">
          <Button href="/blog" variant="outline">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
}
