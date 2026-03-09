import { SITE_URL, SITE_NAME, CONTACT, SOCIAL_LINKS } from "@/lib/constants";
import type { WPPost } from "@/types/post";

interface OrganizationJsonLdProps {
  siteName?: string;
  contact?: { email: string; phone: string; location: string; calendly: string };
  socialLinks?: { linkedin: string; facebook: string; instagram: string; twitter: string };
}

export function OrganizationJsonLd({ siteName, contact, socialLinks }: OrganizationJsonLdProps) {
  const name = siteName || SITE_NAME;
  const contactInfo = contact || CONTACT;
  const socials = socialLinks || SOCIAL_LINKS;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    foundingDate: "2023",
    founder: { "@type": "Person", name: "Rishad Wahid" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "Ontario",
      addressCountry: "CA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contactInfo.phone,
      email: contactInfo.email,
    },
    sameAs: Object.values(socials),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArticleJsonLd({ post }: { post: WPPost }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title.rendered,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      "@type": "Person",
      name: post._embedded?.author?.[0]?.name || "Sklentr Team",
    },
    image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    url: `${SITE_URL}/blog/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
