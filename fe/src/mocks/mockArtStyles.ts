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
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80",
    description: "Hoạt hình Nhật Bản nhẹ nhàng, ấm áp",
  },
  {
    id: "cinematic",
    name: "3D Cinematic",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    description: "Phim điện ảnh 3D chân thực, chiều sâu",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    thumbnailUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80",
    description: "Tranh màu nước hoài niệm, đậm chất thơ",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    thumbnailUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&auto=format&fit=crop&q=80",
    description: "Viễn tưởng tương lai, ánh sáng neon",
  },
];
