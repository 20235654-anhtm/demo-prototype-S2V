import type { Shot } from "@/types/script";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";

export const mockInitialShots: Shot[] = [
  {
    id: "shot-1",
    order: 1,
    code: "Cảnh 1",
    text: "Trên quảng trường, trắc nghiệm ma thạch hiện lên năm chữ chói mắt: “Đấu chi lực, tam đoạn”.",
    duration: 5,
    image: PLACEHOLDER_IMAGE,
    isLocked: true,
  },
  {
    id: "shot-2",
    order: 2,
    code: "Cảnh 2",
    text: "“Tiêu Viêm, đấu lực, tam đoạn! Cấp bậc: Cấp thấp!” Trung niên trắc nghiệm viên hờ hững công bố, đám đông lập tức xôn xao châm chọc.",
    duration: 6,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
  },
  {
    id: "shot-3",
    order: 3,
    code: "Cảnh 3",
    text: "Tiêu Viêm chán nản xoay người, lặng lẽ đi tới cuối đội ngũ, cô đơn thân ảnh lạc lõng giữa quảng trường.",
    duration: 8,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
  },
  {
    id: "shot-4",
    order: 4,
    code: "Cảnh 4",
    text: "Tiêu Mị đặt tay lên ma thạch bia, quang mang lóe lên: “Đấu khí: Thất đoạn! Cấp bậc: Cao cấp!”",
    duration: 7,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
  },
  {
    id: "shot-5",
    order: 5,
    code: "Cảnh 5",
    text: "Tử y thiếu nữ Tiêu Huân Nhi bước lên, đặt nhẹ tay lên thạch bia: “Đấu khí: Cửu đoạn! Cấp bậc: Cao cấp!” Cả sân lặng đi.",
    duration: 7,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
  },
  {
    id: "shot-6",
    order: 6,
    code: "Cảnh 6",
    text: "Tiêu Huân Nhi cúi người trước Tiêu Viêm: “Tiêu Viêm ca ca, Huân Nhi tin người sẽ lại đứng dậy…”",
    duration: 5,
    image: PLACEHOLDER_IMAGE,
    isLocked: true,
  },
];
