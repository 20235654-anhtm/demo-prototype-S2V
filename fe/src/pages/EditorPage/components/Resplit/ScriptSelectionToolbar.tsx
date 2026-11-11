import { Button } from "@/components/ui/button";
import { RefreshCw, Link2, X, CheckSquare } from "lucide-react";

interface ScriptSelectionToolbarProps {
  selectedCount: number;
  isAdjacent: boolean;
  onOpenResplit: () => void;
  onMerge: () => void;
  onClearSelection: () => void;
}

export default function ScriptSelectionToolbar({
  selectedCount,
  isAdjacent,
  onOpenResplit,
  onMerge,
  onClearSelection,
}: ScriptSelectionToolbarProps) {
  if (selectedCount === 0) return null;

  const canMerge = selectedCount > 1 && isAdjacent;

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-3 py-2 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-primary/25 dark:border-primary/30 rounded-xl shadow-md shadow-black/5 mb-3 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Left: Count */}
      <div className="flex items-center gap-2 text-xs font-medium text-foreground">
        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/10 text-primary font-semibold text-[11px]">
          <CheckSquare className="w-3.5 h-3.5" />
        </span>
        <span>
          Đã chọn <strong className="text-primary font-semibold">{selectedCount}</strong> phân cảnh
        </span>
      </div>

      {/* Middle & Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Button Chia lại (cùng icon RefreshCw với Chia lại tất cả) */}
        <Button
          size="sm"
          onClick={onOpenResplit}
          className="h-7 px-2.5 text-xs bg-brand hover:bg-brand-hover text-brand-foreground font-medium shadow-2xs cursor-pointer gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3 text-brand-foreground" />
          <span>Chia lại</span>
        </Button>

        {/* Button 🔗 Gộp */}
        {selectedCount > 1 && (
          <Button
            size="sm"
            variant="outline"
            onClick={onMerge}
            disabled={!canMerge}
            title={!isAdjacent ? "Chỉ gộp được các cảnh liền kề" : "Gộp thành 1 phân cảnh"}
            className={`h-7 px-2.5 text-xs border-border/80 bg-background hover:bg-muted cursor-pointer transition-colors ${
              !canMerge
                ? "opacity-40 cursor-not-allowed text-muted-foreground"
                : "font-medium text-foreground"
            }`}
          >
            <Link2 className="w-3 h-3 mr-1" />
            <span>Gộp</span>
          </Button>
        )}

        {/* Button ✕ Bỏ chọn */}
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
          title="Bỏ chọn toàn bộ"
        >
          <X className="w-3.5 h-3.5 mr-0.5" />
          <span>Bỏ chọn</span>
        </Button>
      </div>
    </div>
  );
}

