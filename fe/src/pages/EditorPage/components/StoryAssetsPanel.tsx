import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { X, Search, Plus, ChevronRight, ArrowLeft } from "lucide-react";
import {
  STORY_ASSET_KIND_LABEL,
  mockStoryAssets,
  type StoryAsset,
  type StoryAssetKind,
} from "@/mocks/mockStoryDetails";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";
import AssetDetailInline from "./AssetDetailInline";

type AssetFilter = StoryAssetKind;

const FILTER_OPTIONS: Array<{ id: StoryAssetKind; label: string }> = [
  { id: "character", label: STORY_ASSET_KIND_LABEL.character },
  { id: "location", label: STORY_ASSET_KIND_LABEL.location },
  { id: "prop", label: STORY_ASSET_KIND_LABEL.prop },
];

interface StoryAssetsPanelProps {
  width?: number;
  onClose: () => void;
  selectedAssetId?: string | null;
  onSelectAssetId?: (id: string | null) => void;
}

export default function StoryAssetsPanel({
  width,
  onClose,
  selectedAssetId,
  onSelectAssetId,
}: StoryAssetsPanelProps) {
  const [assets, setAssets] = useState<StoryAsset[]>(mockStoryAssets);
  const [filter, setFilter] = useState<AssetFilter>("character");
  const [query, setQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<StoryAsset | null>(null);

  // Mở chi tiết inline khi có selectedAssetId truyền vào từ bên ngoài (ví dụ click nút sửa nhân vật)
  useEffect(() => {
    if (selectedAssetId) {
      if (selectedAssetId === "new") {
        handleAddNewAsset();
        return;
      }
      const found = assets.find(
        (a) => a.id === selectedAssetId || a.id.includes(selectedAssetId) || selectedAssetId.includes(a.id)
      ) || assets[0];
      if (found) {
        setSelectedAsset(found);
        setFilter(found.kind);
      }
    }
  }, [selectedAssetId]);

  const handleAddNewAsset = () => {
    const defaultName =
      filter === "character"
        ? "Nhân vật mới"
        : filter === "location"
          ? "Địa điểm mới"
          : "Vật phẩm mới";

    const newAsset: StoryAsset = {
      id: `asset-${Date.now()}`,
      name: defaultName,
      kind: filter,
      description: `Mô tả chi tiết cho ${defaultName.toLowerCase()}...`,
      tags: ["Mới thêm"],
      imageUrl: "/wireframe-placeholder.svg",
      imagePrompt: `Mô tả phong cách ảnh 3D cinematic cho ${defaultName.toLowerCase()}...`,
    };
    setAssets((prev) => [newAsset, ...prev]);
    setSelectedAsset(newAsset);
  };

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return assets.filter((asset) => {
      const matchesFilter = asset.kind === filter;
      const matchesQuery =
        !normalizedQuery ||
        asset.name.toLowerCase().includes(normalizedQuery) ||
        asset.description.toLowerCase().includes(normalizedQuery) ||
        (asset.imagePrompt && asset.imagePrompt.toLowerCase().includes(normalizedQuery)) ||
        asset.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesFilter && matchesQuery;
    });
  }, [assets, filter, query]);

  const handleOpenDetail = (asset: StoryAsset) => {
    setSelectedAsset(asset);
  };

  const handleUpdateAsset = (updated: StoryAsset) => {
    setAssets((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setSelectedAsset(updated);
  };

  const handleBackToList = () => {
    setSelectedAsset(null);
    onSelectAssetId?.(null);
  };

  return (
    <div
      style={width ? { width: `${width}px`, flexBasis: `${width}px` } : undefined}
      className="w-80 lg:w-[420px] border-l flex flex-col h-full bg-white dark:bg-neutral-900 shrink-0 select-none overflow-hidden relative"
    >
      {/* 1. Header chuẩn: Bỏ icon, có Breadcrumb Tài sản truyện > [Phân loại] > [Tên] và nút đóng ✕ */}
      <div className="h-12 px-3 border-b flex items-center justify-between shrink-0 bg-muted/20">
        <div className="flex items-center gap-1.5 min-w-0 text-sm overflow-hidden">
          {selectedAsset && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToList}
              className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0 mr-0.5"
              title="Quay lại danh sách"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}

          <button
            type="button"
            onClick={handleBackToList}
            className={cn(
              "font-semibold transition-colors cursor-pointer shrink-0 truncate",
              selectedAsset
                ? "text-muted-foreground hover:text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Tài sản truyện
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />

          {selectedAsset ? (
            <>
              <button
                type="button"
                onClick={handleBackToList}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                {STORY_ASSET_KIND_LABEL[selectedAsset.kind]}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="font-semibold text-foreground truncate min-w-0">
                {selectedAsset.name}
              </span>
            </>
          ) : (
            <span className="font-semibold text-foreground truncate min-w-0">
              {STORY_ASSET_KIND_LABEL[filter]}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0 ml-2"
          title="Đóng Tài sản truyện"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* 2. Nội dung: Nếu đang chọn tài sản thì hiển thị luôn thông tin trong thanh bên, ngược lại hiển thị danh sách */}
      {selectedAsset ? (
        <AssetDetailInline
          asset={selectedAsset}
          onBack={handleBackToList}
          onSave={handleUpdateAsset}
        />
      ) : (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Bộ lọc + nút thêm mới + tìm kiếm (cố định, không bị cuộn) */}
          <div className="shrink-0 p-4 pb-3 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              {/* Bộ tabs lọc phân loại dạng pill liền mạch */}
              <div className="flex-1 min-w-0 p-1 bg-muted/60 dark:bg-muted/30 rounded-xl flex items-center gap-1">
                {FILTER_OPTIONS.map((option) => {
                  const isActive = filter === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFilter(option.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                        isActive
                          ? "bg-background text-foreground shadow-2xs font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                      )}
                    >
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>

              <Button
                size="sm"
                onClick={handleAddNewAsset}
                className="h-8 gap-1 px-3 text-xs font-semibold bg-brand hover:bg-brand-hover text-brand-foreground cursor-pointer shrink-0 shadow-2xs"
                title={`Thêm ${STORY_ASSET_KIND_LABEL[filter].toLowerCase()} mới`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </Button>
            </div>

            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm tài sản truyện..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9 bg-card text-xs h-9"
              />
            </div>
          </div>

          {/* Khu vực cuộn chỉ dành riêng cho Danh sách tài sản */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
            {/* Danh sách tài sản: Nhân vật & Vật phẩm 2 cột, Địa điểm 1 cột */}
            {filteredAssets.length > 0 ? (
              <div
                className={cn(
                  "grid gap-3",
                  filter === "location" ? "grid-cols-1" : "grid-cols-2"
                )}
              >
                {filteredAssets.map((asset) => (
                  <article
                    key={asset.id}
                    onClick={() => handleOpenDetail(asset)}
                    className="group rounded-2xl border bg-card p-3 shadow-2xs transition-all flex flex-col items-center text-center cursor-pointer hover:border-brand/40 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] select-none"
                  >
                    {/* Ô ảnh ở trên */}
                    <div
                      className={cn(
                        "relative w-full rounded-xl border border-dashed border-border bg-muted/40 p-2 overflow-hidden flex items-center justify-center group-hover:border-brand/40 transition-colors",
                        filter === "location" ? "aspect-[16/9]" : "aspect-square"
                      )}
                    >
                      <img
                        src={asset.imageUrl || PLACEHOLDER_IMAGE}
                        alt={asset.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>

                    {/* Tên ở dưới */}
                    <div className="w-full mt-2.5 px-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-brand-strong dark:group-hover:text-brand transition-colors truncate">
                        {asset.name}
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed bg-card/60 py-12 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <Search className="w-4 h-4" />
                </div>
                <p className="mt-3 text-xs font-medium">Không tìm thấy tài sản nào</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Thử đổi bộ lọc hoặc từ khóa tìm kiếm khác.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
