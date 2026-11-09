import type { Voice } from "@/types/project";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";

export const mockVoices: Voice[] = [
  {
    id: "voice-1",
    name: "Duy Phương nâng cao (Beta)",
    avatar: PLACEHOLDER_IMAGE,
    audioSampleUrl: "#",
    costPerChar: 2,
    tags: ["Nâng cao", "Sách nói"],
    isPremium: true,
    region: "HN",
  },
  {
    id: "voice-2",
    name: "Thanh Long nâng cao",
    avatar: PLACEHOLDER_IMAGE,
    audioSampleUrl: "#",
    costPerChar: 2,
    tags: ["Nâng cao", "Sách nói"],
    isPremium: true,
    region: "HN",
  },
  {
    id: "voice-3",
    name: "HN - Hà Chi",
    avatar: PLACEHOLDER_IMAGE,
    audioSampleUrl: "#",
    costPerChar: 1,
    tags: ["Cơ bản", "Sách nói"],
    isPremium: false,
    region: "HN",
  },
  {
    id: "voice-4",
    name: "SG - Chí Đạt",
    avatar: PLACEHOLDER_IMAGE,
    audioSampleUrl: "#",
    costPerChar: 1,
    tags: ["Cơ bản", "Tin tức"],
    isPremium: false,
    region: "SG",
  },
  {
    id: "voice-5",
    name: "HN - Thanh Long",
    avatar: PLACEHOLDER_IMAGE,
    audioSampleUrl: "#",
    costPerChar: 1,
    tags: ["Cơ bản", "Sách nói"],
    isPremium: false,
    region: "HN",
  },
];

