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
import StepSettings from "./StepSettings";
import StepVoice from "./StepVoice";
import StepCharacters from "./StepCharacters/StepCharacters";
import type { CreateStoryFormData } from "./types";
import { MOCK_INITIAL_CHARACTERS, MOCK_BOOK_SAMPLE_TEXT } from "./mockData";
import type { Project } from "@/types/project";

interface CreateStoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (formData: CreateStoryFormData) => void;
  selectedDraft?: Project | null;
}

const DEFAULT_FORM_DATA: CreateStoryFormData = {
  file: {
    name: "Bà Nguyễn Thị Thược.docx",
    size: "58 KB",
    format: "DOCX",
    charCount: 3930,
    estimatedDuration: "00:04:24",
  },
  sampleText: MOCK_BOOK_SAMPLE_TEXT,
  narrationStyle: "single",
  coverImage: null,
  language: "vi",
  artStyle: "cinematic",
  aspectRatio: "16:9",
  singleVoiceId: "v-trieu-duong",
  characters: MOCK_INITIAL_CHARACTERS,
};

export default function CreateStoryModal({
  open,
  onOpenChange,
  onCreateProject,
  selectedDraft,
}: CreateStoryModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateStoryFormData>(DEFAULT_FORM_DATA);

  // Nạp dữ liệu bản thảo cũ nếu có selectedDraft, hoặc khởi tạo mới
  useEffect(() => {
    if (open) {
      if (selectedDraft) {
        setFormData({
          file: {
            name: selectedDraft.title.slice(0, 30) + ".docx",
            size: "58 KB",
            format: "DOCX",
            charCount: 3930,
            estimatedDuration: "00:04:24",
          },
          sampleText: selectedDraft.textPreview || MOCK_BOOK_SAMPLE_TEXT,
          narrationStyle: "single",
          coverImage: selectedDraft.thumbnail || null,
          language: "vi",
          artStyle: "cinematic",
          aspectRatio: "16:9",
          singleVoiceId: "v-trieu-duong",
          characters: MOCK_INITIAL_CHARACTERS,
        });
        setCurrentStep(1);
      } else {
        setFormData({
          file: null,
          sampleText: "",
          narrationStyle: "single",
          coverImage: null,
          language: "vi",
          artStyle: "cinematic",
          aspectRatio: "16:9",
          singleVoiceId: "v-trieu-duong",
          characters: MOCK_INITIAL_CHARACTERS,
        });
        setCurrentStep(1);
      }
    }
  }, [open, selectedDraft]);

  // Nhãn bước động theo phong cách đọc
  const steps = [
    { step: 1, label: "Tải lên" },
    { step: 2, label: "Thiết lập" },
    {
      step: 3,
      label: formData.narrationStyle === "single" ? "Giọng đọc" : "Nhân vật",
    },
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleCreate = () => {
    onCreateProject(formData);
    setCurrentStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-4xl h-[620px] flex flex-col p-0 gap-0 overflow-hidden"
      >
        {/* Header: [📖] Story và [ ✕ ] */}
        <DialogHeader className="px-6 py-3 border-b flex flex-row items-center justify-between space-y-0 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <BookOpen className="w-5 h-5" />
            <span>Story</span>
          </DialogTitle>
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md hover:bg-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Đóng</span>
              </Button>
            }
          />
        </DialogHeader>

        {/* Body: 2 Cột (Stepper + Nội dung) */}
        <div className="flex flex-1 min-h-0">
          {/* Cột bước tiến trình bên trái (w-55 / ~220px) */}
          <nav className="w-55 border-r p-4 space-y-1 shrink-0 bg-muted/10">
            {steps.map((s) => {
              const isActive = currentStep === s.step;
              const isPassed = currentStep > s.step;

              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setCurrentStep(s.step)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                    isActive
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold shadow-2xs"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border font-medium ${
                      isActive
                        ? "bg-amber-500 text-slate-950 border-amber-500 font-bold"
                        : isPassed
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-muted-foreground/40"
                    }`}
                  >
                    {isPassed ? "✓" : s.step}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Khung nội dung bên phải */}
          <div className="flex-1 min-h-0 flex flex-col p-6 overflow-hidden">
            {currentStep === 1 && (
              <StepUpload formData={formData} onFormDataChange={setFormData} />
            )}
            {currentStep === 2 && (
              <StepSettings formData={formData} onFormDataChange={setFormData} />
            )}
            {currentStep === 3 && (
              formData.narrationStyle === "single" ? (
                <StepVoice formData={formData} onFormDataChange={setFormData} />
              ) : (
                <StepCharacters formData={formData} onFormDataChange={setFormData} />
              )
            )}
          </div>
        </div>

        {/* Footer: Căn phải với flex justify-end gap-3 */}
        <DialogFooter className="px-6 py-3 border-t flex justify-end gap-3 shrink-0">
          {currentStep > 1 && (
            <Button variant="outline" size="sm" onClick={handleBack} className="cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Quay lại
            </Button>
          )}
          {currentStep < 3 ? (
            <Button
              size="sm"
              onClick={handleNext}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold cursor-pointer shadow-xs"
            >
              Tiếp tục
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleCreate}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold cursor-pointer shadow-sm"
            >
              Tạo dự án
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
