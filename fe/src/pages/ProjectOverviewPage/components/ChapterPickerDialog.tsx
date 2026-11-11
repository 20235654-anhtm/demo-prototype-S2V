import { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  ArrowRight,
  X,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import type { StoryChapter } from "@/lib/storyChapters";

interface ChapterPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapters: StoryChapter[];
  onSelectChapter: (chapter: StoryChapter) => void;
}

const CHUNK_SIZE = 50; // Phân nhóm 50 chương một dải (vd: 1-50, 51-100, 101-150...)

export default function ChapterPickerDialog({
  open,
  onOpenChange,
  chapters,
  onSelectChapter,
}: ChapterPickerDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0);

  // Tạo các dải nhóm nếu số lượng chương lớn (hàng trăm chương)
  const ranges = useMemo(() => {
    if (chapters.length <= 30) return [];
    const count = Math.ceil(chapters.length / CHUNK_SIZE);
    return Array.from({ length: count }, (_, i) => {
      const start = i * CHUNK_SIZE + 1;
      const end = Math.min((i + 1) * CHUNK_SIZE, chapters.length);
      return {
        index: i,
        label: `${start} - ${end}`,
        start,
        end,
      };
    });
  }, [chapters.length]);

  // Lọc chương theo từ khóa tìm kiếm hoặc theo dải nhóm chương
  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return chapters.filter((c) => {
        const matchesNum = String(c.number).includes(q) || `chương ${c.number}`.includes(q);
        const matchesTitle = c.title?.toLowerCase().includes(q);
        return matchesNum || matchesTitle;
      });
    }

    if (ranges.length > 0) {
      const currentRange = ranges[selectedRangeIndex];
      if (currentRange) {
        return chapters.filter(
          (c) => c.number >= currentRange.start && c.number <= currentRange.end
        );
      }
    }

    return chapters;
  }, [chapters, searchQuery, ranges, selectedRangeIndex]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl w-[94vw] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl border-border bg-white dark:bg-neutral-900"
      >
        {/* Header */}
        <DialogHeader className="px-5 py-3.5 border-b flex flex-row items-center justify-between space-y-0 shrink-0 bg-muted/20">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-brand/15 text-brand-strong dark:text-brand flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <DialogTitle className="text-sm font-semibold text-foreground">
              Chọn chương để vào Studio
            </DialogTitle>
          </div>
          <DialogClose render={<Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0" />}>
            <X className="w-3.5 h-3.5" />
            <span className="sr-only">Đóng</span>
          </DialogClose>
        </DialogHeader>

        {/* Thanh tìm kiếm & bộ lọc dải chương (cho truyện hàng trăm chương) */}
        <div className="p-4 pb-3 border-b space-y-2.5 shrink-0 bg-stone-50/50 dark:bg-neutral-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm chương truyện..."
              className="pl-9 h-9 text-xs bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dải phân nhóm chương (1-50, 51-100, 101-150...) nếu truyện dài */}
          {ranges.length > 0 && !searchQuery && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
              <span className="text-[11px] text-muted-foreground font-medium shrink-0 flex items-center gap-1 mr-1">
                <Layers className="w-3 h-3" />
                <span>Nhóm chương:</span>
              </span>
              {ranges.map((r) => {
                const isSelected = selectedRangeIndex === r.index;
                return (
                  <button
                    key={r.index}
                    type="button"
                    onClick={() => setSelectedRangeIndex(r.index)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer border",
                      isSelected
                        ? "bg-brand text-brand-foreground border-brand shadow-2xs"
                        : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    Chương {r.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Danh sách lưới các chương dạng Cards/Grid (Tối ưu cho cả hàng trăm chương) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          {filteredChapters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  onClick={() => onSelectChapter(chapter)}
                  className="group relative flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border/70 bg-card hover:border-brand/40 hover:bg-brand/5 hover:shadow-2xs transition-all cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-muted text-muted-foreground group-hover:bg-brand group-hover:text-brand-foreground flex items-center justify-center text-xs font-bold shrink-0 transition-colors">
                      {chapter.number}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-foreground group-hover:text-brand-strong dark:group-hover:text-brand transition-colors block truncate">
                        Chương {chapter.number}
                      </span>
                      {chapter.title && (
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {chapter.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 rounded-md text-muted-foreground group-hover:text-brand shrink-0"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground">
              <Search className="w-8 h-8 opacity-30 mb-2" />
              <p className="text-xs font-medium">Không tìm thấy chương phù hợp</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Thử nhập số chương khác hoặc xóa từ khóa tìm kiếm.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
