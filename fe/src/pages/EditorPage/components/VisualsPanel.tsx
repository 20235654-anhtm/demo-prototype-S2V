import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Shot, CharacterAsset } from "@/types/script";
import { mockStoryAssets, type StoryAsset } from "@/mocks/mockStoryDetails";

interface VisualsPanelProps {
  onClose?: () => void;
  activeShot: Shot | null;
  characters?: CharacterAsset[];
  onUpdateShotImage?: (shotId: string, newImage: string) => void;
}

export default function VisualsPanel({
  onClose,
  activeShot,
}: VisualsPanelProps) {
  // 1. Quản lý mô tả phân cảnh
  const [prompt, setPrompt] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Sinh prompt tự động dựa theo phân cảnh hiện tại
  useEffect(() => {
    if (activeShot) {
      // Tạo prompt sinh ảnh chi tiết mẫu cho từng phân cảnh
      const defaultPrompts: Record<string, string> = {
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

      setPrompt(
        defaultPrompts[activeShot.id] ||
          `Phân cảnh minh họa: ${activeShot.text}. Bối cảnh tiên hiệp cổ phong chi tiết cao, ánh sáng chân thực, 3D cinematic rendering.`
      );
    }
  }, [activeShot]);

  if (!activeShot) {
    return (
      <div className="w-80 lg:w-[420px] border-l flex flex-col h-full bg-white dark:bg-neutral-900 shrink-0 select-none p-6 items-center justify-center text-center">
        <ImageIcon className="w-10 h-10 text-muted-foreground/50 mb-2" />
        <p className="text-xs text-muted-foreground">Chọn một phân cảnh để chỉnh sửa hình ảnh</p>
      </div>
    );
  }

  // Bóc tách tài sản liên quan đến phân cảnh này (Nhân vật, Địa điểm, Vật phẩm)
  const referencedAssets: StoryAsset[] = (() => {
    const text = activeShot.text.toLowerCase();
    return mockStoryAssets.filter((asset) => {
      const name = asset.name.toLowerCase();
      if (name.includes("tiêu viêm") && text.includes("tiêu viêm")) return true;
      if (name.includes("tiêu mị") && text.includes("tiêu mị")) return true;
      if (name.includes("huân nhi") && (text.includes("huân nhi") || text.includes("tử y"))) return true;
      if (name.includes("trắc nghiệm viên") && (text.includes("trắc nghiệm") || text.includes("trung niên"))) return true;
      if (name.includes("đám đông") && (text.includes("đám đông") || text.includes("quần chúng") || text.includes("tộc nhân"))) return true;
      if (name.includes("quảng trường") && (text.includes("quảng trường") || text.includes("sân"))) return true;
      if (name.includes("ma thạch") && (text.includes("ma thạch") || text.includes("bia"))) return true;
      return false;
    });
  })();

  const handleRegenerateImage = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1200);
  };

  const handleInsertKeyword = (keyword: string) => {
    setPrompt((prev) => `${prev.trim()}, ${keyword}`);
  };

  return (
    <div className="w-80 lg:w-[420px] border-l flex flex-col h-full bg-white dark:bg-neutral-900 shrink-0 select-none overflow-hidden relative">
      {/* 1. Header chuẩn có nhãn cảnh và nút Khóa ảnh */}
      <div className="h-12 px-4 border-b flex items-center justify-between shrink-0 bg-muted/20">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-md bg-brand/15 text-brand-strong dark:text-brand flex items-center justify-center shrink-0">
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-foreground truncate">
                {activeShot.code}
              </span>
              <span className="text-[10px] text-muted-foreground">
                ({activeShot.duration}s)
              </span>
            </div>
          </div>
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            title="Đóng hình ảnh phân cảnh"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* 2. Thân cuộn: Chi tiết hình ảnh & Prompt */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {/* Preview ảnh phân cảnh hiện tại */}
        <div className="space-y-1.5">
          <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-border bg-muted/30 overflow-hidden flex items-center justify-center group shadow-inner">
            <img
              src={activeShot.image}
              alt={activeShot.code}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
                isRegenerating ? "opacity-30 scale-95 blur-xs" : "opacity-95"
              )}
            />

            {isRegenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-xs gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-brand" />
                <span className="text-xs font-semibold text-foreground">
                  AI đang sinh ảnh mới...
                </span>
              </div>
            )}

            <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md font-mono">
              16:9 · 1080p
            </span>
          </div>

          <Button
            size="sm"
            onClick={handleRegenerateImage}
            disabled={isRegenerating}
            className="w-full bg-brand hover:bg-brand-hover text-brand-foreground font-semibold text-xs gap-1.5 cursor-pointer shadow-xs h-8"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRegenerating && "animate-spin")} />
            <span>{isRegenerating ? "Đang sinh lại ảnh..." : "Sinh lại hình ảnh này"}</span>
          </Button>
        </div>

        {/* 3. Mô tả phân cảnh */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span>Mô tả phân cảnh</span>
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Mô tả bối cảnh, nhân vật, ánh sáng, góc máy..."
            className="text-xs leading-relaxed resize-none font-normal text-foreground bg-muted/20"
          />
        </div>

        {/* 4. Tài sản tham chiếu (Nhân vật, Địa điểm, Vật phẩm xuất hiện trong cảnh) */}
        <div className="space-y-2 pt-1 border-t border-border/60">
          <label className="text-xs font-bold text-foreground block">
            Tài sản tham chiếu ({referencedAssets.length})
          </label>

          <div className="space-y-1.5">
            {referencedAssets.length > 0 ? (
              referencedAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => handleInsertKeyword(asset.name)}
                  className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-muted/80 overflow-hidden shrink-0 border">
                      <img
                        src={asset.imageUrl || "/wireframe-placeholder.svg"}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-semibold text-foreground truncate group-hover:text-brand-strong dark:group-hover:text-brand">
                      {asset.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-full border font-medium",
                        asset.kind === "character"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : asset.kind === "location"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      )}
                    >
                      {asset.kind === "character"
                        ? "Nhân vật"
                        : asset.kind === "location"
                          ? "Địa điểm"
                          : "Vật phẩm"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic py-1">
                Không có tài sản tham chiếu.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
