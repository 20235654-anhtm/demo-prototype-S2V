import React, { useState, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search, Check, Pencil, Plus, User } from "lucide-react";
import type { CharacterAsset } from "@/types/script";

interface CharacterSelectPopoverProps {
  trigger: React.ReactNode;
  selectedCharacterId?: string;
  characters: CharacterAsset[];
  onSelectCharacter: (characterId: string) => void;
  onEditCharacter: (characterId: string) => void;
  onAddNewCharacter?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CharacterSelectPopover({
  trigger,
  selectedCharacterId,
  characters,
  onSelectCharacter,
  onEditCharacter,
  onAddNewCharacter,
  open,
  onOpenChange,
}: CharacterSelectPopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  const filteredCharacters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return characters;
    return characters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.voice?.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [characters, searchQuery]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger render={trigger as React.ReactElement} />
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="w-72 p-0 rounded-xl overflow-hidden shadow-xl border border-border bg-popover text-popover-foreground z-50 select-none animate-in fade-in-50 zoom-in-95 duration-100"
      >
        {/* 1. Ô tìm kiếm nhanh */}
        <div className="p-2 border-b border-border/80 bg-muted/20">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhân vật..."
              className="h-8 pl-8 pr-2 text-xs bg-background border-border/70 focus-visible:ring-1 focus-visible:ring-brand"
              autoFocus
            />
          </div>
        </div>

        {/* 2. Danh sách cuộn nhân vật (cuộn độc lập max-h-56) */}
        <div className="max-h-56 overflow-y-auto p-1 divide-y divide-border/30">
          {filteredCharacters.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Không tìm thấy nhân vật nào
            </div>
          ) : (
            filteredCharacters.map((char) => {
              const isSelected = char.id === selectedCharacterId;
              return (
                <div
                  key={char.id}
                  onClick={() => {
                    onSelectCharacter(char.id);
                    setIsOpen(false);
                  }}
                  className={`group/row flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-brand/10 text-brand-strong dark:text-brand font-medium"
                      : "hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {/* Trái: Avatar + Tên + Giọng */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-muted border border-border/60 shrink-0 flex items-center justify-center">
                      {char.avatar ? (
                        <img
                          src={char.avatar}
                          alt={char.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-xs leading-tight">
                        {char.name}
                      </div>
                      <div className="truncate text-[10px] text-muted-foreground leading-tight">
                        {char.voice?.name || "Chưa gán giọng"}
                      </div>
                    </div>
                  </div>

                  {/* Phải: Tick chọn + Nút sửa [✏] */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-brand stroke-[2.5]" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        onEditCharacter(char.id);
                      }}
                      className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title={`Xem & chỉnh sửa cấu hình nhân vật ${char.name}`}
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 3. Ghim cố định ở đáy: Nút thêm nhân vật */}
        <div className="p-1.5 border-t border-border/80 bg-muted/30 sticky bottom-0">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              if (onAddNewCharacter) {
                onAddNewCharacter();
              } else {
                onEditCharacter("new");
              }
            }}
            className="w-full py-1.5 px-2.5 rounded-lg text-xs font-medium text-brand-strong dark:text-brand hover:bg-brand/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm nhân vật mới</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
