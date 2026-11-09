export interface WordTimestamp {
  word: string;
  start: number; // giây, ví dụ: 0.68
  end: number;   // giây, ví dụ: 1.15
}

export interface DialogueLine {
  id: string;              // UUID duy nhất của câu thoại
  text: string;            // Nội dung văn bản câu thoại
  audioUrl?: string;       // URL âm thanh của câu (nếu có)
  duration?: number;       // Thời lượng thực tế tính bằng giây
  words?: WordTimestamp[]; // Danh sách timestamp từng từ
}

export interface DialogueBlock {
  id: string;              // UUID của khối
  shotId: string;          // Thuộc phân cảnh nào (shot-1, shot-2...)
  characterId: string;     // ID nhân vật đọc khối này
  lines: DialogueLine[];   // Danh sách các câu thoại con trong khối
  status: "not_generated" | "generating" | "ready" | "stale"; // Trạng thái âm thanh
  totalDuration?: number;  // Tổng thời lượng âm thanh của khối
}

export interface CharacterAsset {
  id: string;              // ID nhân vật
  name: string;            // Tên nhân vật (Thỏ, Rùa, Narrator...)
  avatar: string;          // Ảnh avatar đại diện
  description: string;     // Mô tả đặc điểm, ngoại hình, tính cách
  voice: {
    id: string;            // ID giọng đọc
    name: string;          // Tên giọng đọc
    style: string;         // Đặc trưng giọng
  };
  volume: number;          // Âm lượng (mặc định 100 hoặc 150%)
}

export interface Shot {
  id: string;
  order: number;
  code: string;         // "Cảnh 1", "Cảnh 2", ...
  text: string;
  duration: number;     // Số giây, ví dụ: 6
  image: string;        // URL ảnh đại diện
  isLocked?: boolean;   // Đã khóa hình ảnh hay chưa
  blocks?: DialogueBlock[]; // Các khối thoại phân vai trong phân cảnh
}

export interface DiffProposal {
  targetShotIds: string[]; // Các id cảnh cũ bị thay thế
  newShots: Array<{
    id: string;
    code: string;
    text: string;
    duration: number;
    blocks?: DialogueBlock[];
  }>;
}

export type ResplitMode = "adjacent-segment" | "independent-shots";
