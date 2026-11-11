import { cn } from "cn";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StoryChapter } from "@/lib/storyChapters";

interface ChapterListViewProps {
  chapters: StoryChapter[];
  activeChapterId: string | null;
  onSelectChapter: (chapter: StoryChapter) => void;
  onOpenInStudio?: (chapter: StoryChapter) => void;
}

export default function ChapterListView({
  chapters,
  activeChapterId,
  onSelectChapter,
  onOpenInStudio,
}: ChapterListViewProps) {
  if (chapters.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card/60 py-10 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <FileText className="w-5 h-5" />
        </div>
        <p className="mt-3 text-xs font-medium">Chưa có chương nào</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Thêm dòng “Chương 1”, “Chương 2”… vào văn bản để tách chương.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 select-none font-sans text-xs">
      {chapters.map((chapter) => {
        const isActive = activeChapterId === chapter.id;

        return (
          <div
            key={chapter.id}
            onClick={() => onSelectChapter(chapter)}
            className={cn(
              "group/item relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all border",
              isActive
                ? "bg-brand/10 border-brand/40 text-brand-strong dark:text-brand font-semibold shadow-2xs"
                : "border-border/70 bg-card hover:bg-muted/50 text-foreground"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0",
                  isActive
                    ? "bg-brand text-brand-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {chapter.number}
              </span>
              <span className="truncate block text-xs font-medium">
                Chương {chapter.number}
                {chapter.title ? ` · ${chapter.title}` : ""}
              </span>
            </div>

            {onOpenInStudio && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenInStudio(chapter);
                }}
                className="h-7 px-2.5 text-[11px] font-semibold shrink-0 gap-1 bg-white hover:bg-brand/10 hover:text-brand-strong border-border hover:border-brand/40 transition-colors shadow-2xs cursor-pointer"
                title={`Vào Studio cho Chương ${chapter.number}`}
              >
                <span>Vào Studio</span>
                <ArrowRight className="w-3 h-3 text-foreground" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
