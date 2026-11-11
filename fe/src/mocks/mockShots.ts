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

// 12 phân cảnh bao trọn toàn bộ nội dung Chương 1 của Đấu Phá Thương Khung
export const mockInitialShots: Shot[] = [
  // Cảnh 1: Kết quả trắc nghiệm tam đoạn
  {
    id: "shot-1",
    order: 1,
    code: "Cảnh 1",
    text: "Trên quảng trường, trắc nghiệm ma thạch hiện lên năm chữ chói mắt: “Đấu chi lực, tam đoạn”. Thiếu niên thần sắc tự giễu, nắm chặt tay đến mức móng tay đâm sâu vào lòng bàn tay.",
    duration: 6,
    image: PLACEHOLDER_IMAGE,
    isLocked: true,
    blocks: [
      {
        id: "block-1-1",
        shotId: "shot-1",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 6,
        lines: [
          {
            id: "line-1-1-1",
            text: "Trên quảng trường, trắc nghiệm ma thạch hiện lên năm chữ chói mắt: “Đấu chi lực, tam đoạn”. Thiếu niên thần sắc tự giễu, nắm chặt tay đến mức móng tay đâm sâu vào lòng bàn tay.",
            duration: 6,
            words: generateWordTimestamps(
              "Trên quảng trường, trắc nghiệm ma thạch hiện lên năm chữ chói mắt: “Đấu chi lực, tam đoạn”. Thiếu niên thần sắc tự giễu, nắm chặt tay đến mức móng tay đâm sâu vào lòng bàn tay.",
              0,
              6
            ),
          },
        ],
      },
    ],
  },

  // Cảnh 2: Trắc nghiệm viên công bố
  {
    id: "shot-2",
    order: 2,
    code: "Cảnh 2",
    text: "“Tiêu Viêm, đấu lực, tam đoạn! Cấp bậc: Cấp thấp!” Bên cạnh ma thạch bia, vị trung niên nam tử thoáng nhìn tin tức trên bia, ngữ khí hờ hững công bố.",
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
              6,
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
            text: "Bên cạnh ma thạch bia, vị trung niên nam tử thoáng nhìn tin tức trên bia, ngữ khí hờ hững công bố.",
            duration: 3,
            words: generateWordTimestamps(
              "Bên cạnh ma thạch bia, vị trung niên nam tử thoáng nhìn tin tức trên bia, ngữ khí hờ hững công bố.",
              9,
              3
            ),
          },
        ],
      },
    ],
  },

  // Cảnh 3: Đám đông xôn xao châm chọc
  {
    id: "shot-3",
    order: 3,
    code: "Cảnh 3",
    text: "Đám người trên quảng trường nhấc lên trận trận châm chọc: “Tam đoạn? Quả nhiên một năm qua thiên tài này vẫn dậm chân tại chỗ! Thật làm mất hết mặt mũi gia tộc!”",
    duration: 7,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-3-1",
        shotId: "shot-3",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 7,
        lines: [
          {
            id: "line-3-1-1",
            text: "Đám người trên quảng trường nhấc lên trận trận châm chọc: “Tam đoạn? Quả nhiên một năm qua thiên tài này vẫn dậm chân tại chỗ! Thật làm mất hết mặt mũi gia tộc!”",
            duration: 7,
            words: generateWordTimestamps(
              "Đám người trên quảng trường nhấc lên trận trận châm chọc: “Tam đoạn? Quả nhiên một năm qua thiên tài này vẫn dậm chân tại chỗ! Thật làm mất hết mặt mũi gia tộc!”",
              12,
              7
            ),
          },
        ],
      },
    ],
  },

  // Cảnh 4: Tiêu Viêm cô đơn lùi về cuối hàng
  {
    id: "shot-4",
    order: 4,
    code: "Cảnh 4",
    text: "Khổ sở cười thầm, Tiêu Viêm chán nản xoay người, im lặng đi tới cuối đội ngũ. Cô đơn thân ảnh cùng thế giới xung quanh hoàn toàn không hòa nhập.",
    duration: 6,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-4-1",
        shotId: "shot-4",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 6,
        lines: [
          {
            id: "line-4-1-1",
            text: "Khổ sở cười thầm, Tiêu Viêm chán nản xoay người, im lặng đi tới cuối đội ngũ. Cô đơn thân ảnh cùng thế giới xung quanh hoàn toàn không hòa nhập.",
            duration: 6,
            words: generateWordTimestamps(
              "Khổ sở cười thầm, Tiêu Viêm chán nản xoay người, im lặng đi tới cuối đội ngũ. Cô đơn thân ảnh cùng thế giới xung quanh hoàn toàn không hòa nhập.",
              19,
              6
            ),
          },
        ],
      },
    ],
  },

  // Cảnh 5: Tiêu Mị xuất hiện trước ma thạch bia
  {
    id: "shot-5",
    order: 5,
    code: "Cảnh 5",
    text: "“Người tiếp theo, Tiêu Mị!” Một thiếu nữ tuổi mười bốn thanh thuần vũ mị nhanh chóng bước lên, tay đặt lên ma thạch bia đen nhánh rồi chậm rãi nhắm mắt.",
    duration: 6,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-5-1",
        shotId: "shot-5",
        characterId: "char-trac-nghiem-vien",
        status: "ready",
        totalDuration: 2,
        lines: [
          {
            id: "line-5-1-1",
            text: "“Người tiếp theo, Tiêu Mị!”",
            duration: 2,
            words: generateWordTimestamps("“Người tiếp theo, Tiêu Mị!”", 25, 2),
          },
        ],
      },
      {
        id: "block-5-2",
        shotId: "shot-5",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 4,
        lines: [
          {
            id: "line-5-2-1",
            text: "Một thiếu nữ tuổi mười bốn thanh thuần vũ mị nhanh chóng bước lên, tay đặt lên ma thạch bia đen nhánh rồi chậm rãi nhắm mắt.",
            duration: 4,
            words: generateWordTimestamps(
              "Một thiếu nữ tuổi mười bốn thanh thuần vũ mị nhanh chóng bước lên, tay đặt lên ma thạch bia đen nhánh rồi chậm rãi nhắm mắt.",
              27,
              4
            ),
          },
        ],
      },
    ],
  },

  // Cảnh 6: Kết quả thất đoạn của Tiêu Mị
  {
    id: "shot-6",
    order: 6,
    code: "Cảnh 6",
    text: "“Tiêu Mị, Đấu khí: Thất đoạn! Cấp bậc: Cao cấp!” Thiếu nữ ngẩng mặt lên đắc ý cười trong tiếng trầm trồ ngưỡng mộ của toàn trường.",
    duration: 6,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-6-1",
        shotId: "shot-6",
        characterId: "char-trac-nghiem-vien",
        status: "ready",
        totalDuration: 3,
        lines: [
          {
            id: "line-6-1-1",
            text: "“Tiêu Mị, Đấu khí: Thất đoạn! Cấp bậc: Cao cấp!”",
            duration: 3,
            words: generateWordTimestamps(
              "“Tiêu Mị, Đấu khí: Thất đoạn! Cấp bậc: Cao cấp!”",
              31,
              3
            ),
          },
        ],
      },
      {
        id: "block-6-2",
        shotId: "shot-6",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 3,
        lines: [
          {
            id: "line-6-2-1",
            text: "Thiếu nữ ngẩng mặt lên đắc ý cười trong tiếng trầm trồ ngưỡng mộ của toàn trường.",
            duration: 3,
            words: generateWordTimestamps(
              "Thiếu nữ ngẩng mặt lên đắc ý cười trong tiếng trầm trồ ngưỡng mộ của toàn trường.",
              34,
              3
            ),
          },
        ],
      },
    ],
  },

  // Cảnh 7: Hồi tưởng thiên tài sa ngã
  {
    id: "shot-7",
    order: 7,
    code: "Cảnh 7",
    text: "Nhìn bóng lưng Tiêu Viêm, Tiêu Mị khẽ thở dài hồi tưởng: Ba năm trước, hắn từng mười một tuổi ngưng tụ đấu khí toàn, trở thành đấu giả trẻ nhất trăm năm của Tiêu gia, rồi bỗng nhiên mất sạch thiên phú trong một đêm.",
    duration: 8,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-7-1",
        shotId: "shot-7",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 8,
        lines: [
          {
            id: "line-7-1-1",
            text: "Nhìn bóng lưng Tiêu Viêm, Tiêu Mị khẽ thở dài hồi tưởng: Ba năm trước, hắn từng mười một tuổi ngưng tụ đấu khí toàn, trở thành đấu giả trẻ nhất trăm năm của Tiêu gia, rồi bỗng nhiên mất sạch thiên phú trong một đêm.",
            duration: 8,
            words: generateWordTimestamps(
              "Nhìn bóng lưng Tiêu Viêm, Tiêu Mị khẽ thở dài hồi tưởng: Ba năm trước, hắn từng mười một tuổi ngưng tụ đấu khí toàn, trở thành đấu giả trẻ nhất trăm năm của Tiêu gia, rồi bỗng nhiên mất sạch thiên phú trong một đêm.",
              37,
              8
            ),
          },
        ],
      },
    ],
  },

  // Cảnh 8: Tiêu Huân Nhi xuất hiện
  {
    id: "shot-8",
    order: 8,
    code: "Cảnh 8",
    text: "“Người tiếp theo, Tiêu Huân Nhi!” Giữa đám đông, một tử y thiếu nữ khí chất thoát tục tựa hoa sen mới nở bước ra, khiến mọi ánh mắt lập tức dồn lại trong im lặng.",
    duration: 6,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-8-1",
        shotId: "shot-8",
        characterId: "char-trac-nghiem-vien",
        status: "ready",
        totalDuration: 2,
        lines: [
          {
            id: "line-8-1-1",
            text: "“Người tiếp theo, Tiêu Huân Nhi!”",
            duration: 2,
            words: generateWordTimestamps("“Người tiếp theo, Tiêu Huân Nhi!”", 45, 2),
          },
        ],
      },
      {
        id: "block-8-2",
        shotId: "shot-8",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 4,
        lines: [
          {
            id: "line-8-2-1",
            text: "Giữa đám đông, một tử y thiếu nữ khí chất thoát tục tựa hoa sen mới nở bước ra, khiến mọi ánh mắt lập tức dồn lại trong im lặng.",
            duration: 4,
            words: generateWordTimestamps(
              "Giữa đám đông, một tử y thiếu nữ khí chất thoát tục tựa hoa sen mới nở bước ra, khiến mọi ánh mắt lập tức dồn lại trong im lặng.",
              47,
              4
            ),
          },
        ],
      },
    ],
  },

  // Cảnh 9: Cửu đoạn đấu khí chấn động
  {
    id: "shot-9",
    order: 9,
    code: "Cảnh 9",
    text: "Huân Nhi nhẹ nhàng đặt bàn tay trắng nõn lên bia đá. Hào quang rực rỡ bùng phát: “Đấu chi khí: Cửu đoạn! Cấp bậc: Cao cấp!” Cả quảng trường nín thở kinh hãi.",
    duration: 7,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-9-1",
        shotId: "shot-9",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 4,
        lines: [
          {
            id: "line-9-1-1",
            text: "Huân Nhi nhẹ nhàng đặt bàn tay trắng nõn lên bia đá. Hào quang rực rỡ bùng phát:",
            duration: 4,
            words: generateWordTimestamps(
              "Huân Nhi nhẹ nhàng đặt bàn tay trắng nõn lên bia đá. Hào quang rực rỡ bùng phát:",
              51,
              4
            ),
          },
        ],
      },
      {
        id: "block-9-2",
        shotId: "shot-9",
        characterId: "char-trac-nghiem-vien",
        status: "ready",
        totalDuration: 3,
        lines: [
          {
            id: "line-9-2-1",
            text: "“Đấu chi khí: Cửu đoạn! Cấp bậc: Cao cấp!”",
            duration: 3,
            words: generateWordTimestamps(
              "“Đấu chi khí: Cửu đoạn! Cấp bậc: Cao cấp!”",
              55,
              3
            ),
          },
        ],
      },
    ],
  },

  // Cảnh 10: Trắc nghiệm viên khen ngợi
  {
    id: "shot-10",
    order: 10,
    code: "Cảnh 10",
    text: "Trắc nghiệm viên nở nụ cười hiếm hoi: “Huân Nhi tiểu thư, nửa năm nữa người có thể thành đấu giả mười bốn tuổi thứ hai trong trăm năm nay!” Huân Nhi chỉ khẽ gật đầu rồi quay đi.",
    duration: 7,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-10-1",
        shotId: "shot-10",
        characterId: "char-trac-nghiem-vien",
        status: "ready",
        totalDuration: 4,
        lines: [
          {
            id: "line-10-1-1",
            text: "“Huân Nhi tiểu thư, nửa năm nữa người có thể thành đấu giả mười bốn tuổi thứ hai trong trăm năm nay!”",
            duration: 4,
            words: generateWordTimestamps(
              "“Huân Nhi tiểu thư, nửa năm nữa người có thể thành đấu giả mười bốn tuổi thứ hai trong trăm năm nay!”",
              58,
              4
            ),
          },
        ],
      },
      {
        id: "block-10-2",
        shotId: "shot-10",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 3,
        lines: [
          {
            id: "line-10-2-1",
            text: "Huân Nhi chỉ khẽ gật đầu rồi quay đi, hướng thẳng về phía Tiêu Viêm.",
            duration: 3,
            words: generateWordTimestamps(
              "Huân Nhi chỉ khẽ gật đầu rồi quay đi, hướng thẳng về phía Tiêu Viêm.",
              62,
              3
            ),
          },
        ],
      },
    ],
  },

  // Cảnh 11: Huân Nhi an ủi Tiêu Viêm
  {
    id: "shot-11",
    order: 11,
    code: "Cảnh 11",
    text: "“Tiêu Viêm ca ca, Huân Nhi tin người sẽ lại đứng dậy, lấy lại vinh quang và tôn nghiêm của mình… Tiêu Viêm ca ca năm đó, đích xác rất hấp dẫn.”",
    duration: 7,
    image: PLACEHOLDER_IMAGE,
    isLocked: false,
    blocks: [
      {
        id: "block-11-1",
        shotId: "shot-11",
        characterId: "char-tieu-huan-nhi",
        status: "ready",
        totalDuration: 7,
        lines: [
          {
            id: "line-11-1-1",
            text: "“Tiêu Viêm ca ca, Huân Nhi tin người sẽ lại đứng dậy, lấy lại vinh quang và tôn nghiêm của mình… Tiêu Viêm ca ca năm đó, đích xác rất hấp dẫn.”",
            duration: 7,
            words: generateWordTimestamps(
              "“Tiêu Viêm ca ca, Huân Nhi tin người sẽ lại đứng dậy, lấy lại vinh quang và tôn nghiêm của mình… Tiêu Viêm ca ca năm đó, đích xác rất hấp dẫn.”",
              65,
              7
            ),
          },
        ],
      },
    ],
  },

  // Cảnh 12: Hai bóng hình rời quảng trường
  {
    id: "shot-12",
    order: 12,
    code: "Cảnh 12",
    text: "Thiếu niên xấu hổ cười tự giễu rồi lạc mịch xoay người. Tiêu Huân Nhi mỉm cười bước nhanh theo, hai bóng hình sóng vai cùng rời khỏi quảng trường Tiêu gia.",
    duration: 6,
    image: PLACEHOLDER_IMAGE,
    isLocked: true,
    blocks: [
      {
        id: "block-12-1",
        shotId: "shot-12",
        characterId: "char-narrator",
        status: "ready",
        totalDuration: 6,
        lines: [
          {
            id: "line-12-1-1",
            text: "Thiếu niên xấu hổ cười tự giễu rồi lạc mịch xoay người. Tiêu Huân Nhi mỉm cười bước nhanh theo, hai bóng hình sóng vai cùng rời khỏi quảng trường Tiêu gia.",
            duration: 6,
            words: generateWordTimestamps(
              "Thiếu niên xấu hổ cười tự giễu rồi lạc mịch xoay người. Tiêu Huân Nhi mỉm cười bước nhanh theo, hai bóng hình sóng vai cùng rời khỏi quảng trường Tiêu gia.",
              72,
              6
            ),
          },
        ],
      },
    ],
  },
];
