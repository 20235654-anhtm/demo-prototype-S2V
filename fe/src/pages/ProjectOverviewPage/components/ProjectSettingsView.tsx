import { useState } from "react";
import {
  Volume2,
  Music,
  Video,
  ChevronRight,
  Save,
  Check,
  Plus,
  Minus,
  Sparkles,
  Sliders,
  Play,
  Square,
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
  // 1. Quản lý thiết lập ngắt nghỉ (Pause Settings)
  const [isPauseDetailOpen, setIsPauseDetailOpen] = useState(false);
  const [pauseValues, setPauseValues] = useState<PauseSetting>({
    period: 0.45,
    comma: 0.25,
    semicolon: 0.3,
    newline: 0.6,
  });
  const [isPauseSaved, setIsPauseSaved] = useState(false);

  // 2. Quản lý nhạc nền (Background Music)
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [selectedBgm, setSelectedBgm] = useState("bgm-1");
  const [bgmVolume, setBgmVolume] = useState(25);
  const [playingBgm, setPlayingBgm] = useState<string | null>(null);

  // 3. Quản lý định dạng đầu ra (Output Format)
  const [resolution, setResolution] = useState<"1080p" | "720p" | "4k">("1080p");
  const [fps, setFps] = useState<"30" | "60">("30");

  const [activeTab, setActiveTab] = useState<"pause" | "bgm" | "output">("pause");

  const bgmList = [
    { id: "bgm-1", name: "Huyền Huyễn Tiên Hiệp (Cổ phong)", duration: "03:15", mood: "Hùng tráng" },
    { id: "bgm-2", name: "Trầm mặc Ô Thản Thành", duration: "02:40", mood: "Sâu lắng" },
    { id: "bgm-3", name: "Đấu Khí Sục Sôi", duration: "02:10", mood: "Kịch tính" },
    { id: "bgm-4", name: "Không dùng nhạc nền", duration: "--:--", mood: "Tắt" },
  ];

  const handleAdjustPause = (key: keyof PauseSetting, delta: number) => {
    setPauseValues((prev) => ({
      ...prev,
      [key]: Math.max(0.05, Number((prev[key] + delta).toFixed(2))),
    }));
  };

  const handleSavePause = () => {
    setIsPauseSaved(true);
    setTimeout(() => {
      setIsPauseSaved(false);
      setIsPauseDetailOpen(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full select-none">
      {/* 1. Thanh tab 3 nhóm thiết lập chính */}
      <div className="pb-3 shrink-0">
        <div className="p-1 bg-muted/60 dark:bg-muted/30 rounded-xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("pause")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer",
              activeTab === "pause"
                ? "bg-background text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <Sliders className="w-3 h-3 text-brand" />
            <span>Ngắt nghỉ</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bgm")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer",
              activeTab === "bgm"
                ? "bg-background text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <Music className="w-3 h-3 text-brand" />
            <span>Nhạc nền</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("output")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer",
              activeTab === "output"
                ? "bg-background text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <Video className="w-3 h-3 text-brand" />
            <span>Đầu ra</span>
          </button>
        </div>
      </div>

      {/* 2. Nội dung cài đặt */}
      <div className="space-y-5">
        {/* === TAB 1: THIẾT LẬP NGẮT NGHỈ GIỌNG ĐỌC === */}
        {activeTab === "pause" && (
          <div className="space-y-4">
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

                {/* Nút Lưu */}
                <div className="pt-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSavePause}
                    disabled={isPauseSaved}
                    className="bg-brand hover:bg-brand-hover text-brand-foreground font-semibold text-xs gap-1.5 cursor-pointer shadow-xs px-4"
                  >
                    {isPauseSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã lưu</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === TAB 2: THIẾT LẬP NHẠC NỀN (BGM) === */}
        {activeTab === "bgm" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Nhạc nền video
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Tự động chèn và cân bằng âm lượng dưới giọng đọc
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBgmEnabled(!bgmEnabled)}
                className={cn(
                  "w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors",
                  bgmEnabled ? "bg-brand justify-end" : "bg-muted justify-start"
                )}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            {bgmEnabled && (
              <>
                {/* Âm lượng nhạc nền */}
                <div className="p-3 rounded-xl border bg-card space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-brand" />
                      Âm lượng nhạc nền
                    </span>
                    <span className="font-mono font-bold text-brand">{bgmVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={bgmVolume}
                    onChange={(e) => setBgmVolume(Number(e.target.value))}
                    className="w-full accent-brand cursor-pointer h-1.5 bg-muted rounded-lg"
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    Khuyên dùng 20% - 30% để không lấn át lời thoại nhân vật.
                  </span>
                </div>

                {/* Danh sách bài nhạc mẫu */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground block">
                    Chọn bản nhạc mẫu
                  </label>
                  <div className="space-y-1.5">
                    {bgmList.map((bgm) => {
                      const isSelected = selectedBgm === bgm.id;
                      const isPlaying = playingBgm === bgm.id;

                      return (
                        <div
                          key={bgm.id}
                          onClick={() => setSelectedBgm(bgm.id)}
                          className={cn(
                            "flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer",
                            isSelected
                              ? "border-brand bg-brand/10 font-semibold text-brand-strong dark:text-brand shadow-2xs"
                              : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlayingBgm(isPlaying ? null : bgm.id);
                              }}
                              className="w-6 h-6 rounded-md bg-muted hover:bg-muted/80 flex items-center justify-center shrink-0 cursor-pointer"
                            >
                              {isPlaying ? (
                                <Square className="w-3 h-3 text-brand fill-brand" />
                              ) : (
                                <Play className="w-3 h-3 text-foreground" />
                              )}
                            </button>
                            <div className="min-w-0">
                              <span className="block truncate text-xs font-medium text-foreground">
                                {bgm.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {bgm.mood} · {bgm.duration}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-brand uppercase tracking-wider shrink-0">
                              Đang dùng
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* === TAB 3: THIẾT LẬP ĐỊNH DẠNG ĐẦU RA === */}
        {activeTab === "output" && (
          <div className="space-y-4">
            {/* Độ phân giải mặc định */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Độ phân giải xuất mặc định
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "720p", label: "720p HD" },
                  { id: "1080p", label: "1080p FHD" },
                  { id: "4k", label: "4K UHD" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setResolution(item.id as any)}
                    className={cn(
                      "py-2.5 px-3 rounded-xl border text-center text-xs transition-all cursor-pointer",
                      resolution === item.id
                        ? "border-brand bg-brand/10 font-semibold text-brand-strong dark:text-brand shadow-2xs"
                        : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="block font-semibold text-foreground">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tốc độ khung hình (FPS) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Tốc độ khung hình (FPS)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "30", label: "30 FPS" },
                  { id: "60", label: "60 FPS" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFps(item.id as any)}
                    className={cn(
                      "py-2.5 px-3 rounded-xl border text-center text-xs transition-all cursor-pointer",
                      fps === item.id
                        ? "border-brand bg-brand/10 font-semibold text-brand-strong dark:text-brand shadow-2xs"
                        : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="font-semibold block text-foreground">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
