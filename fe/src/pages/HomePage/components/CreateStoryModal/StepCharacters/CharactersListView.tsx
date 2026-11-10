import { useState } from "react";
import { Volume2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { demoAudio } from "../mockData";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";
import type { CharacterItem } from "../types";

interface CharactersListViewProps {
  characters: CharacterItem[];
  onSelectCharacter: (char: CharacterItem) => void;
  onDeleteCharacter: (id: string) => void;
  onAddCharacter: () => void;
}

export default function CharactersListView({
  characters,
  onSelectCharacter,
  onDeleteCharacter,
  onAddCharacter,
}: CharactersListViewProps) {
  const [playingCharId, setPlayingCharId] = useState<string | null>(null);

  const handlePlayVoice = (char: CharacterItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!char.voiceId) return;

    if (playingCharId === char.id) {
      setPlayingCharId(null);
      return;
    }

    setPlayingCharId(char.id);
    const pitch = char.name.toLowerCase().includes("thiên") || char.name.toLowerCase().includes("an") ? 640 : 390;
    demoAudio.playTone(pitch, () => {
      setPlayingCharId(null);
    });
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Danh sách nhân vật ({characters.length})
          </h3>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onAddCharacter}
          className="h-8 text-xs font-medium cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1 text-primary" />
          Thêm nhân vật
        </Button>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 border rounded-lg bg-card overflow-hidden">
        <ScrollArea className="h-full">
          <div className="divide-y divide-border/60">
            {characters.map((char) => {
              const hasVoice = Boolean(char.voiceId);
              const isPlaying = playingCharId === char.id;

              return (
                <div
                  key={char.id}
                  onClick={() => onSelectCharacter(char)}
                  className="flex items-center justify-between p-3.5 transition-colors cursor-pointer hover:bg-muted/50 group"
                >
                  {/* Left: Avatar + Tên nhân vật */}
                  <div className="flex items-center gap-3 min-w-0 pr-4 flex-1">
                    <div className="relative shrink-0">
                      <img
                        src={char.avatarUrl || PLACEHOLDER_IMAGE}
                        alt={char.name}
                        className="w-10 h-10 rounded-full border bg-muted/50 object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-foreground group-hover:text-brand-strong dark:group-hover:text-brand transition-colors">
                        {char.name}
                      </span>
                      {hasVoice ? (
                        <span className="text-[11px] text-muted-foreground font-medium">
                          ({char.voiceName})
                        </span>
                      ) : (
                        <span className="text-[11px] text-brand-strong dark:text-brand font-medium bg-brand/10 px-1.5 py-0.5 rounded border border-brand/20">
                          Chưa chọn giọng
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Speaker preview + Delete */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Speaker audio preview */}
                    <button
                      type="button"
                      disabled={!hasVoice}
                      onClick={(e) => handlePlayVoice(char, e)}
                      title={
                        hasVoice
                          ? isPlaying
                            ? "Đang phát..."
                            : `Nghe thử bằng giọng ${char.voiceName}`
                          : "Chưa chọn giọng"
                      }
                      className={`h-8 w-8 rounded-md flex items-center justify-center transition-all ${
                        hasVoice
                          ? isPlaying
                            ? "bg-brand text-brand-foreground shadow-xs cursor-pointer"
                            : "hover:bg-muted text-foreground cursor-pointer"
                          : "opacity-30 cursor-not-allowed text-muted-foreground"
                      }`}
                    >
                      <Volume2 className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
                    </button>

                    {/* Delete button */}
                    {!char.isNarrator && (
                      <button
                        type="button"
                        onClick={() => onDeleteCharacter(char.id)}
                        title="Xóa nhân vật"
                        className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
