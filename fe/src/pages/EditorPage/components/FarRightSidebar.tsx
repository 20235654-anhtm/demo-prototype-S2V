import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Users, Image as ImageIcon, Settings } from "lucide-react";

interface FarRightSidebarProps {
  isScriptPinned: boolean;
  isScriptOpen: boolean;
  activeRightTab: "script" | "assets" | "visuals" | null;
  onToggleScript: () => void;
  onToggleAssets: () => void;
  onToggleVisuals: () => void;
}

export default function FarRightSidebar({
  isScriptPinned,
  isScriptOpen,
  activeRightTab,
  onToggleScript,
  onToggleAssets,
  onToggleVisuals,
}: FarRightSidebarProps) {
  // Script icon active khi Cột Trái đang mở (nếu đã pin) hoặc đang mở ở Panel Phải (nếu chưa pin)
  const isScriptActive = isScriptPinned ? isScriptOpen : activeRightTab === "script";
  const isAssetsActive = activeRightTab === "assets";
  const isVisualsActive = activeRightTab === "visuals";

  return (
    <aside className="w-12 border-l flex flex-col items-center py-3 justify-between bg-white dark:bg-neutral-900 shrink-0 z-10 select-none">
      <div className="flex flex-col items-center gap-2">
        {/* 1. Nút Script (Kịch bản) */}
        <Tooltip>
          <TooltipTrigger render={
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleScript}
              className={`h-9 w-9 rounded-lg transition-colors cursor-pointer ${
                isScriptActive
                  ? "bg-muted text-foreground font-medium hover:bg-muted/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            />
          }>
            <FileText className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>
              {isScriptPinned
                ? isScriptOpen
                  ? "Đóng kịch bản (Cột trái)"
                  : "Mở kịch bản (Cột trái)"
                : "Mở kịch bản"}
            </span>
          </TooltipContent>
        </Tooltip>

        {/* 2. Nút Tài sản truyện */}
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

        {/* 3. Nút Visuals */}
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
      </div>

      {/* Nút Settings ở dưới cùng */}
      <Tooltip>
        <TooltipTrigger render={
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          />
        }>
          <Settings className="w-4 h-4" />
        </TooltipTrigger>
        <TooltipContent side="left">
          <span>Cài đặt dự án</span>
        </TooltipContent>
      </Tooltip>
    </aside>
  );
}
