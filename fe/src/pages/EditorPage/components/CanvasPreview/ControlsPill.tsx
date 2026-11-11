import { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2, Check, Palette } from "lucide-react";
import { ColorPickerPanel } from "./ColorPickerPanel";

export interface AspectRatioOption {
  id: string;
  label: string;
  desc: string;
  css: string;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: "16:9", label: "16:9", desc: "YouTube, Ngang", css: "16 / 9" },
  { id: "9:16", label: "9:16", desc: "TikTok, Reels, Shorts", css: "9 / 16" },
  { id: "1:1", label: "1:1", desc: "Instagram, Vuông", css: "1 / 1" },
  { id: "4:5", label: "4:5", desc: "Facebook ads, Dọc vừa", css: "4 / 5" },
  { id: "original", label: "Gốc", desc: "Theo tỉ lệ phân cảnh", css: "16 / 9" },
];

export function AspectIcon({ id }: { id: string }) {
  if (id === "original") {
    return (
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
        <path
          d="M6.5 3L5.5 3C4.12 3 3 4.12 3 5.5L3 6.5M3 13.5L3 14.5C3 15.88 4.12 17 5.5 17L6.5 17M13.5 17L14.5 17C15.88 17 17 15.88 17 14.5L17 13.5M17 6.5L17 5.5C17 4.12 15.88 3 14.5 3L13.5 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (id === "16:9") {
    return (
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="5.5" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (id === "9:16") {
    return (
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
        <rect x="5.5" y="2" width="9" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (id === "4:5") {
    return (
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="2" width="15" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  // 1:1
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="2.5" width="15" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

interface ControlsPillProps {
  aspectRatioId: string;
  onAspectRatioChange: (id: string) => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  activeShotCode?: string;
  onOpenVisualsDetail?: () => void;
}

export default function ControlsPill({
  aspectRatioId,
  onAspectRatioChange,
  bgColor,
  onBgColorChange,
  isFullscreen,
  onToggleFullscreen,
  activeShotCode,
  onOpenVisualsDetail,
}: ControlsPillProps) {
  const [showAspectMenu, setShowAspectMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const aspectMenuRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const currentRatio =
    ASPECT_RATIOS.find((r) => r.id === aspectRatioId) || ASPECT_RATIOS[0];

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aspectMenuRef.current && !aspectMenuRef.current.contains(e.target as Node)) {
        setShowAspectMenu(false);
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center bg-white dark:bg-neutral-900 rounded-xl border border-border shadow-sm text-neutral-800 dark:text-neutral-200 select-none">
      {/* 1. Aspect Ratio Dropdown */}
      <div className="relative" ref={aspectMenuRef}>
        <button
          type="button"
          onClick={() => {
            setShowAspectMenu((v) => !v);
            setShowColorPicker(false);
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-l-xl transition-colors cursor-pointer"
          title="Chọn tỉ lệ khung hình"
        >
          <span className="text-neutral-600 dark:text-neutral-400">
            <AspectIcon id={currentRatio.id} />
          </span>
          <span className="font-semibold">{currentRatio.label}</span>
        </button>

        {showAspectMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-xl shadow-xl border border-border p-1.5 z-50 min-w-[240px] animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Tỉ lệ hiển thị
            </div>
            {ASPECT_RATIOS.map((ar) => (
              <button
                key={ar.id}
                type="button"
                onClick={() => {
                  onAspectRatioChange(ar.id);
                  setShowAspectMenu(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  ar.id === aspectRatioId
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center shrink-0">
                  <AspectIcon id={ar.id} />
                </span>
                <span className="flex items-baseline gap-1.5 flex-1 text-left">
                  <span className="font-semibold">{ar.label}</span>
                  <span className="text-[11px] text-muted-foreground font-normal">
                    {ar.desc}
                  </span>
                </span>
                {ar.id === aspectRatioId && (
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-4 bg-border" />

      {/* 2. Background Color Picker */}
      <div className="relative" ref={colorPickerRef}>
        <button
          type="button"
          onClick={() => {
            setShowColorPicker((v) => !v);
            setShowAspectMenu(false);
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Chọn màu nền khung video"
        >
          <div
            className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-xs"
            style={{ backgroundColor: bgColor }}
          />
          <span>Màu nền</span>
        </button>

        {showColorPicker && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-border z-50 animate-in fade-in zoom-in-95 duration-100">
            <ColorPickerPanel color={bgColor} onChange={onBgColorChange} />
          </div>
        )}
      </div>

      {/* 2.5 Dynamic Context Button: Chỉnh ảnh {activeShotCode} */}
      {activeShotCode && onOpenVisualsDetail && (
        <>
          <div className="w-px h-4 bg-border" />
          <button
            type="button"
            onClick={onOpenVisualsDetail}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            title={`Mở chỉnh sửa hình ảnh chi tiết cho ${activeShotCode}`}
          >
            <Palette className="w-3.5 h-3.5 text-primary" />
            <span>Chỉnh ảnh {activeShotCode}</span>
          </button>
        </>
      )}

      <div className="w-px h-4 bg-border" />

      {/* 3. Fullscreen Toggle */}
      <button
        type="button"
        onClick={onToggleFullscreen}
        className="px-3 py-1.5 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-r-xl transition-colors cursor-pointer"
        title={isFullscreen ? "Thu nhỏ (Esc)" : "Toàn màn hình"}
      >
        {isFullscreen ? (
          <Minimize2 className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
        ) : (
          <Maximize2 className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
        )}
      </button>
    </div>
  );
}
