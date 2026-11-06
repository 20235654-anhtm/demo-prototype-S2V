import { Button } from "@/components/ui/button";
import { Sparkles, Link2, X, CheckSquare } from "lucide-react";

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
    <div className="sticky top-0 z-20 flex items-center justify-between px-3 py-2 bg-primary text-primary-foreground rounded-lg shadow-md mb-3 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Left: Count */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <CheckSquare className="w-4 h-4 text-yellow-400" />
        <span>Đã chọn {selectedCount} phân cảnh</span>
      </div>

      {/* Middle & Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Button ✦ Chia lại */}
        <Button
          size="sm"
          onClick={onOpenResplit}
          className="h-7 text-xs bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold"
        >
          <Sparkles className="w-3 h-3 mr-1 text-slate-950" />
          Chia lại
        </Button>

        {/* Button 🔗 Gộp */}
        {selectedCount > 1 && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onMerge}
            disabled={!canMerge}
            title={!isAdjacent ? "Chỉ gộp được các cảnh liền kề" : "Gộp thành 1 phân cảnh"}
            className={`h-7 text-xs ${
              !canMerge ? "opacity-50 cursor-not-allowed text-muted-foreground" : "font-medium"
            }`}
          >
            <Link2 className="w-3 h-3 mr-1" />
            Gộp
          </Button>
        )}

        {/* Button ✕ Bỏ chọn */}
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          className="h-7 px-2 text-xs text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
          title="Bỏ chọn toàn bộ"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Bỏ chọn
        </Button>
      </div>
    </div>
  );
}

