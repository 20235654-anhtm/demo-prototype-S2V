import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";
import CharacterVoiceSelect from "@/pages/HomePage/components/CreateStoryModal/CharacterVoiceSelect";
import type { VoiceOption } from "@/pages/HomePage/components/CreateStoryModal/types";
import {
  STORY_ASSET_KIND_LABEL,
  type StoryAsset,
} from "@/mocks/mockStoryDetails";

interface AssetDetailInlineProps {
  asset: StoryAsset;
  onBack?: () => void;
  onSave?: (updatedAsset: StoryAsset) => void;
}

export default function AssetDetailInline({
  asset,
  onSave,
}: AssetDetailInlineProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [voiceId, setVoiceId] = useState<string | undefined>(undefined);
  const [voiceName, setVoiceName] = useState<string | undefined>(undefined);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (asset) {
      setName(asset.name || "");
      setDescription(
        asset.imagePrompt ||
          asset.description ||
          `Hình ảnh chi tiết cho ${asset.name}, phong cách 3D cinematic, chất lượng cao.`
      );
      setImageUrl(asset.imageUrl || PLACEHOLDER_IMAGE);
      setVoiceId(asset.voiceId);
      setVoiceName(asset.voiceName);
    }
  }, [asset.id]);

  const kindLabel = STORY_ASSET_KIND_LABEL[asset.kind] || "Tài sản";

  const triggerAutoSave = (patch: Partial<StoryAsset>) => {
    onSave?.({
      ...asset,
      name,
      description,
      imagePrompt: description,
      imageUrl,
      voiceId: asset.kind === "character" ? voiceId : undefined,
      voiceName: asset.kind === "character" ? voiceName : undefined,
      ...patch,
    });
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const nextImg = asset.imageUrl || PLACEHOLDER_IMAGE;
      setImageUrl(nextImg);
      setIsRegenerating(false);
      triggerAutoSave({ imageUrl: nextImg });
    }, 1000);
  };

  const handleNameChange = (nextName: string) => {
    setName(nextName);
    triggerAutoSave({ name: nextName });
  };

  const handleDescriptionChange = (nextDesc: string) => {
    setDescription(nextDesc);
    triggerAutoSave({ description: nextDesc, imagePrompt: nextDesc });
  };

  const handleSelectVoice = (voice: VoiceOption) => {
    setVoiceId(voice.id);
    setVoiceName(voice.name);
    triggerAutoSave({ voiceId: voice.id, voiceName: voice.name });
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full bg-white dark:bg-neutral-900 overflow-hidden">
      {/* Thân cuộn chứa form chi tiết (Tự động lưu mọi thay đổi) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {/* Khung ảnh + Nút Tạo lại ảnh */}
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[240px] rounded-2xl border-2 border-dashed border-border bg-muted/40 overflow-hidden flex flex-col items-center justify-center p-3 shadow-inner group">
            <img
              src={imageUrl}
              alt={name}
              className={`w-full h-full object-contain rounded-xl transition-all duration-300 ${
                isRegenerating ? "opacity-30 scale-95 blur-xs" : "opacity-90"
              }`}
            />

            {isRegenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-xs gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-brand" />
                <span className="text-xs font-medium text-foreground">Đang sinh ảnh mới...</span>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="w-full max-w-[240px] mt-2.5 gap-1.5 text-xs font-semibold cursor-pointer border-brand/40 text-brand-strong hover:bg-brand/10 hover:text-brand-strong dark:text-brand"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
            Tạo lại ảnh
          </Button>
        </div>

        {/* Form thông tin chi tiết */}
        <div className="space-y-3.5">
          {/* Tên */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Tên {kindLabel.toLowerCase()}
            </label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={`Nhập tên ${kindLabel.toLowerCase()}...`}
              className="h-9 text-xs"
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Mô tả {kindLabel.toLowerCase()}
            </label>
            <Textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder={`Nhập mô tả tạo hình ${kindLabel.toLowerCase()}...`}
              rows={3}
              className="text-xs leading-relaxed resize-none font-normal text-foreground bg-muted/20"
            />
          </div>

          {/* Giọng đọc cho Nhân vật */}
          {asset.kind === "character" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground block">
                Giọng đọc nhân vật
              </label>
              <CharacterVoiceSelect
                voiceId={voiceId}
                voiceName={voiceName}
                onSelectVoice={handleSelectVoice}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
