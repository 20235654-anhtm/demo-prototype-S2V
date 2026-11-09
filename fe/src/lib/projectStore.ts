import { mockProjects } from "@/mocks/mockProjects";
import type { Project } from "@/types/project";

const STORAGE_KEY = "s2v:projects:v3";

function readStoredProjects(): Project[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is Project =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as Project).id === "string" &&
          typeof (item as Project).title === "string"
      )
      .map((project) =>
        project.author === "Myanh"
          ? { ...project, author: "My Anh" }
          : project
      );
  } catch {
    return [];
  }
}

/** Danh sách dự án: dự án do người dùng tạo được ưu tiên hơn mock data. */
export function getProjects(): Project[] {
  const stored = readStoredProjects();
  const storedIds = new Set(stored.map((project) => project.id));

  return [
    ...stored,
    ...mockProjects.filter((project) => !storedIds.has(project.id)),
  ];
}

export function getProject(projectId: string): Project | undefined {
  return getProjects().find((project) => project.id === projectId);
}

export function saveProject(project: Project): void {
  if (typeof window === "undefined") return;

  const stored = readStoredProjects();
  const nextProjects = [
    project,
    ...stored.filter((item) => item.id !== project.id),
  ];

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProjects));
  } catch {
    // Bỏ qua nếu localStorage bị đầy hoặc bị chặn (chế độ riêng tư).
  }
}
