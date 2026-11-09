import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectToolbar from "./components/ProjectToolbar";
import ProjectCard from "./components/ProjectCard";
import ProjectTable from "./components/ProjectTable";
import CreateStoryModal from "./components/CreateStoryModal/CreateStoryModal";
import { mockProjects } from "@/mocks/mockProjects";
import { saveProject } from "@/lib/projectStore";
import type { Project } from "@/types/project";
import type { CreateStoryFormData } from "./components/CreateStoryModal/types";

/** ID dự án dạng hex, không dùng tiền tố. */
const createProjectId = () =>
  `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 6)}`;

export default function HomePage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<Project | null>(null);

  // Trang chủ luôn hiển thị đúng 2 dự án mock cố định.
  const projects = mockProjects;

  // Lọc dự án theo từ khóa tìm kiếm
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Xử lý click thẻ / dòng:
  // - Nếu đang ở trạng thái "Đang tạo" -> mở lại Modal Story để chỉnh sửa tiếp
  // - Nếu không có tag -> mở trang tổng quan dự án
  const handleProjectClick = (project: Project) => {
    if (project.status === "draft") {
      setSelectedDraft(project);
      setIsModalOpen(true);
    } else {
      navigate(`/project/${project.id}/overview`);
    }
  };

  const handleOpenCreateNew = () => {
    setSelectedDraft(null); // Tạo mới từ đầu
    setIsModalOpen(true);
  };

  const handleCreateProject = (formData: CreateStoryFormData) => {
    const newProject: Project = {
      id: selectedDraft ? selectedDraft.id : createProjectId(),
      title:
        formData.file?.name?.replace(/\.[^/.]+$/, "") ||
        selectedDraft?.title ||
        "Dự án không tên",
      thumbnail: formData.coverImage || undefined,
      textPreview: formData.sampleText ? formData.sampleText.slice(0, 120) : "Chưa có trích đoạn kịch bản...",
      createdAt: "Vừa xong",
      author: "My Anh",
      visibility: formData.visibility,
      // Dự án đã chốt tạo sẽ không còn ở trạng thái "Đang tạo" nữa
    };

    saveProject(newProject);
    setIsModalOpen(false);
    setSelectedDraft(null);
    navigate(`/project/${newProject.id}/overview`);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-stone-50/70 dark:bg-neutral-950">
      {/* Header Dashboard của HomePage */}
      <header className="sticky top-0 z-30 h-14 border-b px-4 md:px-6 flex items-center justify-between bg-white/95 dark:bg-neutral-900/95 backdrop-blur shrink-0">
        <span className="text-lg font-bold">Story2Video</span>
        <div className="flex items-center gap-2 text-sm">
          <span>My Anh</span>
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
            M
          </div>
        </div>
      </header>

      <div className="max-w-[1120px] mx-auto p-6 w-full flex-1">
        {/* Toolbar */}
        <ProjectToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateClick={handleOpenCreateNew}
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
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setSelectedDraft(null);
          }}
          onCreateProject={handleCreateProject}
          selectedDraft={selectedDraft}
        />
      </div>
    </div>
  );
}
