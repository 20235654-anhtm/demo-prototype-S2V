import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Globe, Lock } from "lucide-react";
import ProjectPageHeader from "@/components/ProjectPageHeader";

interface EditorHeaderProps {
  title?: string;
  visibility?: "private" | "public";
  onExport?: () => void;
}

export default function EditorHeader({
  title = "Đấu Phá Thương Khung",
  visibility,
  onExport,
}: EditorHeaderProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const backTo = projectId ? `/project/${projectId}/overview` : "/";
  const isPublic = visibility === "public";

  return (
    <ProjectPageHeader
      title={title}
      backTo={backTo}
      backTitle="Quay lại tổng quan dự án"
    >
      <Badge
        variant="outline"
        className={
          isPublic
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 gap-1"
            : "border-brand/30 bg-brand/10 text-brand-strong dark:text-brand gap-1"
        }
      >
        {isPublic ? (
          <Globe className="w-3 h-3" />
        ) : (
          <Lock className="w-3 h-3" />
        )}
        <span className="hidden sm:inline">
          {isPublic ? "Công khai" : "Riêng tư"}
        </span>
      </Badge>
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
