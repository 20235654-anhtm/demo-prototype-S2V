import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  X,
  Palette,
  RefreshCw,
  RotateCcw,
  Plus,
} from "lucide-react";
import type { Shot, ShotVisualData } from "@/types/script";
import {
  mockStoryAssets,
  type StoryAsset,
  type StoryAssetKind,
} from "@/mocks/mockStoryDetails";
import { AssetSelectPopover } from "./AssetSelectPopover";

export const DEFAULT_SHOT_PROMPTS: Record<string, string> = {
  "shot-1":
    "Cận cảnh ma thạch bia cổ kính khổng lồ trên quảng trường Tiêu gia, bề mặt đá đen khắc phù văn phát sáng vàng rực rỡ với dòng chữ Đấu chi lực tam đoạn, không khí trang nghiêm huyền bí, phong cách 3D cinematic độ phân giải cao.",
  "shot-2":
    "Trung niên trắc nghiệm viên áo xám nghiêm nghị đứng cạnh ma thạch bia phán xét, phía sau là đám đông tộc nhân Tiêu gia xôn xao chỉ trỏ, ánh mắt Tiêu Viêm trầm lặng tự giễu, phong cách phim hoạt hình 3D tiên hiệp.",
  "shot-3":
    "Tiêu Viêm cúi đầu nắm chặt tay móng tay đâm vào da thịt, bóng lưng cô đơn giữa quảng trường đá rộng lớn, ánh hoàng hôn chiếu xiên tạo bóng dài u uất, góc máy thấp ấn tượng.",
  "shot-4":
    "Thiếu nữ Tiêu Mị 14 tuổi thanh thuần kiêu sa trong y phục đỏ nhạt, đứng trước ma thạch bia rực rỡ ánh sáng thất đoạn đấu khí, nụ cười đắc ý, các thiếu niên xung quanh ngưỡng mộ tán thưởng.",
  "shot-5":
    "Tử y thiếu nữ Tiêu Huân Nhi khí chất thoát tục tựa tiên tử, tà áo tím thêu kim tuyến bay nhẹ trong gió, ma thạch bia chấn động tỏa hào quang cửu đoạn đấu khí chói lòa cả quảng trường.",
  "shot-6":
    "Tiêu Huân Nhi bước tới mỉm cười dịu dàng an ủi Tiêu Viêm, ánh mắt tràn đầy sự tin tưởng son sắt, hai bóng người sóng vai bên thềm đá cổ kính, khung hình ấm áp lãng mạn.",
};

interface ShotVisualModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shot: Shot | null;
  onUpdateShotVisual?: (shotId: string, visualData: Partial<ShotVisualData>) => void;
  onOpenStoryAssetsForEdit?: (assetId: string) => void;
  onOpenStoryAssetsForCreate?: (kind: StoryAssetKind, initialName?: string) => void;
}

