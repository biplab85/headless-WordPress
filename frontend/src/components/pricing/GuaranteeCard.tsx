import type { LucideIcon } from "lucide-react";

interface GuaranteeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function GuaranteeCard({
  icon: Icon,
  title,
  description,
}: GuaranteeCardProps) {
  return (
    <div className="craft-card corner-brackets p-6 flex gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/8 border border-primary/15 shrink-0">
        <Icon className="h-4.5 w-4.5 text-primary" />
      </div>
      <div>
        <h3 className="font-display text-sm font-700 tracking-[-0.01em]">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
