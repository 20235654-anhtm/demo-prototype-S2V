import type { StoryDraft } from "@/types/project";

interface StepReviewProps {
  draft: StoryDraft;
  goToStep: (step: number) => void;
}

export default function StepReview({
  draft: _draft,
  goToStep: _goToStep,
}: StepReviewProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground p-6">
      <p className="font-medium text-sm">Bước 3: Kiểm tra / Xác nhận</p>
      <p className="text-xs text-muted-foreground/70 mt-1">
        (Khu vực nội dung trống - sẵn sàng để thêm giao diện mới)
      </p>
    </div>
  );
}
