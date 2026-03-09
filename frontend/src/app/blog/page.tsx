import type { Metadata } from "next";
import ElementorPage from "@/components/ui/ElementorPage";
import { getElementorPage } from "@/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getElementorPage("blog").catch(() => null);
  return {
    title: page?.title
      ? `${page.title} | Sklentr`
      : "Blog - Startup Insights & MVP Guides",
    description:
      page?.excerpt ||
      "Actionable insights for founders. Validation strategies, MVP development guides, startup visa tips, and lessons from building products.",
  };
}

export default async function BlogPage() {
  const page = await getElementorPage("blog").catch(() => null);

  if (!page || !page.is_elementor || !page.content?.trim()) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-sm text-muted-foreground">
          This page is being built in Elementor. Visit WordPress Admin to design it.
        </p>
      </div>
    );
  }

  return <ElementorPage page={page} />;
}
