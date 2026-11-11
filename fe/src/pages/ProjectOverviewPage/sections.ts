import { BookOpen, History, Network, Users, Settings, type LucideIcon } from "lucide-react";
import type { OverviewSection } from "./types";

export interface OverviewSectionMeta {
  id: OverviewSection;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const OVERVIEW_SECTIONS: OverviewSectionMeta[] = [
  {
    id: "assets",
    label: "Tài sản truyện",
    description: "Nhân vật, bối cảnh & đạo cụ",
    icon: Users,
  },
  {
    id: "chapters",
    label: "Chương truyện",
    description: "Danh sách chương trong truyện",
    icon: BookOpen,
  },
  {
    id: "relationships",
    label: "Quan hệ nhân vật",
    description: "Liên kết & mức độ gắn kết",
    icon: Network,
  },
  {
    id: "timeline",
    label: "Dòng thời gian truyện",
    description: "Diễn tiến sự kiện trong chương",
    icon: History,
  },
  {
    id: "settings",
    label: "Cài đặt dự án",
    description: "Ngắt nghỉ, nhạc nền & định dạng video",
    icon: Settings,
  },
];

export const getOverviewSectionMeta = (id: OverviewSection) =>
  OVERVIEW_SECTIONS.find((section) => section.id === id) ?? OVERVIEW_SECTIONS[0];
