"use client";

import { useRef, useEffect } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import PricingCard from "@/components/pricing/PricingCard";
import type { WPPricingPlan } from "@/types/pricing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fallbackPlans: WPPricingPlan[] = [
  {
    id: 1,
    title: { rendered: "Starter MVP" },
    acf: {
      price: "$5,000 CAD",
      price_range: "$5,000\u2013$10,000",
      timeline: "2 weeks",
      is_popular: false,
      features_count: "1-3 features",
      design_type: "Template-based",
      pages_screens: "Up to 5",
      revisions: "2 rounds",
      support_duration: "2 weeks",
      inclusions: [
        { item: "1-3 core features" },
        { item: "Template-based design" },
        { item: "Basic SEO setup" },
        { item: "2 weeks post-launch support" },
        { item: "Social media setup" },
      ],
      exclusions: [
        { item: "Video production" },
        { item: "Custom UI/UX design" },
      ],
      cta_text: "Get Started",
      cta_link: "https://calendly.com/sklentr",
      display_order: 1,
    },
  },
  {
    id: 2,
    title: { rendered: "Growth MVP" },
    acf: {
      price: "$15,000 CAD",
      price_range: "$15,000\u2013$25,000",
      timeline: "4 weeks",
      is_popular: true,
      features_count: "5-7 features",
      design_type: "Custom UI",
      pages_screens: "Up to 15",
      revisions: "3 rounds",
      support_duration: "1 month",
      inclusions: [
        { item: "5-7 features" },
        { item: "Custom UI design" },
        { item: "Full SEO setup" },
        { item: "1 month post-launch support" },
        { item: "Technical documentation" },
        { item: "Admin dashboard" },
        { item: "Social media setup" },
      ],
      exclusions: [],
      cta_text: "Most Popular",
      cta_link: "https://calendly.com/sklentr",
      display_order: 2,
    },
  },
  {
    id: 3,
    title: { rendered: "Full-Service" },
    acf: {
      price: "$30,000+ CAD",
      price_range: "$30,000\u2013$60,000+",
      timeline: "8+ weeks",
      is_popular: false,
      features_count: "Full product",
      design_type: "Custom UI/UX",
      pages_screens: "Unlimited",
      revisions: "Unlimited",
      support_duration: "3 months",
      inclusions: [
        { item: "Complete product build" },
        { item: "Custom UI/UX design" },
        { item: "Full SEO & marketing" },
        { item: "3 months post-launch support" },
        { item: "Social media management" },
        { item: "Promotional video" },
        { item: "Priority support" },
      ],
      exclusions: [],
      cta_text: "Go Full-Service",
      cta_link: "https://calendly.com/sklentr",
      display_order: 3,
    },
  },
];

interface PricingSectionProps {
  plans?: WPPricingPlan[];
}

export default function PricingSection({ plans }: PricingSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const validPlans = plans?.filter((p) => p.acf != null);
  const data = validPlans && validPlans.length > 0 ? validPlans : fallbackPlans;
  const sorted = [...data].sort(
    (a, b) => (a.acf?.display_order ?? 0) - (b.acf?.display_order ?? 0)
  );

  useEffect(() => {
    if (!gridRef.current) return;
    const tween = gsap.fromTo(
      gridRef.current.children,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          label="Pricing"
          title="Transparent pricing. No surprises."
          subtitle="Every project starts with a free 30-minute consultation."
        />
        <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {sorted.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
