import { useState, useEffect, useMemo } from "react";
import {
  RefreshCw,
  X,
  ArrowLeft,
  ChevronRight,
  Zap,
  AlertTriangle,
  RotateCcw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Shot, CharacterAsset, ShotVisualData, AssetLinkWarning } from "@/types/script";
import {
  mockStoryAssets,
  type StoryAsset,
  type StoryAssetKind,
} from "@/mocks/mockStoryDetails";
import {
  EntityLinkWarningBox,
  type WarningItemWithShot,
} from "./Visuals/EntityLinkWarningBox";
import { AssetSelectPopover } from "./Visuals/AssetSelectPopover";

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

interface VisualsPanelProps {
  width?: number;
  onClose?: () => void;
  activeShot?: Shot | null;
  shots?: Shot[];
  characters?: CharacterAsset[];
  onSelectShot?: (id: string) => void;
  onScrollToScript?: (shotId: string) => void;
  onOpenStoryAssetsForEdit?: (assetId: string) => void;
  onOpenStoryAssetsForCreate?: (kind: StoryAssetKind, initialName?: string) => void;
  onUpdateShotVisual?: (shotId: string, visualData: Partial<ShotVisualData>) => void;
  onUpdateShotImage?: (shotId: string, newImage: string) => void;
  initialViewMode?: "overview" | "detail";
  forceDetailShotId?: string | null;
}

