import CompactScrubber from "./CompactScrubber";
import ExpandedTimeline from "./ExpandedTimeline";
import type { Shot } from "@/types/script";

interface CanvasPreviewProps {
  timelineMode: "compact" | "expanded";
  onTimelineModeChange: (mode: "compact" | "expanded") => void;
  activeShot: Shot | null;
  shots: Shot[];
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
  currentTime,
  duration,
  isPlaying,
  onTogglePlay,
  onSeek,
  onRewind,
  onSelectShot,
}: CanvasPreviewProps) {
  const currentShot = activeShot || shots[0];

  return (
    <div className="flex-1 min-w-0 flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 overflow-hidden relative">
      {/* 1. Màn hình Video Canvas trung tâm */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-6 overflow-hidden">
        {currentShot ? (
          <div className="relative aspect-video w-full max-w-4xl max-h-full rounded-2xl overflow-hidden bg-black shadow-xl border border-border/80 flex items-center justify-center">
            {/* Hình ảnh phân cảnh */}
            <img
              src={currentShot.image}
              alt={currentShot.code}
              className="w-full h-full object-cover select-none"
            />

            {/* Subtitle Overlay (Phụ đề kịch bản) */}
            <div className="absolute inset-x-6 bottom-5 text-center pointer-events-none">
              <p className="inline-block px-4 py-2 rounded-xl bg-black/75 text-white text-xs sm:text-sm font-medium leading-relaxed backdrop-blur-md max-w-2xl shadow-lg border border-white/10">
                {currentShot.text}
              </p>
            </div>

            {/* Badge mã phân cảnh góc trên bên trái */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/15">
                {currentShot.code}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-neutral-300 text-xs font-mono">
                {currentShot.duration}s
              </span>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            Chưa có phân cảnh nào được chọn
          </div>
        )}
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
