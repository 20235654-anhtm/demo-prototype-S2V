import { useState, useRef, useEffect, Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Sparkles,
} from "lucide-react";
import ShotCard from "./ShotCard";
import ScriptSelectionToolbar from "./Resplit/ScriptSelectionToolbar";
import DiffPreview from "./Resplit/DiffPreview";
import ResplitPopover from "./Resplit/ResplitPopover";
import type { Shot, DiffProposal, DialogueBlock, CharacterAsset } from "@/types/script";
import { mockCharacters } from "@/mocks/mockCharacters";

interface ScriptPanelProps {
  width?: number;
  shots: Shot[];
  activeShotId: string | null;
  selectedShotIds: string[];
  characters?: CharacterAsset[];
  onSelectShot: (id: string) => void;
  onToggleSelectShot: (id: string, selected: boolean) => void;
  onClearSelection: () => void;
  onTextChange?: (id: string, text: string) => void;
  onShotUpdate?: (
    shotId: string,
    updated: { blocks: DialogueBlock[]; text: string; duration: number }
  ) => void;
  onToggleLock: (id: string) => void;
  onOpenResplitModal: () => void;
  onRequestResplitScoped: (
    targetShotIds: string[],
    prompt: string,
    mode: "merge_resplit" | "split_each"
  ) => void;
  proposal: DiffProposal | null;
  onApplyProposal: () => void;
  onCancelProposal: () => void;
  onMergeShots: () => void;
  onEditCharacter?: (characterId: string) => void;
  onSeekWord?: (timeSec: number) => void;
  onAddNewCharacter?: () => void;
  currentTime?: number;
  isPlaying?: boolean;
}

