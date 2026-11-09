import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getOverviewSectionMeta } from "../sections";
import type { OverviewSection } from "../types";
import StoryAssetsView from "./StoryAssetsView";
import RelationshipsView from "./RelationshipsView";
import TimelineView from "./TimelineView";

interface OverviewSectionPanelProps {
  section: OverviewSection;
  onClose: () => void;
}

export default function OverviewSectionPanel({
  section,
  onClose,
}: OverviewSectionPanelProps) {
  const meta = getOverviewSectionMeta(section);
  const Icon = meta.icon;

  return (
    <aside className="w-full lg:w-[360px] xl:w-[400px] shrink-0 border-b lg:border-b-0 lg:border-r bg-white dark:bg-neutral-900 flex flex-col min-h-0 max-h-[45vh] lg:max-h-none animate-in fade-in slide-in-from-left-2 duration-200">
      <div className="flex items-start justify-between gap-2 border-b px-4 py-3 shrink-0">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand/15 text-brand-strong dark:text-brand flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">
              {meta.label}
            </h2>
            <p className="text-[11px] text-muted-foreground leading-snug">
              {meta.description}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
          title="Đóng bảng"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {section === "assets" && <StoryAssetsView />}
        {section === "relationships" && <RelationshipsView />}
        {section === "timeline" && <TimelineView />}
      </div>
    </aside>
  );
}
