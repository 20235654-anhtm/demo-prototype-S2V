import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Image, MoreHorizontal } from "lucide-react";
import type { Project } from "@/types/project";

interface ProjectTableProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
}

export default function ProjectTable({
  projects,
  onProjectClick,
}: ProjectTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Created by</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onProjectClick(project.id)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  {/* Icon type */}
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                    {project.thumbnail ? (
                      <Image className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="font-medium text-sm truncate">
                    {project.title}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {project.createdAt}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {project.author}
              </TableCell>
              <TableCell>
                {project.status === "Creation draft" && (
                  <Badge variant="secondary" className="text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 inline-block" />
                    {project.status}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
