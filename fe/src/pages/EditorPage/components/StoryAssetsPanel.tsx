import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";

interface StoryAssetsPanelProps {
  onClose: () => void;
}

export default function StoryAssetsPanel({ onClose }: StoryAssetsPanelProps) {
  return (
    <div className="w-80 md:w-[360px] xl:w-[400px] border-l flex flex-col h-full bg-white dark:bg-neutral-900 shrink-0 select-none">
      {/* 1. Header chuẩn có tiêu đề và nút đóng ✕ */}
      <div className="h-12 px-4 border-b flex items-center justify-between shrink-0 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand/15 text-brand-strong dark:text-brand flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-sm">Tài sản truyện</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          title="Đóng Tài sản truyện"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* 2. Phần thân trống (Placeholder) */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-brand/10 text-brand-strong dark:text-brand flex items-center justify-center mb-3">
          <Users className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-sm text-foreground mb-1">
          Quản lý tài sản truyện
        </h4>
        <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
          Khu vực phân tích nhân vật, vật phẩm, bối cảnh và tạo ảnh tham chiếu đồng bộ.
        </p>
      </div>
    </div>
  );
}
