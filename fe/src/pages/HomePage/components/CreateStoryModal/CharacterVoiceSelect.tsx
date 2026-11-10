import { useState } from "react";
import { ChevronDown, Volume2, Mic } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VoicePickerList from "./VoicePickerList";
import { MOCK_VOICES, demoAudio } from "./mockData";
import type { VoiceOption } from "./types";

interface CharacterVoiceSelectProps {
  voiceId?: string;
  voiceName?: string;
  onSelectVoice: (voice: VoiceOption) => void;
  className?: string;
}

export default function CharacterVoiceSelect({
  voiceId,
  voiceName,
  onSelectVoice,
  className = "",
}: CharacterVoiceSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedVoice =
    MOCK_VOICES.find((v) => v.id === voiceId) ||
    (voiceId ? { id: voiceId, name: voiceName || "Giọng đọc", subtitle: "" } : null);

  const handleVoiceChosen = (voice: VoiceOption) => {
    onSelectVoice(voice);
    setIsOpen(false);
  };

  const handlePreviewCurrent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!voiceId) return;

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const pitch =
      voiceId.includes("female") || voiceId.includes("chi") || voiceId.includes("cam")
        ? 620
        : 380;
    demoAudio.playTone(pitch, () => setIsPlaying(false));
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`flex items-center justify-between gap-2 h-9 px-3 rounded-lg border border-input bg-card hover:bg-muted/60 text-xs font-medium transition-colors cursor-pointer shadow-2xs group ${className}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Mic className="w-3.5 h-3.5 text-brand shrink-0" />
          {selectedVoice ? (
            <span className="truncate text-foreground group-hover:text-brand-strong dark:group-hover:text-brand">
              {selectedVoice.name}
            </span>
          ) : (
            <span className="text-muted-foreground italic truncate">
              Chọn giọng đọc...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedVoice && (
            <button
              type="button"
              onClick={handlePreviewCurrent}
              title={isPlaying ? "Đang phát..." : `Nghe thử giọng ${selectedVoice.name}`}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? "text-brand animate-pulse" : ""}`} />
            </button>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200" />
        </div>
      </div>

      {/* Modal Thư viện giọng đọc */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-3xl h-[600px] flex flex-col p-6 gap-3 overflow-hidden">
          <DialogHeader className="shrink-0 space-y-1">
            <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Mic className="w-4 h-4 text-brand" />
              <span>Thư viện giọng đọc nhân vật</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0 pt-1">
            <VoicePickerList
              selectedVoiceId={voiceId}
              onSelectVoice={handleVoiceChosen}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
