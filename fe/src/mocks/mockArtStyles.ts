import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";

export interface ArtStyleItem {
  id: string;
  name: string;
  thumbnailUrl: string;
  description?: string;
}

export const mockArtStyles: ArtStyleItem[] = [
  {
    id: "ghibli",
    name: "Ghibli Anime",
    thumbnailUrl: PLACEHOLDER_IMAGE,
    description: "Hoạt hình Nhật Bản nhẹ nhàng, ấm áp",
  },
  {
    id: "cinematic",
    name: "3D Cinematic",
    thumbnailUrl: PLACEHOLDER_IMAGE,
    description: "Phim điện ảnh 3D chân thực, chiều sâu",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    thumbnailUrl: PLACEHOLDER_IMAGE,
    description: "Tranh màu nước hoài niệm, đậm chất thơ",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    thumbnailUrl: PLACEHOLDER_IMAGE,
    description: "Viễn tưởng tương lai, ánh sáng neon",
  },
];
