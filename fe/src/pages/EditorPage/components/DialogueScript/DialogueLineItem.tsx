import { useState, useRef, useEffect } from "react";
import CharacterSelectPopover from "./CharacterSelectPopover";
import { User } from "lucide-react";
import type { DialogueLine, CharacterAsset } from "@/types/script";

interface DialogueLineItemProps {
  line: DialogueLine;
  character?: CharacterAsset;
  characters: CharacterAsset[];
  isActive?: boolean;
  onSeekWord?: (timeSec: number) => void;
  onLineTextChange: (lineId: string, newText: string) => void;
  onChangeLineCharacter: (lineId: string, newCharacterId: string) => void;
  onEditCharacter: (characterId: string) => void;
  onAddNewCharacter?: () => void;
}

export default function DialogueLineItem({
  line,
  character,
  characters,
  isActive = false,
  onSeekWord,
  onLineTextChange,
  onChangeLineCharacter,
  onEditCharacter,
  onAddNewCharacter,
}: DialogueLineItemProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Tự động dãn chiều cao theo nội dung text, không cuộn trong
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [line.text]);

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    // Caret Word Seek: Xác định từ tại vị trí con trỏ chuột khi nhấp vào
    if (onSeekWord && line.words && line.words.length > 0) {
      const charPos = e.currentTarget.selectionStart || 0;
      let cumulativeLength = 0;

      for (const w of line.words) {
        const wordLen = w.word.length;
        if (charPos >= cumulativeLength && charPos <= cumulativeLength + wordLen + 1) {
          e.stopPropagation();
          onSeekWord(w.start);
          return;
        }
        cumulativeLength += wordLen + 1; // +1 cho dấu cách
      }
    }
  };

  return (
    <div
      className={`group/line relative flex items-start transition-colors rounded -ml-7 pl-7 py-0.5 min-h-[24px] ${
        isPopoverOpen
          ? "bg-amber-50/80 dark:bg-amber-950/40 rounded px-1 -mx-1"
          : isActive
          ? "bg-brand/5 rounded px-1 -mx-1"
          : "hover:bg-muted/30 rounded px-1 -mx-1"
      }`}
    >
      {/* 1. Nút Avatar nhỏ hover: Nằm ở vị trí tuyệt đối x = 0 (w-5 h-5), tâm tại 10px, 
             TRÙNG KHỚP TUYỆT ĐỐI VỚI AVATAR HEADER VÀ ĐƯỜNG GIÓNG DỌC */}
      <div className="absolute left-0 top-0.5 w-5 h-5 flex items-center justify-center z-10">
        <CharacterSelectPopover
          trigger={
            <button
              type="button"
              className={`w-5 h-5 rounded-full border shadow-xs overflow-hidden flex items-center justify-center transition-all cursor-pointer bg-background ${
                isPopoverOpen
                  ? "opacity-100 ring-2 ring-amber-400 border-amber-400 scale-105"
                  : "opacity-0 group-hover/line:opacity-100 border-border hover:border-brand hover:scale-105"
              }`}
              title="Đổi nhân vật đọc câu này (tự động tách khối)"
            >
              {character?.avatar ? (
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-2.5 h-2.5 text-muted-foreground" />
              )}
            </button>
          }
          selectedCharacterId={character?.id}
          characters={characters}
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          onSelectCharacter={(newCharId) => {
            onChangeLineCharacter(line.id, newCharId);
            setIsPopoverOpen(false);
          }}
          onEditCharacter={onEditCharacter}
          onAddNewCharacter={onAddNewCharacter}
        />
      </div>

      {/* 2. Thân câu thoại: Chỉnh sửa trực tiếp không cần nút bấm, không hiện khung hộp */}
      <div className="flex-1 min-w-0">
        <textarea
          ref={textareaRef}
          value={line.text}
          onChange={(e) => {
            onLineTextChange(line.id, e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onClick={handleTextareaClick}
          rows={1}
          className="w-full text-xs text-foreground/90 bg-transparent resize-none outline-none border-none focus:outline-none focus:ring-0 leading-relaxed font-sans overflow-hidden block p-0 cursor-text"
          placeholder="Nhập lời thoại..."
        />
      </div>
    </div>
  );
}
