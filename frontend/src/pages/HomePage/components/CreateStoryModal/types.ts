export type NarrationStyle = 'single' | 'multi';

export interface ArtStyleOption {
  id: string;
  name: string;
  thumbnailUrl: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  avatarUrl: string;
  accent: 'Bắc' | 'Trung' | 'Nam' | 'All';
  gender: 'Nam' | 'Nữ' | 'All';
  ageGroup?: string;
  isCustom?: boolean;
}

export interface CharacterItem {
  id: string;
  name: string;
  description: string;
  previewLine: string;
  voiceId?: string;
  voiceName?: string;
  avatarUrl?: string;
  isNarrator?: boolean;
}

export interface CreateStoryFormData {
  // Bước 1: Tải lên
  file: {
    name: string;
    size: string;
    format: string;
    charCount: number;
    estimatedDuration: string;
  } | null;
  sampleText: string;

  // Bước 2: Thiết lập
  narrationStyle: NarrationStyle;
  coverImage: string | null;
  language: string; // 'vi' | 'en'
  artStyle: string; // 'ghibli' | 'cinematic' | 'watercolor' | 'cyberpunk'
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
  visibility: 'private' | 'public';

  // Bước 3: Giọng đọc hoặc Nhân vật
  singleVoiceId?: string;
  characters: CharacterItem[];
}
