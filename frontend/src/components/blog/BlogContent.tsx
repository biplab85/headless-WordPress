"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { formatDate, estimateReadTime } from "@/lib/utils";
import type { WPPost } from "@/types/post";
import gsap from "gsap";

interface BlogContentProps {
  post: WPPost;
}

export default function BlogContent({ post }: BlogContentProps) {
  const image = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]?.[0]?.[0];
  const author = post._embedded?.author?.[0];
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <article className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-10">
        <div ref={headerRef} className="mb-10">
          {category && (
            <Badge variant="primary" className="mb-4">
              {category.name}
            </Badge>
          )}
          <h1
            className="font-display text-3xl font-800 tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem] leading-[1.05]"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <div className="flex items-center gap-2 mt-6 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
            {author && <span className="font-600 text-foreground/80">{author.name}</span>}
            <span className="text-primary/40">/</span>
            <span>{formatDate(post.date)}</span>
            <span className="text-primary/40">/</span>
            <span>{estimateReadTime(post.content.rendered)}</span>
          </div>
        </div>

        {image && (
          <div className="relative aspect-video overflow-hidden rounded-sm border border-border/30 mb-12">
            <Image
              src={image.source_url}
              alt={image.alt_text || post.title.rendered}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div
          className="prose dark:text-foreground max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>
    </article>
  );
}
