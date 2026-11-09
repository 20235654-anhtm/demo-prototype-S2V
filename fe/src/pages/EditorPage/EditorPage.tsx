import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import EditorHeader from "./components/EditorHeader";
import FarRightSidebar from "./components/FarRightSidebar";
import ScriptPanel from "./components/ScriptPanel";
import StoryAssetsPanel from "./components/StoryAssetsPanel";
import VisualsPanel from "./components/VisualsPanel";
import CanvasPreview from "./components/CanvasPreview/CanvasPreview";
import ResplitAllModal from "./components/Resplit/ResplitAllModal";
import { mockInitialShots } from "@/mocks/mockShots";
import { getProject } from "@/lib/projectStore";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";
import type { Shot, DiffProposal } from "@/types/script";

export default function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const chapterParam = Number(searchParams.get("chapter"));
  const selectedChapter =
    Number.isFinite(chapterParam) && chapterParam > 0 ? chapterParam : undefined;

  // Tìm tên dự án từ kho dự án (localStorage + mock data)
  const currentProject = projectId ? getProject(projectId) : undefined;
  const projectTitle = currentProject?.title || "Đấu Phá Thương Khung";

  // 1. Quản lý trạng thái các Panel & Cơ chế Pin kịch bản
  type RightTabType = "script" | "assets" | "visuals" | null;
  const [isScriptPinned, setIsScriptPinned] = useState<boolean>(true); // Đã Pin sang Cột Trái
  const [isScriptOpen, setIsScriptOpen] = useState<boolean>(true); // Cột Trái đang mở/đóng
  const [activeRightTab, setActiveRightTab] = useState<RightTabType>(null); // Tab mở ở Panel Phải

  // 2. Quản lý 2 chế độ thanh tua
  const [timelineMode, setTimelineMode] = useState<"compact" | "expanded">("compact");

  // 3. Quản lý dữ liệu phân cảnh
  const [shots, setShots] = useState<Shot[]>(mockInitialShots);
  const [activeShotId, setActiveShotId] = useState<string>(mockInitialShots[1]?.id || mockInitialShots[0]?.id);
  const [selectedShotIds, setSelectedShotIds] = useState<string[]>([]);
  const [proposal, setProposal] = useState<DiffProposal | null>(null);
  const [isResplitModalOpen, setIsResplitModalOpen] = useState<boolean>(false);

  // 4. Quản lý phát Video
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(31.0); // Bắt đầu ở 00:31
  const duration = shots.reduce((acc, s) => acc + s.duration, 0) || 44.0;

  const activeShot = shots.find((s) => s.id === activeShotId) || shots[0];

  // Giả lập phát video thời gian thực
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return Number((prev + 0.2).toFixed(1));
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Cập nhật activeShot theo currentTime khi phát video
  useEffect(() => {
    let acc = 0;
    for (const shot of shots) {
      acc += shot.duration;
      if (currentTime <= acc) {
        setActiveShotId(shot.id);
        break;
      }
    }
  }, [currentTime, shots]);

  // Logic Sidebar & Pin kịch bản
  const handleToggleScriptTab = () => {
    if (isScriptPinned) {
      // Nếu đã Pin sang Cột Trái -> bật/tắt Cột Trái
      setIsScriptOpen((prev) => !prev);
    } else {
      // Nếu chưa Pin -> mở/đóng ở Panel Phải
      setActiveRightTab((prev) => (prev === "script" ? null : "script"));
    }
  };

  const handleToggleAssetsTab = () => {
    setActiveRightTab((prev) => (prev === "assets" ? null : "assets"));
  };

  const handleToggleVisualsTab = () => {
    setActiveRightTab((prev) => (prev === "visuals" ? null : "visuals"));
  };

  const handlePinScript = () => {
    // Chuyển Script từ Panel Phải sang cố định ở Cột Trái
    setIsScriptPinned(true);
    setIsScriptOpen(true);
    setActiveRightTab(null);
  };

  const handleUnpinScript = () => {
    // Bỏ ghim: đóng Cột Trái và chuyển sang Panel Phải
    setIsScriptPinned(false);
    setIsScriptOpen(false);
    setActiveRightTab("script");
  };

  // Logic tương tác kịch bản
  const handleToggleSelectShot = (id: string, checked: boolean) => {
    setSelectedShotIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleTextChange = (id: string, text: string) => {
    setShots((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));
  };

  const handleToggleLock = (id: string) => {
    setShots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isLocked: !s.isLocked } : s))
    );
  };

  const handleMergeShots = () => {
    if (selectedShotIds.length <= 1) return;
    const selected = shots.filter((s) => selectedShotIds.includes(s.id));
    const mergedText = selected.map((s) => s.text).join(" ");
    const mergedDuration = selected.reduce((sum, s) => sum + s.duration, 0);

    const firstId = selectedShotIds[0];
    const newShots = shots
      .map((s) => {
        if (s.id === firstId) {
          return {
            ...s,
            text: mergedText,
            duration: mergedDuration,
          };
        }
        return s;
      })
      .filter((s) => s.id === firstId || !selectedShotIds.includes(s.id));

    setShots(newShots);
    setSelectedShotIds([]);
  };

  const handleApplyResplitAll = (
    _mode: "auto" | "duration" | "count",
    _value?: number
  ) => {
    // Tạo giả lập Diff Proposal chia lại
    const targetIds = selectedShotIds.length > 0 ? selectedShotIds : ["shot-2", "shot-3"];
    setProposal({
      targetShotIds: targetIds,
      newShots: [
        {
          id: `new-${Date.now()}-1`,
          code: "Cảnh 2A (Đề xuất)",
          text: "Trên quảng trường, trắc nghiệm ma thạch hiện lên năm chữ chói mắt: “Đấu chi lực, tam đoạn”.",
          duration: 7,
        },
        {
          id: `new-${Date.now()}-2`,
          code: "Cảnh 2B (Đề xuất)",
          text: "“Tiêu Viêm, đấu lực, tam đoạn! Cấp bậc: Cấp thấp!” Trung niên trắc nghiệm viên hờ hững công bố, đám đông lập tức xôn xao châm chọc.",
          duration: 6,
        },
      ],
    });
  };

  const handleRequestResplitScoped = (
    targetShotIds: string[],
    _prompt: string,
    mode: "merge_resplit" | "split_each"
  ) => {
    const targetShots = shots.filter((s) => targetShotIds.includes(s.id));
    if (targetShots.length === 0) return;

    const firstIndex = shots.findIndex((s) => s.id === targetShots[0].id);
    const baseOrder = firstIndex !== -1 ? firstIndex + 1 : 1;

    let newShots: { id: string; code: string; text: string; duration: number }[] = [];

    if (targetShots.length === 1) {
      // Trường hợp C: Chia đôi cảnh đơn
      const originalText = targetShots[0].text;
      const mid = Math.floor(originalText.length / 2);
      const spaceIdx = originalText.indexOf(" ", mid);
      const cut = spaceIdx !== -1 ? spaceIdx : mid;
      const part1 = originalText.slice(0, cut).trim();
      const part2 = originalText.slice(cut).trim();
      const dur1 = Math.max(3, Math.round(targetShots[0].duration / 2));
      const dur2 = Math.max(3, targetShots[0].duration - dur1);

      newShots = [
        {
          id: `new-${Date.now()}-1`,
          code: `Cảnh ${baseOrder}A (Đề xuất)`,
          text: part1 || originalText,
          duration: dur1,
        },
        {
          id: `new-${Date.now()}-2`,
          code: `Cảnh ${baseOrder}B (Đề xuất)`,
          text: part2 || "Tiếp tục diễn biến phân cảnh...",
          duration: dur2,
        },
      ];
    } else if (mode === "merge_resplit") {
      // Trường hợp A: Gom toàn bộ đoạn lại rồi chia
      const combinedText = targetShots.map((s) => s.text).join(" ");
      const totalDur = targetShots.reduce((acc, s) => acc + s.duration, 0);
      const mid = Math.floor(combinedText.length / 2);
      const spaceIdx = combinedText.indexOf(" ", mid);
      const cut = spaceIdx !== -1 ? spaceIdx : mid;

      newShots = [
        {
          id: `new-${Date.now()}-1`,
          code: `Cảnh ${baseOrder}A (Đề xuất)`,
          text: combinedText.slice(0, cut).trim(),
          duration: Math.max(3, Math.round(totalDur / 2)),
        },
        {
          id: `new-${Date.now()}-2`,
          code: `Cảnh ${baseOrder}B (Đề xuất)`,
          text: combinedText.slice(cut).trim(),
          duration: Math.max(3, totalDur - Math.round(totalDur / 2)),
        },
      ];
    } else {
      // Trường hợp B hoặc chia nhỏ từng cảnh (split_each)
      let counter = 1;
      targetShots.forEach((s, idx) => {
        const shotOrder = firstIndex !== -1 ? firstIndex + idx + 1 : idx + 1;
        const text = s.text;
        const mid = Math.floor(text.length / 2);
        const spaceIdx = text.indexOf(" ", mid);
        const cut = spaceIdx !== -1 ? spaceIdx : mid;

        newShots.push({
          id: `new-${Date.now()}-${counter++}`,
          code: `Cảnh ${shotOrder}A (Đề xuất)`,
          text: text.slice(0, cut).trim() || text,
          duration: Math.max(3, Math.round(s.duration / 2)),
        });
        newShots.push({
          id: `new-${Date.now()}-${counter++}`,
          code: `Cảnh ${shotOrder}B (Đề xuất)`,
          text: text.slice(cut).trim() || "Diễn biến tiếp theo...",
          duration: Math.max(3, s.duration - Math.round(s.duration / 2)),
        });
      });
    }

    setProposal({
      targetShotIds,
      newShots,
    });
  };

  const handleApplyProposal = () => {
    if (!proposal) return;
    const firstTargetIndex = shots.findIndex((s) => s.id === proposal.targetShotIds[0]);
    if (firstTargetIndex === -1) return;

    const convertedNewShots: Shot[] = proposal.newShots.map((ns, idx) => ({
      id: ns.id,
      order: firstTargetIndex + idx + 1,
      code: `Cảnh ${firstTargetIndex + idx + 1}`,
      text: ns.text,
      duration: ns.duration,
      image: PLACEHOLDER_IMAGE,
    }));

    const nextShots = [
      ...shots.slice(0, firstTargetIndex),
      ...convertedNewShots,
      ...shots.slice(firstTargetIndex + proposal.targetShotIds.length),
    ].map((s, idx) => ({ ...s, order: idx + 1, code: `Cảnh ${idx + 1}` }));

    setShots(nextShots);
    setProposal(null);
    setSelectedShotIds([]);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-stone-50/70 dark:bg-neutral-950 select-none">
      {/* 1. Header riêng của Studio */}
      <EditorHeader
        title={projectTitle}
        chapter={selectedChapter}
        onExport={() => alert("Đang chuẩn bị xuất file video MP4 chất lượng cao...")}
      />

      {/* 2. Thân Studio: Cơ chế co giãn 1, 2, 3 cột */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* (1) CỘT TRÁI: SCRIPT PANEL (Khi đã Pin và Cột Trái đang mở) */}
        {isScriptPinned && isScriptOpen && (
          <ScriptPanel
            isPinned={true}
            onTogglePin={handleUnpinScript}
            onClose={() => setIsScriptOpen(false)}
            shots={shots}
            activeShotId={activeShotId}
            selectedShotIds={selectedShotIds}
            onSelectShot={setActiveShotId}
            onToggleSelectShot={handleToggleSelectShot}
            onClearSelection={() => setSelectedShotIds([])}
            onTextChange={handleTextChange}
            onToggleLock={handleToggleLock}
            onOpenResplitModal={() => setIsResplitModalOpen(true)}
            onRequestResplitScoped={handleRequestResplitScoped}
            proposal={proposal}
            onApplyProposal={handleApplyProposal}
            onCancelProposal={() => setProposal(null)}
            onMergeShots={handleMergeShots}
          />
        )}

        {/* (2) KHUNG CANVAS PREVIEW (Tự co giãn flex-1 chiếm không gian trung tâm) */}
        <CanvasPreview
          timelineMode={timelineMode}
          onTimelineModeChange={setTimelineMode}
          activeShot={activeShot}
          shots={shots}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onSeek={(t) => setCurrentTime(t)}
          onRewind={(s) => setCurrentTime((t) => Math.max(0, t - s))}
          onSelectShot={setActiveShotId}
        />

        {/* (3) PANEL PHẢI (Khi mở Script ở dạng chưa Pin) */}
        {!isScriptPinned && activeRightTab === "script" && (
          <ScriptPanel
            isPinned={false}
            onTogglePin={handlePinScript}
            onClose={() => setActiveRightTab(null)}
            shots={shots}
            activeShotId={activeShotId}
            selectedShotIds={selectedShotIds}
            onSelectShot={setActiveShotId}
            onToggleSelectShot={handleToggleSelectShot}
            onClearSelection={() => setSelectedShotIds([])}
            onTextChange={handleTextChange}
            onToggleLock={handleToggleLock}
            onOpenResplitModal={() => setIsResplitModalOpen(true)}
            onRequestResplitScoped={handleRequestResplitScoped}
            proposal={proposal}
            onApplyProposal={handleApplyProposal}
            onCancelProposal={() => setProposal(null)}
            onMergeShots={handleMergeShots}
          />
        )}

        {/* (3) PANEL PHẢI (Khi mở Story Assets) */}
        {activeRightTab === "assets" && (
          <StoryAssetsPanel onClose={() => setActiveRightTab(null)} />
        )}

        {/* (3) PANEL PHẢI (Khi mở Visuals) */}
        {activeRightTab === "visuals" && (
          <VisualsPanel onClose={() => setActiveRightTab(null)} />
        )}

        {/* (4) THANH SIDEBAR PHẢI CÙNG */}
        <FarRightSidebar
          isScriptPinned={isScriptPinned}
          isScriptOpen={isScriptOpen}
          activeRightTab={activeRightTab}
          onToggleScript={handleToggleScriptTab}
          onToggleAssets={handleToggleAssetsTab}
          onToggleVisuals={handleToggleVisualsTab}
        />
      </div>

      {/* Modal Re-split all shots */}
      <ResplitAllModal
        open={isResplitModalOpen}
        onOpenChange={setIsResplitModalOpen}
        onApplyResplitAll={handleApplyResplitAll}
      />
    </div>
  );
}
