import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowUp, Lock, Sparkles, Scissors, Zap, Target } from "lucide-react";
import type { Shot } from "@/types/script";

interface ResplitPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  targetShots: Shot[];
  onSubmit: (prompt: string, mode: "merge_resplit" | "split_each") => void;
}

export default function ResplitPopover({
  isOpen,
  onClose,
  targetShots,
  onSubmit,
}: ResplitPopoverProps) {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"merge_resplit" | "split_each">("merge_resplit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const shotCount = targetShots.length;

  // Sắp xếp các cảnh theo thứ tự
  const sortedShots = [...targetShots].sort((a, b) => a.order - b.order);

  // Kiểm tra tính liền kề
  const isAdjacent = (() => {
    if (sortedShots.length <= 1) return true;
    for (let i = 0; i < sortedShots.length - 1; i++) {
      if (sortedShots[i + 1].order !== sortedShots[i].order + 1) {
        return false;
      }
    }
    return true;
  })();

  // Tự động chuyển tab nếu không liền kề hoặc khi thay đổi targetShots
  useEffect(() => {
    if (!isOpen) return;
    if (shotCount > 1 && !isAdjacent) {
      setActiveTab("split_each");
    } else {
      setActiveTab("merge_resplit");
    }
    setPrompt("");
    // Focus vào textarea sau khi mở
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  }, [isOpen, shotCount, isAdjacent]);

  if (!isOpen || shotCount === 0) return null;

  // Tạo tiêu đề theo ngữ cảnh
  const title = (() => {
    if (shotCount === 1) {
      return `Chia lại ${sortedShots[0].code}`;
    }
    if (isAdjacent) {
      return `Chia lại phân cảnh (${sortedShots[0].code} – ${sortedShots[sortedShots.length - 1].code})`;
    }
    return `Chia lại phân cảnh (${sortedShots.map((s) => s.code).join(", ")})`;
  })();

  // Danh sách Prompt Chips theo từng Case
  interface PromptChip {
    icon: React.ReactNode;
    label: string;
    text: string;
  }

  const getPromptChips = (): PromptChip[] => {
    if (shotCount === 1) {
      // Trường hợp C: Đúng 1 cảnh
      return [
        {
          icon: <Scissors className="w-3 h-3 text-amber-500" />,
          label: "Mỗi câu là 1 cảnh",
          text: "Chia nhỏ cảnh này ra, mỗi câu trọn vẹn thành một phân cảnh riêng biệt.",
        },
        {
          icon: <Scissors className="w-3 h-3 text-blue-500" />,
          label: "Chia đôi cảnh này",
          text: "Tìm điểm ngắt ý phù hợp nhất ở giữa để chia đôi phân cảnh này.",
        },
        {
          icon: <Target className="w-3 h-3 text-emerald-500" />,
          label: "Tách câu cuối ra riêng",
          text: "Giữ nguyên đoạn đầu, tách riêng câu cuối cùng ra thành phân cảnh mới độc lập.",
        },
      ];
    }

    if (activeTab === "merge_resplit") {
      // Trường hợp A - Tab 1: Gom đoạn rồi chia lại
      return [
        {
          icon: <Scissors className="w-3 h-3 text-amber-500" />,
          label: "Gom lại rồi chia đôi",
          text: "Gom toàn bộ nội dung của các cảnh này lại và chia đều thành 2 phân cảnh cân đối.",
        },
        {
          icon: <Zap className="w-3 h-3 text-indigo-500" />,
          label: "Chia lại theo nhịp nhanh (~4s/shot)",
          text: "Chia lại toàn bộ đoạn này thành các phân cảnh ngắn (mỗi cảnh khoảng 3-5 giây) để tạo nhịp video dồn dập.",
        },
        {
          icon: <Target className="w-3 h-3 text-emerald-500" />,
          label: "Tách câu chốt làm điểm nhấn",
          text: "Gộp phần đầu lại, tách riêng câu cuối cùng ra thành 1 phân cảnh độc lập.",
        },
      ];
    } else {
      // Trường hợp B hoặc Tab 2: Chia nhỏ từng cảnh độc lập
      return [
        {
          icon: <Scissors className="w-3 h-3 text-amber-500" />,
          label: "Mỗi câu là 1 cảnh",
          text: "Duyệt qua từng cảnh đã chọn, tách mỗi câu trọn vẹn thành một phân cảnh riêng biệt.",
        },
        {
          icon: <Scissors className="w-3 h-3 text-blue-500" />,
          label: "Chia đôi từng cảnh",
          text: "Tìm điểm ngắt ý phù hợp nhất ở giữa để chia đôi từng cảnh đã chọn.",
        },
        {
          icon: <Zap className="w-3 h-3 text-indigo-500" />,
          label: "Giới hạn nhịp nhanh (~5s)",
          text: "Chia nhỏ từng cảnh sao cho độ dài mỗi cảnh dao động quanh mức 4-6 giây.",
        },
      ];
    }
  };

  const handleChipClick = (text: string) => {
    setPrompt(text);
    if (textareaRef.current) {
      textareaRef.current.value = text;
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      textareaRef.current.focus();
    }
  };

  const handleSubmit = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    const mode = shotCount === 1 ? "split_each" : activeTab;
    onSubmit(trimmed, mode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const placeholderText = (() => {
    if (shotCount === 1) {
      return "Nhập yêu cầu chia nhỏ cảnh này (hoặc bấm chọn gợi ý bên dưới)...";
    }
    if (activeTab === "merge_resplit") {
      return "Nhập yêu cầu phân chia lại cho cả đoạn này...";
    }
    return "Nhập quy tắc chia nhỏ cho từng cảnh đã chọn...";
  })();

  const promptChips = getPromptChips();

  return (
    <div className="relative bg-white dark:bg-neutral-900 border border-primary/30 dark:border-primary/40 rounded-xl shadow-xl shadow-black/10 overflow-hidden mb-3 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* 1. Header */}
      <div className="px-3.5 py-2.5 border-b border-border/80 flex items-center justify-between bg-primary/5 dark:bg-primary/10">
        <div className="flex items-center gap-1.5 font-semibold text-xs text-primary">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>{title}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-5 w-5 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="p-3 space-y-3">
        {/* 2. Context Tabs (Chỉ hiển thị khi chọn > 1 cảnh) */}
        {shotCount > 1 && (
          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg text-xs font-medium">
            {/* Tab 1: Chia lại cả đoạn */}
            {isAdjacent ? (
              <button
                type="button"
                onClick={() => setActiveTab("merge_resplit")}
                className={`flex-1 py-1.5 px-2 rounded-md transition-all text-center cursor-pointer ${
                  activeTab === "merge_resplit"
                    ? "bg-white dark:bg-neutral-800 text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === "merge_resplit" ? "● " : "○ "} Chia lại cả đoạn
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 py-1.5 px-2 rounded-md text-muted-foreground/50 bg-transparent flex items-center justify-center gap-1 cursor-not-allowed"
                title="Chỉ chia lại cả đoạn khi các cảnh được chọn liền kề nhau"
              >
                <Lock className="w-3 h-3" />
                <span>Chia lại cả đoạn (Cần liền kề)</span>
              </button>
            )}

            {/* Tab 2: Chia nhỏ từng cảnh */}
            <button
              type="button"
              onClick={() => setActiveTab("split_each")}
              className={`flex-1 py-1.5 px-2 rounded-md transition-all text-center cursor-pointer ${
                activeTab === "split_each"
                  ? "bg-white dark:bg-neutral-800 text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "split_each" ? "● " : "○ "} Chia nhỏ từng cảnh
            </button>
          </div>
        )}

        {/* 3. Input Box */}
        <div className="relative border border-input rounded-lg bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all p-2">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className="w-full text-xs text-foreground bg-transparent resize-none outline-none leading-relaxed min-h-[50px] max-h-[120px] pr-8"
            rows={2}
          />
          {/* Nút gửi mũi tên lên [ ↑ ] */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className={`absolute bottom-2 right-2 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
              prompt.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
                : "bg-muted text-muted-foreground/40 cursor-not-allowed"
            }`}
            title="Gửi yêu cầu chia lại"
          >
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Prompt Chips */}
        <div>
          <div className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center justify-between">
            <span>
              {shotCount > 1 && activeTab === "split_each"
                ? "Gợi ý quy tắc chia nhỏ (Áp dụng độc lập cho mỗi cảnh):"
                : "Gợi ý nhanh (Bấm để tự điền):"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip.text)}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-transparent transition-all cursor-pointer text-foreground/80 active:scale-95"
              >
                {chip.icon}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
