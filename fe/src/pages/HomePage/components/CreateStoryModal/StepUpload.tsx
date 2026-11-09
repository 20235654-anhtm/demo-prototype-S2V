import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUp, RefreshCw } from "lucide-react";
import type { CreateStoryFormData } from "./types";
import { MOCK_BOOK_SAMPLE_TEXT } from "./mockData";

interface StepUploadProps {
  formData: CreateStoryFormData;
  onFormDataChange: React.Dispatch<React.SetStateAction<CreateStoryFormData>>;
}

export default function StepUpload({ formData, onFormDataChange }: StepUploadProps) {
  const handleUpload = () => {
    onFormDataChange((prev) => ({
      ...prev,
      file: {
        name: "Đấu Phá Thương Khung.docx",
        size: "24 KB",
        format: "DOCX",
        charCount: 8258,
        estimatedDuration: "00:09:10",
      },
      sampleText: prev.sampleText || MOCK_BOOK_SAMPLE_TEXT,
    }));
  };

  const handleChangeFile = () => {
    onFormDataChange((prev) => ({
      ...prev,
      file: null,
      sampleText: "",
    }));
  };

  if (!formData.file) {
    return (
      <div className="h-full flex items-center justify-center">
        <div
          onClick={handleUpload}
          className="w-full max-w-md border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <FileUp className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium text-sm mb-1">Kéo thả tệp vào đây</p>
          <p className="text-xs text-muted-foreground mb-3">
            hoặc nhấn để chọn tệp từ máy tính
          </p>
          <p className="text-[11px] text-muted-foreground">
            Hỗ trợ: DOCX, EPUB, PDF, TXT
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      {/* File Header Card */}
      <div className="flex items-center justify-between p-3.5 border rounded-lg bg-muted/20 shrink-0">
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-600 text-white font-mono text-xs">
            {formData.file.format}
          </Badge>
          <div>
            <p className="font-medium text-sm">{formData.file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formData.file.size} · {formData.file.charCount.toLocaleString()} ký tự · khoảng {formData.file.estimatedDuration}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleChangeFile} className="cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Đổi tệp
        </Button>
      </div>

      {/* Text Preview Box */}
      <div className="flex-1 min-h-0 border rounded-lg flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
              {formData.sampleText}
            </p>
          </div>
        </ScrollArea>
        <div className="border-t px-4 py-2 bg-muted/10 shrink-0">
          <p className="text-xs text-muted-foreground">
            Xem trước 3.000 ký tự đầu.
          </p>
        </div>
      </div>
    </div>
  );
}
