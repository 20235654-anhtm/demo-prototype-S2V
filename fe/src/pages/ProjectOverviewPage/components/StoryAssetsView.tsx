import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import {
  MapPin,
  Package,
  Search,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import {
  STORY_ASSET_KIND_LABEL,
  mockStoryAssets,
  type StoryAssetKind,
} from "@/mocks/mockStoryDetails";

type AssetFilter = StoryAssetKind;

interface KindStyle {
  icon: LucideIcon;
  avatar: string;
  chip: string;
}

const KIND_STYLE: Record<StoryAssetKind, KindStyle> = {
  character: {
    icon: UserRound,
    avatar: "from-brand via-orange-500 to-rose-500",
    chip: "border-brand/30 bg-brand/10 text-brand-strong dark:text-brand",
  },
  location: {
    icon: MapPin,
    avatar: "from-emerald-400 via-teal-500 to-cyan-600",
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  prop: {
    icon: Package,
    avatar: "from-violet-400 via-purple-500 to-fuchsia-600",
    chip: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
};

const FILTER_OPTIONS: Array<{ id: StoryAssetKind; label: string }> = [
  { id: "character", label: STORY_ASSET_KIND_LABEL.character },
  { id: "location", label: STORY_ASSET_KIND_LABEL.location },
  { id: "prop", label: STORY_ASSET_KIND_LABEL.prop },
];

/** Lấy chữ cái đầu của từ cuối trong tên (tên gọi chính). */
const getInitial = (name: string) => {
  const words = name.trim().split(/\s+/);
  const mainWord = words[words.length - 1] || name;
  return mainWord.charAt(0).toUpperCase() || "?";
};

const countByKind = (kind: StoryAssetKind) =>
  mockStoryAssets.filter((asset) => asset.kind === kind).length;

export default function StoryAssetsView() {
  const [filter, setFilter] = useState<AssetFilter>("character");
  const [query, setQuery] = useState("");

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return mockStoryAssets.filter((asset) => {
      const matchesFilter = asset.kind === filter;
      const matchesQuery =
        !normalizedQuery ||
        asset.name.toLowerCase().includes(normalizedQuery) ||
        asset.description.toLowerCase().includes(normalizedQuery) ||
        asset.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div className="space-y-5">
      {/* Bộ lọc + tìm kiếm */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTER_OPTIONS.map((option) => {
            const count = countByKind(option.id);
            const isActive = filter === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {option.label}
                <span
                  className={cn(
                    "text-[10px] rounded-full px-1.5 py-px",
                    isActive ? "bg-background/20" : "bg-muted"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
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

      {/* Danh sách tài sản */}
      {filteredAssets.length > 0 ? (
        <div className="grid gap-3">
          {filteredAssets.map((asset) => {
            const style = KIND_STYLE[asset.kind];
            const Icon = style.icon;

            return (
              <article
                key={asset.id}
                className="group rounded-xl border bg-card p-4 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shrink-0 shadow-sm",
                      style.avatar
                    )}
                  >
                    {asset.kind === "character" ? (
                      <span className="text-sm font-bold">
                        {getInitial(asset.name)}
                      </span>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-snug text-foreground">
                        {asset.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] shrink-0",
                          style.chip
                        )}
                      >
                        {STORY_ASSET_KIND_LABEL[asset.kind]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {asset.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
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
