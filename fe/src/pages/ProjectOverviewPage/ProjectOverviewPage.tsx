import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { parseStoryChapters, getStoryText, type StoryChapter } from "@/lib/storyChapters";
import { getProject } from "@/lib/projectStore";
import { MOCK_BOOK_SAMPLE_TEXT } from "@/pages/HomePage/components/CreateStoryModal/mockData";
import ProjectOverviewHeader from "./components/ProjectOverviewHeader";
import OverviewSidebar from "./components/OverviewSidebar";
import OverviewSectionPanel from "./components/OverviewSectionPanel";
import ChapterPickerDialog from "./components/ChapterPickerDialog";
import StoryTextView from "./components/StoryTextView";
import type { OverviewSection } from "./types";

export default function ProjectOverviewPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [activeSection, setActiveSection] =
    useState<OverviewSection | null>("assets");
  const [activeChapterId, setActiveChapterId] = useState<string | null>(
    "chapter-1"
  );
  const [chapterJumpNonce, setChapterJumpNonce] = useState(0);
  const [isChapterPickerOpen, setIsChapterPickerOpen] = useState(false);

  const chapters = useMemo(
    () => parseStoryChapters(getStoryText(projectId, MOCK_BOOK_SAMPLE_TEXT)),
    [projectId]
  );

  useEffect(() => {
    if (!activeChapterId) return;

    document
      .getElementById(activeChapterId)
      ?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [activeChapterId, chapterJumpNonce]);

  const project = useMemo(
    () => (projectId ? getProject(projectId) : undefined),
    [projectId]
  );

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const handleEnterStudio = () => {
    setIsChapterPickerOpen(true);
  };

  const handleSelectChapterForStudio = (chapter: StoryChapter) => {
    setIsChapterPickerOpen(false);
    navigate(`/editor/${project.id}?chapter=${chapter.number}`);
  };

  const handleSectionSelect = (section: OverviewSection) => {
    setActiveSection((current) => (current === section ? null : section));
  };

  const handleSelectChapter = (chapter: StoryChapter) => {
    setActiveChapterId(chapter.id);
    setChapterJumpNonce((nonce) => nonce + 1);
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
            chapters={chapters}
            activeChapterId={activeChapterId}
            onSelectChapter={handleSelectChapter}
            onOpenInStudio={handleSelectChapterForStudio}
            onClose={() => setActiveSection(null)}
          />
        )}

        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6 lg:px-8 py-5 md:py-7">
            <StoryTextView activeChapterId={activeChapterId} />
          </div>
        </main>
      </div>

      <ChapterPickerDialog
        open={isChapterPickerOpen}
        onOpenChange={setIsChapterPickerOpen}
        chapters={chapters}
        onSelectChapter={handleSelectChapterForStudio}
      />
    </div>
  );
}
