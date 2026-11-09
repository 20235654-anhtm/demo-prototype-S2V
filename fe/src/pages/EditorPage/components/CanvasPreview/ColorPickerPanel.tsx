import { useCallback, useEffect, useRef, useState } from "react";
import { Pipette, ChevronDown } from "lucide-react";

export const COLOR_PICKER_PRESETS = [
  "#000000", "#1c1c1e", "#3a3a3c", "#636366", "#8e8e93", "#aeaeb2", "#c7c7cc", "#ffffff",
  "#ff3b30", "#ff6b35", "#ff9500", "#ffcc00", "#34c759", "#5ac8fa", "#007aff", "#5856d6",
  "#af52de", "#ff2d55", "#ff6961", "#ffb347", "#77dd77", "#87ceeb", "#4169e1", "#ff69b4",
];

type Format = "hex" | "rgb" | "hsl";
const FORMAT_LABEL: Record<Format, string> = { hex: "Hex", rgb: "RGB", hsl: "HSL" };

// ── Color math ──────────────────────────────────────────────────────────────

export function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
  };
  return `#${f(5).toString(16).padStart(2, "0")}${f(3).toString(16).padStart(2, "0")}${f(1).toString(16).padStart(2, "0")}`;
}

export function hexToHsv(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return [0, 0, 0];
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60); if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max];
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return [0, 0, 0];
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`;
}

function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((n) => n / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

function formatColor(hex: string, fmt: Format): string {
  if (fmt === "hex") return hex;
  if (fmt === "rgb") {
    const [r, g, b] = hexToRgb(hex);
    return `${r}, ${g}, ${b}`;
  }
  const [h, s, l] = hexToHsl(hex);
  return `${h}, ${s}%, ${l}%`;
}

function parseColorInput(input: string, fmt: Format): string | null {
  const v = input.trim();
  if (fmt === "hex") {
    const m = v.match(/^#?([0-9a-fA-F]{6})$/);
    return m ? `#${m[1].toLowerCase()}` : null;
  }
  const nums = v.replace(/[^\d,.\s%-]/g, "").split(/[,\s]+/).filter(Boolean).map(Number);
  if (nums.length !== 3 || nums.some(Number.isNaN)) return null;
  if (fmt === "rgb") {
    if (nums.some((n) => n < 0 || n > 255)) return null;
    return rgbToHex(nums[0], nums[1], nums[2]);
  }
  // hsl
  const [h, s, l] = nums;
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
  return hslToHex(h, s, l);
}

// ── EyeDropper typing ───────────────────────────────────────────────────────

interface EyeDropperResult { sRGBHex: string }
interface EyeDropperConstructor { new (): { open: () => Promise<EyeDropperResult> } }
function getEyeDropper(): EyeDropperConstructor | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { EyeDropper?: EyeDropperConstructor }).EyeDropper ?? null;
}

// ── Component ───────────────────────────────────────────────────────────────

