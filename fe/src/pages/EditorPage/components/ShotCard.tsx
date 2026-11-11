import { Button } from "@/components/ui/button";
import { RefreshCw, Check } from "lucide-react";
import DialogueBlockCard from "./DialogueScript/DialogueBlockCard";
import {
  splitBlockWithLine,
  updateBlockCharacter,
  updateLineTextInBlocks,
  calculateShotTextAndDuration,
} from "./DialogueScript/dialogueSplitUtils";
import { generateWordTimestamps } from "@/mocks/mockShots";
import type { Shot, DialogueBlock, CharacterAsset } from "@/types/script";
import { cn } from "@/lib/utils";

interface ShotCardProps {
  shot: Shot;
  isSelected: boolean;
  isActive: boolean;
  hasAnySelection?: boolean;
  currentTime?: number;
  isPlaying?: boolean;
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
  hasAnySelection = false,
  currentTime,
  isPlaying,
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
      id={`shot-card-${shot.id}`}
      onClick={() => !isDisabled && onClick(shot.id)}
      className={cn(
        "group relative flex items-start gap-2 py-2 px-2 rounded-lg transition-all cursor-pointer",
        isDisabled && "opacity-40 pointer-events-none bg-muted/30",
        isSelected ? "bg-primary/[0.05]" : isActive ? "bg-brand/[0.04]" : "hover:bg-muted/30"
      )}
    >
      {/* 1. Vạch Active mép trái chuẩn Fliki (Discrete Indicator Pill) */}
      {isActive && !isSelected && (
        <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-brand" />
      )}

      {/* 2. Cột Lề Trái (Left Gutter): Hoán đổi tại chỗ giữa số cảnh và Checkbox (Zero Layout Shift) */}
      <div className="w-6 shrink-0 flex items-center justify-center pt-0.5 select-none">
        {isSelected || hasAnySelection ? (
          // Khi đang chọn hoặc danh sách có ít nhất 1 cảnh được chọn: Luôn hiện Checkbox tại đúng tâm
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(shot.id, !isSelected);
            }}
            className={cn(
              "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer",
              isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "border-muted-foreground/40 hover:border-primary bg-background"
            )}
            title={isSelected ? "Bỏ chọn phân cảnh" : "Chọn phân cảnh"}
          >
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </button>
        ) : (
          // Bình thường: Hiện số thứ tự cảnh (1), khi rê chuột vào card thì tự động chuyển thành Checkbox rỗng
          <div className="relative w-5 h-5 flex items-center justify-center">
            <span className="text-xs text-muted-foreground/70 font-semibold group-hover:opacity-0 transition-opacity">
              {shot.order || shot.code.replace(/\D/g, "") || "1"}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(shot.id, true);
              }}
              className="absolute inset-0 m-auto w-4 h-4 rounded border border-muted-foreground/40 hover:border-primary hover:bg-primary/10 bg-background opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              title="Chọn phân cảnh này"
            />
          </div>
        )}
      </div>

      {/* 3. Phần Thân Thoại Liền Mạch (Seamless Flow, không khung viền) */}
      <div className="flex-1 min-w-0 relative pr-6">
        {/* Nút [Chia lại] nổi ở góc trên bên phải khi Hover hoặc Active */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onResplitSingle(shot.id);
          }}
          className={cn(
            "absolute right-0 top-0 h-6 px-2 text-[11px] rounded-md gap-1 transition-all cursor-pointer z-10",
            "text-muted-foreground hover:text-brand-strong dark:hover:text-brand hover:bg-brand/10",
            isActive ? "opacity-90" : "opacity-0 group-hover:opacity-100"
          )}
          title="Chia lại phân cảnh này"
        >
          <RefreshCw className="w-3 h-3 text-brand" />
          <span>Chia lại</span>
        </Button>

        {/* Danh sách khối thoại và câu thoại */}
        <div className="space-y-1">
          {currentBlocks.map((block) => (
            <DialogueBlockCard
              key={block.id}
              block={block}
              characters={characters}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onChangeBlockCharacter={handleChangeBlockCharacter}
              onChangeLineCharacter={handleChangeLineCharacter}
              onLineTextChange={handleLineTextChange}
              onEditCharacter={onEditCharacter}
              onSeekWord={onSeekWord}
              onAddNewCharacter={onAddNewCharacter}
            />
          ))}
        </div>

        {/* Thời lượng góc dưới bên phải - Nằm gọn gàng ở góc dưới, không chiếm dòng riêng gây khoảng trống đáy */}
        <span className="absolute right-0 bottom-0 text-[11px] font-mono text-muted-foreground/50 group-hover:text-muted-foreground/80 select-none pointer-events-none transition-colors">
          {formatDuration(shot.duration)}
        </span>
      </div>
    </div>
  );
}
