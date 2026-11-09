import { cn } from "cn";
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
    <nav
      aria-label="Mục lục dự án"
      className="flex lg:flex-col items-stretch gap-1 border-b lg:border-b-0 lg:border-r bg-white dark:bg-neutral-900 p-2 lg:w-24 shrink-0"
    >
      {OVERVIEW_SECTIONS.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionSelect(section.id)}
            title={section.label}
            aria-pressed={isActive}
            className={cn(
              "flex flex-1 lg:flex-none flex-col items-center justify-center gap-1 rounded-lg px-1 py-2.5 transition-colors cursor-pointer",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="max-w-[84px] text-center text-[10px] font-medium leading-tight">
              {section.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
