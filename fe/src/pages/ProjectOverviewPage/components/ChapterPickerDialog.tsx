import { BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { StoryChapter } from "@/lib/storyChapters";
import ChapterListView from "./ChapterListView";

interface ChapterPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapters: StoryChapter[];
  onSelectChapter: (chapter: StoryChapter) => void;
}

export default function ChapterPickerDialog({
  open,
  onOpenChange,
  chapters,
  onSelectChapter,
}: ChapterPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <BookOpen className="w-4 h-4 text-brand-strong dark:text-brand" />
            Chọn chương để vào Studio
          </DialogTitle>
          <DialogDescription>
            Chọn chương bạn muốn bắt đầu dựng video.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[55vh] overflow-y-auto pr-1">
          <ChapterListView
            chapters={chapters}
            activeChapterId={null}
            onSelectChapter={onSelectChapter}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
