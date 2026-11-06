export interface Shot {
  id: string;
  order: number;
  code: string;         // "Cảnh 1", "Cảnh 2", ...
  text: string;
  duration: number;     // Số giây, ví dụ: 6
  image: string;        // URL ảnh đại diện
  isLocked?: boolean;   // Đã khóa hình ảnh hay chưa
}

export interface DiffProposal {
  targetShotIds: string[]; // Các id cảnh cũ bị thay thế
  newShots: Array<{
    id: string;
    code: string;
    text: string;
    duration: number;
  }>;
}

export type ResplitMode = "adjacent-segment" | "independent-shots";

