import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ProjectPageHeader from "@/components/ProjectPageHeader";

interface EditorHeaderProps {
  title?: string;
  chapter?: number;
  onExport?: () => void;
}

export default function EditorHeader({
  title = "Đấu Phá Thương Khung",
  chapter,
  onExport,
}: EditorHeaderProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const backTo = projectId ? `/project/${projectId}/overview` : "/";
  const chapterLabel = chapter ? `Chương ${chapter}` : undefined;

  return (
    <ProjectPageHeader
      title={title}
      titleTo={chapterLabel ? backTo : undefined}
      trailing={chapterLabel}
      backTo={backTo}
      backTitle="Quay lại tổng quan dự án"
    >
      <Button
        size="sm"
        onClick={onExport}
        className="bg-brand hover:bg-brand-hover text-brand-foreground font-semibold shadow-xs gap-1.5 h-8 px-3.5"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Xuất video</span>
      </Button>
    </ProjectPageHeader>
  );
}
