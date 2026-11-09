import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { MOCK_BOOK_SAMPLE_TEXT } from "@/pages/HomePage/components/CreateStoryModal/mockData";

const STORAGE_PREFIX = "s2v:story-content:";

function getInitialText(projectId?: string) {
  if (projectId && typeof window !== "undefined") {
    const saved = window.localStorage.getItem(`${STORAGE_PREFIX}${projectId}`);
    if (saved) return saved;
  }
  return MOCK_BOOK_SAMPLE_TEXT;
}

export default function StoryTextView() {
  const { projectId } = useParams<{ projectId: string }>();
  const text = useMemo(() => getInitialText(projectId), [projectId]);

  const paragraphs = useMemo(
    () =>
      text
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    [text]
  );

  const handleSave = (value: string) => {
    if (!projectId || typeof window === "undefined") return;

    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${projectId}`, value);
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
        <div className="space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-[15px] leading-8 font-normal text-foreground/80"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
