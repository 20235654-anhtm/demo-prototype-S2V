import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onClick: (projectId: string) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      className="cursor-pointer group flex flex-col"
      onClick={() => onClick(project.id)}
    >
      {/* Khung Thumbnail / Text Preview độc lập (có viền và bo góc) */}
      <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-stone-50/80 dark:bg-neutral-900 shadow-2xs">
        {/* Nút ... chỉ hiện khi hover */}
        <div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-white/90 hover:bg-white text-neutral-700 shadow-sm transition-colors cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Đổi tên</DropdownMenuItem>
              <DropdownMenuItem>Nhân bản</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Xóa dự án
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Thumbnail hoặc Text Preview */}
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full p-3 flex flex-col justify-end">
            <div className="w-full h-[88%] bg-white dark:bg-neutral-800 rounded-t-lg border-t border-x border-neutral-200/80 p-2.5 overflow-hidden">
              <p className="line-clamp-4 text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.textPreview}
              </p>
            </div>
          </div>
        )}

        {/* Badge trạng thái ở góc dưới bên trái */}
        <div className="absolute bottom-2 left-2 z-10">
          <Badge
            variant="secondary"
            className="text-xs bg-white/85 dark:bg-black/60 backdrop-blur-md shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5 inline-block" />
            {project.status}
          </Badge>
        </div>
      </div>

      {/* Thông tin Tiêu đề & Ngày tạo nằm BÊN NGOÀI khung hình */}
      <div className="mt-2.5 px-0.5">
        <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors text-foreground">
          {project.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Created {project.createdAt} · {project.author}
        </p>
      </div>
    </div>
  );
}
