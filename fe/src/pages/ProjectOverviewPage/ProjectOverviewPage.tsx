import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getProject } from "@/lib/projectStore";
import ProjectOverviewHeader from "./components/ProjectOverviewHeader";
import OverviewSidebar from "./components/OverviewSidebar";
import OverviewSectionPanel from "./components/OverviewSectionPanel";
import StoryTextView from "./components/StoryTextView";
import type { OverviewSection } from "./types";

export default function ProjectOverviewPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [activeSection, setActiveSection] =
    useState<OverviewSection | null>(null);

  const project = useMemo(
    () => (projectId ? getProject(projectId) : undefined),
    [projectId]
  );

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const handleEnterStudio = () => {
    navigate(`/editor/${project.id}`);
  };

  const handleSectionSelect = (section: OverviewSection) => {
    setActiveSection((current) => (current === section ? null : section));
  };

  return (
    <div className="h-full flex flex-col bg-stone-50/70 dark:bg-neutral-950 overflow-hidden">
      <ProjectOverviewHeader
        project={project}
        onEnterStudio={handleEnterStudio}
      />

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        <OverviewSidebar
          activeSection={activeSection}
          onSectionSelect={handleSectionSelect}
        />

        {activeSection && (
          <OverviewSectionPanel
            section={activeSection}
            onClose={() => setActiveSection(null)}
          />
        )}

        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6 lg:px-8 py-5 md:py-7">
            <StoryTextView />
          </div>
        </main>
      </div>
    </div>
  );
}
