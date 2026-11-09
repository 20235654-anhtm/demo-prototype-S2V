import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Users,
  X,
  ChevronRight,
  Wand2,
  RefreshCw,
  Plus,
  Pencil,
  Volume2,
  MapPin,
  Check,
  User,
} from "lucide-react";
import type { CharacterAsset } from "@/types/script";
import { MOCK_VOICES } from "@/pages/HomePage/components/CreateStoryModal/mockData";
import { mockStoryAssets } from "@/mocks/mockStoryDetails";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";

interface StoryAssetsPanelProps {
  onClose: () => void;
  characters: CharacterAsset[];
  onCharactersChange: (characters: CharacterAsset[]) => void;
  selectedCharacterId?: string | null;
  onSelectCharacterId?: (id: string | null) => void;
}

export default function StoryAssetsPanel({
  onClose,
  characters,
  onCharactersChange,
  selectedCharacterId,
  onSelectCharacterId,
}: StoryAssetsPanelProps) {
  // Trạng thái hiển thị: 'overview' (tổng quan) hoặc 'detail' (chi tiết 1 nhân vật)
  const [viewMode, setViewMode] = useState<"overview" | "detail">("overview");
  const [activeCharId, setActiveCharId] = useState<string | null>(null);
  const [isChangingVoice, setIsChangingVoice] = useState(false);
  const [activeTab, setActiveTab] = useState<"characters" | "locations">("characters");

  // Đồng bộ khi có selectedCharacterId được truyền vào từ ngoài (click cây bút ở kịch bản)
  useEffect(() => {
    if (selectedCharacterId) {
      if (selectedCharacterId === "new") {
        // Tạo nhân vật mới nhanh
        const newChar: CharacterAsset = {
          id: `char-${Date.now()}`,
          name: "Nhân vật mới",
          avatar: PLACEHOLDER_IMAGE,
          description: "Mô tả tính cách và ngoại hình nhân vật...",
          voice: {
            id: MOCK_VOICES[0].id,
            name: MOCK_VOICES[0].name,
            style: MOCK_VOICES[0].subtitle,
          },
          volume: 150,
        };
        onCharactersChange([...characters, newChar]);
        setActiveCharId(newChar.id);
        setViewMode("detail");
      } else {
        const found = characters.find((c) => c.id === selectedCharacterId);
        if (found) {
          setActiveCharId(found.id);
          setViewMode("detail");
        }
      }
    }
  }, [selectedCharacterId, characters, onCharactersChange]);

  const activeCharacter = characters.find((c) => c.id === activeCharId) || characters[0];

  const handleUpdateActiveCharacter = (patch: Partial<CharacterAsset>) => {
    if (!activeCharacter) return;
    const updated = characters.map((c) =>
      c.id === activeCharacter.id ? { ...c, ...patch } : c
    );
    onCharactersChange(updated);
  };

  const handleAddNewCharacter = () => {
    const newChar: CharacterAsset = {
      id: `char-${Date.now()}`,
      name: `Nhân vật ${characters.length + 1}`,
      avatar: PLACEHOLDER_IMAGE,
      description: "Mô tả diện mạo, tính cách...",
      voice: {
        id: MOCK_VOICES[0].id,
        name: MOCK_VOICES[0].name,
        style: MOCK_VOICES[0].subtitle,
      },
      volume: 150,
    };
    onCharactersChange([...characters, newChar]);
    setActiveCharId(newChar.id);
    setViewMode("detail");
  };

  const locations = mockStoryAssets.filter((a) => a.kind === "location");

  return (
    <div className="w-80 md:w-[360px] xl:w-[400px] border-l flex flex-col h-full bg-white dark:bg-neutral-900 shrink-0 select-none">
      {/* 1. Header chuẩn có tiêu đề và nút đóng ✕ (Giữ nguyên 100% style hiện tại) */}
      <div className="h-12 px-4 border-b flex items-center justify-between shrink-0 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand/15 text-brand-strong dark:text-brand flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-sm">Tài sản truyện</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          title="Đóng Tài sản truyện"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* 2. Breadcrumb Navigation khi ở chế độ Detail */}
      {viewMode === "detail" && activeCharacter && (
        <div className="px-4 py-2 border-b bg-muted/10 flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
          <button
            type="button"
            onClick={() => {
              setViewMode("overview");
              onSelectCharacterId?.(null);
            }}
            className="hover:text-brand-strong dark:hover:text-brand transition-colors font-medium cursor-pointer"
          >
            Tài sản truyện
          </button>
          <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
          <span className="text-foreground font-semibold truncate">
            {activeCharacter.name}
          </span>
        </div>
      )}

      {/* 3. Phần thân cuộn linh hoạt */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {viewMode === "detail" && activeCharacter ? (
          /* ================= CHẾ ĐỘ DETAIL (Cấu hình nhân vật) ================= */
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Avatar & Tên */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Tên nhân vật
              </label>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border border-border/80 shrink-0 flex items-center justify-center">
                  {activeCharacter.avatar ? (
                    <img
                      src={activeCharacter.avatar}
                      alt={activeCharacter.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <Input
                  value={activeCharacter.name}
                  onChange={(e) =>
                    handleUpdateActiveCharacter({ name: e.target.value })
                  }
                  placeholder="Nhập tên nhân vật..."
                  className="h-9 text-xs font-medium"
                />
              </div>
            </div>

            {/* Description + AI Magic Sparkles */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Mô tả nhân vật
                </label>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateActiveCharacter({
                      description: `${activeCharacter.description} Khí chất tự tin, đôi mắt sắc sảo và hành động dứt khoát.`,
                    });
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-brand-strong dark:text-brand hover:underline cursor-pointer"
                  title="Tối ưu mô tả bằng AI Magic"
                >
                  <Wand2 className="w-3 h-3 text-brand" />
                  <span>AI Magic</span>
                </button>
              </div>
              <Textarea
                value={activeCharacter.description}
                onChange={(e) =>
                  handleUpdateActiveCharacter({ description: e.target.value })
                }
                placeholder="Mô tả đặc điểm, ngoại hình, tính cách nhân vật..."
                rows={3}
                className="text-xs resize-none leading-relaxed"
              />
            </div>

            {/* Voice & Đổi giọng */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Giọng đọc
              </label>
              <div className="rounded-xl border border-border p-3 bg-card shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-brand/10 text-brand-strong dark:text-brand flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-foreground truncate">
                        {activeCharacter.voice.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {activeCharacter.voice.style}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsChangingVoice(!isChangingVoice)}
                    className="p-1.5 rounded-lg border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                    title="Đổi giọng đọc"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] text-muted-foreground/80 italic">
                  Giọng đọc đang được chọn cho nhân vật này
                </div>

                {/* Danh sách chọn giọng mở rộng */}
                {isChangingVoice && (
                  <div className="pt-2 border-t space-y-1 max-h-48 overflow-y-auto animate-in fade-in duration-100">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Chọn giọng đọc tiếng Việt:
                    </div>
                    {MOCK_VOICES.map((v) => {
                      const isCurrent = v.id === activeCharacter.voice.id;
                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            handleUpdateActiveCharacter({
                              voice: {
                                id: v.id,
                                name: v.name,
                                style: `${v.subtitle} (${v.gender})`,
                              },
                            });
                            setIsChangingVoice(false);
                          }}
                          className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                            isCurrent
                              ? "bg-brand/10 text-brand-strong font-medium"
                              : "hover:bg-muted/70 text-foreground"
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="font-medium">{v.name}</span>
                            <span className="text-[10px] text-muted-foreground ml-1.5">
                              · {v.subtitle}
                            </span>
                          </div>
                          {isCurrent && (
                            <Check className="w-3.5 h-3.5 text-brand" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Voice Volume Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Âm lượng giọng đọc</span>
                </label>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-muted/60 border border-border/80">
                  {activeCharacter.volume} %
                </span>
              </div>
              <Slider
                value={[activeCharacter.volume]}
                min={0}
                max={200}
                onValueChange={(val) => {
                  if (Array.isArray(val) && val.length > 0) {
                    handleUpdateActiveCharacter({ volume: val[0] });
                  } else if (typeof val === "number") {
                    handleUpdateActiveCharacter({ volume: val });
                  }
                }}
                className="w-full cursor-pointer py-1"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0%</span>
                <span>100%</span>
                <span>200%</span>
              </div>
            </div>
          </div>
        ) : (
          /* ================= CHẾ ĐỘ OVERVIEW (Danh sách tổng quan) ================= */
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Tabs chuyển đổi Characters / Locations */}
            <div className="flex items-center p-1 rounded-lg bg-muted/50 border border-border/60">
              <button
                type="button"
                onClick={() => setActiveTab("characters")}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "characters"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Nhân vật ({characters.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("locations")}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "locations"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Bối cảnh ({locations.length})
              </button>
            </div>

            {activeTab === "characters" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Danh sách nhân vật
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddNewCharacter}
                    className="h-7 text-xs px-2 text-brand-strong dark:text-brand hover:bg-brand/10 border-brand/30 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    <span>Thêm nhân vật</span>
                  </Button>
                </div>

                <div className="space-y-1.5">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      onClick={() => {
                        setActiveCharId(char.id);
                        setViewMode("detail");
                        onSelectCharacterId?.(char.id);
                      }}
                      className="group flex items-center justify-between p-2 rounded-xl border border-border/80 bg-card hover:border-brand/40 hover:bg-brand/5 transition-all cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted border border-border/60 shrink-0 flex items-center justify-center">
                          {char.avatar ? (
                            <img
                              src={char.avatar}
                              alt={char.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-foreground group-hover:text-brand-strong transition-colors truncate">
                            {char.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {char.voice?.name} · {char.volume}%
                          </div>
                        </div>
                      </div>

                      <div className="p-1 rounded-md text-muted-foreground group-hover:text-brand-strong transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Bối cảnh câu chuyện
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("Chức năng thêm bối cảnh mới...")}
                    className="h-7 text-xs px-2 text-brand-strong dark:text-brand hover:bg-brand/10 border-brand/30 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    <span>Thêm bối cảnh</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  {locations.map((loc) => (
                    <div
                      key={loc.id}
                      className="p-2.5 rounded-xl border border-border/80 bg-card shadow-2xs space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-brand" />
                        <span className="font-semibold text-xs text-foreground">
                          {loc.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {loc.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