export default function VisualsPanel({
  width,
  onClose,
  activeShot: propActiveShot,
  shots = [],
  onSelectShot,
  onScrollToScript: _onScrollToScript,
  onOpenStoryAssetsForEdit,
  onOpenStoryAssetsForCreate,
  onUpdateShotVisual,
  initialViewMode = "overview",
  forceDetailShotId,
}: VisualsPanelProps) {
  // Chế độ xem: 'overview' (toàn bộ phân cảnh) hoặc 'detail' (chi tiết 1 phân cảnh)
  const [viewMode, setViewMode] = useState<"overview" | "detail">(
    initialViewMode
  );
  const [selectedDetailShotId, setSelectedDetailShotId] = useState<string | null>(
    propActiveShot?.id || (shots.length > 0 ? shots[0].id : null)
  );

  // Bộ lọc ở chế độ overview
  const [filter, setFilter] = useState<
    "all" | "missing_image" | "changed" | "unlinked"
  >("all");

  // State cục bộ lưu visual data của các shots (prompt, linkedAssets, warnings...)
  const [localVisuals, setLocalVisuals] = useState<Record<string, ShotVisualData>>({});

  // Loading animation khi sinh ảnh
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  // State mở popover gán asset
  const [activePopoverKind, setActivePopoverKind] = useState<StoryAssetKind | null>(
    null
  );

  // Khởi tạo visual data từ shots
  useEffect(() => {
    if (shots && shots.length > 0) {
      setLocalVisuals((prev) => {
        const next = { ...prev };
        shots.forEach((shot) => {
          if (!next[shot.id]) {
            next[shot.id] = {
              prompt:
                shot.visual?.prompt ||
                DEFAULT_SHOT_PROMPTS[shot.id] ||
                `Phân cảnh minh họa: ${shot.text}. Phong cách 3D cinematic độ phân giải cao.`,
              status: shot.visual?.status || "ready",
              isAssetChanged: shot.visual?.isAssetChanged || false,
              isPromptModified: shot.visual?.isPromptModified || false,
              staleReason: shot.visual?.staleReason,
              linkedAssetIds: shot.visual?.linkedAssetIds || [],
              unlinkedWarnings: shot.visual?.unlinkedWarnings || [],
            };
          }
        });
        return next;
      });
    }
  }, [shots]);

  // Nếu prop forceDetailShotId thay đổi hoặc được set từ ngoài
  useEffect(() => {
    if (forceDetailShotId) {
      setSelectedDetailShotId(forceDetailShotId);
      setViewMode("detail");
    }
  }, [forceDetailShotId]);

  // Xác định shot đang được xem chi tiết
  const currentDetailShot: Shot | null = useMemo(() => {
    if (!selectedDetailShotId) return propActiveShot || (shots.length > 0 ? shots[0] : null);
    return shots.find((s) => s.id === selectedDetailShotId) || propActiveShot || null;
  }, [selectedDetailShotId, shots, propActiveShot]);

  const currentVisual: ShotVisualData = useMemo(() => {
    if (!currentDetailShot) {
      return {
        prompt: "",
        status: "idle",
        linkedAssetIds: [],
        unlinkedWarnings: [],
      };
    }
    return (
      localVisuals[currentDetailShot.id] ||
      currentDetailShot.visual || {
        prompt:
          DEFAULT_SHOT_PROMPTS[currentDetailShot.id] ||
          `Phân cảnh minh họa: ${currentDetailShot.text}`,
        status: "ready",
        linkedAssetIds: [],
        unlinkedWarnings: [],
      }
    );
  }, [currentDetailShot, localVisuals]);

  // Danh sách warnings toàn cục trên tất cả phân cảnh
  const allGlobalWarnings: WarningItemWithShot[] = useMemo(() => {
    const list: WarningItemWithShot[] = [];
    shots.forEach((shot) => {
      const v = localVisuals[shot.id] || shot.visual;
      if (v?.unlinkedWarnings && v.unlinkedWarnings.length > 0) {
        v.unlinkedWarnings.forEach((w) => {
          list.push({
            shotId: shot.id,
            shotCode: shot.code,
            warning: w,
          });
        });
      }
    });
    return list;
  }, [shots, localVisuals]);

  // Đếm số lượng phân cảnh có thay đổi cần sinh lại
  const changedShotsCount = useMemo(() => {
    return shots.filter((s) => {
      const v = localVisuals[s.id] || s.visual;
      return v?.status === "stale" || v?.isAssetChanged || v?.isPromptModified;
    }).length;
  }, [shots, localVisuals]);

  // Lọc shots theo filter pill
  const filteredShots = useMemo(() => {
    return shots.filter((shot) => {
      const v = localVisuals[shot.id] || shot.visual;
      if (filter === "missing_image") {
        return v?.status === "idle";
      }
      if (filter === "changed") {
        return v?.status === "stale" || v?.isAssetChanged || v?.isPromptModified;
      }
      if (filter === "unlinked") {
        return (v?.unlinkedWarnings?.length || 0) > 0;
      }
      return true;
    });
  }, [shots, localVisuals, filter]);

  // Handler khi click vào 1 ShotCard ở chế độ overview
  const handleOpenDetail = (shot: Shot) => {
    setSelectedDetailShotId(shot.id);
    setViewMode("detail");
    onSelectShot?.(shot.id);
  };

  // Handler khi sửa prompt trong chế độ detail
  const handlePromptChange = (newPrompt: string) => {
    if (!currentDetailShot) return;
    const defaultPrompt =
      DEFAULT_SHOT_PROMPTS[currentDetailShot.id] || currentDetailShot.text;
    const isModified = newPrompt.trim() !== defaultPrompt.trim();

    setLocalVisuals((prev) => ({
      ...prev,
      [currentDetailShot.id]: {
        ...prev[currentDetailShot.id],
        prompt: newPrompt,
        isPromptModified: isModified,
      },
    }));

    onUpdateShotVisual?.(currentDetailShot.id, {
      prompt: newPrompt,
      isPromptModified: isModified,
    });
  };

  // Handler: Khôi phục prompt gốc
  const handleRestoreDefaultPrompt = () => {
    if (!currentDetailShot) return;
    const defaultPrompt =
      DEFAULT_SHOT_PROMPTS[currentDetailShot.id] ||
      `Phân cảnh minh họa: ${currentDetailShot.text}. Phong cách 3D cinematic độ phân giải cao.`;
    handlePromptChange(defaultPrompt);
  };

  // Handler: Sinh lại ảnh cho 1 cảnh
  const handleRegenerateSingle = () => {
    if (!currentDetailShot) return;
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setLocalVisuals((prev) => ({
        ...prev,
        [currentDetailShot.id]: {
          ...prev[currentDetailShot.id],
          status: "ready",
          isAssetChanged: false,
          isPromptModified: false,
        },
      }));
      onUpdateShotVisual?.(currentDetailShot.id, {
        status: "ready",
        isAssetChanged: false,
        isPromptModified: false,
      });
    }, 1200);
  };

  // Handler: Sinh tất cả ảnh
  const handleGenerateAll = () => {
    setIsBatchGenerating(true);
    setTimeout(() => {
      setIsBatchGenerating(false);
      setLocalVisuals((prev) => {
        const next = { ...prev };
        shots.forEach((s) => {
          next[s.id] = {
            ...next[s.id],
            status: "ready",
            isAssetChanged: false,
            isPromptModified: false,
          };
        });
        return next;
      });
    }, 1800);
  };

  // Handler: Sinh lại (X) cảnh có thay đổi
  const handleRegenerateChanged = () => {
    setIsBatchGenerating(true);
    setTimeout(() => {
      setIsBatchGenerating(false);
      setLocalVisuals((prev) => {
        const next = { ...prev };
        shots.forEach((s) => {
          const v = next[s.id];
          if (v?.status === "stale" || v?.isAssetChanged || v?.isPromptModified) {
            next[s.id] = {
              ...v,
              status: "ready",
              isAssetChanged: false,
              isPromptModified: false,
            };
          }
        });
        return next;
      });
    }, 1500);
  };

  // Handler giải quyết warning: gắn entity với asset
  const handleLinkEntity = (
    warning: AssetLinkWarning,
    shotId: string,
    asset: StoryAsset
  ) => {
    setLocalVisuals((prev) => {
      const current = prev[shotId] || {
        prompt: "",
        status: "ready",
        linkedAssetIds: [],
        unlinkedWarnings: [],
      };
      const nextWarnings = (current.unlinkedWarnings || []).filter(
        (w) => w.id !== warning.id
      );
      const nextAssetIds = Array.from(
        new Set([...(current.linkedAssetIds || []), asset.id])
      );
      return {
        ...prev,
        [shotId]: {
          ...current,
          unlinkedWarnings: nextWarnings,
          linkedAssetIds: nextAssetIds,
        },
      };
    });
  };

  // Handler gán thêm asset vào shot đang xem chi tiết
  const handleAddAssetToShot = (asset: StoryAsset) => {
    if (!currentDetailShot) return;
    setLocalVisuals((prev) => {
      const current = prev[currentDetailShot.id] || {
        prompt: "",
        status: "ready",
        linkedAssetIds: [],
      };
      const nextAssetIds = Array.from(
        new Set([...(current.linkedAssetIds || []), asset.id])
      );
      return {
        ...prev,
        [currentDetailShot.id]: {
          ...current,
          linkedAssetIds: nextAssetIds,
        },
      };
    });
    setActivePopoverKind(null);
  };

  // Handler gỡ bỏ asset khỏi shot
  const handleRemoveAssetFromShot = (assetId: string) => {
    if (!currentDetailShot) return;
    setLocalVisuals((prev) => {
      const current = prev[currentDetailShot.id] || {
        prompt: "",
        status: "ready",
        linkedAssetIds: [],
      };
      const nextAssetIds = (current.linkedAssetIds || []).filter(
        (id) => id !== assetId
      );
      return {
        ...prev,
        [currentDetailShot.id]: {
          ...current,
          linkedAssetIds: nextAssetIds,
        },
      };
    });
  };

  // Phân loại các asset đã liên kết của shot hiện tại
  const linkedAssetsGrouped = useMemo(() => {
    const assetIds = currentVisual.linkedAssetIds || [];
    const assets = mockStoryAssets.filter((a) => assetIds.includes(a.id));
    return {
      characters: assets.filter((a) => a.kind === "character"),
      locations: assets.filter((a) => a.kind === "location"),
      props: assets.filter((a) => a.kind === "prop"),
    };
  }, [currentVisual.linkedAssetIds]);

  // Cảnh báo riêng của cảnh hiện tại
  const currentShotWarnings: WarningItemWithShot[] = useMemo(() => {
    if (!currentDetailShot) return [];
    const warnings = currentVisual.unlinkedWarnings || [];
    return warnings.map((w) => ({
      shotId: currentDetailShot.id,
      shotCode: currentDetailShot.code,
      warning: w,
    }));
  }, [currentDetailShot, currentVisual.unlinkedWarnings]);

  return (
    <div
      style={width ? { width: `${width}px`, flexBasis: `${width}px` } : undefined}
      className="w-80 lg:w-[420px] border-l flex flex-col h-full bg-white dark:bg-neutral-900 shrink-0 select-none overflow-hidden relative"
    >
      {/* =========================================================================
          VIEW MODE 1: OVERVIEW (Danh sách Storyboard toàn bộ phân cảnh)
      ========================================================================= */}
      {viewMode === "overview" && (
        <>
          {/* Header */}
          <div className="h-12 px-3 border-b flex items-center justify-between shrink-0 bg-muted/20">
            <div className="flex items-center min-w-0 text-sm overflow-hidden">
              <span className="font-semibold text-sm text-foreground truncate min-w-0">
                Hình ảnh phân cảnh
              </span>
            </div>

            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0 ml-2"
                title="Đóng panel hình ảnh"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>

          {/* Thân cuộn: Overview */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3.5">
            {/* 1. Hộp cảnh báo thiếu liên kết toàn cục (Chuẩn Ảnh 1) */}
            {allGlobalWarnings.length > 0 && (
              <EntityLinkWarningBox
                warnings={allGlobalWarnings}
                isGlobal={true}
                onLinkEntity={handleLinkEntity}
                onEditAsset={onOpenStoryAssetsForEdit}
                onCreateNewAsset={onOpenStoryAssetsForCreate}
              />
            )}

            {/* 2. Cặp nút hành động hàng loạt (Batch Action Buttons) */}
            <div className="space-y-1.5">
              <Button
                size="sm"
                onClick={handleGenerateAll}
                disabled={isBatchGenerating}
                className="w-full bg-brand hover:bg-brand-hover text-brand-foreground font-semibold text-xs gap-1.5 cursor-pointer shadow-2xs h-8.5"
              >
                <Zap className={cn("w-3.5 h-3.5", isBatchGenerating && "animate-spin")} />
                <span>
                  {isBatchGenerating
                    ? "Đang sinh toàn bộ ảnh..."
                    : "Sinh tất cả ảnh"}
                </span>
              </Button>

              {changedShotsCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRegenerateChanged}
                  disabled={isBatchGenerating}
                  className="w-full border-border bg-card hover:bg-muted text-foreground font-medium text-xs gap-1.5 cursor-pointer h-8 shadow-2xs"
                >
                  <RefreshCw
                    className={cn("w-3.5 h-3.5 text-muted-foreground", isBatchGenerating && "animate-spin")}
                  />
                  <span>
                    Sinh lại ({changedShotsCount}) cảnh có thay đổi
                  </span>
                </Button>
              )}
            </div>

            {/* 3. Bộ lọc trạng thái (Filter pills) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-border/50">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 cursor-pointer",
                  filter === "all"
                    ? "bg-foreground text-background font-semibold"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Tất cả ({shots.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("missing_image")}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 cursor-pointer",
                  filter === "missing_image"
                    ? "bg-foreground text-background font-semibold"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Chưa có ảnh (
                {
                  shots.filter(
                    (s) => (localVisuals[s.id] || s.visual)?.status === "idle"
                  ).length
                }
                )
              </button>
              <button
                type="button"
                onClick={() => setFilter("changed")}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 cursor-pointer",
                  filter === "changed"
                    ? "bg-foreground text-background font-semibold"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Có thay đổi ({changedShotsCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter("unlinked")}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 cursor-pointer",
                  filter === "unlinked"
                    ? "bg-foreground text-background font-semibold"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Thiếu liên kết (
                {
                  shots.filter(
                    (s) =>
                      ((localVisuals[s.id] || s.visual)?.unlinkedWarnings?.length ||
                        0) > 0
                  ).length
                }
                )
              </button>
            </div>

            {/* 4. Danh sách Storyboard Card (gọn gàng, ô ảnh to full chiều ngang, tiêu đề cảnh ở dưới) */}
            <div className="space-y-3">
              {filteredShots.map((shot) => {
                const visual = localVisuals[shot.id] || shot.visual;
                const isError = visual?.status === "error";
                const isChanged =
                  visual?.status === "stale" ||
                  visual?.isAssetChanged ||
                  visual?.isPromptModified;

                return (
                  <article
                    key={shot.id}
                    onClick={() => {
                      if (isError) {
                        const errorMsg =
                          visual?.errorMessage ||
                          "Lỗi sinh ảnh: Không thể kết nối tới mô hình AI hoặc prompt không hợp lệ. Vui lòng thử lại.";
                        console.error(`[${shot.code}] Lỗi sinh hình ảnh:`, {
                          shotId: shot.id,
                          code: shot.code,
                          error: errorMsg,
                          visual,
                        });
                        alert(`[${shot.code}] Chi tiết lỗi: ${errorMsg}`);
                      } else {
                        handleOpenDetail(shot);
                      }
                    }}
                    className={cn(
                      "group rounded-xl border p-2.5 transition-all flex flex-col gap-2 cursor-pointer select-none shadow-2xs",
                      isError
                        ? "border-destructive/80 bg-destructive/5 hover:border-destructive hover:bg-destructive/10 ring-1 ring-destructive/30"
                        : "border-border/70 bg-card hover:border-foreground/30 hover:bg-muted/40"
                    )}
                  >
                    {/* Thumbnail cảnh phóng to chiếm full 100% chiều ngang */}
                    <div className="relative w-full aspect-video rounded-lg border border-border/80 bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center">
                      <img
                        src={shot.image}
                        alt={shot.code}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />

                      {/* Huy hiệu cảnh báo lỗi đỏ phủ trên góc ảnh nếu có lỗi */}
                      {isError && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold shadow-xs">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Sinh ảnh lỗi</span>
                        </div>
                      )}
                    </div>

                    {/* Tên phân cảnh và thông tin ở dưới ảnh */}
                    <div className="space-y-1 px-0.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "font-bold text-xs transition-colors",
                            isError
                              ? "text-destructive"
                              : "text-foreground group-hover:text-primary"
                          )}
                        >
                          {shot.code.replace("Cảnh", "Phân cảnh")}
                        </span>

                        {isError && (
                          <span className="text-[10px] text-destructive font-medium underline">
                            Bấm xem log lỗi
                          </span>
                        )}
                      </div>

                      {/* Badges cảnh báo nếu có */}
                      {((isError) || (isChanged && !isError)) && (
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          {isError && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-destructive/10 text-destructive border border-destructive/20">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {visual?.errorMessage || "Lỗi tạo hình ảnh"}
                            </span>
                          )}
                          {isChanged && !isError && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                              <RefreshCw className="w-2.5 h-2.5 text-muted-foreground" />
                              Cần cập nhật ảnh
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW MODE 2: DETAIL (Chi tiết phân cảnh được chọn)
      ========================================================================= */}
      {viewMode === "detail" && currentDetailShot && (
        <>
          {/* Breadcrumb Header đồng bộ style với Dự án > Đấu Phá Thương Khung / StoryAssets */}
          <div className="h-12 px-3 border-b flex items-center justify-between shrink-0 bg-muted/20">
            <div className="flex items-center gap-1.5 min-w-0 text-sm overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("overview")}
                className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0 mr-0.5"
                title="Quay lại danh sách phân cảnh"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <button
                type="button"
                onClick={() => setViewMode("overview")}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 truncate"
              >
                Hình ảnh phân cảnh
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />

              <span className="font-semibold text-sm text-foreground truncate min-w-0">
                {currentDetailShot.code.replace("Cảnh", "Phân cảnh")}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Đóng"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Thân cuộn: Chi tiết cảnh */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            {/* 1. Preview ảnh 16:9 + Nút Sinh lại */}
            <div className="space-y-2">
              <div className="relative w-full aspect-video rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 overflow-hidden flex items-center justify-center group shadow-md">
                <img
                  src={currentDetailShot.image}
                  alt={currentDetailShot.code}
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

            {/* 2. Banner cảnh báo ngoại hình thay đổi (Stale Asset Alert Banner) */}
            {(currentVisual.isAssetChanged || currentVisual.status === "stale") && (
              <div className="p-3 bg-muted/60 border border-border rounded-xl flex items-start gap-2.5">
                <RefreshCw className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-foreground">
                    Cần cập nhật lại ảnh
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                    {currentVisual.staleReason ||
                      "Ảnh nhân vật hoặc bối cảnh trong cảnh này vừa được thay đổi trong Story Assets. Hãy bấm 'Sinh lại hình ảnh này' để cập nhật diện mạo mới."}
                  </p>
                </div>
              </div>
            )}

            {/* 3. Cảnh báo thực thể chưa liên kết riêng của cảnh này */}
            {currentShotWarnings.length > 0 && (
              <EntityLinkWarningBox
                warnings={currentShotWarnings}
                isGlobal={false}
                onLinkEntity={handleLinkEntity}
                onEditAsset={onOpenStoryAssetsForEdit}
                onCreateNewAsset={onOpenStoryAssetsForCreate}
              />
            )}

            {/* 4. Asset Bindings theo 3 nhóm rõ rệt: Nhân vật, Địa điểm, Vật phẩm */}
            <div className="space-y-3 pt-2 border-t border-border/70">
              <label className="text-xs font-bold text-foreground block">
                Liên kết Story Assets
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

            {/* 5. Prompt & Góc máy */}
            <div className="space-y-2 pt-2 border-t border-border/70">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Prompt sinh ảnh & Góc máy
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleRestoreDefaultPrompt}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Khôi phục prompt gốc"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
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

          {/* Modal Popover chọn Asset khi bấm Gán */}
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
        </>
      )}
    </div>
  );
}
