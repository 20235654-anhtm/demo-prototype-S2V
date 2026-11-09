export type StoryAssetKind = "character" | "location" | "prop";

export interface StoryAsset {
  id: string;
  name: string;
  kind: StoryAssetKind;
  description: string;
  tags: string[];
}

export const STORY_ASSET_KIND_LABEL: Record<StoryAssetKind, string> = {
  character: "Nhân vật",
  location: "Địa điểm",
  prop: "Vật phẩm",
};

export const mockStoryAssets: StoryAsset[] = [
  {
    id: "asset-tieu-vien",
    name: "Tiêu Viêm",
    kind: "character",
    description:
      "Thiếu niên từng là thiên tài trăm năm của Ô Thản Thành; sau biến cố ba năm trước chỉ còn tam đoạn đấu khí.",
    tags: ["Nhân vật chính", "Tam đoạn"],
  },
  {
    id: "asset-tieu-mi",
    name: "Tiêu Mị",
    kind: "character",
    description:
      "Thiếu nữ mười bốn tuổi, thanh thuần pha chút vũ mị; đấu khí thất đoạn, được xem là hạt giống của gia tộc.",
    tags: ["Thất đoạn", "Hạt giống gia tộc"],
  },
  {
    id: "asset-tieu-huan-nhi",
    name: "Tiêu Huân Nhi",
    kind: "character",
    description:
      "Tử y thiếu nữ khí chất thoát tục; đấu khí cửu đoạn, gia tộc tuổi trẻ đệ nhất nhân.",
    tags: ["Cửu đoạn", "Đệ nhất nhân"],
  },
  {
    id: "asset-trac-nghiem-vien",
    name: "Trắc nghiệm viên",
    kind: "character",
    description:
      "Trung niên nam tử phụ trách đo đấu khí, thái độ hờ hững trước kết quả của Tiêu Viêm.",
    tags: ["Phụ trách trắc nghiệm"],
  },
  {
    id: "asset-dam-dong",
    name: "Đám đông tộc nhân",
    kind: "character",
    description:
      "Các tộc nhân chứng kiến lễ trắc nghiệm, nhanh chóng châm chọc khi Tiêu Viêm mất phong độ.",
    tags: ["Quần chúng"],
  },
  {
    id: "asset-quang-truong",
    name: "Quảng trường Tiêu gia",
    kind: "location",
    description:
      "Nơi diễn ra lễ trắc nghiệm đấu khí hằng năm, tập trung đông đảo tộc nhân.",
    tags: ["Địa điểm chính"],
  },
  {
    id: "asset-o-than-thanh",
    name: "Ô Thản Thành",
    kind: "location",
    description:
      "Thành trấn quê hương của Tiêu Viêm, nơi gia tộc Tiêu gia tọa lạc.",
    tags: ["Quê hương"],
  },
  {
    id: "asset-ma-thach-bia",
    name: "Ma thạch bia",
    kind: "prop",
    description:
      "Bia đá đen dùng để đo đấu khí; kết quả hiện thành những chữ phát sáng.",
    tags: ["Vật phẩm trắc nghiệm"],
  },
  {
    id: "asset-hac-kim-tu-tu",
    name: "Hắc kim tử tụ",
    kind: "prop",
    description:
      "Trang phục tím đen của Tiêu Huân Nhi, tôn lên khí chất thoát tục của nàng.",
    tags: ["Trang phục"],
  },
  {
    id: "asset-dau-khi",
    name: "Đấu khí",
    kind: "prop",
    description:
      "Năng lượng tu luyện của đấu giả, chia từ nhất đoạn đến thập đoạn.",
    tags: ["Hệ thống sức mạnh"],
  },
];

export type RelationshipTone = "positive" | "neutral" | "conflict";

export interface StoryRelationship {
  id: string;
  from: string;
  to: string;
  label: string;
  description: string;
  tone: RelationshipTone;
  strength: number;
}