export default function ShotVisualModal({
  open,
  onOpenChange,
  shot,
  onUpdateShotVisual,
  onOpenStoryAssetsForEdit,
  onOpenStoryAssetsForCreate,
}: ShotVisualModalProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activePopoverKind, setActivePopoverKind] = useState<StoryAssetKind | null>(null);

  if (!shot) return null;

  const currentVisual = shot.visual || {
    prompt:
      DEFAULT_SHOT_PROMPTS[shot.id] ||
      `Phân cảnh minh họa: ${shot.text}. Phong cách 3D cinematic độ phân giải cao.`,
    status: "ready" as const,
    linkedAssetIds: [],
    unlinkedWarnings: [],
  };

  const handlePromptChange = (newPrompt: string) => {
    onUpdateShotVisual?.(shot.id, {
      prompt: newPrompt,
      isPromptModified: true,
    });
  };

  const handleRestoreDefaultPrompt = () => {
    const defaultPrompt =
      DEFAULT_SHOT_PROMPTS[shot.id] ||
      `Phân cảnh minh họa: ${shot.text}. Phong cách 3D cinematic độ phân giải cao.`;
    handlePromptChange(defaultPrompt);
  };

  const handleRegenerateSingle = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      onUpdateShotVisual?.(shot.id, {
        status: "ready",
        isAssetChanged: false,
        isPromptModified: false,
      });
    }, 1200);
  };

  const handleAddAssetToShot = (asset: StoryAsset) => {
    const nextAssetIds = Array.from(
      new Set([...(currentVisual.linkedAssetIds || []), asset.id])
    );
    onUpdateShotVisual?.(shot.id, {
      linkedAssetIds: nextAssetIds,
    });
    setActivePopoverKind(null);
  };

  const handleRemoveAssetFromShot = (assetId: string) => {
    const nextAssetIds = (currentVisual.linkedAssetIds || []).filter(
      (id) => id !== assetId
    );
    onUpdateShotVisual?.(shot.id, {
      linkedAssetIds: nextAssetIds,
    });
  };

  const linkedAssetsGrouped = useMemo(() => {
    const assetIds = currentVisual.linkedAssetIds || [];
    const assets = mockStoryAssets.filter((a) => assetIds.includes(a.id));
    return {
      characters: assets.filter((a) => a.kind === "character"),
      locations: assets.filter((a) => a.kind === "location"),
      props: assets.filter((a) => a.kind === "prop"),
    };
  }, [currentVisual.linkedAssetIds]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        showOverlay={false}
        className="sm:max-w-5xl w-[94vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl border-border bg-white dark:bg-neutral-900"
      >
        {/* Header */}
        <DialogHeader className="px-5 py-3.5 border-b flex flex-row items-center justify-between space-y-0 shrink-0 bg-muted/20">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-brand/15 text-brand-strong dark:text-brand flex items-center justify-center shrink-0">
              <Palette className="w-4 h-4" />
            </div>
            <DialogTitle className="text-sm font-semibold text-foreground truncate">
              {shot.code.replace("Cảnh", "Phân cảnh")}
            </DialogTitle>
          </div>
          <DialogClose render={<Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0" />}>
            <X className="w-3.5 h-3.5" />
            <span className="sr-only">Đóng</span>
          </DialogClose>
        </DialogHeader>

        {/* Thân cuộn: Chi tiết hình ảnh phân cảnh */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* CỘT TRÁI: Ảnh preview + cảnh báo */}
          <div className="min-w-0 space-y-4">
          {/* 1. Preview ảnh 16:9 + Nút Sinh lại */}
          <div className="space-y-2.5">
            <div className="relative w-full aspect-video rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 overflow-hidden flex items-center justify-center group shadow-md">
              <img
                src={shot.image}
                alt={shot.code}
                className={cn(
                  "w-full h-full object-cover transition-all duration-300",
                  isRegenerating ? "opacity-30 scale-95 blur-xs" : "opacity-95"
                )}
              />

              {isRegenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs gap-2 text-white">
                  <RefreshCw className="w-6 h-6 animate-spin text-brand" />
                  <span className="text-xs font-semibold">
                    AI đang sinh ảnh mới...
                  </span>
                </div>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleRegenerateSingle}
              disabled={isRegenerating}
              className="w-full bg-brand hover:bg-brand-hover text-brand-foreground font-semibold text-xs gap-1.5 cursor-pointer shadow-2xs h-8.5"
            >
              <RefreshCw
                className={cn("w-3.5 h-3.5", isRegenerating && "animate-spin")}
              />
              <span>
                {isRegenerating
                  ? "Đang sinh lại ảnh..."
                  : "Sinh lại hình ảnh này"}
              </span>
            </Button>
          </div>

          {/* 2. Banner cảnh báo nếu có thay đổi */}
          {(currentVisual.isAssetChanged || currentVisual.status === "stale") && (
            <div className="p-3 bg-muted/60 border border-border rounded-xl flex items-start gap-2.5">
              <RefreshCw className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-foreground">
                  Cần cập nhật lại ảnh
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                  {currentVisual.staleReason ||
                    "Ảnh nhân vật hoặc bối cảnh trong cảnh này vừa được thay đổi. Hãy bấm 'Sinh lại hình ảnh này' để cập nhật diện mạo mới."}
                </p>
              </div>
            </div>
          )}
          </div>

          {/* CỘT PHẢI: Liên kết tài sản + Mô tả */}
          <div className="min-w-0 space-y-4 md:max-h-[70vh] md:overflow-y-auto md:pr-1">
          {/* 3. Liên kết tài sản truyện (Characters, Locations, Props) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-foreground block">
              Liên kết tài sản truyện
            </label>

            {/* Nhóm 1: Nhân vật */}
            <div className="space-y-1.5 bg-muted/30 p-2.5 rounded-lg border border-border/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">
                  Nhân vật
                </span>
                <button
                  type="button"
                  onClick={() => setActivePopoverKind("character")}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-foreground bg-muted hover:bg-muted/80 border border-border cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Thêm</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {linkedAssetsGrouped.characters.map((asset) => (
                  <div
                    key={asset.id}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-background border border-border rounded-md text-xs shadow-2xs group"
                  >
                    <div className="w-4 h-4 rounded-full overflow-hidden bg-muted shrink-0">
                      <img
                        src={asset.imageUrl || "/wireframe-placeholder.svg"}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-[11px] text-foreground">
                      {asset.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAssetFromShot(asset.id)}
                      className="text-muted-foreground hover:text-destructive rounded p-0.5 transition-colors cursor-pointer"
                      title="Gỡ bỏ liên kết"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {linkedAssetsGrouped.characters.length === 0 && (
                  <p className="text-[11px] text-muted-foreground italic">
                    Chưa gán nhân vật nào.
                  </p>
                )}
              </div>
            </div>

            {/* Nhóm 2: Địa điểm */}
            <div className="space-y-1.5 bg-muted/30 p-2.5 rounded-lg border border-border/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">
                  Địa điểm
                </span>
                <button
                  type="button"
                  onClick={() => setActivePopoverKind("location")}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-foreground bg-muted hover:bg-muted/80 border border-border cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Thêm</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {linkedAssetsGrouped.locations.map((asset) => (
                  <div
                    key={asset.id}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-background border border-border rounded-md text-xs shadow-2xs group"
                  >
                    <div className="w-4 h-4 rounded-full overflow-hidden bg-muted shrink-0">
                      <img
                        src={asset.imageUrl || "/wireframe-placeholder.svg"}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-[11px] text-foreground">
                      {asset.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAssetFromShot(asset.id)}
                      className="text-muted-foreground hover:text-destructive rounded p-0.5 transition-colors cursor-pointer"
                      title="Gỡ bỏ liên kết"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {linkedAssetsGrouped.locations.length === 0 && (
                  <p className="text-[11px] text-muted-foreground italic">
                    Chưa gán địa điểm nào.
                  </p>
                )}
              </div>
            </div>

            {/* Nhóm 3: Vật phẩm */}
            <div className="space-y-1.5 bg-muted/30 p-2.5 rounded-lg border border-border/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">
                  Vật phẩm
                </span>
                <button
                  type="button"
                  onClick={() => setActivePopoverKind("prop")}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-foreground bg-muted hover:bg-muted/80 border border-border cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Thêm</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {linkedAssetsGrouped.props.map((asset) => (
                  <div
                    key={asset.id}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-background border border-border rounded-md text-xs shadow-2xs group"
                  >
                    <div className="w-4 h-4 rounded-full overflow-hidden bg-muted shrink-0">
                      <img
                        src={asset.imageUrl || "/wireframe-placeholder.svg"}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-[11px] text-foreground">
                      {asset.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAssetFromShot(asset.id)}
                      className="text-muted-foreground hover:text-destructive rounded p-0.5 transition-colors cursor-pointer"
                      title="Gỡ bỏ liên kết"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {linkedAssetsGrouped.props.length === 0 && (
                  <p className="text-[11px] text-muted-foreground italic">
                    Chưa gán vật phẩm nào.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 4. Mô tả phân cảnh (Prompt) */}
          <div className="space-y-2 pt-2 border-t border-border/70">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Mô tả phân cảnh
              </label>
              <button
                type="button"
                onClick={handleRestoreDefaultPrompt}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Khôi phục prompt gốc"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <Textarea
              value={currentVisual.prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              rows={4}
              placeholder="Mô tả bối cảnh, nhân vật, góc máy..."
              className="text-xs leading-relaxed resize-none font-normal text-foreground bg-muted/20 border-border focus:ring-ring"
            />
          </div>
          </div>
        </div>

        {/* Modal Popover chọn Asset */}
        {activePopoverKind && (
          <AssetSelectPopover
            kind={activePopoverKind}
            selectedAssetIds={currentVisual.linkedAssetIds || []}
            onSelectAsset={handleAddAssetToShot}
            onDeselectAsset={handleRemoveAssetFromShot}
            onClose={() => setActivePopoverKind(null)}
            onEditAsset={onOpenStoryAssetsForEdit}
            onCreateNewAsset={onOpenStoryAssetsForCreate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
