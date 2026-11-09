import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles } from "lucide-react";
import type { Shot, DiffProposal } from "@/types/script";

interface DiffPreviewProps {
  proposal: DiffProposal;
  oldShots: Shot[];
  onApply: () => void;
  onCancel: () => void;
}

export default function DiffPreview({
  proposal,
  oldShots,
  onApply,
  onCancel,
}: DiffPreviewProps) {
  const formatDuration = (sec: number) => {
    const rounded = Number.isInteger(sec) ? sec : Number(sec.toFixed(1));
    return `${rounded}s`;
  };

  return (
    <div className="rounded-xl border-2 border-emerald-500/60 bg-emerald-50/10 dark:bg-emerald-950/10 p-3.5 space-y-4 shadow-sm animate-in fade-in duration-200">
      {/* Sticky Review Bar */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
            Đang xem trước kết quả chia lại ({proposal.newShots.length} cảnh mới đề xuất)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            onClick={onCancel}
            variant="outline"
            className="h-7 text-xs border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer bg-background"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Hủy bỏ
          </Button>
          <Button
            size="sm"
            onClick={onApply}
            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
          >
            <Check className="w-3.5 h-3.5 mr-1 stroke-[3]" />
            Áp dụng
          </Button>
        </div>
      </div>

      {/* 1. Old shots (Faded 45%, dạng hàng liền mạch seamless) */}
      <div className="space-y-1.5 opacity-45 pointer-events-none select-none">
        <div className="flex items-center gap-2 px-1">
          <Badge variant="outline" className="text-[10px] text-muted-foreground bg-muted">
            Bản cũ ({oldShots.length} phân cảnh bị thay thế)
          </Badge>
        </div>
        {oldShots.map((shot) => (
          <div
            key={shot.id}
            className="flex items-start gap-3 py-2 px-2.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
          >
            <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
              <Badge
                variant="outline"
                className="font-semibold text-xs text-muted-foreground bg-background/60 px-2 py-0.5"
              >
                {shot.code}
              </Badge>
              <span className="text-[11px] text-muted-foreground/70 font-mono">
                {formatDuration(shot.duration)}
              </span>
            </div>

            <p className="flex-1 min-w-0 text-sm text-muted-foreground leading-relaxed pt-0.5">
              {shot.text}
            </p>
          </div>
        ))}
      </div>

      {/* 2. New proposed shots (Bố cục hàng liền mạch đồng bộ chuẩn với ShotCard mới) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Badge className="text-[10px] font-semibold bg-emerald-600 text-white">
            <Sparkles className="w-2.5 h-2.5 mr-1" />
            Đề xuất mới từ AI
          </Badge>
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
            (Ảnh sẽ tự động đồng bộ sau khi áp dụng)
          </span>
        </div>

        {proposal.newShots.map((shot) => (
          <div
            key={shot.id}
            className="flex items-start gap-3 py-2.5 px-3 rounded-lg border border-dashed border-emerald-400/80 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-2xs"
          >
            <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
              <Badge
                variant="outline"
                className="font-bold text-xs text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5"
              >
                {shot.code.replace(/\s*\(Đề xuất\)/gi, "")}
              </Badge>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                {formatDuration(shot.duration)}
              </span>
            </div>

            <p className="flex-1 min-w-0 text-sm text-foreground font-medium leading-relaxed pt-0.5">
              {shot.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
