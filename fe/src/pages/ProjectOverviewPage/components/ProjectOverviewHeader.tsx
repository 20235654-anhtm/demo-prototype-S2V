import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Lock } from "lucide-react";
import ProjectPageHeader from "@/components/ProjectPageHeader";
import type { Project } from "@/types/project";

interface ProjectOverviewHeaderProps {
  project: Project;
  onEnterStudio: () => void;
}

export default function ProjectOverviewHeader({
  project,
  onEnterStudio,
}: ProjectOverviewHeaderProps) {
  const isPublic = project.visibility === "public";

  return (
    <ProjectPageHeader title={project.title}>
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
        onClick={onEnterStudio}
        className="bg-brand hover:bg-brand-hover text-brand-foreground font-semibold shadow-xs gap-1.5 h-8 px-3.5"
      >
        <span>Vào Studio</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </ProjectPageHeader>
  );
}
