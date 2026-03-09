import type { LucideIcon } from "lucide-react";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ValueCard({
  icon: Icon,
  title,
  description,
}: ValueCardProps) {
  return (
    <div className="craft-card corner-brackets p-7 group">
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/8 border border-primary/15 mb-5">
        <Icon className="h-4.5 w-4.5 text-primary" />
      </div>
      <h3 className="font-display text-base font-700 mb-2 tracking-[-0.02em]">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
