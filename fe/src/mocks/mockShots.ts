import type { Shot, WordTimestamp } from "@/types/script";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";

// Hàm tiện ích tạo danh sách word timestamps theo tỷ lệ độ dài từ
export function generateWordTimestamps(
  text: string,
  startSec: number = 0,
  durationSec: number = 4
): WordTimestamp[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const totalChars = words.reduce((sum, w) => sum + w.length, 0);
  let currentStart = startSec;

  return words.map((word) => {
    const fraction = totalChars > 0 ? word.length / totalChars : 1 / words.length;
    const wordDur = Math.max(0.18, fraction * durationSec);
    const end = Math.min(startSec + durationSec, currentStart + wordDur);
    const item: WordTimestamp = {
      word,
      start: Number(currentStart.toFixed(2)),
      end: Number(end.toFixed(2)),
    };
    currentStart = end;
    return item;
  });
}

export const mockInitialShots: Shot[] = [
  {
    id: "shot-1",
    order: 1,
    code: "Cảnh 1",
    text: "Trên quảng trường, trắc nghiệm ma thạch hiện lên năm chữ chói mắt: “Đấu chi lực, tam đoạn”.",
    duration: 5,
    image: PLACEHOLDER_IMAGE,
    isLocked: true,
    blocks: [
      {
        id: "block-1-1",
        shotId: "shot-1",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 5,
        lines: [
          {
            id: "line-1-1-1",
            text: "Trên quảng trường, trắc nghiệm ma thạch hiện lên năm chữ chói mắt: “Đấu chi lực, tam đoạn”.",
            duration: 5,
            words: generateWordTimestamps(
              "Trên quảng trường, trắc nghiệm ma thạch hiện lên năm chữ chói mắt: “Đấu chi lực, tam đoạn”.",
              0,
              5
            ),
          },
        ],
      },
    ],
  },
  {
    id: "shot-2",
    order: 2,
    code: "Cảnh 2",
    text: "“Tiêu Viêm, đấu lực, tam đoạn! Cấp bậc: Cấp thấp!” Trung niên trắc nghiệm viên hờ hững công bố, đám đông lập tức xôn xao châm chọc.",
    duration: 6,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-2-1",
        shotId: "shot-2",
        characterId: "char-trac-nghiem-vien",
        status: "ready",
        totalDuration: 3,
        lines: [
          {
            id: "line-2-1-1",
            text: "“Tiêu Viêm, đấu lực, tam đoạn! Cấp bậc: Cấp thấp!”",
            duration: 3,
            words: generateWordTimestamps(
              "“Tiêu Viêm, đấu lực, tam đoạn! Cấp bậc: Cấp thấp!”",
              5,
              3
            ),
          },
        ],
      },
      {
        id: "block-2-2",
        shotId: "shot-2",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 3,
        lines: [
          {
            id: "line-2-2-1",
            text: "Trung niên trắc nghiệm viên hờ hững công bố, đám đông lập tức xôn xao châm chọc.",
            duration: 3,
            words: generateWordTimestamps(
              "Trung niên trắc nghiệm viên hờ hững công bố, đám đông lập tức xôn xao châm chọc.",
              8,
              3
            ),
          },
        ],
      },
    ],
  },
  {
    id: "shot-3",
    order: 3,
    code: "Cảnh 3",
    text: "Tiêu Viêm chán nản xoay người, lặng lẽ đi tới cuối đội ngũ, cô đơn thân ảnh lạc lõng giữa quảng trường.",
    duration: 8,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-3-1",
        shotId: "shot-3",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 8,
        lines: [
          {
            id: "line-3-1-1",
            text: "Tiêu Viêm chán nản xoay người, lặng lẽ đi tới cuối đội ngũ, cô đơn thân ảnh lạc lõng giữa quảng trường.",
            duration: 8,
            words: generateWordTimestamps(
              "Tiêu Viêm chán nản xoay người, lặng lẽ đi tới cuối đội ngũ, cô đơn thân ảnh lạc lõng giữa quảng trường.",
              11,
              8
            ),
          },
        ],
      },
    ],
  },
  {
    id: "shot-4",
    order: 4,
    code: "Cảnh 4",
    text: "Tiêu Mị đặt tay lên ma thạch bia, quang mang lóe lên: “Đấu khí: Thất đoạn! Cấp bậc: Cao cấp!”",
    duration: 7,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-4-1",
        shotId: "shot-4",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 3.5,
        lines: [
          {
            id: "line-4-1-1",
            text: "Tiêu Mị đặt tay lên ma thạch bia, quang mang lóe lên:",
            duration: 3.5,
            words: generateWordTimestamps(
              "Tiêu Mị đặt tay lên ma thạch bia, quang mang lóe lên:",
              19,
              3.5
            ),
          },
        ],
      },
      {
        id: "block-4-2",
        shotId: "shot-4",
        characterId: "char-tieu-mi",
        status: "ready",
        totalDuration: 3.5,
        lines: [
          {
            id: "line-4-2-1",
            text: "“Đấu khí: Thất đoạn! Cấp bậc: Cao cấp!”",
            duration: 3.5,
            words: generateWordTimestamps(
              "“Đấu khí: Thất đoạn! Cấp bậc: Cao cấp!”",
              22.5,
              3.5
            ),
          },
        ],
      },
    ],
  },
  {
    id: "shot-5",
    order: 5,
    code: "Cảnh 5",
    text: "Tử y thiếu nữ Tiêu Huân Nhi bước lên, đặt nhẹ tay lên thạch bia: “Đấu khí: Cửu đoạn! Cấp bậc: Cao cấp!” Cả sân lặng đi.",
    duration: 7,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-5-1",
        shotId: "shot-5",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 3.5,
        lines: [
          {
            id: "line-5-1-1",
            text: "Tử y thiếu nữ Tiêu Huân Nhi bước lên, đặt nhẹ tay lên thạch bia:",
            duration: 3.5,
            words: generateWordTimestamps(
              "Tử y thiếu nữ Tiêu Huân Nhi bước lên, đặt nhẹ tay lên thạch bia:",
              26,
              3.5
            ),
          },
        ],
      },
      {
        id: "block-5-2",
        shotId: "shot-5",
        characterId: "char-tieu-huan-nhi",
        status: "ready",
        totalDuration: 3.5,
        lines: [
          {
            id: "line-5-2-1",
            text: "“Đấu khí: Cửu đoạn! Cấp bậc: Cao cấp!” Cả sân lặng đi.",
            duration: 3.5,
            words: generateWordTimestamps(
              "“Đấu khí: Cửu đoạn! Cấp bậc: Cao cấp!” Cả sân lặng đi.",
              29.5,
              3.5
            ),
          },
        ],
      },
    ],
  },
  {
    id: "shot-6",
    order: 6,
    code: "Cảnh 6",
    text: "Tiêu Huân Nhi cúi người trước Tiêu Viêm: “Tiêu Viêm ca ca, Huân Nhi tin người sẽ lại đứng dậy…”",
    duration: 5,
    image: PLACEHOLDER_IMAGE,
    isLocked: true,
    blocks: [
      {
        id: "block-6-1",
        shotId: "shot-6",
        characterId: "char-tieu-huan-nhi",
        status: "ready",
        totalDuration: 5,
        lines: [
          {
            id: "line-6-1-1",
            text: "“Tiêu Viêm ca ca, Huân Nhi tin người sẽ lại đứng dậy…”",
            duration: 5,
            words: generateWordTimestamps(
              "“Tiêu Viêm ca ca, Huân Nhi tin người sẽ lại đứng dậy…”",
              33,
              5
            ),
          },
        ],
      },
    ],
  },
];
