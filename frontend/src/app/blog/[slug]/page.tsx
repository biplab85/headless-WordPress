import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogContent from "@/components/blog/BlogContent";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import { getPostBySlug, getPostSlugs } from "@/services/posts";
import { stripHtml } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) return { title: "Post Not Found" };

  const yoast = post.yoast_head_json;
  return {
    title: yoast?.title || post.title.rendered,
    description:
      yoast?.description || stripHtml(post.excerpt.rendered).slice(0, 160),
    openGraph: {
      title: yoast?.og_title || post.title.rendered,
      description: yoast?.og_description,
      images: yoast?.og_image?.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
      })),
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) notFound();

  return (
    <>
      <ArticleJsonLd post={post} />
      <BlogContent post={post} />
    </>
  );
}
