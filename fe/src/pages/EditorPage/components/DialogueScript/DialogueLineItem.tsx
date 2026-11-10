import { useState, useRef, useEffect } from "react";
import CharacterSelectPopover from "./CharacterSelectPopover";
import { User } from "lucide-react";
import type { DialogueLine, CharacterAsset, WordTimestamp } from "@/types/script";
import { cn } from "@/lib/utils";

interface DialogueLineItemProps {
  line: DialogueLine;
  character?: CharacterAsset;
  characters: CharacterAsset[];
  isActive?: boolean;
  isPlaying?: boolean;
  currentTime?: number;
  onSeekWord?: (timeSec: number) => void;
  onLineTextChange: (lineId: string, newText: string) => void;
  onChangeLineCharacter: (lineId: string, newCharacterId: string) => void;
  onEditCharacter: (characterId: string) => void;
  onAddNewCharacter?: () => void;
}

// Tìm từ trong danh sách tương ứng với vị trí con trỏ ký tự (charIndex)
function findWordAtCharIndex(
  text: string,
  words: WordTimestamp[],
  charIndex: number
): WordTimestamp | undefined {
  if (!words || words.length === 0) return undefined;

  let searchPos = 0;
  let closestWord: WordTimestamp | undefined = undefined;
  let minDiff = Infinity;

  for (const w of words) {
    const wordStart = text.indexOf(w.word, searchPos);
    if (wordStart !== -1) {
      const wordEnd = wordStart + w.word.length;
      searchPos = wordEnd;

      // Nếu con trỏ nằm trúng trong từ này hoặc liền kề ngay sau từ
      if (charIndex >= wordStart && charIndex <= wordEnd + 1) {
        return w;
      }

      const diff = Math.abs(charIndex - wordStart);
      if (diff < minDiff) {
        minDiff = diff;
        closestWord = w;
      }
    }
  }

  return closestWord || words[0];
}

export default function DialogueLineItem({
  line,
  character,
  characters,
  isActive = false,
  isPlaying = false,
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

  // Tự động dãn chiều cao theo nội dung text khi đang có con trỏ edit
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, editText]);

  // Khi bắt đầu nghe thử (isPlaying = true), tự động lưu và thoát chế độ sửa để hiển thị Karaoke
  useEffect(() => {
    if (isPlaying && isEditing) {
      handleFinishEdit();
    }
  }, [isPlaying]);

  const handleFinishEdit = () => {
    if (editText.trim() !== line.text.trim()) {
      onLineTextChange(line.id, editText);
    }
    setIsEditing(false);
  };

  // Tính toán trước vị trí ký tự bắt đầu của từng từ trong câu
  const wordRanges: { word: WordTimestamp; charIndex: number }[] = [];
  let searchPos = 0;
  if (line.words) {
    for (const w of line.words) {
      const found = line.text.indexOf(w.word, searchPos);
      const startIdx = found !== -1 ? found : searchPos;
      wordRanges.push({ word: w, charIndex: startIdx });
      searchPos = startIdx + w.word.length;
    }
  }

  // Khi click vào 1 từ: Vừa di chuyển timeline tới từ đó, vừa hiện con trỏ caret tại chữ đó
  const handleWordClick = (w: WordTimestamp, charIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // 1. Điều khiển timeline đến chữ đó
    onSeekWord?.(w.start);

    // 2. Click 1 lần là có con trỏ caret ngay tại vị trí chữ đó
    setIsEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(charIndex, charIndex);
      }
    }, 0);
  };

  // Khi click vào vùng trống của dòng thoại: Hiện caret ở cuối câu
  const handleLineClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const len = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(len, len);
        if (line.words && line.words.length > 0) {
          const lastWord = line.words[line.words.length - 1];
          onSeekWord?.(lastWord.start);
        }
      }
    }, 0);
  };

  // Khi di chuyển con trỏ caret bên trong textarea (click hoặc phím mũi tên) -> Điều khiển timeline theo caret
  const handleTextareaSeek = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const caretPos = target.selectionStart;
    const w = findWordAtCharIndex(editText, line.words || [], caretPos);
    if (w) {
      onSeekWord?.(w.start);
    }
  };

  return (
    <div
      className={cn(
        "group/line relative flex items-start gap-2 py-0.5 rounded transition-colors",
        isPopoverOpen && "bg-amber-50/80 dark:bg-amber-950/40",
        isActive && "bg-brand/5"
      )}
    >
      {/* 1. Nút Avatar nhỏ hover: Nằm ở vị trí x = 0 (w-5 h-5), tâm tại 10px */}
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

      {/* 2. Thân câu thoại: 
             - Click 1 lần là hiện caret ngay tại chữ đó
             - Tuyệt đối không có khung, không có gạch chân (border-none outline-none)
             - Highlight Karaoke CHỈ chạy khi đang nghe thử (isPlaying = true)
      */}
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
            onClick={handleTextareaSeek}
            onKeyUp={(e) => {
              if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
                handleTextareaSeek(e);
              }
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
            className="w-full text-sm leading-relaxed text-foreground bg-transparent resize-none border-none outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-none font-sans overflow-hidden block py-0.5 px-0 cursor-text select-text"
            placeholder="Nhập lời thoại..."
          />
        ) : (
          <div
            onClick={handleLineClick}
            className="text-sm leading-relaxed text-foreground/90 font-sans py-0.5 cursor-text select-text"
            title="Nhấp chuột để đặt con trỏ và chỉnh sửa câu thoại"
          >
            {line.words && line.words.length > 0 ? (
              wordRanges.map(({ word: w, charIndex }, idx) => {
                // Highlight Karaoke CHỈ hiển thị khi người dùng đang bấm nghe thử (isPlaying = true)
                const isKaraokeActive =
                  isPlaying &&
                  currentTime !== undefined &&
                  currentTime >= w.start &&
                  currentTime < w.end;

                return (
                  <span
                    key={idx}
                    onClick={(e) => handleWordClick(w, charIndex, e)}
                    className={cn(
                      "cursor-text transition-colors rounded px-0.5 inline-block",
                      isKaraokeActive &&
                        "bg-brand/25 text-brand-strong dark:text-brand font-semibold shadow-2xs"
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
