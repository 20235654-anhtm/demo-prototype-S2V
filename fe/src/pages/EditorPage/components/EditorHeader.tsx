import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Download } from "lucide-react";
import { cn } from "cn";
import ProjectPageHeader from "@/components/ProjectPageHeader";

interface EditorHeaderProps {
  title?: string;
  chapter?: number;
  onExport?: (options?: { resolution: string; fps: string }) => void;
}

export default function EditorHeader({
  title = "Đấu Phá Thương Khung",
  chapter,
  onExport,
}: EditorHeaderProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const backTo = projectId ? `/project/${projectId}/overview` : "/";
  const chapterLabel = chapter ? `Chương ${chapter}` : undefined;

  const [open, setOpen] = useState(false);
  const [resolution, setResolution] = useState<"720p" | "1080p" | "4k">("1080p");
  const [fps, setFps] = useState<"30" | "60">("30");

  const handleConfirmExport = () => {
    setOpen(false);
    onExport?.({ resolution, fps });
  };

  return (
    <ProjectPageHeader
      title={title}
      titleTo={chapterLabel ? backTo : undefined}
      trailing={chapterLabel}
      backTo={backTo}
      backTitle="Quay lại tổng quan dự án"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              size="sm"
              className="bg-brand hover:bg-brand-hover text-brand-foreground font-semibold shadow-xs gap-1.5 h-8 px-3.5 cursor-pointer"
            />
          }
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất video</span>
        </PopoverTrigger>

        <PopoverContent align="end" sideOffset={8} className="w-80 p-4 space-y-4 rounded-2xl shadow-xl">
          <h4 className="text-sm font-semibold text-foreground">
            Tùy chọn xuất video
          </h4>

          {/* Độ phân giải */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Độ phân giải
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "720p", label: "720p HD" },
                { id: "1080p", label: "1080p FHD" },
                { id: "4k", label: "4K UHD" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setResolution(item.id as "720p" | "1080p" | "4k")}
                  className={cn(
                    "py-2 px-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer",
                    resolution === item.id
                      ? "border-brand bg-brand/10 font-semibold text-brand-strong dark:text-brand shadow-2xs"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="block font-semibold text-foreground">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tốc độ khung hình (FPS) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Tốc độ khung hình (FPS)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "30", label: "30 FPS" },
                { id: "60", label: "60 FPS" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFps(item.id as "30" | "60")}
                  className={cn(
                    "py-2 px-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer",
                    fps === item.id
                      ? "border-brand bg-brand/10 font-semibold text-brand-strong dark:text-brand shadow-2xs"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="font-semibold block text-foreground">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleConfirmExport}
            className="w-full bg-brand hover:bg-brand-hover text-brand-foreground font-semibold shadow-xs gap-1.5 h-9 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất video ({resolution.toUpperCase()} · {fps} FPS)</span>
          </Button>
        </PopoverContent>
      </Popover>
    </ProjectPageHeader>
  );
}
