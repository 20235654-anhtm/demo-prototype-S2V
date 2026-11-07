import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Maximize2,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Film,
  Music,
  Mic,
  Eye,
} from "lucide-react";
import type { Shot } from "@/types/script";

interface ExpandedTimelineProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  shots: Shot[];
  activeShotId: string | null;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onRewind: (seconds: number) => void;
  onSelectShot: (id: string) => void;
  onCollapseTimeline: () => void;
}

const MIN_PX_PER_SEC = 5;
const MAX_PX_PER_SEC = 120;
const DEFAULT_PX_PER_SEC = 40;

export default function ExpandedTimeline({
  currentTime,
  duration,
  isPlaying,
  shots,
  activeShotId,
  onTogglePlay,
  onSeek,
  onRewind: _onRewind,
  onSelectShot,
  onCollapseTimeline,
}: ExpandedTimelineProps) {
  // Tỷ lệ pixel trên mỗi giây (px/giây), mặc định 40px/s (100%)
  const [pixelsPerSec, setPixelsPerSec] = useState<number>(DEFAULT_PX_PER_SEC);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingPlayhead = useRef(false);

  const [containerWidth, setContainerWidth] = useState(0);

  // Theo dõi kích thước container cuộn
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Tổng độ rộng timeline (tối thiểu bằng bề rộng khung nhìn)
  const totalWidth = Math.max(containerWidth, duration * pixelsPerSec);

  // Vị trí trục hoành con trỏ Playhead
  const playheadPosition = currentTime * pixelsPerSec;

  // Thuật toán phân vạch thích ứng (Adaptive Tick Interval) theo Timeline.tsx
  const tickInterval =
    pixelsPerSec >= 60
      ? 1
      : pixelsPerSec >= 30
      ? 2
      : pixelsPerSec >= 20
      ? 5
      : pixelsPerSec >= 14
      ? 10
      : 20;

  const rulerDuration = (totalWidth + 200) / pixelsPerSec;
  const tickCount = Math.ceil(rulerDuration / tickInterval) + 2;

  // Tính toán thời gian seek từ tọa độ clientX
  const seekFromX = useCallback(
    (clientX: number) => {
      const el = scrollRef.current;
      if (!el || duration <= 0) return;
      const rect = el.getBoundingClientRect();
      const clickX = clientX - rect.left + el.scrollLeft;
      const newTime = Math.max(0, Math.min(duration, clickX / pixelsPerSec));
      onSeek(newTime);
    },
    [duration, pixelsPerSec, onSeek]
  );

  // Lắng nghe di chuột toàn trang khi đang kéo con trỏ kim (Scrubbing)
  useEffect(() => {
    const onUp = () => {
      isDraggingPlayhead.current = false;
    };
    const onMove = (e: MouseEvent) => {
      if (isDraggingPlayhead.current) {
        seekFromX(e.clientX);
      }
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [seekFromX]);

  // Tự động cuộn khung nhìn theo Playhead khi đang phát hoặc khi kim đến gần mép
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isDraggingPlayhead.current) return;
    const clientW = el.clientWidth;
    const sLeft = el.scrollLeft;
    if (playheadPosition < sLeft + 60 || playheadPosition > sLeft + clientW - 60) {
      el.scrollTo({
        left: Math.max(0, playheadPosition - clientW * 0.1),
        behavior: isPlaying ? "instant" : "smooth",
      });
    }
  }, [playheadPosition, isPlaying]);

  return (
    <div className="h-64 border-t flex flex-col bg-white dark:bg-neutral-900 text-foreground shrink-0 select-none z-10 shadow-sm">
      {/* 1. Header Toolbar của Timeline */}
      <div className="h-10 px-4 border-b flex items-center justify-between shrink-0 bg-neutral-50/80 dark:bg-neutral-950/80">
        {/* Nhóm phát / Tua / Thời lượng */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePlay}
            className="h-7 w-7 rounded-full bg-primary/10 hover:bg-primary/20 text-primary cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSeek(0)}
            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            title="Về đầu video (00:00)"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </Button>

          <span className="text-xs font-mono font-medium text-foreground ml-1 tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer ml-1"
          >
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>

        {/* Nhóm Zoom Timeline & Fit */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPixelsPerSec((p) => Math.max(MIN_PX_PER_SEC, p - 10))}
            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            title="Thu nhỏ zoom (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>

          <div className="w-24 px-1">
            <Slider
              value={[pixelsPerSec]}
              min={MIN_PX_PER_SEC}
              max={MAX_PX_PER_SEC}
              step={5}
              onValueChange={(val: any) => {
                const z = Array.isArray(val) ? val[0] : val;
                setPixelsPerSec(z);
              }}
              className="cursor-pointer"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPixelsPerSec((p) => Math.min(MAX_PX_PER_SEC, p + 10))}
            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            title="Phóng to zoom (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>

          <span className="text-[11px] font-mono text-muted-foreground w-10 text-center tabular-nums">
            {Math.round((pixelsPerSec / DEFAULT_PX_PER_SEC) * 100)}%
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const el = scrollRef.current;
              if (el) {
                const fitPx = Math.max(
                  MIN_PX_PER_SEC,
                  Math.min(MAX_PX_PER_SEC, (el.clientWidth - 20) / Math.max(duration, 1))
                );
                setPixelsPerSec(Math.round(fitPx));
              }
            }}
            className="h-6 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer ml-0.5"
            title="Vừa khít khung nhìn (Fit)"
          >
            Fit
          </Button>
        </div>

        {/* Nhóm Thu gọn Timeline */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCollapseTimeline}
            className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            title="Thu gọn về thanh tua mini (⌃)"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 2. Khu vực các Track cuộn ngang */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Cột nhãn cố định bên trái các Track */}
        <div className="w-28 border-r bg-neutral-50/60 dark:bg-neutral-950/60 flex flex-col shrink-0 text-[11px] font-medium text-muted-foreground select-none">
          {/* Ô tương ứng Thước kẻ (Time Ruler) */}
          <div className="h-8 px-3 flex items-center border-b border-border/80 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          </div>
          <div className="h-20 px-3 flex items-center border-b gap-1.5 font-semibold text-foreground">
            <Film className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Phân cảnh</span>
          </div>
          <div className="h-10 px-3 flex items-center border-b gap-1.5">
            <Mic className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            <span>Giọng đọc</span>
          </div>
          <div className="h-10 px-3 flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Nhạc nền</span>
          </div>
        </div>

        {/* Khung cuộn ngang các track cùng Playhead và Thước kẻ */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden bg-white dark:bg-neutral-900"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(156,163,175,0.4) transparent",
          }}
        >
          <div
            className="relative flex flex-col"
            style={{ width: `${totalWidth}px` }}
          >
            {/* THƯỚC KẺ THỜI GIAN (TIME RULER) */}
            <div
              className="relative h-8 bg-neutral-50 dark:bg-neutral-950 border-b border-border/80 cursor-pointer shrink-0 select-none"
              onMouseDown={(e) => {
                e.preventDefault();
                isDraggingPlayhead.current = true;
                seekFromX(e.clientX);
              }}
            >
              {Array.from({ length: tickCount }, (_, i) => {
                const t = i * tickInterval;
                if (t === 0) {
                  return (
                    <div
                      key={i}
                      className="absolute top-0 pointer-events-none"
                      style={{ left: 0 }}
                    >
                      <div className="w-px h-3 bg-neutral-400 dark:bg-neutral-500" />
                      <span
                        className="absolute text-[10px] text-muted-foreground font-mono select-none"
                        style={{
                          top: 13,
                          left: 2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        00:00
                      </span>
                    </div>
                  );
                }

                const isMajor =
                  tickInterval >= 5 || t % (tickInterval * 5) === 0;

                return (
                  <div
                    key={i}
                    className="absolute top-0 pointer-events-none"
                    style={{ left: t * pixelsPerSec }}
                  >
                    {/* Vạch chia chính h-3 (12px), vạch phụ h-2 (8px) */}
                    <div
                      className={`w-px ${
                        isMajor
                          ? "h-3 bg-neutral-400 dark:bg-neutral-500"
                          : "h-2 bg-neutral-300 dark:bg-neutral-700"
                      }`}
                    />
                    {isMajor && (
                      <span
                        className="absolute text-[10px] text-muted-foreground font-mono select-none"
                        style={{
                          top: 13,
                          left: 0,
                          transform: "translateX(-50%)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {Math.floor(t / 60)
                          .toString()
                          .padStart(2, "0")}
                        :{String(Math.floor(t % 60)).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* TRACK 1: Video Scenes (Phân cảnh hình ảnh) */}
            <div
              className="h-20 border-b flex items-center px-1 gap-1.5 bg-neutral-100/40 dark:bg-neutral-900/40 cursor-pointer"
              onClick={(e) => seekFromX(e.clientX)}
            >
              {shots.map((shot) => {
                const shotWidth = Math.max(90, shot.duration * pixelsPerSec);
                const isSelected = shot.id === activeShotId;

                return (
                  <div
                    key={shot.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectShot(shot.id);
                    }}
                    style={{ width: `${shotWidth}px` }}
                    className={`h-16 rounded-md overflow-hidden relative border transition-all cursor-pointer group shrink-0 ${
                      isSelected
                        ? "border-2 border-primary shadow-sm ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={shot.image}
                      alt={shot.code}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                    {/* Badge thông tin cảnh */}
                    <div className="absolute top-1 left-1.5 flex items-center gap-1">
                      <span className="text-[10px] font-semibold text-white drop-shadow">
                        {shot.code}
                      </span>
                    </div>

                    <div className="absolute top-1 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3 h-3 text-white drop-shadow" />
                    </div>

                    <div className="absolute bottom-1 right-1.5">
                      <span className="text-[10px] font-mono font-medium text-neutral-200 drop-shadow">
                        {shot.duration.toFixed(1)}s
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TRACK 2: Voice Audio (Giọng đọc) */}
            <div
              className="h-10 border-b flex items-center px-1 bg-neutral-50/50 dark:bg-neutral-900/20 cursor-pointer"
              onClick={(e) => seekFromX(e.clientX)}
            >
              <div
                className="h-7 rounded bg-green-50 dark:bg-green-950/70 border border-green-300 dark:border-green-700/60 flex items-center px-2.5 gap-2 text-green-800 dark:text-green-300 text-xs truncate shadow-2xs"
                style={{
                  width: `${Math.min(totalWidth - 20, duration * pixelsPerSec)}px`,
                }}
              >
                <Mic className="w-3 h-3 shrink-0 text-green-600 dark:text-green-400" />
                <span className="truncate font-mono text-[11px] font-medium">
                  🎵 Shady Guise · Giọng chuẩn truyền cảm (3930 ký tự)
                </span>
              </div>
            </div>

            {/* TRACK 3: Background Music (Nhạc nền) */}
            <div
              className="h-10 flex items-center px-1 bg-neutral-50/30 dark:bg-neutral-900/10 cursor-pointer"
              onClick={(e) => seekFromX(e.clientX)}
            >
              <div
                className="h-7 rounded bg-purple-50 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-700/60 flex items-center px-2.5 gap-2 text-purple-800 dark:text-purple-300 text-xs truncate shadow-2xs"
                style={{ width: `${totalWidth - 40}px` }}
              >
                <Music className="w-3 h-3 shrink-0 text-purple-600 dark:text-purple-400" />
                <span className="truncate font-mono text-[11px] font-medium">
                  🎵 Background music · Cinematic Calm Ambient (Âm lượng 25%)
                </span>
              </div>
            </div>

            {/* KIM CHỈ THỜI GIAN (PLAYHEAD) - Thiết kế chuẩn theo Timeline.tsx */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-30"
              style={{ left: `${playheadPosition}px` }}
            >
              {/* Thân kim mảnh màu xanh xuyên suốt qua Thước kẻ và tất cả các Track */}
              <div className="absolute top-0 bottom-0 w-px bg-blue-500 -translate-x-1/2" />

              {/* Đầu kim hình tam giác màu xanh chúc xuống trên đỉnh Thước kẻ */}
              <div
                className="absolute top-0 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-blue-500 pointer-events-auto cursor-ew-resize drop-shadow-xs"
                title={`Vị trí: ${formatTime(currentTime)}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  isDraggingPlayhead.current = true;
                  seekFromX(e.clientX);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

