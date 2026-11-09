import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { cn } from "cn";
import { BookOpen, History, Network, Users } from "lucide-react";
import { getProject } from "@/lib/projectStore";
import ProjectOverviewHeader from "./components/ProjectOverviewHeader";
import OverviewSidebar from "./components/OverviewSidebar";
import StoryAssetsView from "./components/StoryAssetsView";
import RelationshipsView from "./components/RelationshipsView";
import TimelineView from "./components/TimelineView";
import StoryTextView from "./components/StoryTextView";
import type { OverviewSection } from "./types";

const MOBILE_TABS: Array<{
  id: OverviewSection;
  label: string;
  icon: typeof Users;
}> = [
  { id: "story", label: "Nội dung truyện", icon: BookOpen },
  { id: "assets", label: "Tài sản truyện", icon: Users },
  { id: "relationships", label: "Quan hệ nhân vật", icon: Network },
  { id: "timeline", label: "Dòng thời gian", icon: History },
];

export default function ProjectOverviewPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [activeSection, setActiveSection] =
    useState<OverviewSection>("story");

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

  return (
    <div className="h-full flex flex-col bg-stone-50/70 dark:bg-neutral-950 overflow-hidden">
      <ProjectOverviewHeader
        project={project}
        onEnterStudio={handleEnterStudio}
      />

      <div className="flex-1 min-h-0 flex overflow-hidden">
        <div className="hidden md:flex">
          <OverviewSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6 lg:px-8 py-5 md:py-7">
            {/* Tabs cho màn hình nhỏ */}
            <div className="md:hidden mb-4 flex gap-1.5 overflow-x-auto pb-1">
              {MOBILE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSection(tab.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer",
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div
              key={activeSection}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {activeSection === "story" && <StoryTextView />}
              {activeSection === "assets" && <StoryAssetsView />}
              {activeSection === "relationships" && <RelationshipsView />}
              {activeSection === "timeline" && <TimelineView />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
