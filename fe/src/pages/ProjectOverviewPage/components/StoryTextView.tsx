import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { cn } from "cn";
import {
  getStoryText,
  parseStoryChapters,
  STORY_CONTENT_STORAGE_PREFIX,
} from "@/lib/storyChapters";
import { MOCK_BOOK_SAMPLE_TEXT } from "@/pages/HomePage/components/CreateStoryModal/mockData";

export default function StoryTextView() {
  const { projectId } = useParams<{ projectId: string }>();
  const text = useMemo(
    () => getStoryText(projectId, MOCK_BOOK_SAMPLE_TEXT),
    [projectId]
  );

  const chapters = useMemo(() => parseStoryChapters(text), [text]);

  const handleSave = (value: string) => {
    if (!projectId || typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        `${STORY_CONTENT_STORAGE_PREFIX}${projectId}`,
        value
      );
    } catch {
      // Bỏ qua nếu localStorage không khả dụng.
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    handleSave(event.currentTarget.innerText);
  };

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    handleSave(event.currentTarget.innerText);
  };

  return (
    <div className="mx-auto w-full max-w-[820px]">
      <div
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Nội dung truyện, có thể chỉnh sửa trực tiếp"
        aria-multiline="true"
        spellCheck={false}
        onBlur={handleBlur}
        onInput={handleInput}
        className="min-h-[calc(100vh-220px)] rounded-2xl border bg-card px-5 sm:px-8 md:px-12 py-8 md:py-10 shadow-2xs outline-none transition-shadow focus:border-brand/40 focus:shadow-md focus:ring-2 focus:ring-brand/15"
      >
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <section
              key={chapter.id}
              id={chapter.id}
              className={cn("scroll-mt-6", chapterIndex > 0 && "mt-10")}
            >
              <div className="mb-6 flex items-center gap-3 text-xs font-normal tracking-wide text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span>Chương {chapter.number}</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-5">
                {chapter.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[15px] leading-8 font-normal text-foreground/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
