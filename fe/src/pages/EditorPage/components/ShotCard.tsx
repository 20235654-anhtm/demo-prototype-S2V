import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles, Check } from "lucide-react";
import DialogueBlockCard from "./DialogueScript/DialogueBlockCard";
import {
  splitBlockWithLine,
  updateBlockCharacter,
  updateLineTextInBlocks,
  calculateShotTextAndDuration,
} from "./DialogueScript/dialogueSplitUtils";
import { generateWordTimestamps } from "@/mocks/mockShots";
import type { Shot, DialogueBlock, CharacterAsset } from "@/types/script";

interface ShotCardProps {
  shot: Shot;
  isSelected: boolean;
  isActive: boolean;
  isDisabled?: boolean;
  characters: CharacterAsset[];
  onSelect: (id: string, selected: boolean) => void;
  onClick: (id: string) => void;
  onShotUpdate: (
    shotId: string,
    updated: { blocks: DialogueBlock[]; text: string; duration: number }
  ) => void;
  onToggleLock?: (id: string) => void;
  onResplitSingle: (id: string) => void;
  onEditCharacter: (characterId: string) => void;
  onSeekWord?: (timeSec: number) => void;
  onAddNewCharacter?: () => void;
}

export default function ShotCard({
  shot,
  isSelected,
  isActive,
  isDisabled = false,
  characters,
  onSelect,
  onClick,
  onShotUpdate,
  onResplitSingle,
  onEditCharacter,
  onSeekWord,
  onAddNewCharacter,
}: ShotCardProps) {
  const formatDuration = (sec: number) => {
    const rounded = Number.isInteger(sec) ? sec : Number(sec.toFixed(1));
    return `${rounded}s`;
  };

  // Đảm bảo shot luôn có ít nhất 1 block hợp lệ
  const currentBlocks: DialogueBlock[] =
    shot.blocks && shot.blocks.length > 0
      ? shot.blocks
      : [
          {
            id: `block-${shot.id}-default`,
            shotId: shot.id,
            characterId: "char-narrator",
            status: "ready",
            totalDuration: shot.duration,
            lines: [
              {
                id: `line-${shot.id}-default`,
                text: shot.text,
                duration: shot.duration,
                words: generateWordTimestamps(shot.text, 0, shot.duration),
              },
            ],
          },
        ];

  const handleApplyBlocksChange = (nextBlocks: DialogueBlock[]) => {
    const { text, duration } = calculateShotTextAndDuration(nextBlocks);
    onShotUpdate(shot.id, {
      blocks: nextBlocks,
      text,
      duration,
    });
  };

  const handleChangeBlockCharacter = (blockId: string, newCharacterId: string) => {
    const nextBlocks = updateBlockCharacter(currentBlocks, blockId, newCharacterId);
    handleApplyBlocksChange(nextBlocks);
  };

  const handleChangeLineCharacter = (lineId: string, newCharacterId: string) => {
    const targetBlock = currentBlocks.find((b) =>
      b.lines.some((l) => l.id === lineId)
    );
    if (!targetBlock) return;

    const nextBlocks = splitBlockWithLine(
      currentBlocks,
      targetBlock.id,
      lineId,
      newCharacterId,
      shot.id
    );
    handleApplyBlocksChange(nextBlocks);
  };

  const handleLineTextChange = (lineId: string, newText: string) => {
    const nextBlocks = updateLineTextInBlocks(currentBlocks, lineId, newText);
    handleApplyBlocksChange(nextBlocks);
  };

  return (
    <div
      onClick={() => !isDisabled && onClick(shot.id)}
      className={`group relative rounded-xl border transition-all cursor-pointer overflow-hidden ${
        isDisabled
          ? "opacity-40 pointer-events-none bg-muted/30"
          : isSelected
          ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
          : isActive
          ? "border-brand bg-brand/5 shadow-xs ring-2 ring-brand/30"
          : "border-border bg-card hover:border-border/80 hover:shadow-xs"
      }`}
    >
      {/* 1. Header row chạy toàn bộ chiều ngang card từ mép này sang mép kia (Edge-to-edge divider) */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/70 select-none bg-muted/15">
        <div className="flex items-center gap-2">
          {/* Custom Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(shot.id, !isSelected);
            }}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "border-muted-foreground/40 hover:border-primary bg-background"
            }`}
          >
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          <Badge
            variant="outline"
            className="font-semibold text-xs text-foreground bg-muted/40 px-2 py-0.5"
          >
            {shot.code}
          </Badge>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <Clock className="w-3 h-3 text-muted-foreground/70" />
            <span>{formatDuration(shot.duration)}</span>
          </div>
        </div>

        {/* Quick Resplit ✦ button on card */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onResplitSingle(shot.id);
          }}
          className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-brand-strong dark:hover:text-brand hover:bg-brand/10 cursor-pointer opacity-75 group-hover:opacity-100"
          title="Chia lại cảnh này"
        >
          <Sparkles className="w-3 h-3 mr-1 text-brand" />
          <span>Chia lại</span>
        </Button>
      </div>

      {/* 2. Thân phân cảnh: Toàn bộ chiều ngang dành cho lời đọc & nhân vật */}
      <div className="p-3.5 pt-2.5 space-y-2">
        {currentBlocks.map((block) => (
          <DialogueBlockCard
            key={block.id}
            block={block}
            characters={characters}
            onChangeBlockCharacter={handleChangeBlockCharacter}
            onChangeLineCharacter={handleChangeLineCharacter}
            onLineTextChange={handleLineTextChange}
            onEditCharacter={onEditCharacter}
            onSeekWord={onSeekWord}
            onAddNewCharacter={onAddNewCharacter}
          />
        ))}
      </div>
    </div>
  );
}
