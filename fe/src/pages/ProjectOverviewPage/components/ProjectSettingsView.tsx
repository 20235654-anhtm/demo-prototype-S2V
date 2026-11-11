import { useState } from "react";
import {
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

interface PauseSetting {
  period: number; // Dấu chấm
  comma: number; // Dấu phẩy
  semicolon: number; // Dấu chấm phẩy
  newline: number; // Xuống dòng
}

export default function ProjectSettingsView() {
  // Quản lý thiết lập ngắt nghỉ (Pause Settings - tự động lưu)
  const [isPauseDetailOpen, setIsPauseDetailOpen] = useState(false);
  const [pauseValues, setPauseValues] = useState<PauseSetting>({
    period: 0.45,
    comma: 0.25,
    semicolon: 0.3,
    newline: 0.6,
  });

  const handleAdjustPause = (key: keyof PauseSetting, delta: number) => {
    setPauseValues((prev) => ({
      ...prev,
      [key]: Math.max(0.05, Number((prev[key] + delta).toFixed(2))),
    }));
  };

  return (
    <div className="flex flex-col h-full select-none space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Cấu hình ngắt nghỉ
        </label>

        {/* Nút bấm mở thiết lập ngắt nghỉ */}
        <button
          type="button"
          onClick={() => setIsPauseDetailOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-muted/50 transition-colors cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand/10 text-brand-strong dark:text-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-semibold text-foreground block">
                Mặc định
              </span>
            </div>
          </div>
          <ChevronRight
            className={cn(
              "w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200",
              isPauseDetailOpen && "rotate-90"
            )}
          />
        </button>
      </div>

      {/* Bảng Chi tiết thiết lập ngắt nghỉ */}
      {isPauseDetailOpen && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs space-y-4 animate-in fade-in-50 slide-in-from-top-2">
          <div className="flex items-center justify-between pb-1 border-b border-border/50">
            <h4 className="text-xs font-semibold text-foreground">
              Thiết lập ngắt nghỉ chi tiết
            </h4>
            <span className="text-[10px] text-muted-foreground font-mono">
              Đơn vị: giây (s)
            </span>
          </div>

          {/* 1. Dấu chấm . */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground">Dấu chấm</span>
                <span className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-mono">.</span>
              </div>
              <span className="text-xs font-normal text-muted-foreground font-mono px-2 py-0.5 rounded-md border bg-muted/30">
                {pauseValues.period}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAdjustPause("period", -0.05)}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <input
                type="range"
                min={0.1}
                max={2.0}
                step={0.05}
                value={pauseValues.period}
                onChange={(e) =>
                  setPauseValues((prev) => ({
                    ...prev,
                    period: Number(parseFloat(e.target.value).toFixed(2)),
                  }))
                }
                className="flex-1 accent-brand cursor-pointer h-1.5 bg-muted rounded-lg"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAdjustPause("period", 0.05)}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* 2. Dấu phẩy , */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground">Dấu phẩy</span>
                <span className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-mono">,</span>
              </div>
              <span className="text-xs font-normal text-muted-foreground font-mono px-2 py-0.5 rounded-md border bg-muted/30">
                {pauseValues.comma}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAdjustPause("comma", -0.05)}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <input
                type="range"
                min={0.05}
                max={1.5}
                step={0.05}
                value={pauseValues.comma}
                onChange={(e) =>
                  setPauseValues((prev) => ({
                    ...prev,
                    comma: Number(parseFloat(e.target.value).toFixed(2)),
                  }))
                }
                className="flex-1 accent-brand cursor-pointer h-1.5 bg-muted rounded-lg"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAdjustPause("comma", 0.05)}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* 3. Dấu chấm phẩy ; */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground">Dấu chấm phẩy</span>
                <span className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-mono">;</span>
              </div>
              <span className="text-xs font-normal text-muted-foreground font-mono px-2 py-0.5 rounded-md border bg-muted/30">
                {pauseValues.semicolon}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAdjustPause("semicolon", -0.05)}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <input
                type="range"
                min={0.05}
                max={1.5}
                step={0.05}
                value={pauseValues.semicolon}
                onChange={(e) =>
                  setPauseValues((prev) => ({
                    ...prev,
                    semicolon: Number(parseFloat(e.target.value).toFixed(2)),
                  }))
                }
                className="flex-1 accent-brand cursor-pointer h-1.5 bg-muted rounded-lg"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAdjustPause("semicolon", 0.05)}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* 4. Xuống dòng ↵ */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground">Xuống dòng</span>
                <span className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-mono">↵</span>
              </div>
              <span className="text-xs font-normal text-muted-foreground font-mono px-2 py-0.5 rounded-md border bg-muted/30">
                {pauseValues.newline}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAdjustPause("newline", -0.05)}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <input
                type="range"
                min={0.1}
                max={3.0}
                step={0.05}
                value={pauseValues.newline}
                onChange={(e) =>
                  setPauseValues((prev) => ({
                    ...prev,
                    newline: Number(parseFloat(e.target.value).toFixed(2)),
                  }))
                }
                className="flex-1 accent-brand cursor-pointer h-1.5 bg-muted rounded-lg"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAdjustPause("newline", 0.05)}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
