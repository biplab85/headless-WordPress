import {
  Zap,
  Heart,
  Eye,
  Shield,
  Star,
  Target,
  Award,
  Users,
  Globe,
  Layers,
  Code,
  Rocket,
  Search,
  PenTool,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  zap: Zap,
  heart: Heart,
  eye: Eye,
  shield: Shield,
  star: Star,
  target: Target,
  award: Award,
  users: Users,
  globe: Globe,
  layers: Layers,
  code: Code,
  rocket: Rocket,
  search: Search,
  "pen-tool": PenTool,
  clock: Clock,
  "dollar-sign": DollarSign,
  "alert-triangle": AlertTriangle,
  "check-circle": CheckCircle,
  lightbulb: Lightbulb,
  "trending-up": TrendingUp,
};

/**
 * Get a Lucide icon component by name string (from WordPress admin).
 * Falls back to Zap if the icon name is not found.
 */
export function getLucideIcon(name: string): LucideIcon {
  return ICON_MAP[name.toLowerCase()] || Zap;
}