export function ColorPickerPanel({
  color,
  onChange,
}: {
  color: string;
  onChange: (c: string) => void;
}) {
  const initialHex = /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#000000";
  const [hue, setHue] = useState(() => hexToHsv(initialHex)[0]);
  const [sat, setSat] = useState(() => hexToHsv(initialHex)[1]);
  const [val, setVal] = useState(() => hexToHsv(initialHex)[2]);
  const [format, setFormat] = useState<Format>("hex");
  const [inputText, setInputText] = useState(() => formatColor(initialHex, "hex"));

  const pickerRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"picker" | "hue" | null>(null);

  // Sync from external prop when it changes (skip while dragging)
  useEffect(() => {
    if (dragging.current) return;
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) return;
    const next = color.toLowerCase();
    const currentHex = hsvToHex(hue, sat, val).toLowerCase();
    if (next === currentHex) return;
    const [h, s, v] = hexToHsv(next);
    setHue(h); setSat(s); setVal(v);
    setInputText(formatColor(next, format));
  }, [color]); // eslint-disable-line react-hooks/exhaustive-deps

  const emitColor = useCallback((h: number, s: number, v: number) => {
    const c = hsvToHex(h, s, v);
    setInputText(formatColor(c, format));
    onChange(c);
  }, [onChange, format]);

  const handlePickerPointer = useCallback((e: PointerEvent | React.PointerEvent) => {
    const el = pickerRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const newSat = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newVal = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    setSat(newSat); setVal(newVal); emitColor(hue, newSat, newVal);
  }, [hue, emitColor]);

  const handleHuePointer = useCallback((e: PointerEvent | React.PointerEvent) => {
    const el = hueRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const newHue = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360));
    setHue(newHue); emitColor(newHue, sat, val);
  }, [sat, val, emitColor]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (dragging.current === "picker") handlePickerPointer(e);
      else if (dragging.current === "hue") handleHuePointer(e);
    };
    const up = () => { dragging.current = null; };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
    };
  }, [handlePickerPointer, handleHuePointer]);

  const handleFormatChange = (f: Format) => {
    setFormat(f);
    setInputText(formatColor(hsvToHex(hue, sat, val), f));
  };

  const handleInputChange = (raw: string) => {
    setInputText(raw);
    const parsed = parseColorInput(raw, format);
    if (parsed) {
      const [h, s, v] = hexToHsv(parsed);
      setHue(h); setSat(s); setVal(v);
      onChange(parsed);
    }
  };

  const handleInputBlur = () => {
    setInputText(formatColor(hsvToHex(hue, sat, val), format));
  };

  const handleEyeDropper = async () => {
    const Ctor = getEyeDropper();
    if (!Ctor) return;
    try {
      const result = await new Ctor().open();
      const next = result.sRGBHex.toLowerCase();
      if (!/^#[0-9a-fA-F]{6}$/.test(next)) return;
      const [h, s, v] = hexToHsv(next);
      setHue(h); setSat(s); setVal(v);
      setInputText(formatColor(next, format));
      onChange(next);
    } catch {
      // User cancelled
    }
  };

  const pickPreset = (c: string) => {
    const [h, s, v] = hexToHsv(c);
    setHue(h); setSat(s); setVal(v);
    setInputText(formatColor(c, format));
    onChange(c);
  };

  const currentHueHex = hsvToHex(hue, 1, 1);
  const eyeDropperAvailable = !!getEyeDropper();

  return (
    <div className="w-[240px] p-3 flex flex-col gap-3 select-none text-neutral-800 dark:text-neutral-100">
      {/* SV area */}
      <div
        ref={pickerRef}
        className="relative rounded-lg overflow-hidden cursor-crosshair touch-none border border-black/10 dark:border-white/10"
        style={{ height: 130 }}
        onPointerDown={(e) => {
          dragging.current = "picker";
          (e.target as Element).setPointerCapture?.(e.pointerId);
          handlePickerPointer(e);
        }}
      >
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, white, ${currentHueHex})` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, black)" }} />
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{
            left: `${sat * 100}%`,
            top: `${(1 - val) * 100}%`,
            transform: "translate(-50%,-50%)",
            backgroundColor: hsvToHex(hue, sat, val),
          }}
        />
      </div>

      {/* Hue slider */}
      <div
        ref={hueRef}
        className="relative h-3 rounded-full cursor-pointer touch-none shadow-inner"
        style={{ background: "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)" }}
        onPointerDown={(e) => {
          dragging.current = "hue";
          (e.target as Element).setPointerCapture?.(e.pointerId);
          handleHuePointer(e);
        }}
      >
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{
            left: `${(hue / 360) * 100}%`,
            top: "50%",
            transform: "translate(-50%,-50%)",
            backgroundColor: currentHueHex,
          }}
        />
      </div>

      {/* Format selector + input + eyedropper */}
      <div className="flex items-stretch gap-1.5">
        <div className="relative">
          <select
            value={format}
            onChange={(e) => handleFormatChange(e.target.value as Format)}
            className="appearance-none pl-2 pr-5 h-7 text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md focus:outline-none cursor-pointer"
            title="Đổi định dạng"
          >
            {(Object.keys(FORMAT_LABEL) as Format[]).map((f) => (
              <option key={f} value={f}>
                {FORMAT_LABEL[f]}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          spellCheck={false}
          className="flex-1 min-w-0 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-2 h-7 text-[11px] font-mono focus:outline-none focus:border-neutral-400"
        />

        {eyeDropperAvailable && (
          <button
            type="button"
            onClick={handleEyeDropper}
            className="w-7 h-7 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            title="Hút màu từ màn hình"
          >
            <Pipette className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-8 gap-1.5 pt-1 border-t border-neutral-100 dark:border-neutral-800">
        {COLOR_PICKER_PRESETS.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => pickPreset(c)}
            className="w-5 h-5 rounded-full border border-black/10 dark:border-white/10 hover:scale-115 transition-transform cursor-pointer"
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>
    </div>
  );
}
