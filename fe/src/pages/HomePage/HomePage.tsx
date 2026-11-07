import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectToolbar from "./components/ProjectToolbar";
import ProjectCard from "./components/ProjectCard";
import ProjectTable from "./components/ProjectTable";
import CreateStoryModal from "./components/CreateStoryModal/CreateStoryModal";
import { mockProjects } from "@/mocks/mockProjects";
import type { Project, StoryDraft } from "@/types/project";

export default function HomePage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  // Filter projects by search query
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectClick = (projectId: string) => {
    navigate(`/editor/${projectId}`);
  };

  const handleCreateProject = (draft: StoryDraft) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: draft.file?.name || "Dự án không tên",
      textPreview: draft.sampleText.slice(0, 120),
      createdAt: "Vừa xong",
      author: "Myanh",
      status: "Creation draft",
    };
    setProjects((prev) => [newProject, ...prev]);
    setIsModalOpen(false);
    navigate(`/editor/${newProject.id}`);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {/* Header Dashboard của HomePage */}
      <header className="sticky top-0 z-30 border-b px-6 py-3 flex items-center justify-between bg-white dark:bg-neutral-900 shrink-0">
        <span className="text-lg font-bold">Story2Video</span>
        <div className="flex items-center gap-2 text-sm">
          <span>Myanh</span>
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
            M
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 w-full flex-1">
        {/* Toolbar */}
      <ProjectToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={() => setIsModalOpen(true)}
      />

      {/* Project list */}
      <div className="mt-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={handleProjectClick}
              />
            ))}
          </div>
        ) : (
          <ProjectTable
            projects={filteredProjects}
            onProjectClick={handleProjectClick}
          />
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Không tìm thấy dự án nào</p>
            <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Create Story Modal */}
      <CreateStoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreateProject={handleCreateProject}
      />
      </div>
    </div>
  );
}
