import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Plus, Search } from "lucide-react";

interface ProjectToolbarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateClick: () => void;
}

export default function ProjectToolbar({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onCreateClick,
}: ProjectToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Row 1: Title + Create button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dự án của tôi</h2>
        <Button
          onClick={onCreateClick}
          className="bg-brand hover:bg-brand-hover text-brand-foreground font-semibold"
        >
          <Plus className="w-4 h-4" />
          Tạo dự án mới
        </Button>
      </div>

      {/* Row 2: Search + View toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm dự án..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="rounded-r-none"
          >
            <LayoutGrid className="w-4 h-4 mr-1" />
            Lưới
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="rounded-l-none"
          >
            <List className="w-4 h-4 mr-1" />
            Danh sách
          </Button>
        </div>
      </div>
    </div>
  );
}

