import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Plus, Edit2, Check, X, User, MapPin, Box } from "lucide-react";
import {
  type StoryAsset,
  type StoryAssetKind,
  STORY_ASSET_KIND_LABEL,
  mockStoryAssets,
} from "@/mocks/mockStoryDetails";

interface AssetSelectPopoverProps {
  kind: StoryAssetKind;
  selectedAssetIds: string[];
  initialSearchQuery?: string;
  onSelectAsset: (asset: StoryAsset) => void;
  onDeselectAsset?: (assetId: string) => void;
  onClose: () => void;
  onEditAsset?: (assetId: string) => void;
  onCreateNewAsset?: (kind: StoryAssetKind, initialName?: string) => void;
}

export const AssetSelectPopover: React.FC<AssetSelectPopoverProps> = ({
  kind,
  selectedAssetIds,
  initialSearchQuery = "",
  onSelectAsset,
  onDeselectAsset,
  onClose,
  onEditAsset,
  onCreateNewAsset,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (initialSearchQuery) {
      inputRef.current?.select();
    }
  }, [initialSearchQuery]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const kindLabel = STORY_ASSET_KIND_LABEL[kind].toLowerCase();

  const filteredAssets = useMemo(() => {
    return mockStoryAssets.filter((item) => {
      if (item.kind !== kind) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [kind, searchQuery]);

  const renderKindIcon = () => {
    switch (kind) {
      case "character":
        return <User className="w-4 h-4 text-blue-500" />;
      case "location":
        return <MapPin className="w-4 h-4 text-emerald-500" />;
      case "prop":
        return <Box className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div
        ref={containerRef}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-white border border-neutral-200 shadow-xs">
              {renderKindIcon()}
            </span>
            <span className="text-sm font-semibold text-neutral-800">
              Chọn {kindLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-neutral-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Tìm ${kindLabel} hoặc nhập tên mới...`}
              className="w-full pl-9 pr-3 py-2 text-xs text-neutral-800 bg-neutral-50 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Asset List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-neutral-50">
          {filteredAssets.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400 space-y-2">
              <p>Không tìm thấy {kindLabel} nào khớp với "{searchQuery}"</p>
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    onCreateNewAsset?.(kind, searchQuery.trim());
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tạo mới "{searchQuery.trim()}" vào Story Assets
                </button>
              )}
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isSelected = selectedAssetIds.includes(asset.id);
              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    if (isSelected && onDeselectAsset) {
                      onDeselectAsset(asset.id);
                    } else {
                      onSelectAsset(asset);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer group ${
                    isSelected
                      ? "bg-amber-50/70 text-amber-950 font-medium"
                      : "hover:bg-neutral-50 text-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 flex items-center justify-center">
                      {asset.imageUrl ? (
                        <img
                          src={asset.imageUrl}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        renderKindIcon()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs truncate">{asset.name}</span>
                        {isSelected && (
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {asset.tags?.[0] || asset.voiceName || asset.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    {onEditAsset && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAsset(asset.id);
                        }}
                        title="Chỉnh sửa trong Story Assets"
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-md transition-colors opacity-60 group-hover:opacity-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-100 bg-neutral-50/70 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              onCreateNewAsset?.(kind);
              onClose();
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-500" />
            Thêm {kindLabel} mới
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-200/50 rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
