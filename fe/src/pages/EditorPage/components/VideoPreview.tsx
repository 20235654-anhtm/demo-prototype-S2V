import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import type { Shot } from "@/types/script";

interface VideoPreviewProps {
  activeShot: Shot | null;
  shots: Shot[];
  onSelectShot: (id: string) => void;
}

export default function VideoPreview({
  activeShot,
  shots,
  onSelectShot,
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const currentShot = activeShot || shots[0];
  const currentIndex = shots.findIndex((s) => s.id === currentShot?.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectShot(shots[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < shots.length - 1) {
      onSelectShot(shots[currentIndex + 1].id);
    }
  };

  if (!currentShot) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Chưa có phân cảnh nào
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 max-w-4xl mx-auto justify-center">
      {/* 16:9 Video Canvas */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-border">
        <img
          src={currentShot.image}
          alt={currentShot.code}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Subtitle Overlay */}
        <div className="absolute inset-x-8 bottom-6 text-center">
          <p className="inline-block px-4 py-2 rounded-lg bg-black/75 text-white text-sm font-medium leading-relaxed backdrop-blur-xs max-w-2xl shadow-sm">
            {currentShot.text}
          </p>
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-black/60 text-white text-xs font-semibold backdrop-blur-xs">
            {currentShot.code}
          </span>
          <span className="px-2 py-1 rounded-md bg-black/60 text-white/80 text-xs font-mono backdrop-blur-xs">
            00:{currentShot.duration.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="mt-4 p-3 rounded-xl border bg-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-9 w-9 rounded-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleNext}
            disabled={currentIndex === shots.length - 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
          <span>
            {currentShot.code} / {shots.length} cảnh
          </span>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-primary" />
            <span className="font-sans text-[11px]">Duy Phương nâng cao</span>
          </div>
        </div>
      </div>
    </div>
  );
}

