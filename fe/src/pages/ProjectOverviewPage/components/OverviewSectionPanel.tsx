import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { StoryChapter } from "@/lib/storyChapters";
import { getOverviewSectionMeta } from "../sections";
import type { OverviewSection } from "../types";
import ChapterListView from "./ChapterListView";
import StoryAssetsView from "./StoryAssetsView";

const MIN_PANEL_WIDTH = 280;
const MAX_PANEL_WIDTH = 560;

interface OverviewSectionPanelProps {
  section: OverviewSection;
  chapters: StoryChapter[];
  activeChapterId: string | null;
  onSelectChapter: (chapter: StoryChapter) => void;
  onOpenInStudio?: (chapter: StoryChapter) => void;
  onClose: () => void;
}

export default function OverviewSectionPanel({
  section,
  chapters,
  activeChapterId,
  onSelectChapter,
  onOpenInStudio,
  onClose,
}: OverviewSectionPanelProps) {
  const meta = getOverviewSectionMeta(section);
  const Icon = meta.icon;
  const [panelWidth, setPanelWidth] = useState(380);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : true
  );
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => setIsDesktop(query.matches);

    handleChange();
    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, []);

  const getMaxWidth = () =>
    Math.min(MAX_PANEL_WIDTH, window.innerWidth * 0.55);

  const handleResizeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    startXRef.current = event.clientX;
    startWidthRef.current = panelWidth;

    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextWidth = Math.min(
        Math.max(
          startWidthRef.current + moveEvent.clientX - startXRef.current,
          MIN_PANEL_WIDTH
        ),
        getMaxWidth()
      );
      setPanelWidth(nextWidth);
    };

    const handlePointerUp = () => {
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleResizeKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 24 : -24;
    setPanelWidth((width) =>
      Math.min(Math.max(width + delta, MIN_PANEL_WIDTH), getMaxWidth())
    );
  };

  return (
    <div
      style={isDesktop ? { flexBasis: `${panelWidth}px` } : undefined}
      className="relative w-full lg:w-auto shrink-0 flex flex-col min-h-0 max-h-[45vh] lg:max-h-none border-b lg:border-b-0 lg:border-r bg-white dark:bg-neutral-900"
    >
      <aside className="flex flex-1 flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand/15 text-brand-strong dark:text-brand flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <h2 className="truncate text-sm font-semibold text-foreground">
              {meta.label}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
            title="Đóng bảng"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          {section === "chapters" && (
            <ChapterListView
              chapters={chapters}
              activeChapterId={activeChapterId}
              onSelectChapter={onSelectChapter}
              onOpenInStudio={onOpenInStudio}
            />
          )}
          {section === "assets" && <StoryAssetsView />}
        </div>
      </aside>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Kéo để thay đổi độ rộng panel"
        tabIndex={0}
        onPointerDown={handleResizeStart}
        onKeyDown={handleResizeKeyDown}
        title="Kéo để thay đổi độ rộng"
        className="group absolute -right-1 top-0 z-10 hidden h-full w-2 cursor-col-resize touch-none items-center justify-center lg:flex"
      >
        <span className="h-full w-px bg-transparent transition-colors group-hover:bg-brand/60 group-focus-visible:bg-brand" />
      </div>
    </div>
  );
}
