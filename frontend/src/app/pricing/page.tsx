import type { Metadata } from "next";
import ElementorPage from "@/components/ui/ElementorPage";
import { getElementorPage } from "@/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getElementorPage("pricing").catch(() => null);
  return {
    title: page?.title
      ? `${page.title} | Sklentr`
      : "Pricing - Transparent MVP Development Costs",
    description:
      page?.excerpt ||
      "Simple pricing. No surprises. Starter MVP from $5,000 CAD. Growth MVP $15,000. Full-Service $30,000+.",
  };
}

export default async function PricingPage() {
  const page = await getElementorPage("pricing").catch(() => null);

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
