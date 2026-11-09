import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Check } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";
import {
  STORY_ASSET_KIND_LABEL,
  type StoryAsset,
} from "@/mocks/mockStoryDetails";

interface AssetDetailDialogProps {
  asset: StoryAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (updatedAsset: StoryAsset) => void;
}

export default function AssetDetailDialog({
  asset,
  open,
  onOpenChange,
  onSave,
}: AssetDetailDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSavedToast, setIsSavedToast] = useState(false);

  useEffect(() => {
    if (asset) {
      setName(asset.name || "");
      setDescription(
        asset.imagePrompt ||
          asset.description ||
          `Hình ảnh chi tiết cho ${asset.name}, phong cách 3D cinematic, chất lượng cao.`
      );
      setImageUrl(asset.imageUrl || PLACEHOLDER_IMAGE);
    }
  }, [asset]);

  if (!asset) return null;

  const kindLabel = STORY_ASSET_KIND_LABEL[asset.kind] || "Tài sản";

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setImageUrl(asset.imageUrl || PLACEHOLDER_IMAGE);
      setIsRegenerating(false);
    }, 1000);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...asset,
        name,
        description,
        imagePrompt: description,
        imageUrl,
      });
    }
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      onOpenChange(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Thông tin chi tiết {kindLabel.toLowerCase()}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-3">
          {/* Cột trái: Khung ảnh + Nút Tạo lại ảnh */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-square rounded-2xl border-2 border-dashed border-border bg-muted/40 overflow-hidden flex flex-col items-center justify-center p-3 shadow-inner group">
              <img
                src={imageUrl}
                alt={name}
                className={`w-full h-full object-contain rounded-xl transition-all duration-300 ${
                  isRegenerating ? "opacity-30 scale-95 blur-xs" : "opacity-90"
                }`}
              />

              {isRegenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-xs gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-brand" />
                  <span className="text-xs font-medium text-foreground">Đang sinh ảnh mới...</span>
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="w-full mt-3 gap-1.5 text-xs font-semibold cursor-pointer border-brand/40 text-brand-strong hover:bg-brand/10 hover:text-brand-strong dark:text-brand"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
              Tạo lại ảnh
            </Button>
          </div>

          {/* Cột phải: Form thông tin chi tiết */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Tên */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Tên {kindLabel.toLowerCase()}
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Nhập tên ${kindLabel.toLowerCase()}...`}
                className="h-9 text-sm"
              />
            </div>

            {/* Mô tả */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Mô tả {kindLabel.toLowerCase()}
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Nhập mô tả tạo hình ${kindLabel.toLowerCase()}...`}
                rows={5}
                className="text-xs leading-relaxed resize-none font-normal text-foreground bg-muted/20"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer"
          >
            Đóng
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSavedToast}
            className="bg-brand hover:bg-brand-hover text-brand-foreground text-xs font-semibold cursor-pointer gap-1"
          >
            {isSavedToast ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Đã lưu
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
