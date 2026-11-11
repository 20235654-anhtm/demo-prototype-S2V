import { useState } from "react";
import { AlertTriangle, User, MapPin, Box, Link2 } from "lucide-react";
import type { AssetLinkWarning } from "@/types/script";
import type { StoryAsset, StoryAssetKind } from "@/mocks/mockStoryDetails";
import { AssetSelectPopover } from "./AssetSelectPopover";

export interface WarningItemWithShot {
  shotId: string;
  shotCode?: string;
  warning: AssetLinkWarning;
}

interface EntityLinkWarningBoxProps {
  warnings: WarningItemWithShot[];
  isGlobal?: boolean;
  onLinkEntity: (
    warning: AssetLinkWarning,
    shotId: string,
    asset: StoryAsset
  ) => void;
  onEditAsset?: (assetId: string) => void;
  onCreateNewAsset?: (kind: StoryAssetKind, initialName?: string) => void;
}

export const EntityLinkWarningBox = ({
  warnings,
  isGlobal = false,
  onLinkEntity,
  onEditAsset,
  onCreateNewAsset,
}: EntityLinkWarningBoxProps) => {
  const [activeWarningItem, setActiveWarningItem] =
    useState<WarningItemWithShot | null>(null);

  if (warnings.length === 0) return null;

  const renderKindIcon = (kind: StoryAssetKind) => {
    switch (kind) {
      case "character":
        return <User className="w-3.5 h-3.5 text-blue-600" />;
      case "location":
        return <MapPin className="w-3.5 h-3.5 text-emerald-600" />;
      case "prop":
        return <Box className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <>
      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-amber-900 leading-tight">
              {isGlobal
                ? "Có thực thể chưa liên kết với Story Assets"
                : "Phát hiện thực thể chưa liên kết trong kịch bản cảnh này"}
            </h4>
            <p className="text-[11px] text-amber-700/90 mt-0.5 leading-normal">
              {isGlobal
                ? "Liên kết thực thể với Story Assets để hình ảnh nhân vật và bối cảnh luôn đồng nhất qua các cảnh."
                : "Liên kết để AI áp dụng đúng diện mạo và đặc điểm đã thiết lập trong Story Assets."}
            </p>
          </div>
        </div>

        {/* List of Warning Pills (Standard Photo 1) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {warnings.map((item, idx) => {
            const { warning, shotCode } = item;
            const displayName = warning.entityName || warning.name;
            return (
              <div
                key={`${item.shotId}-${warning.id}-${idx}`}
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/90 border border-amber-300/70 rounded-md shadow-2xs text-xs text-neutral-800"
              >
                <span className="shrink-0">{renderKindIcon(warning.kind)}</span>
                <span className="font-medium text-neutral-800 text-[11px]">
                  {displayName}
                </span>
                {isGlobal && shotCode && (
                  <span className="text-[10px] text-neutral-400 font-normal">
                    ({shotCode})
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setActiveWarningItem(item)}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium transition-colors shadow-2xs cursor-pointer ml-1"
                >
                  <Link2 className="w-2.5 h-2.5" />
                  Link
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popover to select/create asset for this warning */}
      {activeWarningItem && (
        <AssetSelectPopover
          kind={activeWarningItem.warning.kind}
          selectedAssetIds={[]}
          initialSearchQuery={
            activeWarningItem.warning.entityName ||
            activeWarningItem.warning.name
          }
          onSelectAsset={(asset) => {
            onLinkEntity(
              activeWarningItem.warning,
              activeWarningItem.shotId,
              asset
            );
            setActiveWarningItem(null);
          }}
          onClose={() => setActiveWarningItem(null)}
          onEditAsset={onEditAsset}
          onCreateNewAsset={(kind, initialName) => {
            onCreateNewAsset?.(kind, initialName);
            setActiveWarningItem(null);
          }}
        />
      )}
    </>
  );
};
