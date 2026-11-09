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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, MoreHorizontal, Info } from "lucide-react";
import { PROJECT_STATUS_LABEL, type Project } from "@/types/project";

interface ProjectTableProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function ProjectTable({
  projects,
  onProjectClick,
}: ProjectTableProps) {
  return (
    <TooltipProvider>
      <div className="border rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Title</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onProjectClick(project)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Icon type / Thumbnail bo tròn */}
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="font-medium text-sm truncate hover:text-primary transition-colors">
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
                  {project.status === "draft" && (
                    <Badge variant="secondary" className="text-xs">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5 inline-block" />
                      {PROJECT_STATUS_LABEL[project.status]}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div
                    className="flex items-center justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Nút (i) xem chi tiết thông số kèm Tooltip */}
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <button
                            type="button"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        }
                      />
                      <TooltipContent>
                        <span>Thông tin dự án</span>
                      </TooltipContent>
                    </Tooltip>

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
    </TooltipProvider>
  );
}
