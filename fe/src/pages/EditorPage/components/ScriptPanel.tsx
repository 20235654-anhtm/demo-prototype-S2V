import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Pin,
  PinOff,
  X,
  Sparkles,
} from "lucide-react";
import ShotCard from "./ShotCard";
import ScriptSelectionToolbar from "./ScriptSelectionToolbar";
import DiffPreview from "./DiffPreview";
import type { Shot, DiffProposal } from "@/types/script";

interface ScriptPanelProps {
  isPinned: boolean;
  onTogglePin?: () => void;
  onClose: () => void;
  shots: Shot[];
  activeShotId: string | null;
  selectedShotIds: string[];
  onSelectShot: (id: string) => void;
  onToggleSelectShot: (id: string, selected: boolean) => void;
  onClearSelection: () => void;
  onTextChange: (id: string, text: string) => void;
  onToggleLock: (id: string) => void;
  onOpenResplitModal: () => void;
  proposal: DiffProposal | null;
  onApplyProposal: () => void;
  onCancelProposal: () => void;
  onMergeShots: () => void;
}

export default function ScriptPanel({
  isPinned,
  onTogglePin,
  onClose,
  shots,
  activeShotId,
  selectedShotIds,
  onSelectShot,
  onToggleSelectShot,
  onClearSelection,
  onTextChange,
  onToggleLock,
  onOpenResplitModal,
  proposal,
  onApplyProposal,
  onCancelProposal,
  onMergeShots,
}: ScriptPanelProps) {
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
    <div className="w-96 lg:w-[420px] border-r flex flex-col h-full bg-white dark:bg-neutral-900 shrink-0 select-none">
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
            className="h-6 px-2 text-[11px] font-medium text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/40 cursor-pointer gap-1"
            title="Mở gợi ý chia lại toàn bộ kịch bản"
          >
            <Sparkles className="w-3 h-3" />
            <span>Chia lại tất cả</span>
          </Button>

          <div className="h-3 w-[1px] bg-border mx-0.5" />

          {/* Nút Pin / Unpin kịch bản sang Cột Trái */}
          {onTogglePin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePin}
              className={`h-6 w-6 rounded-md hover:bg-muted cursor-pointer ${
                isPinned ? "text-primary hover:text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              title={
                isPinned
                  ? "Bỏ ghim (chuyển sang Panel Phải)"
                  : "Ghim kịch bản cố định sang Cột Trái (Pin)"
              }
            >
              {isPinned ? (
                <PinOff className="w-3.5 h-3.5" />
              ) : (
                <Pin className="w-3.5 h-3.5" />
              )}
            </Button>
          )}

          {/* Nút Đóng */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            title="Đóng kịch bản"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 2. Body: Cuộn danh sách phân cảnh */}
      <ScrollArea className="flex-1 min-h-0 p-3">
        {/* Thanh công cụ khi tick chọn phân cảnh */}
        <ScriptSelectionToolbar
          selectedCount={selectedShotIds.length}
          isAdjacent={isAdjacent}
          onOpenResplit={onOpenResplitModal}
          onMerge={onMergeShots}
          onClearSelection={onClearSelection}
        />

        {/* Khung xem trước Diff Proposal khi chia lại */}
        {proposal && (
          <div className="mb-3">
            <DiffPreview
              proposal={proposal}
              oldShots={oldShotsUnderDiff}
              onApply={onApplyProposal}
              onCancel={onCancelProposal}
            />
          </div>
        )}

        {/* Danh sách các ShotCard */}
        <div className="space-y-2.5">
          {shots.map((shot) => {
            const isUnderDiff = proposal?.targetShotIds.includes(shot.id);
            if (isUnderDiff) return null; // Ẩn cảnh cũ trong list vì đã hiển thị trong DiffPreview

            return (
              <ShotCard
                key={shot.id}
                shot={shot}
                isSelected={selectedShotIds.includes(shot.id)}
                isActive={shot.id === activeShotId}
                onSelect={(id, checked) => onToggleSelectShot(id, checked)}
                onClick={(id) => onSelectShot(id)}
                onTextChange={onTextChange}
                onToggleLock={onToggleLock}
                onResplitSingle={onOpenResplitModal}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
