import { useMemo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  getStoryText,
  parseStoryChapters,
  STORY_CONTENT_STORAGE_PREFIX,
  type StoryChapter,
} from "@/lib/storyChapters";
import { MOCK_BOOK_SAMPLE_TEXT } from "@/pages/HomePage/components/CreateStoryModal/mockData";
import { BookOpen } from "lucide-react";

interface StoryTextViewProps {
  activeChapterId?: string | null;
  onChaptersChange?: (chapters: StoryChapter[]) => void;
}

export default function StoryTextView({
  activeChapterId = "chapter-1",
}: StoryTextViewProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const text = useMemo(
    () => getStoryText(projectId, MOCK_BOOK_SAMPLE_TEXT),
    [projectId]
  );

  const chapters = useMemo(() => parseStoryChapters(text), [text]);

  // Tìm chương đang được chọn để hiển thị riêng biệt
  const currentChapter = useMemo(() => {
    return (
      chapters.find((c) => c.id === activeChapterId) ||
      chapters[0] ||
      null
    );
  }, [chapters, activeChapterId]);

  const editorRef = useRef<HTMLDivElement>(null);

  // Cập nhật lại innerText của editor khi chuyển chương
  useEffect(() => {
    if (!editorRef.current || !currentChapter) return;
    const chapterBody = currentChapter.paragraphs.join("\n\n");
    if (editorRef.current.innerText.trim() !== chapterBody.trim()) {
      editorRef.current.innerText = chapterBody;
    }
  }, [currentChapter?.id]);

  const handleSaveCurrentChapter = (updatedBody: string) => {
    if (!projectId || !currentChapter || typeof window === "undefined") return;

    // Tái cấu trúc lại toàn bộ story text với chương hiện tại được cập nhật
    const updatedFullText = chapters
      .map((ch) => {
        const body =
          ch.id === currentChapter.id ? updatedBody.trim() : ch.paragraphs.join("\n\n");
        return `Chương ${ch.number}${ch.title ? ` · ${ch.title}` : ""}\n\n${body}`;
      })
      .join("\n\n");

    try {
      window.localStorage.setItem(
        `${STORY_CONTENT_STORAGE_PREFIX}${projectId}`,
        updatedFullText
      );
    } catch {
      // Bỏ qua nếu localStorage không khả dụng
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    handleSaveCurrentChapter(event.currentTarget.innerText);
  };

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    handleSaveCurrentChapter(event.currentTarget.innerText);
  };

  if (!currentChapter) {
    return (
      <div className="mx-auto w-full max-w-[820px] rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
        <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Chưa có chương nào được chọn.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[820px]">
      {/* Khung soạn thảo riêng biệt của từng chương */}
      <div className="rounded-2xl border bg-card px-5 sm:px-8 md:px-12 py-8 md:py-10 shadow-2xs outline-none transition-shadow focus-within:border-brand/40 focus-within:shadow-md focus-within:ring-2 focus-within:ring-brand/15 min-h-[calc(100vh-230px)]">
        <div className="mb-6 flex items-center gap-3 text-xs font-semibold tracking-wide text-foreground/80">
          <span className="h-px flex-1 bg-border" />
          <span className="uppercase text-[11px] tracking-wider text-muted-foreground">
            Chương {currentChapter.number}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label={`Nội dung Chương ${currentChapter.number}, có thể chỉnh sửa trực tiếp`}
          aria-multiline="true"
          spellCheck={false}
          onBlur={handleBlur}
          onInput={handleInput}
          className="outline-none whitespace-pre-wrap text-[15px] leading-8 font-normal text-foreground/80 min-h-[400px]"
        />
      </div>
    </div>
  );
}
