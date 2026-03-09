import type { Metadata } from "next";
import ElementorPage from "@/components/ui/ElementorPage";
import { getElementorPage } from "@/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getElementorPage("about").catch(() => null);
  return {
    title: page?.title
      ? `${page.title} | Sklentr`
      : "About - Toronto-Based MVP Development Studio",
    description:
      page?.excerpt ||
      "Founded in 2023. 50+ projects. Canadian management, global talent. Learn about Sklentr's mission and team.",
  };
}

export default async function AboutPage() {
  const page = await getElementorPage("about").catch(() => null);

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
