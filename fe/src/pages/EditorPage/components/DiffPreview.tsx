import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, Clock, Image as ImageIcon } from "lucide-react";
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
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl border-2 border-emerald-500/60 bg-emerald-50/10 p-3.5 space-y-4 shadow-sm animate-in fade-in duration-200">
      {/* Sticky Review Bar */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-900">
            Đang xem trước kết quả chia lại ({proposal.newShots.length} cảnh mới đề xuất)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            onClick={onCancel}
            variant="outline"
            className="h-7 text-xs border-emerald-200 text-emerald-800 hover:bg-emerald-100 cursor-pointer bg-white"
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

      {/* 1. Old shots (Faded 40%, labeled [Bản cũ]) */}
      <div className="space-y-2 opacity-45 pointer-events-none select-none">
        <div className="flex items-center gap-2 px-1">
          <Badge variant="outline" className="text-[10px] text-muted-foreground bg-muted">
            Bản cũ ({oldShots.length} phân cảnh bị thay thế)
          </Badge>
        </div>
        {oldShots.map((shot) => (
          <div
            key={shot.id}
            className="rounded-lg border border-border/80 p-2.5 bg-muted/30 flex items-start gap-3"
          >
            <div className="w-20 aspect-video rounded overflow-hidden bg-muted shrink-0">
              <img src={shot.image} alt={shot.code} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground line-through">{shot.code}</span>
                <span className="text-[10px] text-muted-foreground">{formatDuration(shot.duration)}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {shot.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. New proposed shots (Green dashed border, [Ảnh chờ sinh]) */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
          <Badge className="text-[10px] font-semibold bg-emerald-600 text-white">
            <Sparkles className="w-2.5 h-2.5 mr-1" />
            Đề xuất mới từ AI
          </Badge>
          <span className="text-[11px] text-emerald-800 font-medium">
            (Ảnh sẽ tự động đồng bộ sau khi áp dụng)
          </span>
        </div>

        {proposal.newShots.map((shot) => (
          <div
            key={shot.id}
            className="rounded-xl border-2 border-dashed border-emerald-500 bg-white p-3 shadow-xs space-y-2"
          >
            <div className="flex items-start gap-3">
              {/* Image Pending Box */}
              <div className="w-28 aspect-video rounded-lg border border-dashed border-emerald-400 bg-emerald-50/60 flex flex-col items-center justify-center text-emerald-700 text-center p-1 shrink-0">
                <ImageIcon className="w-4 h-4 mb-1 text-emerald-600" />
                <span className="text-[10px] font-semibold leading-tight">[Ảnh chờ sinh]</span>
              </div>

              {/* Text & Header */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-bold text-emerald-800 border-emerald-300 bg-emerald-50">
                    {shot.code}
                  </Badge>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(shot.duration)}</span>
                  </div>
                </div>
                <p className="text-xs text-foreground font-medium leading-relaxed">
                  {shot.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
