import { cn } from "cn";
import { BookOpen, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StoryChapter } from "@/lib/storyChapters";

interface ChapterListViewProps {
  chapters: StoryChapter[];
  activeChapterId: string | null;
  onSelectChapter: (chapter: StoryChapter) => void;
  onOpenInStudio?: (chapter: StoryChapter) => void;
}

const formatCharCount = (count: number) => {
  if (count >= 1000) {
    const value = (count / 1000).toFixed(1).replace(/\.0$/, "");
    return `${value}k ký tự`;
  }

  return `${count} ký tự`;
};

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
          <BookOpen className="w-5 h-5" />
        </div>
        <p className="mt-3 text-xs font-medium">Chưa có chương nào</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Thêm dòng “Chương 1”, “Chương 2”… vào văn bản để tách chương.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chapters.map((chapter) => {
        const isActive = activeChapterId === chapter.id;

        return (
          <div
            key={chapter.id}
            onClick={() => onSelectChapter(chapter)}
            className={cn(
              "group/chap relative flex items-center justify-between gap-2 w-full rounded-xl border p-3 text-left transition-colors cursor-pointer",
              isActive
                ? "border-brand/40 bg-brand/10"
                : "bg-card hover:bg-muted/50"
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
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
                <span className="text-xs font-semibold text-foreground">
                  Chương {chapter.number}
                </span>
                {chapter.title && (
                  <span className="truncate text-[10px] text-muted-foreground">
                    · {chapter.title}
                  </span>
                )}
              </div>

              <span className="mt-1.5 inline-flex text-[10px] text-muted-foreground">
                {formatCharCount(chapter.charCount)}
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
                className="h-7 px-2 text-[11px] font-medium shrink-0 gap-1 bg-white hover:bg-brand/10 hover:text-brand-strong border-border hover:border-brand/40 transition-colors shadow-2xs"
                title={`Vào dựng video cho Chương ${chapter.number}`}
              >
                <Video className="w-3 h-3 text-brand" />
                <span>Dựng video</span>
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
