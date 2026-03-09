import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import ThemeHeader from "@/components/layout/ThemeHeader";
import ThemeFooter from "@/components/layout/ThemeFooter";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { getSiteOptions } from "@/services/site-options";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const opts = await getSiteOptions().catch(() => null);

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ),
    title: {
      default: opts?.site_name
        ? `${opts.site_name} - Launch-Ready MVPs in Weeks, Not Months`
        : "Sklentr Inc. - Launch-Ready MVPs in Weeks, Not Months",
      template: opts?.site_name ? `%s | ${opts.site_name}` : "%s | Sklentr",
    },
    description:
      opts?.site_description ||
      "Toronto-based MVP development studio. We build launch-ready products in weeks. Web apps, mobile apps, SEO, marketing, and more.",
    icons: opts?.site_favicon_url
      ? { icon: opts.site_favicon_url, apple: opts.site_favicon_url }
      : undefined,
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: opts?.site_name || "Sklentr Inc.",
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const opts = await getSiteOptions().catch(() => null);
  const logoUrl = opts?.site_logo_url || "/sklentr-logo.png";
  const navItems = opts?.nav_items;
  const calendlyUrl = opts?.calendly_url;

  const contact = {
    email: opts?.contact_email || "info@sklentr.com",
    phone: opts?.contact_phone || "+1 647-997-0557",
    location: opts?.contact_location || "Toronto, Ontario, Canada",
    calendly: opts?.calendly_url || "https://calendly.com/sklentr",
  };

  const socialLinks = {
    linkedin: opts?.social_linkedin || "https://linkedin.com/company/sklentr",
    facebook: opts?.social_facebook || "https://facebook.com/sklentr",
    instagram: opts?.social_instagram || "https://instagram.com/sklentr",
    twitter: opts?.social_twitter || "https://x.com/sklentr",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SmoothScroll>
            <OrganizationJsonLd
              siteName={opts?.site_name}
              contact={contact}
              socialLinks={socialLinks}
            />
            <ThemeHeader logoUrl={logoUrl} navItems={navItems} calendlyUrl={calendlyUrl} />
            <main className="min-h-screen">{children}</main>
            <ThemeFooter
              logoUrl={logoUrl}
              siteName={opts?.site_name}
              siteDescription={opts?.site_description}
              contact={contact}
              socialLinks={socialLinks}
              companyLinks={opts?.footer_company_links}
              serviceLinks={opts?.footer_service_links}
              legalLinks={opts?.footer_legal_links}
            />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
