import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { Search, Plus } from "lucide-react";
import {
  STORY_ASSET_KIND_LABEL,
  mockStoryAssets,
  type StoryAsset,
  type StoryAssetKind,
} from "@/mocks/mockStoryDetails";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";
import AssetDetailInline from "@/pages/EditorPage/components/AssetDetailInline";

type AssetFilter = StoryAssetKind;

const FILTER_OPTIONS: Array<{ id: StoryAssetKind; label: string }> = [
  { id: "character", label: STORY_ASSET_KIND_LABEL.character },
  { id: "location", label: STORY_ASSET_KIND_LABEL.location },
  { id: "prop", label: STORY_ASSET_KIND_LABEL.prop },
];

interface StoryAssetsViewProps {
  selectedAsset?: StoryAsset | null;
  onSelectAsset?: (asset: StoryAsset | null) => void;
  activeFilter?: AssetFilter;
  onFilterChange?: (filter: AssetFilter) => void;
}

export default function StoryAssetsView({
  selectedAsset: controlledSelectedAsset,
  onSelectAsset,
  activeFilter,
  onFilterChange,
}: StoryAssetsViewProps) {
  const [assets, setAssets] = useState<StoryAsset[]>(mockStoryAssets);
  const [internalFilter, setInternalFilter] = useState<AssetFilter>("character");
  const [query, setQuery] = useState("");
  const [internalSelectedAsset, setInternalSelectedAsset] = useState<StoryAsset | null>(null);

  const filter = activeFilter !== undefined ? activeFilter : internalFilter;
  const setFilter = (nextFilter: AssetFilter) => {
    setInternalFilter(nextFilter);
    onFilterChange?.(nextFilter);
  };

  const selectedAsset = controlledSelectedAsset !== undefined ? controlledSelectedAsset : internalSelectedAsset;

  const setSelectedAsset = (asset: StoryAsset | null) => {
    setInternalSelectedAsset(asset);
    onSelectAsset?.(asset);
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

  const handleUpdateAsset = (updated: StoryAsset) => {
    setAssets((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setSelectedAsset(updated);
  };

  const handleBack = () => {
    setSelectedAsset(null);
  };

  if (selectedAsset) {
    return (
      <div className="-m-4 h-[calc(100%+2rem)] flex flex-col">
        <AssetDetailInline
          asset={selectedAsset}
          onBack={handleBack}
          onSave={handleUpdateAsset}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bộ lọc + nút thêm mới + tìm kiếm */}
      <div className="flex flex-col gap-2.5">
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
            className="pl-9 bg-card"
          />
        </div>
      </div>

      {/* Danh sách tài sản: Nhân vật & Vật phẩm 2 cột/hàng, Địa điểm 1 cột/hàng */}
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
                {asset.kind === "character" && asset.voiceName && (
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5 font-normal">
                    Giọng: <span className="text-foreground/90 font-medium">{asset.voiceName}</span>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-card/60 py-14 flex flex-col items-center justify-center text-center">
          <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <p className="mt-3 text-sm font-medium">Không tìm thấy tài sản nào</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Thử đổi bộ lọc hoặc từ khóa tìm kiếm khác.
          </p>
        </div>
      )}
    </div>
  );
}
