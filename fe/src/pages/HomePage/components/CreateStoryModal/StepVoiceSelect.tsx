import type { StoryDraft } from "@/types/project";

interface StepVoiceSelectProps {
  draft: StoryDraft;
  onDraftChange: (draft: StoryDraft) => void;
}

export default function StepVoiceSelect({
  draft: _draft,
  onDraftChange: _onDraftChange,
}: StepVoiceSelectProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground p-6">
      <p className="font-medium text-sm">Bước 2: Chọn giọng đọc</p>
      <p className="text-xs text-muted-foreground/70 mt-1">
        (Khu vực nội dung trống - sẵn sàng để thêm giao diện mới)
      </p>
    </div>
  );
}
