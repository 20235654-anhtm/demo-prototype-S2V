export interface Project {
  id: string;
  title: string;
  thumbnail?: string;        // URL ảnh thumbnail (nếu có)
  textPreview?: string;       // Văn bản xem trước (nếu không có thumbnail)
  createdAt: string;          // Thời gian tạo (ISO string hoặc relative)
  author: string;
  status?: "Creation draft";
}

export interface Voice {
  id: string;
  name: string;
  avatar: string;             // URL ảnh đại diện
  audioSampleUrl?: string;    // URL audio demo
  costPerChar: number;        // Giá điểm/ký tự
  tags: string[];             // ["Nâng cao", "Sách nói", "HN", "SG"]
  isPremium: boolean;
  region: string;             // "HN" | "SG"
}

export interface StoryDraft {
  file: {
    name: string;
    size: string;             // "58 KB"
    format: "DOCX" | "PDF" | "TXT";
    charCount: number;
    estimatedDuration: string; // "00:04:24"
  } | null;
  sampleText: string;
  selectedVoiceId: string | null;
}

