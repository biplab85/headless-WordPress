import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { formatDate, stripHtml, estimateReadTime } from "@/lib/utils";
import type { WPPost } from "@/types/post";

interface BlogCardProps {
  post: WPPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const image = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]?.[0]?.[0];
  const author = post._embedded?.author?.[0];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="craft-card overflow-hidden group"
    >
      <div className="relative aspect-video overflow-hidden bg-surface">
        {image ? (
          <Image
            src={image.source_url}
            alt={image.alt_text || post.title.rendered}
            fill
            className="object-cover"
            style={{ transition: "transform 0.6s ease" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="font-display text-5xl font-800 text-primary/8">S</span>
          </div>
        )}
      </div>

      <div className="p-6">
        {category && (
          <Badge variant="primary" className="mb-3">
            {category.name}
          </Badge>
        )}
        <h3
          className="font-display text-base font-700 mb-2 tracking-[-0.02em] line-clamp-2 group-hover:text-primary"
          style={{ transition: "color 0.3s" }}
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {stripHtml(post.excerpt.rendered)}
        </p>
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground tracking-[0.1em] uppercase">
          {author && <span>{author.name}</span>}
          <span className="text-primary/40">/</span>
          <span>{formatDate(post.date)}</span>
          <span className="text-primary/40">/</span>
          <span>{estimateReadTime(post.content.rendered)}</span>
        </div>
      </div>
    </Link>
  );
}