export default function ScriptPanel({
  width,
  shots,
  activeShotId,
  selectedShotIds,
  characters = mockCharacters,
  onSelectShot,
  onToggleSelectShot,
  onClearSelection,
  onTextChange,
  onShotUpdate,
  onToggleLock,
  onOpenResplitModal,
  onRequestResplitScoped,
  proposal,
  onApplyProposal,
  onCancelProposal,
  onMergeShots,
  onEditCharacter = () => {},
  onSeekWord,
  onAddNewCharacter,
  currentTime,
  isPlaying,
}: ScriptPanelProps) {
  // Quản lý việc mở ResplitPopover cho 1 hoặc nhiều phân cảnh cụ thể
  const [resplitTargetShotIds, setResplitTargetShotIds] = useState<string[] | null>(null);

  const targetShotsForPopover = resplitTargetShotIds
    ? shots.filter((s) => resplitTargetShotIds.includes(s.id))
    : [];

  // Xác định id của cảnh đầu tiên trong nhóm cần chia lại (để hiển thị Popover ngay trước cảnh đó)
  const firstResplitTargetId = resplitTargetShotIds && resplitTargetShotIds.length > 0
    ? shots.find((s) => resplitTargetShotIds.includes(s.id))?.id
    : null;

  // Xác định id của cảnh đầu tiên trong nhóm đang duyệt Diff (để hiển thị DiffPreview thay thế ngay tại vị trí đó)
  const firstDiffTargetId = proposal && proposal.targetShotIds.length > 0
    ? shots.find((s) => proposal.targetShotIds.includes(s.id))?.id
    : null;

  const popoverRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn đến Popover khi mở
  useEffect(() => {
    if (resplitTargetShotIds && resplitTargetShotIds.length > 0) {
      setTimeout(() => {
        popoverRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }
  }, [resplitTargetShotIds]);

  // Tự động cuộn đến DiffPreview khi có proposal
  useEffect(() => {
    if (proposal) {
      setTimeout(() => {
        diffRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  }, [proposal]);

  // Kiểm tra các phân cảnh được chọn có liền kề nhau không (để cho phép gộp)
  const isAdjacent = (() => {
    if (selectedShotIds.length <= 1) return true;
    const selectedIndices = selectedShotIds
      .map((id) => shots.findIndex((s) => s.id === id))
      .filter((idx) => idx !== -1)
      .sort((a, b) => a - b);

    for (let i = 0; i < selectedIndices.length - 1; i++) {
      if (selectedIndices[i + 1] !== selectedIndices[i] + 1) return false;
    }
    return true;
  })();

  const oldShotsUnderDiff = proposal
    ? shots.filter((s) => proposal.targetShotIds.includes(s.id))
    : [];

  return (
    <div
      style={width ? { width: `${width}px`, flexBasis: `${width}px` } : undefined}
      className="w-[450px] lg:w-[490px] xl:w-[520px] border-r flex flex-col h-full bg-white dark:bg-neutral-900 shrink-0 select-none relative"
    >
      {/* 1. Header ScriptPanel */}
      <div className="h-10 px-3.5 border-b flex items-center justify-between shrink-0 bg-muted/20">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-semibold text-xs">Kịch bản phân cảnh</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
            {shots.length} cảnh
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {/* Nút chia lại toàn bộ */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenResplitModal}
            className="h-6 px-2 text-[11px] font-medium text-brand-strong dark:text-brand hover:bg-brand/10 dark:hover:bg-brand/15 cursor-pointer gap-1"
            title="Mở gợi ý chia lại toàn bộ kịch bản"
          >
            <Sparkles className="w-3 h-3" />
            <span>Chia lại tất cả</span>
          </Button>
        </div>
      </div>

      {/* 2. Body: Cuộn danh sách phân cảnh */}
      <ScrollArea className="flex-1 min-h-0 px-2 py-2">
        {/* Thanh công cụ khi tick chọn phân cảnh */}
        <ScriptSelectionToolbar
          selectedCount={selectedShotIds.length}
          isAdjacent={isAdjacent}
          onOpenResplit={() => setResplitTargetShotIds(selectedShotIds)}
          onMerge={onMergeShots}
          onClearSelection={() => {
            onClearSelection();
            setResplitTargetShotIds(null);
          }}
        />

        {/* Danh sách các ShotCard kèm Popover và DiffPreview hiển thị Inline đúng vị trí cảnh */}
        <div className="space-y-1.5">
          {shots.map((shot) => {
            const isFirstDiffTarget = proposal && shot.id === firstDiffTargetId;
            const isUnderDiff = proposal?.targetShotIds.includes(shot.id);
            const isFirstResplitTarget =
              resplitTargetShotIds &&
              targetShotsForPopover.length > 0 &&
              shot.id === firstResplitTargetId;

            return (
              <Fragment key={shot.id}>
                {/* 1. Nếu đây là vị trí bắt đầu của Diff Preview, hiển thị DiffPreview inline thay thế trực tiếp */}
                {isFirstDiffTarget && (
                  <div ref={diffRef} className="animate-in fade-in duration-200">
                    <DiffPreview
                      proposal={proposal}
                      oldShots={oldShotsUnderDiff}
                      onApply={onApplyProposal}
                      onCancel={onCancelProposal}
                    />
                  </div>
                )}

                {/* 2. Nếu cảnh nằm trong nhóm đang duyệt Diff thì ẩn đi vì đã nằm trong DiffPreview */}
                {!isUnderDiff && (
                  <>
                    {/* Hiển thị ResplitPopover ngay trước cảnh đầu tiên trong nhóm được chọn chia lại */}
                    {isFirstResplitTarget && (
                      <div ref={popoverRef} className="animate-in fade-in slide-in-from-top-2 duration-150">
                        <ResplitPopover
                          isOpen={true}
                          onClose={() => setResplitTargetShotIds(null)}
                          targetShots={targetShotsForPopover}
                          onSubmit={(prompt, mode) => {
                            onRequestResplitScoped(resplitTargetShotIds, prompt, mode);
                            setResplitTargetShotIds(null);
                          }}
                        />
                      </div>
                    )}

                    <ShotCard
                      shot={shot}
                      isSelected={selectedShotIds.includes(shot.id)}
                      hasAnySelection={selectedShotIds.length > 0}
                      isActive={shot.id === activeShotId}
                      currentTime={currentTime}
                      characters={characters}
                      onSelect={(id, checked) => onToggleSelectShot(id, checked)}
                      onClick={(id) => onSelectShot(id)}
                      onShotUpdate={(shotId, updated) => {
                        if (onShotUpdate) {
                          onShotUpdate(shotId, updated);
                        } else if (onTextChange) {
                          onTextChange(shotId, updated.text);
                        }
                      }}
                      onToggleLock={onToggleLock}
                      onResplitSingle={(shotId) => setResplitTargetShotIds([shotId])}
                      onEditCharacter={onEditCharacter}
                      onSeekWord={onSeekWord}
                      onAddNewCharacter={onAddNewCharacter}
                      isPlaying={isPlaying}
                    />
                  </>
                )}
              </Fragment>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
