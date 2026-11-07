import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

interface EditorHeaderProps {
  title?: string;
  onExport?: () => void;
}

export default function EditorHeader({
  title = "Dưới sự thao túng của các đối tượng cầm đầu",
  onExport,
}: EditorHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="h-12 border-b px-4 flex items-center justify-between bg-white dark:bg-neutral-900 shrink-0 z-20">
      {/* Left: Nút quay lại & Tên dự án */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="h-8 w-8 rounded-lg hover:bg-muted shrink-0 text-muted-foreground hover:text-foreground"
          title="Quay lại trang chủ"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="h-4 w-[1px] bg-border shrink-0" />
        <h1 className="font-semibold text-sm truncate max-w-[280px] sm:max-w-md md:max-w-lg">
          {title}
        </h1>
      </div>

      {/* Right: Nút Xuất video */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          onClick={onExport}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold shadow-xs gap-1.5 h-8 px-3.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất video</span>
        </Button>
      </div>
    </header>
  );
}
