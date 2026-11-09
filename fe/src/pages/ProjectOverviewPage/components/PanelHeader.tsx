import { cn } from "cn";
import type { LucideIcon } from "lucide-react";

interface PanelHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: "amber" | "sky" | "emerald";
}

const ACCENT_STYLES = {
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
} as const;

export default function PanelHeader({
  icon: Icon,
  title,
  description,
  accent = "amber",
}: PanelHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          ACCENT_STYLES[accent]
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
