import { Check, Globe, Lock } from "lucide-react";
import { MOCK_ART_STYLES } from "./mockData";
import type { CreateStoryFormData } from "./types";

interface StepSettingsProps {
  formData: CreateStoryFormData;
  onFormDataChange: React.Dispatch<React.SetStateAction<CreateStoryFormData>>;
}

const ASPECT_RATIOS: { value: '16:9' | '9:16' | '1:1' | '4:3'; label: string; desc: string; iconRatio: string }[] = [
  { value: "16:9", label: "16:9", desc: "Youtube / TV", iconRatio: "w-7 h-4" },
  { value: "9:16", label: "9:16", desc: "Shorts / TikTok", iconRatio: "w-4 h-7" },
  { value: "1:1", label: "1:1", desc: "Khung vuông", iconRatio: "w-5 h-5" },
  { value: "4:3", label: "4:3", desc: "Sách tranh / Tablet", iconRatio: "w-6 h-5" },
];

const VISIBILITY_OPTIONS = [
  {
    value: "private" as const,
    label: "Riêng tư",
    description: "Chỉ bạn có thể xem và chỉnh sửa dự án này.",
    icon: Lock,
  },
  {
    value: "public" as const,
    label: "Công khai",
    description: "Mọi người có thể xem và khám phá dự án của bạn.",
    icon: Globe,
  },
];

export default function StepSettings({ formData, onFormDataChange }: StepSettingsProps) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto pr-3">
      <div className="space-y-6 pb-4">
        {/* 1. Ngôn ngữ tác phẩm */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Ngôn ngữ tác phẩm
          </label>

          <select
            value={formData.language}
            onChange={(e) =>
              onFormDataChange((prev) => ({ ...prev, language: e.target.value }))
            }
            className="w-full h-10 px-3 rounded-xl border bg-card text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-2xs"
          >
            <option value="vi">🇻🇳 Tiếng Việt</option>
            <option value="en">🇺🇸 English</option>
            <option value="ja">🇯🇵 日本語</option>
          </select>
        </div>

        {/* 2. Phong cách nghệ thuật */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Phong cách nghệ thuật
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOCK_ART_STYLES.map((style) => {
              const isSelected = formData.artStyle === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() =>
                    onFormDataChange((prev) => ({ ...prev, artStyle: style.id }))
                  }
                  className={`group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all flex flex-col bg-card ${
                    isSelected
                      ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                      : "border-border hover:border-muted-foreground/40"
                  }`}
                >
                  {/* Visual Thumbnail */}
                  <div className="aspect-16/10 w-full overflow-hidden bg-muted relative">
                    <img
                      src={style.thumbnailUrl}
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Style Info */}
                  <div className="p-2">
                    <p className="font-semibold text-xs text-foreground truncate">
                      {style.name}
                    </p>
                    {style.description && (
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                        {style.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Tỷ lệ ảnh minh họa */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Tỷ lệ ảnh minh họa
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ASPECT_RATIOS.map((item) => {
              const isSelected = formData.aspectRatio === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    onFormDataChange((prev) => ({ ...prev, aspectRatio: item.value }))
                  }
                  className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 shadow-xs"
                      : "border-border hover:border-muted-foreground/40 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="w-7 h-7 rounded bg-muted/60 flex items-center justify-center shrink-0">
                      <div
                        className={`border-2 border-foreground/70 rounded-xs ${item.iconRatio}`}
                      />
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[3]" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Chế độ hiển thị */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Chế độ hiển thị
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VISIBILITY_OPTIONS.map((item) => {
              const isSelected = formData.visibility === item.value;
              const Icon = item.icon;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    onFormDataChange((prev) => ({ ...prev, visibility: item.value }))
                  }
                  className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs"
                      : "border-border hover:border-muted-foreground/40 bg-card"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "bg-muted/60 text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {item.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[3] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
