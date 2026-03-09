import type { Metadata } from "next";
import ElementorPage from "@/components/ui/ElementorPage";
import { getElementorPage } from "@/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getElementorPage("services").catch(() => null);
  return {
    title: page?.title
      ? `${page.title} | Sklentr`
      : "Services - Full-Service MVP Development Studio",
    description:
      page?.excerpt ||
      "MVP development, website design, SEO, paid ads, video production, and business consultation. Everything you need to launch.",
  };
}

export default async function ServicesPage() {
  const page = await getElementorPage("services").catch(() => null);

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
