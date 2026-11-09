import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
  return (
    <ProjectPageHeader title={project.title}>
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
