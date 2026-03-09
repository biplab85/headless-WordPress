"use client";

import { Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { WPPricingPlan } from "@/types/pricing";

interface PricingCardProps {
  plan: WPPricingPlan;
}

export default function PricingCard({ plan }: PricingCardProps) {
  const { acf } = plan;

  return (
    <div
      className={cn(
        "relative craft-card p-8 flex flex-col",
        acf.is_popular && "border-primary/40 shadow-[0_0_40px_rgba(255,77,0,0.06)]"
      )}
    >
      {acf.is_popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 tag-pill tag-pill--primary text-[9px]">
          Most Popular
        </span>
      )}

      <h3 className="font-display text-xl font-700 tracking-[-0.02em]">
        {plan.title.rendered}
      </h3>
      <div className="mt-5">
        <span className="font-display text-3xl font-800 tracking-[-0.03em] text-primary">
          {acf.price}
        </span>
        <p className="text-[10px] text-muted-foreground mt-1.5 tracking-[0.08em] uppercase">
          {acf.price_range} / {acf.timeline}
        </p>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        {[
          ["Features", acf.features_count],
          ["Design", acf.design_type],
          ["Pages/Screens", acf.pages_screens],
          ["Revisions", acf.revisions],
          ["Support", acf.support_duration],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground/80">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-border/50 pt-6 space-y-2.5 flex-1">
        {acf.inclusions?.map((item) => (
          <div key={item.item} className="flex items-center gap-2.5 text-sm">
            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>{item.item}</span>
          </div>
        ))}
        {acf.exclusions?.map((item) => (
          <div
            key={item.item}
            className="flex items-center gap-2.5 text-sm text-muted-foreground"
          >
            <X className="h-3.5 w-3.5 text-red-400/60 shrink-0" />
            <span>{item.item}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button
          href={acf.cta_link}
          external
          variant={acf.is_popular ? "primary" : "outline"}
          className="w-full"
        >
          {acf.cta_text}
        </Button>
      </div>
    </div>
  );
}
