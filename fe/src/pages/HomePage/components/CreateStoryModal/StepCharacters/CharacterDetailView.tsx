import { useState } from "react";
import { ArrowLeft, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VoicePickerList from "../VoicePickerList";
import type { CharacterItem, VoiceOption } from "../types";

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
  const [previewLine, setPreviewLine] = useState(character.previewLine);
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    onUpdateCharacter({ ...character, name: val });
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    onUpdateCharacter({ ...character, description: val });
  };

  const handlePreviewLineChange = (val: string) => {
    setPreviewLine(val);
    onUpdateCharacter({ ...character, previewLine: val });
  };

  const handleAiEnhanceDescription = () => {
    setIsAiEnhancing(true);
    setTimeout(() => {
      const enhanced = `${description} (Tông giọng truyền cảm, ngữ điệu rõ ràng, cảm xúc phù hợp với nhân vật)`.trim();
      setDescription(enhanced);
      onUpdateCharacter({ ...character, description: enhanced });
      setIsAiEnhancing(false);
    }, 600);
  };

  const handleSelectVoice = (voice: VoiceOption) => {
    onUpdateCharacter({
      ...character,
      voiceId: voice.id,
      voiceName: voice.name,
    });
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden">
      {/* Top back button: [ < Danh sách nhân vật ] */}
      <div className="flex items-center justify-between mb-4 shrink-0">
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
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-3">
        <div className="space-y-5 pb-4">
          {/* 1. Tên nhân vật */}
          <div className="space-y-2.5">
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

          {/* 2. Mô tả vai diễn & tông giọng */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Mô tả vai diễn & tông giọng
              </label>
              <button
                type="button"
                onClick={handleAiEnhanceDescription}
                disabled={isAiEnhancing}
                title="AI tự động gợi ý mô tả nhân vật"
                className="text-xs text-brand-strong dark:text-brand hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isAiEnhancing ? "animate-spin" : ""}`} />
                <span>{isAiEnhancing ? "Đang viết..." : "Gợi ý AI"}</span>
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Mô tả vai trò, cảm xúc, tông giọng của nhân vật..."
              rows={2}
              className="w-full text-xs rounded-md border border-input bg-background p-2.5 text-foreground shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none leading-relaxed"
            />
          </div>

          {/* 3. Dòng thoại mẫu */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-foreground block">
              Dòng thoại mẫu
            </label>
            <textarea
              value={previewLine}
              onChange={(e) => handlePreviewLineChange(e.target.value)}
              placeholder="Nhập dòng thoại mẫu để nghe thử giọng đọc..."
              rows={2}
              className="w-full text-xs rounded-md border border-input bg-background p-2.5 text-foreground shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none leading-relaxed"
            />
          </div>

          {/* 4. Bộ chọn giọng đọc */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-semibold text-foreground block">
              Chọn giọng đọc cho nhân vật
            </label>
            <div className="h-65">
              <VoicePickerList
                selectedVoiceId={character.voiceId}
                onSelectVoice={handleSelectVoice}
                compact
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
