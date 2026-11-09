import { useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ChevronUp,
} from "lucide-react";
import type { Shot } from "@/types/script";
import { computeAudioClips } from "../DialogueScript/dialogueSplitUtils";

interface CompactScrubberProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  shots: Shot[];
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onRewind?: (seconds: number) => void;
  onExpandTimeline: () => void;
}

export default function CompactScrubber({
  currentTime,
  duration,
  isPlaying,
  shots,
  onTogglePlay,
  onSeek,
  onRewind: _onRewind,
  onExpandTimeline,
}: CompactScrubberProps) {
  const isDragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Tính toán vị trí các vạch chia Scene (%)
  let accumulatedTime = 0;
  const sceneDividers: number[] = [];
  shots.forEach((shot, index) => {
    accumulatedTime += shot.duration;
    if (index < shots.length - 1 && duration > 0) {
      sceneDividers.push((accumulatedTime / duration) * 100);
    }
  });

  // Tính toán trạng thái các phân đoạn audio clip trên toàn bộ thanh timeline
  const audioClips = useMemo(() => computeAudioClips(shots), [shots]);

  const seekFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el || duration <= 0) return;
    const rect = el.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(Number((pct * duration).toFixed(1)));
  };

  useEffect(() => {
    const onUp = () => {
      isDragging.current = false;
    };
    const onMove = (e: MouseEvent) => {
      if (isDragging.current) {
        seekFromClientX(e.clientX);
      }
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [duration]);

  const currentPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="h-12 border-t px-4 flex items-center gap-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm shrink-0 select-none z-10">
      {/* Controls bên trái */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePlay}
          className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary cursor-pointer"
          title={isPlaying ? "Tạm dừng" : "Phát"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 ml-0.5 fill-current" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSeek(0)}
          className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
          title="Về đầu video (00:00)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
          title="Âm lượng"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Hiển thị thời gian */}
      <span className="text-xs font-mono font-medium text-muted-foreground shrink-0 tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      {/* Seekbar: Tô màu trực tiếp trạng thái Audio trên thanh tua, dải video đã phát phủ lớp mờ mờ */}
      <div className="flex-1 relative flex items-center mx-1 py-2 group/seekbar">
        {/* Vùng thanh tua tương tác có thể click và kéo */}
        <div
          ref={trackRef}
          onMouseDown={(e) => {
            isDragging.current = true;
            seekFromClientX(e.clientX);
          }}
          className="relative w-full h-2.5 group-hover/seekbar:h-3 rounded-full cursor-pointer transition-all flex items-center"
        >
          {/* Lớp nền phân đoạn Audio (Tô màu toàn bộ thanh tua) */}
          <div className="absolute inset-0 rounded-full overflow-hidden flex items-center shadow-inner">
            {audioClips.map((clip) => {
              const startPct = duration > 0 ? (clip.startTime / duration) * 100 : 0;
              const widthPct = duration > 0 ? (clip.duration / duration) * 100 : 0;
              const isReady = clip.status === "ready";
              const isGenerating = clip.status === "generating";

              return (
                <div
                  key={`compact-clip-${clip.id}`}
                  style={{
                    left: `${startPct}%`,
                    width: `${widthPct}%`,
                    ...(isReady || isGenerating
                      ? {}
                      : {
                          backgroundImage:
                            "repeating-linear-gradient(45deg, #64748b 0px, #64748b 4px, #94a3b8 4px, #94a3b8 8px)",
                        }),
                  }}
                  className={`absolute inset-y-0 ${
                    isReady
                      ? "bg-emerald-500"
                      : isGenerating
                      ? "bg-amber-400 animate-pulse"
                      : "bg-slate-400"
                  }`}
                  title={
                    isReady
                      ? `Audio đã tạo: ${clip.text.slice(0, 30)}... (${clip.duration}s)`
                      : isGenerating
                      ? `Đang tạo audio...`
                      : `Chưa tạo audio / Cần tạo lại (${clip.duration}s)`
                  }
                />
              );
            })}
          </div>

          {/* Dải tiến trình video đã phát (Dạng hơi mờ mờ phủ lên trên để vẫn nhìn thấy rõ màu audio bên dưới) */}
          <div
            className="absolute top-0 bottom-0 left-0 rounded-l-full bg-black/35 dark:bg-white/35 backdrop-blur-[0.5px] pointer-events-none transition-[width] duration-75"
            style={{ width: `${currentPct}%` }}
          />

          {/* Các vạch đánh dấu ranh giới phân cảnh (Scene Dividers) */}
          {sceneDividers.map((pct, idx) => (
            <div
              key={idx}
              className="absolute w-[2px] h-3.5 bg-white dark:bg-black rounded-full -translate-x-1/2 pointer-events-none z-10 opacity-80"
              style={{ left: `${pct}%` }}
              title={`Phân cảnh ${idx + 2}`}
            />
          ))}

          {/* Nút chỉ vị trí con trỏ kim (Scrubber Thumb) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-neutral-100 border-2 border-primary shadow-md pointer-events-none transition-transform group-hover/seekbar:scale-110 z-20"
            style={{ left: `${currentPct}%` }}
          />
        </div>
      </div>

      {/* Controls bên phải: Mở rộng Timeline */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onExpandTimeline}
          className="h-8 w-8 rounded-md hover:bg-primary/10 hover:text-primary text-muted-foreground cursor-pointer transition-colors"
          title="Mở rộng Timeline (Phím tắt: ⌃)"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
