import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OVERVIEW_SECTIONS } from "../sections";
import type { OverviewSection } from "../types";

interface OverviewSidebarProps {
  activeSection: OverviewSection | null;
  onSectionSelect: (section: OverviewSection) => void;
}

export default function OverviewSidebar({
  activeSection,
  onSectionSelect,
}: OverviewSidebarProps) {
  return (
    <aside
      aria-label="Mục lục dự án"
      className="w-12 border-r flex flex-col items-center py-3 bg-white dark:bg-neutral-900 shrink-0 z-10 select-none"
    >
      <div className="flex flex-col items-center gap-2">
        {OVERVIEW_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <Tooltip key={section.id}>
              <TooltipTrigger render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSectionSelect(section.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "h-9 w-9 rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "bg-muted text-foreground font-medium hover:bg-muted/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                />
              }>
                <Icon className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>{section.label}</span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </aside>
  );
}
