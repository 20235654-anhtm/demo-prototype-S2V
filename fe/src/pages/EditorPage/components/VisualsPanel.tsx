import { useState, useEffect } from "react";
import {
  RefreshCw,
  X,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Shot, CharacterAsset } from "@/types/script";
import { mockStoryAssets, type StoryAsset } from "@/mocks/mockStoryDetails";

interface VisualsPanelProps {
  width?: number;
  onClose?: () => void;
  activeShot: Shot | null;
  shots: Shot[];
  onSelectShot: (id: string) => void;
  characters?: CharacterAsset[];
  onUpdateShotImage?: (shotId: string, newImage: string) => void;
  initialViewMode?: "list" | "detail";
}

export default function VisualsPanel({
  width,
  onClose,
  activeShot,
  shots,
  onSelectShot,
  initialViewMode = "detail",
}: VisualsPanelProps) {
  // viewMode: "list" (danh sách các hình ảnh phân cảnh) hoặc "detail" (chi tiết của 1 phân cảnh)
  const [viewMode, setViewMode] = useState<"list" | "detail">(initialViewMode);
  const [prompt, setPrompt] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Mẫu prompt mô tả hình ảnh cho 12 phân cảnh
  const defaultPrompts: Record<string, string> = {
    "shot-1":
      "Cận cảnh ma thạch bia cổ kính khổng lồ trên quảng trường Tiêu gia, bề mặt đá đen khắc phù văn phát sáng vàng rực rỡ với dòng chữ Đấu chi lực tam đoạn, không khí trang nghiêm huyền bí, phong cách 3D cinematic độ phân giải cao.",
    "shot-2":
      "Trung niên trắc nghiệm viên áo xám nghiêm nghị đứng cạnh ma thạch bia phán xét, phía sau là đám đông tộc nhân Tiêu gia xôn xao chỉ trỏ, ánh mắt Tiêu Viêm trầm lặng tự giễu, phong cách phim hoạt hình 3D tiên hiệp.",
    "shot-3":
      "Đám đông tộc nhân thanh thiếu niên Tiêu gia đứng vây quanh quảng trường chỉ trỏ cười nhạo, ánh mắt châm biếm coi thường, không gian ồn ào chế giễu.",
    "shot-4":
      "Tiêu Viêm cúi đầu chán nản xoay người, cô đơn lững thững bước về cuối hàng, bóng lưng lạc lõng giữa quảng trường đá rộng lớn ngập tràn ánh hoàng hôn.",
    "shot-5":
      "Thiếu nữ Tiêu Mị 14 tuổi thanh thuần kiêu sa trong y phục đỏ nhạt, nhẹ nhàng bước lên thềm đá, đặt tay lên ma thạch bia đen nhánh, không khí hồi hộp.",
    "shot-6":
      "Ma thạch bia bùng lên luồng sáng chói lọi hiện dòng chữ Đấu khí thất đoạn cao cấp, Tiêu Mị nở nụ cười kiêu hãnh đắc ý giữa muôn vàn ánh mắt ngưỡng mộ.",
    "shot-7":
      "Cảnh hồi tưởng quá khứ huy hoàng: Thiếu niên Tiêu Viêm 11 tuổi ý khí phong phát tỏa sáng giữa vạn người khi ngưng tụ đấu khí toàn, rồi ánh sáng dần tắt báo hiệu biến cố.",
    "shot-8":
      "Tử y thiếu nữ Tiêu Huân Nhi khí chất thoát tục tựa hoa sen mới nở bước ra từ đám đông, tà áo tím thêu viền vàng bay nhẹ trong gió, cả quảng trường tĩnh lặng.",
    "shot-9":
      "Huân Nhi đặt bàn tay ngọc ngà lên bia đá, ma thạch bia chấn động tỏa hào quang cửu đoạn đấu khí cực phẩm chói lòa, mọi người kinh ngạc nín thở.",
    "shot-10":
      "Trung niên trắc nghiệm viên nở nụ cười cung kính khen ngợi Huân Nhi, trong khi thiếu nữ bình thản khẽ gật đầu rồi quay bước về phía cuối hàng.",
    "shot-11":
      "Huân Nhi mỉm cười dịu dàng an ủi Tiêu Viêm, ánh mắt tràn đầy sự tin tưởng son sắt, gương mặt thoáng ửng hồng e thẹn dưới nắng chiều.",
    "shot-12":
      "Hai bóng người thiếu niên và thiếu nữ sóng vai bước chậm rãi rời khỏi quảng trường Tiêu gia, phía sau là ánh hoàng hôn rực rỡ trải dài thềm đá cổ kính.",
  };

  // Cập nhật prompt khi đổi cảnh
  useEffect(() => {
    if (activeShot) {
      setPrompt(
        defaultPrompts[activeShot.id] ||
          `Phân cảnh minh họa: ${activeShot.text}. Bối cảnh tiên hiệp cổ phong chi tiết cao, ánh sáng chân thực, 3D cinematic rendering.`
      );
    }
  }, [activeShot]);

  // Bóc tách tài sản liên quan đến phân cảnh hiện tại
  const referencedAssets: StoryAsset[] = (() => {
    if (!activeShot) return [];
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

  const handlePickShot = (shotId: string) => {
    onSelectShot(shotId);
    setViewMode("detail");
  };

  return (
    <div
      style={width ? { width: `${width}px`, flexBasis: `${width}px` } : undefined}
      className="w-80 lg:w-[420px] border-l flex flex-col h-full bg-white dark:bg-neutral-900 shrink-0 select-none overflow-hidden relative"
    >
      {/* 1. Header có Breadcrumb: Phân cảnh > [Tên cảnh] */}
      <div className="h-12 px-3 border-b flex items-center justify-between shrink-0 bg-muted/20">
        <div className="flex items-center gap-1.5 min-w-0 text-sm overflow-hidden">
          {viewMode === "detail" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0 mr-0.5"
              title="Quay lại danh sách phân cảnh"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}

          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "font-semibold transition-colors cursor-pointer shrink-0 truncate",
              viewMode === "detail"
                ? "text-muted-foreground hover:text-foreground"
                : "text-foreground"
            )}
          >
            Hình ảnh phân cảnh
          </button>

          {viewMode === "detail" && activeShot && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="font-semibold text-foreground truncate min-w-0">
                {activeShot.code.replace("Cảnh", "Phân cảnh")}
              </span>
            </>
          )}
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0 ml-2"
            title="Đóng bảng hình ảnh phân cảnh"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* 2. Thân nội dung: Hiển thị dạng Danh sách hoặc Chi tiết */}
      {viewMode === "list" ? (
        // === GIAO DIỆN DANH SÁCH CÁC HÌNH ẢNH PHÂN CẢNH ===
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tất cả phân cảnh ({shots.length})
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {shots.map((shot) => {
              const isSelected = activeShot?.id === shot.id;
              return (
                <article
                  key={shot.id}
                  onClick={() => handlePickShot(shot.id)}
                  className={cn(
                    "group rounded-xl border p-2.5 transition-all flex flex-col gap-2 cursor-pointer select-none",
                    isSelected
                      ? "border-brand bg-brand/5 shadow-xs ring-1 ring-brand/30"
                      : "bg-card hover:border-brand/40 hover:shadow-md hover:-translate-y-0.5"
                  )}
                >
                  {/* Thumbnail cảnh phóng to chiếm full 100% chiều ngang */}
                  <div className="relative w-full aspect-video rounded-lg border border-border/80 bg-muted/40 overflow-hidden flex items-center justify-center">
                    <img
                      src={shot.image}
                      alt={shot.code}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                  </div>

                  {/* Tên phân cảnh ở dưới ảnh */}
                  <div className="px-0.5">
                    <h4
                      className={cn(
                        "text-xs font-bold truncate",
                        isSelected
                          ? "text-brand-strong dark:text-brand"
                          : "text-foreground group-hover:text-brand-strong dark:group-hover:text-brand"
                      )}
                    >
                      {shot.code.replace("Cảnh", "Phân cảnh")}
                    </h4>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : activeShot ? (
        // === GIAO DIỆN CHI TIẾT 1 PHÂN CẢNH CỤ THỂ ===
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

          {/* Mô tả phân cảnh */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground block">
              Mô tả phân cảnh
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Mô tả bối cảnh, nhân vật, ánh sáng, góc máy..."
              className="text-xs leading-relaxed resize-none font-normal text-foreground bg-muted/20"
            />
          </div>

          {/* Tài sản tham chiếu */}
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
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-xs text-muted-foreground">Chọn một phân cảnh để chỉnh sửa hình ảnh</p>
        </div>
      )}
    </div>
  );
}
