import { useState, useRef, useEffect } from "react";
import CharacterSelectPopover from "./CharacterSelectPopover";
import { User } from "lucide-react";
import type { DialogueLine, CharacterAsset } from "@/types/script";
import { cn } from "@/lib/utils";

interface DialogueLineItemProps {
  line: DialogueLine;
  character?: CharacterAsset;
  characters: CharacterAsset[];
  isActive?: boolean;
  currentTime?: number;
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
  currentTime,
  onSeekWord,
  onLineTextChange,
  onChangeLineCharacter,
  onEditCharacter,
  onAddNewCharacter,
}: DialogueLineItemProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(line.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditText(line.text);
  }, [line.text]);

  // Tự động dãn chiều cao theo nội dung text khi đang edit
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, editText]);

  const handleFinishEdit = () => {
    if (editText.trim() !== line.text.trim()) {
      onLineTextChange(line.id, editText);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "group/line relative flex items-start gap-2 py-0.5 rounded transition-colors",
        isPopoverOpen && "bg-amber-50/80 dark:bg-amber-950/40",
        isActive && "bg-brand/5"
      )}
    >
      {/* 1. Nút Avatar nhỏ hover: Nằm ở vị trí x = 0 (w-5 h-5), tâm tại 10px, 
             TRÙNG KHỚP TUYỆT ĐỐI 100% VỚI AVATAR HEADER VÀ ĐƯỜNG GIÓNG DỌC */}
      <div className="w-5 h-5 shrink-0 flex items-center justify-center relative z-10 mt-0.5">
        <CharacterSelectPopover
          trigger={
            <button
              type="button"
              className={cn(
                "w-5 h-5 rounded-full border shadow-xs overflow-hidden flex items-center justify-center transition-all cursor-pointer bg-background",
                isPopoverOpen
                  ? "opacity-100 ring-2 ring-amber-400 border-amber-400 scale-105"
                  : "opacity-0 group-hover/line:opacity-100 border-border hover:border-brand hover:scale-105"
              )}
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

      {/* 2. Thân câu thoại: Chữ to rõ ràng (text-sm leading-relaxed), tận dụng tối đa chiều rộng */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editText}
            autoFocus
            onChange={(e) => {
              setEditText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onBlur={handleFinishEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleFinishEdit();
              } else if (e.key === "Escape") {
                setEditText(line.text);
                setIsEditing(false);
              }
            }}
            rows={1}
            className="w-full text-sm leading-relaxed text-foreground bg-transparent resize-none outline-none border-b border-primary/40 focus:border-primary font-sans overflow-hidden block p-0 cursor-text"
            placeholder="Nhập lời thoại..."
          />
        ) : (
          <div
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="text-sm leading-relaxed text-foreground/90 font-sans py-0.5 cursor-text select-text"
            title="Nhấp đúp chuột để chỉnh sửa câu thoại"
          >
            {line.words && line.words.length > 0 ? (
              line.words.map((w, idx) => {
                const isKaraokeActive =
                  currentTime !== undefined &&
                  currentTime >= w.start &&
                  currentTime < w.end;

                return (
                  <span
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeekWord?.(w.start);
                    }}
                    className={cn(
                      "cursor-pointer transition-colors rounded px-0.5 inline-block",
                      isKaraokeActive
                        ? "bg-brand/25 text-brand-strong dark:text-brand font-semibold shadow-2xs"
                        : "hover:text-brand-strong dark:hover:text-brand hover:bg-muted/40"
                    )}
                  >
                    {w.word}{" "}
                  </span>
                );
              })
            ) : (
              <span>{line.text}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
