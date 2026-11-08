import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, Upload, Trash2, Image as ImageIcon, Sparkles } from "lucide-react";
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

export default function StepSettings({ formData, onFormDataChange }: StepSettingsProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSelectCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onFormDataChange((prev) => ({ ...prev, coverImage: url }));
    }
  };

  const handleRemoveCover = () => {
    onFormDataChange((prev) => ({ ...prev, coverImage: null }));
  };

  const handleSetSampleCover = () => {
    onFormDataChange((prev) => ({
      ...prev,
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    }));
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto pr-3">
      <div className="space-y-6 pb-4">
        {/* 1. Phong cách đọc */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Phong cách đọc
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Single cast card */}
            <div
              onClick={() =>
                onFormDataChange((prev) => ({ ...prev, narrationStyle: "single" }))
              }
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-center ${
                formData.narrationStyle === "single"
                  ? "border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs"
                  : "border-border hover:border-muted-foreground/40 bg-card"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.narrationStyle === "single"
                          ? "border-amber-500 bg-amber-500 text-white"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {formData.narrationStyle === "single" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    Single cast
                  </span>
                </div>
                <p className="text-xs text-foreground/80 font-medium pl-6">
                  Một giọng người kể chuyện cho toàn bộ cuốn sách
                </p>
              </div>
            </div>

            {/* Multi cast card */}
            <div
              onClick={() =>
                onFormDataChange((prev) => ({ ...prev, narrationStyle: "multi" }))
              }
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-center ${
                formData.narrationStyle === "multi"
                  ? "border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs"
                  : "border-border hover:border-muted-foreground/40 bg-card"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.narrationStyle === "multi"
                          ? "border-amber-500 bg-amber-500 text-white"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {formData.narrationStyle === "multi" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    Multi cast
                  </span>
                </div>
                <p className="text-xs text-foreground/80 font-medium pl-6">
                  Các giọng đọc riêng biệt cho người kể chuyện và từng nhân vật trong tác phẩm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Ảnh bìa sách */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Ảnh bìa sách
          </label>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSelectCoverFile}
          />

          <div className="flex items-start sm:items-center gap-5">
            {/* Thumbnail Preview */}
            <div className="w-32 h-44 sm:w-36 sm:h-48 rounded-xl border bg-muted/40 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
              {formData.coverImage ? (
                <img
                  src={formData.coverImage}
                  alt="Book Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground/60 p-3 text-center">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs font-medium leading-tight">Chưa có ảnh bìa</span>
                  <span className="text-[10px] text-muted-foreground/60 mt-1">Tỷ lệ khuyến nghị 2:3</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => coverInputRef.current?.click()}
                  className="h-8 text-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Thay ảnh bìa
                </Button>
                {formData.coverImage ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCover}
                    className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Xóa ảnh bìa
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSetSampleCover}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                    Dùng ảnh mẫu
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {formData.coverImage
                  ? "Ảnh bìa sẽ được hiển thị làm thẻ đại diện ngoài trang chủ."
                  : "Nếu không tải ảnh, trang chủ sẽ hiển thị khung trích đoạn văn bản."}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Ngôn ngữ tác phẩm (Trực tiếp, không lồng 2 khung) */}
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

        {/* 4. Phong cách mỹ thuật */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Phong cách mỹ thuật
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

        {/* 5. Tỷ lệ ảnh muốn sinh */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Tỷ lệ ảnh minh hoạ muốn sinh
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
      </div>
    </div>
  );
}
