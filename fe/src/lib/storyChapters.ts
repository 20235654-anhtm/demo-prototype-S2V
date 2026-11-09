export interface StoryChapter {
  id: string;
  number: number;
  title: string;
  paragraphs: string[];
  charCount: number;
}

const CHAPTER_PATTERN = /^Chương\s+(\d+)(?:\s*[:.\-–]\s*(.*))?$/i;

export const STORY_CONTENT_STORAGE_PREFIX = "s2v:story-content:v2:";

export function getStoryText(projectId: string | undefined, fallback: string) {
  if (!projectId || typeof window === "undefined") return fallback;

  return (
    window.localStorage.getItem(`${STORY_CONTENT_STORAGE_PREFIX}${projectId}`) ??
    fallback
  );
}

const toParagraphs = (value: string) =>
  value
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

/**
 * Tách văn bản truyện thành các chương dựa trên dòng "Chương 1", "Chương 2"...
 * Nếu file không có marker chương, coi toàn bộ nội dung là một chương duy nhất.
 */
export function parseStoryChapters(text: string): StoryChapter[] {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");

  const chapters: Array<{
    number: number;
    title: string;
    lines: string[];
  }> = [];

  let current: (typeof chapters)[number] | null = null;

  for (const line of lines) {
    const match = line.trim().match(CHAPTER_PATTERN);

    if (match) {
      current = {
        number: Number(match[1]),
        title: match[2]?.trim() ?? "",
        lines: [],
      };
      chapters.push(current);
      continue;
    }

    if (current) {
      current.lines.push(line);
    }
  }

  if (chapters.length === 0) {
    return [
      {
        id: "chapter-1",
        number: 1,
        title: "",
        paragraphs: toParagraphs(text),
        charCount: text.trim().length,
      },
    ];
  }

  return chapters.map((chapter) => {
    const body = chapter.lines.join("\n").trim();

    return {
      id: `chapter-${chapter.number}`,
      number: chapter.number,
      title: chapter.title,
      paragraphs: toParagraphs(body),
      charCount: body.length,
    };
  });
}
