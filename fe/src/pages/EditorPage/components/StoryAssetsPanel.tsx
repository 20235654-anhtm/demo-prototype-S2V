import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";

interface StoryAssetsPanelProps {
  onClose: () => void;
}

export default function StoryAssetsPanel({ onClose }: StoryAssetsPanelProps) {
  return (
    <div className="w-80 md:w-96 border-l flex flex-col h-full bg-white dark:bg-neutral-900 shrink-0 select-none">
      {/* 1. Header chuẩn có tiêu đề và nút đóng ✕ */}
      <div className="h-10 px-3.5 border-b flex items-center justify-between shrink-0 bg-muted/20">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-semibold text-xs">Story Assets</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          title="Đóng Story Assets"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* 2. Phần thân trống (Placeholder) */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          <Users className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-sm text-foreground mb-1">
          Quản lý Story Assets
        </h4>
        <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
          Khu vực phân tích nhân vật, vật phẩm, bối cảnh và tạo ảnh tham chiếu đồng bộ.
        </p>
      </div>
    </div>
  );
}
