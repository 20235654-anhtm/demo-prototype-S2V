import { useState, useRef, useEffect } from "react";
import CompactScrubber from "./CompactScrubber";
import ExpandedTimeline from "./ExpandedTimeline";
import ControlsPill, { ASPECT_RATIOS } from "./ControlsPill";
import type { Shot, CharacterAsset } from "@/types/script";

interface CanvasPreviewProps {
  timelineMode: "compact" | "expanded";
  onTimelineModeChange: (mode: "compact" | "expanded") => void;
  activeShot: Shot | null;
  shots: Shot[];
  characters?: CharacterAsset[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onRewind: (seconds: number) => void;
  onSelectShot: (id: string) => void;
}

export default function CanvasPreview({
  timelineMode,
  onTimelineModeChange,
  activeShot,
  shots,
  characters,
  currentTime,
  duration,
  isPlaying,
  onTogglePlay,
  onSeek,
  onRewind,
  onSelectShot,
}: CanvasPreviewProps) {
  const currentShot = activeShot || shots[0];

  const [aspectRatioId, setAspectRatioId] = useState("16:9");
  const [bgColor, setBgColor] = useState("#000000");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const previewAreaRef = useRef<HTMLDivElement>(null);

  const currentRatio =
    ASPECT_RATIOS.find((r) => r.id === aspectRatioId) || ASPECT_RATIOS[0];

  // Đồng bộ trạng thái Fullscreen khi user bấm ESC hoặc dùng phím tắt trình duyệt
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (previewAreaRef.current?.requestFullscreen) {
        previewAreaRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 overflow-hidden relative">
      {/* Vùng Canvas Preview (hỗ trợ Fullscreen) */}
      <div
        ref={previewAreaRef}
        className={`flex-1 min-h-0 flex flex-col overflow-hidden relative ${
          isFullscreen
            ? "bg-neutral-950 p-6 flex items-center justify-center"
            : ""
        }`}
      >
        {/* Controls Pill Bar */}
        <div className="pt-3 pb-1 flex items-center justify-center shrink-0 z-20">
          <ControlsPill
            aspectRatioId={aspectRatioId}
            onAspectRatioChange={setAspectRatioId}
            bgColor={bgColor}
            onBgColorChange={setBgColor}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </div>

        {/* 1. Màn hình Video Canvas trung tâm */}
        <div className="flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          {currentShot ? (
            <div
              className="relative rounded-2xl overflow-hidden shadow-xl border border-border/80 flex items-center justify-center transition-all duration-300"
              style={{
                aspectRatio: currentRatio.css,
                backgroundColor: bgColor,
                width: "100%",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              {/* Hình ảnh phân cảnh */}
              <img
                src={currentShot.image}
                alt={currentShot.code}
                className="w-full h-full object-cover select-none"
              />
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              Chưa có phân cảnh nào được chọn
            </div>
          )}
        </div>
      </div>

      {/* 2. Thanh tua dưới đáy: Chuyển đổi giữa Compact Scrubber và Expanded Timeline */}
      {timelineMode === "compact" ? (
        <CompactScrubber
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          shots={shots}
          onTogglePlay={onTogglePlay}
          onSeek={onSeek}
          onRewind={onRewind}
          onExpandTimeline={() => onTimelineModeChange("expanded")}
        />
      ) : (
        <ExpandedTimeline
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          shots={shots}
          characters={characters}
          activeShotId={currentShot?.id || null}
          onTogglePlay={onTogglePlay}
          onSeek={onSeek}
          onRewind={onRewind}
          onSelectShot={onSelectShot}
          onCollapseTimeline={() => onTimelineModeChange("compact")}
        />
      )}
    </div>
  );
}
