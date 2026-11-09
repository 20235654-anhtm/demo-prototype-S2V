import { useState } from "react";
import { Search, Play, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_VOICES, demoAudio } from "./mockData";
import type { VoiceOption } from "./types";

interface VoicePickerListProps {
  selectedVoiceId?: string;
  onSelectVoice: (voice: VoiceOption) => void;
  compact?: boolean;
}

const getVoiceInitial = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

export default function VoicePickerList({
  selectedVoiceId,
  onSelectVoice,
}: VoicePickerListProps) {
  const [activeTab, setActiveTab] = useState<"explore" | "my-voices">("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccent, setSelectedAccent] = useState<string>("All");
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const handlePlayVoice = (voiceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
      return;
    }
    setPlayingVoiceId(voiceId);
    demoAudio.playTone(
      voiceId.includes("female") || voiceId.includes("chi") || voiceId.includes("cam") ? 620 : 380,
      () => setPlayingVoiceId(null)
    );
  };

  const filteredVoices = MOCK_VOICES.filter((voice) => {
    if (activeTab === "my-voices" && !voice.isCustom) return false;
    if (activeTab === "explore" && voice.isCustom) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        voice.name.toLowerCase().includes(q) ||
        voice.subtitle.toLowerCase().includes(q) ||
        voice.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedAccent !== "All" && voice.accent !== selectedAccent) return false;
    if (selectedGender !== "All" && voice.gender !== selectedGender) return false;

    return true;
  });

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Search Bar & Language */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm giọng đọc..."
            className="pl-9 h-9 text-xs bg-background shadow-none"
          />
        </div>
        <div className="flex items-center gap-1.5 px-3 h-9 rounded-md border text-xs font-medium bg-muted/30 shrink-0">
          <span>🇻🇳</span>
          <span>Tiếng Việt</span>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 shrink-0 text-xs">
        <span className="text-muted-foreground shrink-0 text-[11px] font-medium">Bộ lọc:</span>
        <select
          value={selectedAccent}
          onChange={(e) => setSelectedAccent(e.target.value)}
          aria-label="Lọc theo Accent"
          className="h-7 px-2 text-xs rounded border bg-background text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">Tất cả Accent</option>
          <option value="Bắc">Miền Bắc</option>
          <option value="Nam">Miền Nam</option>
          <option value="Trung">Miền Trung</option>
        </select>

        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          aria-label="Lọc theo Giới tính"
          className="h-7 px-2 text-xs rounded border bg-background text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">Tất cả Giới tính</option>
          <option value="Nam">Giọng Nam</option>
          <option value="Nữ">Giọng Nữ</option>
        </select>
      </div>

      {/* 2 Tabs: Khám phá & Giọng của tôi */}
      <div className="flex border-b mb-3 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("explore")}
          className={`pb-2 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === "explore"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Khám phá
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("my-voices")}
          className={`pb-2 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === "my-voices"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Giọng của tôi
        </button>
      </div>

      {/* Voice list */}
      <div className="flex-1 min-h-0 border rounded-lg bg-card overflow-hidden">
        <ScrollArea className="h-full">
          <div className="divide-y divide-border/60">
            {filteredVoices.map((voice) => {
              const isSelected = selectedVoiceId === voice.id;
              const isPlaying = playingVoiceId === voice.id;

              return (
                <div
                  key={voice.id}
                  onClick={() => onSelectVoice(voice)}
                  className={`flex items-center justify-between p-3 transition-colors cursor-pointer group ${
                    isSelected
                      ? "bg-brand/10 dark:bg-brand/15"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {/* Left: Radio check + Avatar + Info */}
                  <div className="flex items-start gap-3 min-w-0 pr-3">
                    <div className="pt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-brand bg-brand text-brand-foreground"
                            : "border-muted-foreground/40 group-hover:border-foreground/60"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-brand-foreground" />}
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="w-10 h-10 rounded-full border border-brand/30 bg-brand/10 text-brand-strong dark:text-brand flex items-center justify-center text-sm font-bold shrink-0"
                    >
                      {getVoiceInitial(voice.name)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {voice.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                          — {voice.subtitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                        {voice.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Play icon ONLY [ ▶ ] */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handlePlayVoice(voice.id, e)}
                      title={isPlaying ? "Dừng" : "Nghe thử"}
                      className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                        isPlaying
                          ? "bg-brand text-brand-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {isPlaying ? (
                        <Square className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredVoices.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-xs">
                Không tìm thấy giọng đọc phù hợp.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
