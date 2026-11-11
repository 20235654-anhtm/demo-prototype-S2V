import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Sparkles, Clock, LayoutGrid, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResplitAllModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyResplitAll: (mode: "auto" | "duration" | "count", value?: number) => void;
}

export default function ResplitAllModal({
  open,
  onOpenChange,
  onApplyResplitAll,
}: ResplitAllModalProps) {
  const [strategy, setStrategy] = useState<"auto" | "duration" | "count">("auto");
  const [durationSeconds, setDurationSeconds] = useState<number>(12);
  const [targetCount, setTargetCount] = useState<number>(15);

  const handleApply = () => {
    let val: number | undefined;
    if (strategy === "duration") val = durationSeconds;
    if (strategy === "count") val = targetCount;
    onApplyResplitAll(strategy, val);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl w-[90vw] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl border-border">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0 shrink-0 bg-muted/20">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Sparkles className="w-5 h-5 text-brand" />
            <span>Chia lại toàn bộ phân cảnh</span>
          </DialogTitle>
          <DialogClose render={<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground" />}>
            <X className="w-4 h-4" />
            <span className="sr-only">Đóng</span>
          </DialogClose>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-medium text-muted-foreground">
            Chọn phương thức để AI tính toán và phân bổ lại toàn bộ cảnh trong kịch bản:
          </p>

          <div className="space-y-3">
            {/* Option 1: Auto */}
            <div
              onClick={() => setStrategy("auto")}
              className={cn(
                "relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 select-none",
                strategy === "auto"
                  ? "border-brand bg-brand/[0.04] shadow-xs"
                  : "border-border hover:border-border/80 hover:bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors",
                  strategy === "auto"
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-muted-foreground/40 bg-transparent"
                )}
              >
                {strategy === "auto" && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">
                    1. Tự động theo ngữ cảnh
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Khuyên dùng
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  AI tự đọc hiểu cốt truyện, phân tích mạch cảm xúc và điểm chuyển cảnh tự nhiên để phân chia cảnh hợp lý nhất.
                </p>
              </div>
            </div>

            {/* Option 2: Duration */}
            <div
              onClick={() => setStrategy("duration")}
              className={cn(
                "relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 select-none",
                strategy === "duration"
                  ? "border-brand bg-brand/[0.04] shadow-xs"
                  : "border-border hover:border-border/80 hover:bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors",
                  strategy === "duration"
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-muted-foreground/40 bg-transparent"
                )}
              >
                {strategy === "duration" && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-foreground">
                    2. Theo thời lượng mỗi cảnh
                  </span>
                  <div
                    className="flex items-center gap-1.5 shrink-0 bg-background border border-border/80 rounded-lg px-2.5 py-1 shadow-2xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="number"
                      min={3}
                      max={60}
                      value={durationSeconds}
                      onChange={(e) => setDurationSeconds(Number(e.target.value) || 12)}
                      className="w-10 h-6 text-xs font-bold text-center p-0 border-0 shadow-none focus-visible:ring-0"
                    />
                    <span className="text-xs text-muted-foreground font-medium">giây</span>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 pt-0.5" onClick={(e) => e.stopPropagation()}>
                  {[
                    { label: "Nhanh (Shorts / TikTok)", sec: 6 },
                    { label: "Vừa (YouTube)", sec: 12 },
                    { label: "Chậm (Điện ảnh)", sec: 20 },
                  ].map((preset) => {
                    const isSelected = durationSeconds === preset.sec && strategy === "duration";
                    return (
                      <button
                        key={preset.sec}
                        type="button"
                        onClick={() => {
                          setStrategy("duration");
                          setDurationSeconds(preset.sec);
                        }}
                        className={cn(
                          "text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer",
                          isSelected
                            ? "bg-foreground text-background border-foreground font-semibold shadow-2xs"
                            : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/70"
                        )}
                      >
                        {preset.label}: ~{preset.sec}s
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Option 3: Target count */}
            <div
              onClick={() => setStrategy("count")}
              className={cn(
                "relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 select-none",
                strategy === "count"
                  ? "border-brand bg-brand/[0.04] shadow-xs"
                  : "border-border hover:border-border/80 hover:bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors",
                  strategy === "count"
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-muted-foreground/40 bg-transparent"
                )}
              >
                {strategy === "count" && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-foreground">
                    3. Theo số lượng phân cảnh mục tiêu
                  </span>
                  <div
                    className="flex items-center gap-1.5 shrink-0 bg-background border border-border/80 rounded-lg px-2.5 py-1 shadow-2xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="number"
                      min={2}
                      max={100}
                      value={targetCount}
                      onChange={(e) => setTargetCount(Number(e.target.value) || 15)}
                      className="w-10 h-6 text-xs font-bold text-center p-0 border-0 shadow-none focus-visible:ring-0"
                    />
                    <span className="text-xs text-muted-foreground font-medium">cảnh</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Phù hợp khi bạn có kế hoạch cố định về tổng số lượng khung hình hoặc ảnh minh họa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-3.5 border-t bg-muted/10 flex justify-end gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="cursor-pointer text-xs h-8">
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="bg-brand hover:bg-brand-hover text-brand-foreground font-semibold cursor-pointer text-xs h-8 shadow-2xs"
          >
            Áp dụng chia lại toàn bộ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
