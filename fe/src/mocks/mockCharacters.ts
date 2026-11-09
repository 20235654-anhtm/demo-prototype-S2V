import type { CharacterAsset } from "@/types/script";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";

export const mockCharacters: CharacterAsset[] = [
  {
    id: "char-narrator",
    name: "Người dẫn chuyện",
    avatar: PLACEHOLDER_IMAGE,
    description: "Giọng đọc truyền cảm dẫn dắt diễn biến câu chuyện và bối cảnh không gian.",
    voice: {
      id: "v-trieu-duong",
      name: "Triệu Dương",
      style: "Trầm ấm, truyền cảm (Nam)",
    },
    volume: 150,
  },
  {
    id: "char-tieu-viem",
    name: "Tiêu Viêm",
    avatar: PLACEHOLDER_IMAGE,
    description: "Thiếu niên từng là thiên tài trăm năm của Ô Thản Thành; sau biến cố ba năm trước chỉ còn tam đoạn đấu khí.",
    voice: {
      id: "v-duy-khoa",
      name: "Duy Khoa",
      style: "Hà Nội chuẩn, cương nghị (Nam)",
    },
    volume: 150,
  },
  {
    id: "char-tieu-huan-nhi",
    name: "Tiêu Huân Nhi",
    avatar: PLACEHOLDER_IMAGE,
    description: "Tử y thiếu nữ khí chất thoát tục; đấu khí cửu đoạn, gia tộc tuổi trẻ đệ nhất nhân.",
    voice: {
      id: "v-ha-chi",
      name: "Hà Chi",
      style: "Dịu dàng, truyền cảm (Nữ)",
    },
    volume: 150,
  },
  {
    id: "char-trac-nghiem-vien",
    name: "Trắc nghiệm viên",
    avatar: PLACEHOLDER_IMAGE,
    description: "Trung niên nam tử phụ trách đo đấu khí, thái độ hờ hững trước kết quả của Tiêu Viêm.",
    voice: {
      id: "v-hoang-nam",
      name: "Hoàng Nam",
      style: "Nam tính, đĩnh đạc (Nam)",
    },
    volume: 150,
  },
  {
    id: "char-tieu-mi",
    name: "Tiêu Mị",
    avatar: PLACEHOLDER_IMAGE,
    description: "Thiếu nữ mười bốn tuổi, thanh thuần pha chút vũ mị; đấu khí thất đoạn, được xem là hạt giống của gia tộc.",
    voice: {
      id: "v-cam-hong",
      name: "Cẩm Hồng",
      style: "Miền Nam bản địa, thanh thoát (Nữ)",
    },
    volume: 150,
  },
  {
    id: "char-tho",
    name: "Thỏ",
    avatar: PLACEHOLDER_IMAGE,
    description: "Chú thỏ trắng nhanh nhẹn, tinh nghịch nhưng hay chủ quan và ham ngủ nướng.",
    voice: {
      id: "v-duy-khoa",
      name: "Duy Khoa",
      style: "Lém lỉnh, lanh lợi",
    },
    volume: 150,
  },
  {
    id: "char-rua",
    name: "Rùa",
    avatar: PLACEHOLDER_IMAGE,
    description: "Bác rùa già điềm đạm, kiên trì, từng bước vững chãi 'chậm mà chắc'.",
    voice: {
      id: "v-minh-triet",
      name: "Minh Triết",
      style: "Sâu lắng, trầm ổn",
    },
    volume: 150,
  },
];

export const DEFAULT_CHARACTER_ID = "char-narrator";
