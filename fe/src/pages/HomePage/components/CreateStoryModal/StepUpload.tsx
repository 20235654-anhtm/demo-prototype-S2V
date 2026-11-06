import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUp, RefreshCw } from "lucide-react";
import type { StoryDraft } from "@/types/project";

interface StepUploadProps {
  draft: StoryDraft;
  onDraftChange: (draft: StoryDraft) => void;
}

const MOCK_SAMPLE_TEXT = `Bà Nguyễn Thị Thược sinh năm 1940, tại một làng quê nhỏ thuộc tỉnh Hà Nam. Bà lớn lên trong thời kỳ kháng chiến, chứng kiến bao đổi thay của đất nước.

Tuổi thơ của bà gắn liền với những cánh đồng lúa bát ngát, với tiếng ru ầu ơ của mẹ bên hiên nhà. Dù cuộc sống khó khăn, bà vẫn luôn giữ trong mình niềm tin vào tương lai tươi sáng.

Năm 18 tuổi, bà tham gia đội thanh niên xung phong, cùng đồng đội mở đường, xây cầu phục vụ tiền tuyến. Những năm tháng ấy đã rèn luyện cho bà ý chí kiên cường và lòng yêu nước sâu sắc.

Sau chiến tranh, bà trở về quê hương, bắt đầu cuộc sống mới với vai trò một người giáo viên. Bà dành cả đời mình cho sự nghiệp giáo dục, truyền đạt kiến thức và tình yêu thương cho bao thế hệ học trò.

Câu chuyện của bà là minh chứng cho sức mạnh phi thường của con người Việt Nam, những người đã vượt qua mọi khó khăn, thử thách để xây dựng đất nước.`;

export default function StepUpload({ draft, onDraftChange }: StepUploadProps) {
  const handleUpload = () => {
    onDraftChange({
      ...draft,
      file: {
        name: "Bà Nguyễn Thị Thược.docx",
        size: "58 KB",
        format: "DOCX",
        charCount: 3930,
        estimatedDuration: "00:04:24",
      },
      sampleText: MOCK_SAMPLE_TEXT,
    });
  };

  const handleChangeFile = () => {
    onDraftChange({
      ...draft,
      file: null,
      sampleText: "",
    });
  };

  if (!draft.file) {
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
            Hỗ trợ: DOCX, PDF, TXT
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
            {draft.file.format}
          </Badge>
          <div>
            <p className="font-medium text-sm">{draft.file.name}</p>
            <p className="text-xs text-muted-foreground">
              {draft.file.size} · {draft.file.charCount.toLocaleString()} ký tự · khoảng {draft.file.estimatedDuration}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleChangeFile}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Đổi tệp
        </Button>
      </div>

      {/* Text Preview Box */}
      <div className="flex-1 min-h-0 border rounded-lg flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
              {draft.sampleText}
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
