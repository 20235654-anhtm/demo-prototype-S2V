import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, ArrowRight, X } from "lucide-react";
import StepUpload from "./StepUpload";
import StepVoiceSelect from "./StepVoiceSelect";
import StepReview from "./StepReview";
import type { Project, StoryDraft } from "@/types/project";

interface CreateStoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (draft: StoryDraft) => void;
  selectedDraft?: Project | null;
}

const STEPS = [
  { label: "Tải lên", step: 1 },
  { label: "Chọn giọng đọc", step: 2 },
  { label: "Kiểm tra", step: 3 },
];

export default function CreateStoryModal({
  open,
  onOpenChange,
  onCreateProject,
  selectedDraft,
}: CreateStoryModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setDraft] = useState<StoryDraft>({
    file: null,
    sampleText: "",
    selectedVoiceId: null,
  });

  // Nạp dữ liệu bản thảo cũ nếu có selectedDraft, hoặc reset nếu tạo mới
  useEffect(() => {
    if (open) {
      if (selectedDraft) {
        setDraft({
          file: {
            name: selectedDraft.title.slice(0, 30) + ".docx",
            size: "58 KB",
            format: "DOCX",
            charCount: 3930,
            estimatedDuration: "00:04:24",
          },
          sampleText:
            selectedDraft.textPreview ||
            "Bà Nguyễn Thị Thược sinh năm 1940 tại một làng quê nghèo ven sông Đáy, tỉnh Hà Nam...",
          selectedVoiceId: null,
        });
        setCurrentStep(1);
      } else {
        setDraft({ file: null, sampleText: "", selectedVoiceId: null });
        setCurrentStep(1);
      }
    }
  }, [open, selectedDraft]);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleCreate = () => {
    onCreateProject(draft);
    setCurrentStep(1);
    setDraft({ file: null, sampleText: "", selectedVoiceId: null });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-4xl h-[600px] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header: Căn giữa tiêu đề và nút đóng trên cùng một hàng */}
        <DialogHeader className="px-6 py-3 border-b flex flex-row items-center justify-between space-y-0 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <BookOpen className="w-5 h-5" />
            <span>Story</span>
          </DialogTitle>
          <DialogClose render={<Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-muted" />}>
            <X className="w-4 h-4" />
            <span className="sr-only">Đóng</span>
          </DialogClose>
        </DialogHeader>

        {/* Body: Stepper + Content */}
        <div className="flex flex-1 min-h-0">
          <nav className="w-55 border-r p-4 space-y-1 shrink-0">
            {STEPS.map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-left transition-colors cursor-pointer ${
                  currentStep === s.step
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                    currentStep === s.step
                      ? "bg-primary text-primary-foreground border-primary"
                      : currentStep > s.step
                        ? "bg-green-600 text-white border-green-600"
                        : "border-muted-foreground/40"
                  }`}
                >
                  {currentStep > s.step ? "✓" : s.step}
                </span>
                {s.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 min-h-0 flex flex-col p-6 overflow-hidden">
            {currentStep === 1 && (
              <StepUpload draft={draft} onDraftChange={setDraft} />
            )}
            {currentStep === 2 && (
              <StepVoiceSelect draft={draft} onDraftChange={setDraft} />
            )}
            {currentStep === 3 && (
              <StepReview draft={draft} goToStep={setCurrentStep} />
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-3 border-t flex justify-between shrink-0">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Quay lại
              </Button>
            )}
          </div>
          <div>
            {currentStep < 3 ? (
              <Button
                size="sm"
                onClick={handleNext}
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold"
              >
                Tiếp tục
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleCreate}
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold"
              >
                Tạo dự án
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
