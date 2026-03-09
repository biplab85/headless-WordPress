import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
  magnetic?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  external,
  magnetic = true,
}: ButtonProps) {
  const base =
    "group relative inline-flex items-center justify-center font-semibold whitespace-nowrap cursor-pointer tracking-wide";

  const variants = {
    primary:
      "bg-primary text-primary-foreground rounded-sm hover:shadow-[0_4px_24px_rgba(255,77,0,0.3)]",
    secondary:
      "bg-surface text-foreground rounded-sm hover:bg-muted",
    outline:
      "border border-border text-foreground rounded-sm hover:border-primary/50 hover:text-primary",
    ghost:
      "text-muted-foreground hover:text-primary",
  };

  const sizes = {
    sm: "px-4 py-2 text-[11px] uppercase tracking-[0.1em]",
    md: "px-6 py-2.5 text-xs uppercase tracking-[0.1em]",
    lg: "px-8 py-3.5 text-xs uppercase tracking-[0.12em]",
  };

  const classes = cn(base, variants[variant], sizes[size], className);
  const style = { transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" };
  const magProps = magnetic ? { "data-magnetic": "" } : {};

  const arrow = variant === "primary" && (
    <span
      className="ml-2 inline-block group-hover:translate-x-1"
      style={{ transition: "transform 0.3s" }}
    >
      &rarr;
    </span>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} style={style} {...magProps}>
          {children}
          {arrow}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} style={style} {...magProps}>
        {children}
        {arrow}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} style={style} {...magProps}>
      {children}
      {arrow}
    </button>
  );
}
