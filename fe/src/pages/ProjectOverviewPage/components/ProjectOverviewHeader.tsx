import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen, Globe, Lock } from "lucide-react";
import type { Project } from "@/types/project";

interface ProjectOverviewHeaderProps {
  project: Project;
  onEnterStudio: () => void;
}

export default function ProjectOverviewHeader({
  project,
  onEnterStudio,
}: ProjectOverviewHeaderProps) {
  const navigate = useNavigate();
  const isPublic = project.visibility === "public";

  return (
    <header className="h-14 border-b bg-white/95 dark:bg-neutral-900/95 backdrop-blur px-3 md:px-5 flex items-center justify-between gap-3 shrink-0 z-20">
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
        <div className="h-4 w-px bg-border shrink-0" />
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-sm shrink-0">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-none mb-1">
            Tổng quan dự án
          </p>
          <h1 className="text-sm font-semibold truncate max-w-[320px] sm:max-w-lg">
            {project.title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge
          variant="outline"
          className={
            isPublic
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 gap-1"
              : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 gap-1"
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
          onClick={onEnterStudio}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold shadow-xs gap-1.5 h-8 px-3.5"
        >
          <span>Vào Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </header>
  );
}
