import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Maximize2,
  ChevronUp,
} from "lucide-react";
import type { Shot } from "@/types/script";

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

      {/* Seekbar với vạch chia các Scene */}
      <div className="flex-1 relative flex items-center mx-1">
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 1}
          step={0.1}
          onValueChange={(val: any) => {
            const time = Array.isArray(val) ? val[0] : val;
            onSeek(time);
          }}
          className="cursor-pointer"
        />

        {/* Các vạch đánh dấu ranh giới phân cảnh */}
        <div className="absolute inset-x-0 h-1.5 pointer-events-none flex items-center">
          {sceneDividers.map((pct, idx) => (
            <div
              key={idx}
              className="absolute w-[2px] h-2 bg-neutral-400/80 dark:bg-neutral-500 rounded-full -translate-x-1/2"
              style={{ left: `${pct}%` }}
              title={`Phân cảnh ${idx + 2}`}
            />
          ))}
        </div>
      </div>

      {/* Controls bên phải: Toàn màn hình & Mở rộng Timeline */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
          title="Toàn màn hình"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </Button>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

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
