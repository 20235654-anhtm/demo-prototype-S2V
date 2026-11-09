import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface ProjectPageHeaderProps {
  title: string;
  backTo?: string;
  backTitle?: string;
  children?: ReactNode;
}

export default function ProjectPageHeader({
  title,
  backTo = "/",
  backTitle = "Quay lại trang chủ",
  children,
}: ProjectPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b bg-white/95 dark:bg-neutral-900/95 backdrop-blur px-3 md:px-5 flex items-center justify-between gap-3 shrink-0 z-20">
      <div className="flex items-center gap-2 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(backTo)}
          className="h-8 w-8 rounded-lg hover:bg-muted shrink-0 text-muted-foreground hover:text-foreground"
          title={backTitle}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 min-w-0"
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="shrink-0 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Dự án
          </button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
          <h1 className="text-sm font-semibold truncate max-w-[220px] sm:max-w-md">
            {title}
          </h1>
        </nav>
      </div>

      {children ? (
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      ) : null}
    </header>
  );
}
