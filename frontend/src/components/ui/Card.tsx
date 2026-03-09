import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function Card({
  children,
  className,
  hover = true,
  glow = false,
}: CardProps) {
  return (
    <div
      className={cn(
        glow
          ? "craft-card corner-brackets p-6"
          : "rounded-xl border border-border bg-card p-6",
        hover && !glow && "hover:border-primary/30",
        className
      )}
      style={hover ? { transition: "border-color 0.4s, box-shadow 0.4s" } : undefined}
    >
      {children}
    </div>
  );
}
