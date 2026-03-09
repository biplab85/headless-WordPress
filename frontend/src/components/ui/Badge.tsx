import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "accent";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-muted/80 text-muted-foreground border border-border/30",
    primary: "bg-primary/6 text-primary border border-primary/15",
    accent: "bg-accent/6 text-accent border border-accent/15",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-0.5 text-[10px] font-600 tracking-[0.06em] uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
