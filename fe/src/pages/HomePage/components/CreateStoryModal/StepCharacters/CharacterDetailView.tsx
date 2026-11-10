import { useState } from "react";
import { ArrowLeft, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CharacterVoiceSelect from "../CharacterVoiceSelect";
import type { CharacterItem, VoiceOption } from "../types";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";

interface CharacterDetailViewProps {
  character: CharacterItem;
  onBack: () => void;
  onUpdateCharacter: (updated: CharacterItem) => void;
}

export default function CharacterDetailView({
  character,
  onBack,
  onUpdateCharacter,
}: CharacterDetailViewProps) {
  const [name, setName] = useState(character.name);
  const [description, setDescription] = useState(character.description);
  const [imageUrl, setImageUrl] = useState(character.avatarUrl || PLACEHOLDER_IMAGE);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    onUpdateCharacter({ ...character, name: val });
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    onUpdateCharacter({ ...character, description: val });
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setImageUrl(character.avatarUrl || PLACEHOLDER_IMAGE);
      setIsRegenerating(false);
    }, 1000);
  };

  const handleSelectVoice = (voice: VoiceOption) => {
    onUpdateCharacter({
      ...character,
      voiceId: voice.id,
      voiceName: voice.name,
    });
  };

  const handleSave = () => {
    onUpdateCharacter({
      ...character,
      name,
      description,
      avatarUrl: imageUrl,
    });
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      onBack();
    }, 500);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden">
      {/* Top back button & Action */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-8 text-xs font-semibold -ml-2 text-primary hover:bg-muted cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Danh sách nhân vật
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={isSavedToast}
          className="bg-brand hover:bg-brand-hover text-brand-foreground text-xs font-semibold cursor-pointer gap-1 h-8"
        >
          {isSavedToast ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Đã lưu
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </div>

      {/* Main Content: Layout 2 cột giống Template Overview */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pb-4">
          {/* Cột trái: Khung ảnh + Nút tạo lại ảnh (giống AssetDetailDialog) */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative w-full aspect-square rounded-2xl border-2 border-dashed border-border bg-muted/40 overflow-hidden flex flex-col items-center justify-center p-3 shadow-inner group">
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
                  <span className="text-[11px] font-medium text-foreground">Đang sinh ảnh mới...</span>
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="w-full mt-2.5 gap-1.5 text-xs font-semibold cursor-pointer border-brand/40 text-brand-strong hover:bg-brand/10 hover:text-brand-strong dark:text-brand h-8"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
              Tạo lại ảnh
            </Button>
          </div>

          {/* Cột phải: Tên, Mô tả, Giọng đọc */}
          <div className="md:col-span-8 flex flex-col gap-3.5">
            {/* 1. Tên nhân vật */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground block">
                Tên nhân vật
              </label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nhập tên nhân vật..."
                className="h-9 text-xs"
              />
            </div>

            {/* 2. Mô tả nhân vật */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground block">
                Mô tả nhân vật
              </label>
              <Textarea
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Mô tả tạo hình, phong cách, tính cách nhân vật..."
                rows={4}
                className="text-xs leading-relaxed resize-none font-normal text-foreground bg-muted/20"
              />
            </div>

            {/* 3. Menu Select chọn giọng đọc - click mở Thư viện giọng */}
            <div className="space-y-1 pt-1">
              <label className="text-xs font-semibold text-foreground block">
                Giọng đọc nhân vật
              </label>
              <CharacterVoiceSelect
                voiceId={character.voiceId}
                voiceName={character.voiceName}
                onSelectVoice={handleSelectVoice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