export const mockStoryRelationships: StoryRelationship[] = [
  {
    id: "rel-tieu-vien-huan-nhi",
    from: "Tiêu Viêm",
    to: "Tiêu Huân Nhi",
    label: "Tôn kính & tin tưởng",
    description:
      "Huân Nhi là người hiếm hoi vẫn giữ lòng tôn kính, tin Tiêu Viêm sẽ đứng dậy và lấy lại vinh quang.",
    tone: "positive",
    strength: 5,
  },
  {
    id: "rel-tieu-vien-tieu-mi",
    from: "Tiêu Viêm",
    to: "Tiêu Mị",
    label: "Bạn cũ, nay cách biệt",
    description:
      "Tiêu Mị từng ngưỡng mộ thiên tài năm xưa, nhưng nay xem Tiêu Viêm đã khác giai tầng và không còn tương xứng.",
    tone: "neutral",
    strength: 2,
  },
  {
    id: "rel-tieu-vien-trac-nghiem",
    from: "Tiêu Viêm",
    to: "Trắc nghiệm viên",
    label: "Đánh giá / bị đánh giá",
    description:
      "Trắc nghiệm viên công bố kết quả tam đoạn với thái độ hờ hững, không chút thiên vị.",
    tone: "neutral",
    strength: 2,
  },
  {
    id: "rel-tieu-vien-gia-toc",
    from: "Tiêu Viêm",
    to: "Gia tộc Tiêu gia",
    label: "Thiên tài sa ngã",
    description:
      "Từ niềm tự hào của gia tộc thành đối tượng châm chọc; chỉ phụ thân còn đứng ra bảo vệ.",
    tone: "conflict",
    strength: 4,
  },
  {
    id: "rel-huan-nhi-tieu-mi",
    from: "Tiêu Huân Nhi",
    to: "Tiêu Mị",
    label: "Đồng tộc, ngầm so sánh",
    description:
      "Cùng thế hệ tài năng, nhưng Huân Nhi nổi bật hơn với cửu đoạn đấu khí và khí chất thoát tục.",
    tone: "neutral",
    strength: 3,
  },
];

export type TimelineKind =
  | "opening"
  | "conflict"
  | "development"
  | "flashback"
  | "climax"
  | "resolution";

export interface StoryTimelineEvent {
  id: string;
  order: number;
  kind: TimelineKind;
  label: string;
  title: string;
  description: string;
  location: string;
  characters: string[];
}

export const mockStoryTimeline: StoryTimelineEvent[] = [
  {
    id: "event-1",
    order: 1,
    kind: "opening",
    label: "Mở đầu",
    title: "Lễ trắc nghiệm bắt đầu",
    description:
      "Tiêu Viêm bước lên quảng trường, trắc nghiệm ma thạch hiện lên năm chữ chói mắt: “Đấu chi lực, tam đoạn”.",
    location: "Quảng trường Tiêu gia",
    characters: ["Tiêu Viêm", "Trắc nghiệm viên"],
  },
  {
    id: "event-2",
    order: 2,
    kind: "conflict",
    label: "Biến cố",
    title: "Kết quả tam đoạn",
    description:
      "Trắc nghiệm viên công bố cấp thấp; đám đông xôn xao châm chọc, Tiêu Viêm lặng lẽ lùi về cuối hàng.",
    location: "Quảng trường Tiêu gia",
    characters: ["Tiêu Viêm", "Đám đông tộc nhân"],
  },
  {
    id: "event-3",
    order: 3,
    kind: "development",
    label: "Phát triển",
    title: "Tiêu Mị tỏa sáng",
    description:
      "Tiêu Mị đạt thất đoạn, cấp cao; nàng trở thành tâm điểm và nhận ánh mắt ngưỡng mộ của cả quảng trường.",
    location: "Quảng trường Tiêu gia",
    characters: ["Tiêu Mị", "Đám đông tộc nhân"],
  },
  {
    id: "event-4",
    order: 4,
    kind: "flashback",
    label: "Hồi tưởng",
    title: "Thiên tài một đêm sa ngã",
    description:
      "Ba năm trước, Tiêu Viêm từng ngưng tụ đấu khí toàn, trở thành đấu giả trẻ nhất trăm năm của gia tộc; rồi đấu khí biến mất.",
    location: "Ô Thản Thành",
    characters: ["Tiêu Viêm", "Tiêu Mị"],
  },
  {
    id: "event-5",
    order: 5,
    kind: "climax",
    label: "Cao trào",
    title: "Tiêu Huân Nhi xuất hiện",
    description:
      "Tử y thiếu nữ đạt cửu đoạn, cả sân lặng đi; trắc nghiệm viên dự báo nàng sẽ thành đấu giả trong nửa năm.",
    location: "Quảng trường Tiêu gia",
    characters: ["Tiêu Huân Nhi", "Trắc nghiệm viên"],
  },
  {
    id: "event-6",
    order: 6,
    kind: "resolution",
    label: "Kết đoạn",
    title: "Lời động viên",
    description:
      "Huân Nhi cúi chào, tin Tiêu Viêm sẽ đứng dậy; hai người sóng vai rời quảng trường, khép lại chương mở đầu.",
    location: "Quảng trường Tiêu gia",
    characters: ["Tiêu Viêm", "Tiêu Huân Nhi"],
  },
];
