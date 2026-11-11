import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Users, Image as ImageIcon, Settings } from "lucide-react";

interface EditorSidebarProps {
  activeTab: "assets" | "visuals" | "settings" | null;
  onToggleAssets: () => void;
  onToggleVisuals: () => void;
  onToggleSettings: () => void;
}

export default function EditorSidebar({
  activeTab,
  onToggleAssets,
  onToggleVisuals,
  onToggleSettings,
}: EditorSidebarProps) {
  const isAssetsActive = activeTab === "assets";
  const isVisualsActive = activeTab === "visuals";
  const isSettingsActive = activeTab === "settings";

  return (
    <aside className="w-12 border-l flex flex-col items-center py-3 bg-white dark:bg-neutral-900 shrink-0 z-10 select-none">
      <div className="flex flex-col items-center gap-2">
        {/* 1. Nút Tài sản truyện */}
        <Tooltip>
          <TooltipTrigger render={
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleAssets}
              className={`h-9 w-9 rounded-lg transition-colors cursor-pointer ${
                isAssetsActive
                  ? "bg-muted text-foreground font-medium hover:bg-muted/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            />
          }>
            <Users className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>Tài sản truyện</span>
          </TooltipContent>
        </Tooltip>

        {/* 2. Nút Visuals */}
        <Tooltip>
          <TooltipTrigger render={
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleVisuals}
              className={`h-9 w-9 rounded-lg transition-colors cursor-pointer ${
                isVisualsActive
                  ? "bg-muted text-foreground font-medium hover:bg-muted/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            />
          }>
            <ImageIcon className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>Hình ảnh phân cảnh</span>
          </TooltipContent>
        </Tooltip>

        {/* 3. Nút Cài đặt dự án */}
        <Tooltip>
          <TooltipTrigger render={
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSettings}
              className={`h-9 w-9 rounded-lg transition-colors cursor-pointer ${
                isSettingsActive
                  ? "bg-muted text-foreground font-medium hover:bg-muted/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            />
          }>
            <Settings className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>Cài đặt dự án</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
