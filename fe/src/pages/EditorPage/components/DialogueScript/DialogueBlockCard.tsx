import CharacterSelectPopover from "./CharacterSelectPopover";
import DialogueLineItem from "./DialogueLineItem";
import { ChevronDown, User } from "lucide-react";
import type { DialogueBlock, CharacterAsset } from "@/types/script";

interface DialogueBlockCardProps {
  block: DialogueBlock;
  characters: CharacterAsset[];
  onChangeBlockCharacter: (blockId: string, newCharacterId: string) => void;
  onChangeLineCharacter: (lineId: string, newCharacterId: string) => void;
  onLineTextChange: (lineId: string, newText: string) => void;
  onEditCharacter: (characterId: string) => void;
  onSeekWord?: (timeSec: number) => void;
  onAddNewCharacter?: () => void;
  currentTime?: number;
  isPlaying?: boolean;
}

export default function DialogueBlockCard({
  block,
  characters,
  onChangeBlockCharacter,
  onChangeLineCharacter,
  onLineTextChange,
  onEditCharacter,
  onSeekWord,
  onAddNewCharacter,
  currentTime,
  isPlaying,
}: DialogueBlockCardProps) {
  const currentCharacter = characters.find((c) => c.id === block.characterId);

  return (
    <div className="space-y-0.5">
      {/* 1. Header đại diện nhân vật: Avatar nằm chuẩn xác tại x = 0 (w-5 h-5, tâm tại 10px) */}
      <div className="flex items-center gap-2 select-none">
        <CharacterSelectPopover
          trigger={
            <button
              type="button"
              className="group/btn inline-flex items-center gap-1.5 py-0.5 rounded-md hover:bg-muted/80 transition-colors cursor-pointer text-left"
              title="Đổi nhân vật đọc cho toàn bộ khối này"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-muted border border-border/80 shrink-0 flex items-center justify-center">
                {currentCharacter?.avatar ? (
                  <img
                    src={currentCharacter.avatar}
                    alt={currentCharacter.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-2.5 h-2.5 text-muted-foreground" />
                )}
              </div>
              <span className="font-semibold text-xs text-foreground/90 group-hover/btn:text-brand-strong dark:group-hover/btn:text-brand transition-colors">
                {currentCharacter?.name || "Người dẫn chuyện"}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground group-hover/btn:text-foreground transition-colors" />
            </button>
          }
          selectedCharacterId={block.characterId}
          characters={characters}
          onSelectCharacter={(newCharId) => onChangeBlockCharacter(block.id, newCharId)}
          onEditCharacter={onEditCharacter}
          onAddNewCharacter={onAddNewCharacter}
        />
      </div>

      {/* 2. Đường gióng dẫn hướng dọc & Danh sách câu thoại:
             BỎ pl-7 để avatar hover của line và avatar header cùng nằm trên 1 trục dọc thẳng tắp x = 0 */}
      <div className="relative space-y-0.5">
        <div className="absolute top-0 bottom-1 left-[9px] w-0.5 bg-slate-200 dark:bg-slate-800 pointer-events-none" />

        {block.lines.map((line) => (
          <DialogueLineItem
            key={line.id}
            line={line}
            character={currentCharacter}
            characters={characters}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onSeekWord={onSeekWord}
            onLineTextChange={onLineTextChange}
            onChangeLineCharacter={(lineId, newCharId) =>
              onChangeLineCharacter(lineId, newCharId)
            }
            onEditCharacter={onEditCharacter}
            onAddNewCharacter={onAddNewCharacter}
          />
        ))}
      </div>
    </div>
  );
}
