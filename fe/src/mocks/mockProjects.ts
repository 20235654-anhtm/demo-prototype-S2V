import type { Project } from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    title: "Căn cứ kết quả giám định pháp y về nguyên nhân tử vong",
    thumbnail: "https://picsum.photos/seed/proj1/400/225",
    createdAt: "40 minutes ago",
    author: "Myanh",
    status: "Creation draft",
  },
  {
    id: "proj-2",
    title: "Diễn viên Thúy Diễm cho biết khi nhận kịch bản phim",
    thumbnail: "https://picsum.photos/seed/proj2/400/225",
    createdAt: "2 hours ago",
    author: "Myanh",
    status: "Creation draft",
  },
  {
    id: "proj-3",
    title: "Dưới sự thao túng của các đối tượng cầm đầu",
    textPreview:
      "Introduction:\nXin chào tất cả mọi người, hôm nay chúng ta sẽ cùng nhau tìm hiểu về một câu chuyện đặc biệt...",
    createdAt: "2 days ago",
    author: "Myanh",
    // Dự án này không có tag status -> click sẽ vào thẳng Studio
  },
  {
    id: "proj-4",
    title: "Bà Nguyễn Thị Thược - Câu chuyện cuộc đời",
    textPreview:
      "Chương 1: Tuổi thơ\nBà Nguyễn Thị Thược sinh ra trong một gia đình nông dân nghèo ở vùng quê Bắc Bộ...",
    createdAt: "5 days ago",
    author: "Myanh",
    // Dự án này không có tag status -> click sẽ vào thẳng Studio
  },
];
