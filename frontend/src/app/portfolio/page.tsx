import type { Metadata } from "next";
import ElementorPage from "@/components/ui/ElementorPage";
import { getElementorPage } from "@/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getElementorPage("portfolio").catch(() => null);
  return {
    title: page?.title
      ? `${page.title} | Sklentr`
      : "Portfolio - Our Work",
    description:
      page?.excerpt ||
      "50+ projects delivered. 15+ Startup Visa MVPs built. See our work across healthcare, fintech, agritech, and more.",
  };
}

export default async function PortfolioPage() {
  const page = await getElementorPage("portfolio").catch(() => null);

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
