import { useState } from "react";
import { Plus, Minus, Sparkles, Zap, Coffee, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

interface PauseSetting {
  period: number; // Dấu chấm
  comma: number; // Dấu phẩy
  semicolon: number; // Dấu chấm phẩy
  newline: number; // Xuống dòng
}

type PausePresetId = "default" | "fast" | "slow" | "custom";

interface PausePreset {
  id: PausePresetId;
  label: string;
  description: string;
  icon: typeof Sparkles;
  values: PauseSetting;
}

const PRESETS: PausePreset[] = [
  {
    id: "default",
    label: "Mặc định",
    description: "Nhịp điệu tự nhiên, chuẩn sách nói",
    icon: Sparkles,
    values: { period: 0.45, comma: 0.25, semicolon: 0.3, newline: 0.6 },
  },
  {
    id: "fast",
    label: "Nhanh",
    description: "Ngắt nghỉ ngắn, dồn dập, kịch tính",
    icon: Zap,
    values: { period: 0.25, comma: 0.15, semicolon: 0.2, newline: 0.35 },
  },
  {
    id: "slow",
    label: "Chậm rãi",
    description: "Khoảng dừng dài, sâu lắng, truyền cảm",
    icon: Coffee,
    values: { period: 0.7, comma: 0.4, semicolon: 0.5, newline: 0.9 },
  },
];

export default function ProjectSettingsView() {
  const [selectedPreset, setSelectedPreset] = useState<PausePresetId>("default");
  const [pauseValues, setPauseValues] = useState<PauseSetting>(PRESETS[0].values);

  // Chọn một preset mẫu (Mặc định / Nhanh / Chậm)
  const handleSelectPreset = (preset: PausePreset) => {
    setSelectedPreset(preset.id);
    setPauseValues(preset.values);
  };

  // Tinh chỉnh thủ công sẽ tự động chuyển sang mode "Tùy chỉnh" nếu không khớp preset nào
  const handleAdjustPause = (key: keyof PauseSetting, delta: number) => {
    setPauseValues((prev) => {
      const next = {
        ...prev,
        [key]: Math.max(0.05, Number((prev[key] + delta).toFixed(2))),
      };
      checkCustom(next);
      return next;
    });
  };

  const handleSliderChange = (key: keyof PauseSetting, val: number) => {
    setPauseValues((prev) => {
      const next = { ...prev, [key]: val };
      checkCustom(next);
      return next;
    });
  };

  const checkCustom = (values: PauseSetting) => {
    const matched = PRESETS.find(
      (p) =>
        p.values.period === values.period &&
        p.values.comma === values.comma &&
        p.values.semicolon === values.semicolon &&
        p.values.newline === values.newline
    );
    setSelectedPreset(matched ? matched.id : "custom");
  };

  return (
    <div className="flex flex-col h-full select-none space-y-4 font-sans">
      {/* 1. Bộ tùy chọn Preset (Mặc định / Nhanh / Chậm rãi) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Cấu hình ngắt nghỉ
          </label>
          {selectedPreset === "custom" && (
            <span className="text-[10px] font-medium text-brand-strong dark:text-brand bg-brand/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <SlidersHorizontal className="w-2.5 h-2.5" />
              <span>Đang tùy chỉnh</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedPreset === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={cn(
                  "p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 shadow-2xs group",
                  isSelected
                    ? "border-brand bg-brand/10 ring-1 ring-brand/40 shadow-xs"
                    : "border-border bg-card hover:bg-muted/60 hover:border-border/80"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0",
                      isSelected
                        ? "bg-brand text-brand-foreground"
                        : "bg-muted text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold truncate",
                      isSelected ? "text-foreground font-bold" : "text-foreground"
                    )}
                  >
                    {preset.label}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Bảng Chi tiết thiết lập ngắt nghỉ - Luôn luôn hiển thị */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs space-y-4">
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
                handleSliderChange(
                  "period",
                  Number(parseFloat(e.target.value).toFixed(2))
                )
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
                handleSliderChange(
                  "comma",
                  Number(parseFloat(e.target.value).toFixed(2))
                )
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
                handleSliderChange(
                  "semicolon",
                  Number(parseFloat(e.target.value).toFixed(2))
                )
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
                handleSliderChange(
                  "newline",
                  Number(parseFloat(e.target.value).toFixed(2))
                )
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
    </div>
  );
}
