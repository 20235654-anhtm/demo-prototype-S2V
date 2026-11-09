import type { Project } from "@/types/project";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";

const STORY_PREVIEW =
  "“Đấu chi lực, tam đoạn”\nNhìn trắc nghiệm ma thạch có chút chói mắt năm chữ, thiếu niên mặt không chút thay đổi, thần sắc tự giễu...";

export const mockProjects: Project[] = [
  {
    id: "9f2c7a1e",
    title: "Đấu Phá Thương Khung",
    thumbnail: PLACEHOLDER_IMAGE,
    textPreview: STORY_PREVIEW,
    createdAt: "40 minutes ago",
    author: "My Anh",
    visibility: "private",
  },
  {
    id: "4b8d6e2a",
    title: "Đấu La Đại Lục",
    thumbnail: PLACEHOLDER_IMAGE,
    textPreview: STORY_PREVIEW,
    createdAt: "Vừa xong",
    author: "My Anh",
    visibility: "private",
    status: "draft",
    sourceFileName: "Đấu Phá Thương Khung",
  },
];
