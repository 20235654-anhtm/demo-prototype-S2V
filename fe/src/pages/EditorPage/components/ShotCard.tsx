import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Lock, Unlock, Sparkles, Check } from "lucide-react";
import type { Shot } from "@/types/script";

interface ShotCardProps {
  shot: Shot;
  isSelected: boolean;
  isActive: boolean;
  isDisabled?: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onClick: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onToggleLock: (id: string) => void;
  onResplitSingle: (id: string) => void;
}

export default function ShotCard({
  shot,
  isSelected,
  isActive,
  isDisabled = false,
  onSelect,
  onClick,
  onTextChange,
  onToggleLock,
  onResplitSingle,
}: ShotCardProps) {
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      onClick={() => !isDisabled && onClick(shot.id)}
      className={`group relative rounded-xl border p-3.5 transition-all cursor-pointer ${
        isDisabled
          ? "opacity-40 pointer-events-none bg-muted/30"
          : isSelected
            ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
            : isActive
              ? "border-yellow-500 bg-yellow-50/20 shadow-xs ring-2 ring-yellow-400/30"
              : "border-border bg-card hover:border-border/80 hover:shadow-xs"
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Custom Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(shot.id, !isSelected);
          }}
          className={`w-5 h-5 rounded-md border flex items-center justify-center mt-1 transition-colors cursor-pointer shrink-0 ${
            isSelected
              ? "bg-primary text-primary-foreground border-primary"
              : "border-muted-foreground/40 hover:border-primary bg-background"
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Thumbnail Image */}
        <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-muted border shrink-0 group/img">
          <img
            src={shot.image}
            alt={shot.code}
            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
          />
          {/* Lock Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock(shot.id);
            }}
            className={`absolute bottom-1 right-1 p-1 rounded-md text-[10px] backdrop-blur-xs transition-opacity cursor-pointer ${
              shot.isLocked
                ? "bg-black/70 text-amber-400 opacity-100"
                : "bg-black/50 text-white opacity-0 group-hover/img:opacity-100 hover:bg-black/80"
            }`}
            title={shot.isLocked ? "Đã khóa hình ảnh" : "Khóa hình ảnh này"}
          >
            {shot.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>
        </div>

        {/* Script Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-semibold text-xs text-foreground bg-muted/40">
                {shot.code}
              </Badge>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                <Clock className="w-3 h-3 text-muted-foreground/70" />
                <span>{formatDuration(shot.duration)}</span>
              </div>
            </div>

            {/* Quick Resplit ✦ button on card */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onResplitSingle(shot.id);
              }}
              className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-yellow-600 hover:bg-yellow-50 cursor-pointer opacity-70 group-hover:opacity-100"
              title="Chia lại cảnh này"
            >
              <Sparkles className="w-3 h-3 mr-1 text-yellow-500" />
              <span>Chia lại</span>
            </Button>
          </div>

          {/* Textarea tự động dãn chiều cao theo nội dung, không có thanh cuộn trong */}
          <textarea
            value={shot.text}
            onChange={(e) => {
              onTextChange(shot.id, e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            ref={(el) => {
              if (el) {
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full text-xs text-foreground/90 bg-transparent resize-none outline-none leading-relaxed focus:bg-background focus:p-1.5 focus:border focus:rounded-md transition-all font-sans overflow-hidden block"
            placeholder="Nội dung lời đọc của phân cảnh..."
          />
        </div>
      </div>
    </div>
  );
}

