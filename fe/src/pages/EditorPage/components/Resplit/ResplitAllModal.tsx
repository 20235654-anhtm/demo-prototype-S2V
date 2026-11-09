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
import { Sparkles, AlertTriangle, X, Zap, BookOpen, Film } from "lucide-react";

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
  const [durationSeconds, setDurationSeconds] = useState(12);
  const [targetCount, setTargetCount] = useState(15);

  const handleApply = () => {
    let val: number | undefined;
    if (strategy === "duration") val = durationSeconds;
    if (strategy === "count") val = targetCount;
    onApplyResplitAll(strategy, val);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl w-[90vw] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0 shrink-0 bg-muted/20">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="w-5 h-5 text-brand" />
            <span>Re-split all shots (Chia lại toàn bộ phân cảnh)</span>
          </DialogTitle>
          <DialogClose render={<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full cursor-pointer hover:bg-muted" />}>
            <X className="w-4 h-4" />
            <span className="sr-only">Đóng</span>
          </DialogClose>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Chọn cơ chế phân chia lại toàn bộ kịch bản:
          </p>

          <div className="space-y-3">
            {/* Option 1: Auto */}
            <label
              className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                strategy === "auto"
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="resplit_strategy"
                  value="auto"
                  checked={strategy === "auto"}
                  onChange={() => setStrategy("auto")}
                  className="mt-1 accent-primary cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      1. Tự động theo ngữ nghĩa (Auto scenes)
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Khuyên dùng
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    AI tự đọc hiểu nội dung, tự nhận biết khi đổi bối cảnh hoặc mạch diễn đạt để gom nhóm các phân cảnh tự nhiên nhất.
                  </p>
                </div>
              </div>
            </label>

            {/* Option 2: Duration */}
            <label
              className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                strategy === "duration"
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="resplit_strategy"
                  value="duration"
                  checked={strategy === "duration"}
                  onChange={() => setStrategy("duration")}
                  className="mt-1 accent-primary cursor-pointer"
                />
                <div className="flex-1 space-y-2">
                  <span className="font-semibold text-sm text-foreground">
                    2. Theo thời lượng mong muốn cho mỗi cảnh
                  </span>
                  <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs text-muted-foreground">Mỗi phân cảnh khoảng:</span>
                    <Input
                      type="number"
                      min={3}
                      max={60}
                      value={durationSeconds}
                      onChange={(e) => setDurationSeconds(Number(e.target.value) || 12)}
                      className="w-20 h-8 text-xs font-semibold text-center bg-background"
                    />
                    <span className="text-xs text-muted-foreground">giây</span>
                  </div>

                  {/* Duration Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setDurationSeconds(6)}
                      className={`text-[11px] px-2 py-1 rounded-md border flex items-center gap-1 transition-colors cursor-pointer ${
                        durationSeconds === 6
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <Zap className="w-3 h-3 text-brand" />
                      <span>Nhanh (Shorts / Reels): ~6s</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurationSeconds(12)}
                      className={`text-[11px] px-2 py-1 rounded-md border flex items-center gap-1 transition-colors cursor-pointer ${
                        durationSeconds === 12
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <BookOpen className="w-3 h-3 text-blue-500" />
                      <span>Vừa (YouTube): ~12s</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurationSeconds(20)}
                      className={`text-[11px] px-2 py-1 rounded-md border flex items-center gap-1 transition-colors cursor-pointer ${
                        durationSeconds === 20
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <Film className="w-3 h-3 text-indigo-500" />
                      <span>Chậm (Điện ảnh): ~20s</span>
                    </button>
                  </div>
                </div>
              </div>
            </label>

            {/* Option 3: Target count */}
            <label
              className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                strategy === "count"
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="resplit_strategy"
                  value="count"
                  checked={strategy === "count"}
                  onChange={() => setStrategy("count")}
                  className="mt-1 accent-primary cursor-pointer"
                />
                <div className="flex-1 space-y-2">
                  <span className="font-semibold text-sm text-foreground">
                    3. Theo số lượng phân cảnh mục tiêu
                  </span>
                  <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs text-muted-foreground">Chia toàn bộ kịch bản thành đúng:</span>
                    <Input
                      type="number"
                      min={2}
                      max={100}
                      value={targetCount}
                      onChange={(e) => setTargetCount(Number(e.target.value) || 15)}
                      className="w-20 h-8 text-xs font-semibold text-center bg-background"
                    />
                    <span className="text-xs text-muted-foreground">phân cảnh</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Phù hợp khi bạn có ngân sách cố định cho số lượng hình ảnh hoặc frame video.
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Warning Banner */}
          <div className="flex items-start gap-3 p-3.5 border border-brand/40 bg-brand/10 rounded-xl text-brand-strong dark:text-brand text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-brand-strong dark:text-brand shrink-0 mt-0.5" />
            <p>
              <strong>Cảnh báo:</strong> Thao tác này sẽ phân đoạn lại toàn bộ kịch bản và làm mới các hình ảnh chưa khóa (ảnh có icon 🔒 sẽ được giữ nguyên).
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-3.5 border-t bg-muted/10 flex justify-end gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="bg-brand hover:bg-brand-hover text-brand-foreground font-semibold cursor-pointer"
          >
            Áp dụng chia lại toàn bộ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

