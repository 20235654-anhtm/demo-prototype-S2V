import {
  BookOpen,
  History,
  Network,
  Users,
} from "lucide-react";
import { cn } from "cn";
import type { OverviewSection } from "../types";

interface OverviewSidebarProps {
  activeSection: OverviewSection;
  onSectionChange: (section: OverviewSection) => void;
}

const NAV_ITEMS: Array<{
  id: OverviewSection;
  label: string;
  description: string;
  icon: typeof Users;
}> = [
  {
    id: "assets",
    label: "Tài sản truyện",
    description: "Nhân vật, bối cảnh & đạo cụ",
    icon: Users,
  },
  {
    id: "relationships",
    label: "Quan hệ nhân vật",
    description: "Liên kết & mức độ gắn kết",
    icon: Network,
  },
  {
    id: "timeline",
    label: "Dòng thời gian truyện",
    description: "Diễn tiến sự kiện trong chương",
    icon: History,
  },
  {
    id: "story",
    label: "Nội dung truyện",
    description: "Đọc toàn văn chương truyện",
    icon: BookOpen,
  },
];

export default function OverviewSidebar({
  activeSection,
  onSectionChange,
}: OverviewSidebarProps) {
  return (
    <aside className="w-60 lg:w-64 border-r bg-white dark:bg-neutral-900 flex flex-col shrink-0 min-h-0">
      <nav className="p-3 space-y-1 overflow-y-auto">
        <p className="px-2.5 pt-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Nội dung truyện
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-start gap-2.5 rounded-lg border px-2.5 py-2.5 text-left transition-all cursor-pointer",
                isActive
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 shadow-2xs"
                  : "border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "mt-0.5 w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                  isActive
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold leading-snug">
                  {item.label}
                </span>
                <span className="block text-[10px] leading-snug mt-0.5 opacity-80">
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
