import { useState, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import EditorHeader from "./components/EditorHeader";
import ScriptPanel from "./components/ScriptPanel";
import StoryAssetsModal from "./components/StoryAssetsModal";
import ShotVisualModal from "./components/Visuals/ShotVisualModal";
import CanvasPreview from "./components/CanvasPreview/CanvasPreview";
import ResplitAllModal from "./components/Resplit/ResplitAllModal";
import { mockInitialShots } from "@/mocks/mockShots";
import { mockCharacters } from "@/mocks/mockCharacters";
import { getProject } from "@/lib/projectStore";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";
import type {
  Shot,
  DiffProposal,
  CharacterAsset,
  DialogueBlock,
  ShotVisualData,
} from "@/types/script";

export default function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const chapterParam = Number(searchParams.get("chapter"));
  const selectedChapter =
    Number.isFinite(chapterParam) && chapterParam > 0 ? chapterParam : undefined;

  // Tìm tên dự án từ kho dự án (localStorage + mock data)
  const currentProject = projectId ? getProject(projectId) : undefined;
  const projectTitle = currentProject?.title || "Đấu Phá Thương Khung";

  // 1. Quản lý trạng thái các Panel & Menu Sidebar
  const [isAssetsModalOpen, setIsAssetsModalOpen] = useState(false);
  const [isVisualModalOpen, setIsVisualModalOpen] = useState(false);
  const [visualModalShotId, setVisualModalShotId] = useState<string | null>(null);

  // 1.0 Quản lý kéo dãn độ rộng 2 thanh bên trái và phải
  const [leftWidth, setLeftWidth] = useState<number>(490);

  const leftStartXRef = useRef(0);
  const leftStartWidthRef = useRef(0);

  const handleLeftResizeStart = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    leftStartXRef.current = e.clientX;
    leftStartWidthRef.current = leftWidth;

    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const maxWidth = Math.min(750, window.innerWidth * 0.55);
      const nextWidth = Math.min(
        Math.max(leftStartWidthRef.current + moveEvent.clientX - leftStartXRef.current, 380),
        maxWidth
      );
      setLeftWidth(nextWidth);
    };

    const handlePointerUp = () => {
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // 1.1 Quản lý danh sách nhân vật & điều hướng chọn nhân vật
  const [characters] = useState<CharacterAsset[]>(mockCharacters);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  // 2. Quản lý 2 chế độ thanh tua (mặc định mở thanh timeline đa track khi vào Studio)
  const [timelineMode, setTimelineMode] = useState<"compact" | "expanded">("expanded");

  // 3. Quản lý dữ liệu phân cảnh
  const [shots, setShots] = useState<Shot[]>(mockInitialShots);
  const [activeShotId, setActiveShotId] = useState<string>(mockInitialShots[0]?.id || "shot-1");
  const [selectedShotIds, setSelectedShotIds] = useState<string[]>([]);
  const [proposal, setProposal] = useState<DiffProposal | null>(null);
  const [isResplitModalOpen, setIsResplitModalOpen] = useState<boolean>(false);

  // 4. Quản lý phát Video
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const duration = shots.reduce((acc, s) => acc + s.duration, 0) || 44.0;

  const activeShot = shots.find((s) => s.id === activeShotId) || shots[0];

  // Callback khi người dùng bấm [✏] ở bất kỳ đâu để mở Story Assets và điều hướng đúng nhân vật
  const handleEditCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setIsAssetsModalOpen(true);
  };

  // Cập nhật phân cảnh khi có thay đổi khối thoại/tách câu/sửa chữ
  const handleShotUpdate = (
    shotId: string,
    updated: { blocks: DialogueBlock[]; text: string; duration: number }
  ) => {
    setShots((prev) =>
      prev.map((s) =>
        s.id === shotId
          ? {
              ...s,
              blocks: updated.blocks,
              text: updated.text,
              duration: updated.duration,
            }
          : s
      )
    );
  };

  // Khi chọn một phân cảnh (click ShotCard hoặc Scene trên Timeline):
  // Chuyển activeShotId VÀ chuyển con trỏ thời gian timeline về mốc bắt đầu của phân cảnh đó
  const handleSelectShot = (id: string) => {
    setActiveShotId(id);

    let startTime = 0;
    for (const s of shots) {
      if (s.id === id) break;
      startTime += s.duration;
    }
    setCurrentTime(Number(startTime.toFixed(1)));
  };

  // Khi click nút [🎨 Chỉnh ảnh Cảnh X] trên Canvas Preview
  const handleOpenVisualsDetail = (shotId: string) => {
    setActiveShotId(shotId);
    setVisualModalShotId(shotId);
    setIsVisualModalOpen(true);
  };

  // Cập nhật thuộc tính visual của phân cảnh
  const handleUpdateShotVisual = (
    shotId: string,
    visualData: Partial<ShotVisualData>
  ) => {
    setShots((prev) =>
      prev.map((s) =>
        s.id === shotId
          ? {
              ...s,
              visual: {
                prompt: s.visual?.prompt || "",
                status: s.visual?.status || "ready",
                linkedAssetIds: s.visual?.linkedAssetIds || [],
                unlinkedWarnings: s.visual?.unlinkedWarnings || [],
                ...s.visual,
                ...visualData,
              },
            }
          : s
      )
    );
  };

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

  // Cập nhật activeShot theo currentTime khi phát video hoặc tua timeline
  useEffect(() => {
    let acc = 0;
    for (let i = 0; i < shots.length; i++) {
      const shot = shots[i];
      const nextAcc = acc + shot.duration;
      const isLast = i === shots.length - 1;

      // Kim thời gian nằm trong khoảng [acc, nextAcc) hoặc tại mốc cuối của cảnh cuối cùng
      if (currentTime >= acc - 0.001 && (currentTime < nextAcc - 0.001 || isLast)) {
        setActiveShotId(shot.id);
        break;
      }
      acc = nextAcc;
    }
  }, [currentTime, shots]);

  // Hiệu ứng Gối đầu (Look-ahead Pre-generation) khi nghe thử toàn bộ:
  // Tự động sinh ngầm audio cho khối thoại kế tiếp khi kim chạy đến gần
  useEffect(() => {
    if (!isPlaying) return;

    let accumulatedTime = 0;
    for (const shot of shots) {
      if (!shot.blocks) continue;
      for (const block of shot.blocks) {
        const blockDur = block.totalDuration || 3;
        const blockStart = accumulatedTime;
        accumulatedTime += blockDur;

        // Nếu kim sắp chạm tới block này (trong khoảng 3.5s trước) mà block chưa sẵn sàng
        if (
          currentTime + 3.5 >= blockStart &&
          currentTime <= blockStart + blockDur &&
          (block.status === "stale" || block.status === "not_generated")
        ) {
          // Chuyển sang generating (nhấp nháy vàng cam)
          setShots((prev) =>
            prev.map((s) => ({
              ...s,
              blocks: s.blocks?.map((b) =>
                b.id === block.id ? { ...b, status: "generating" as const } : b
              ),
            }))
          );

          // Sau 1.2s chuyển thành ready (xanh ngọc sẵn sàng)
          const timer = setTimeout(() => {
            setShots((prev) =>
              prev.map((s) => ({
                ...s,
                blocks: s.blocks?.map((b) =>
                  b.id === block.id ? { ...b, status: "ready" as const } : b
                ),
              }))
            );
          }, 1200);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [isPlaying, currentTime, shots]);

  // Logic Sidebar bên trái
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
        onExport={(opts) =>
          alert(
            `Đang chuẩn bị xuất file video MP4 (${opts?.resolution.toUpperCase() || "1080P"} - ${opts?.fps || "30"} FPS)...`
          )
        }
      />

      {/* 2. Thân Studio: Cột kịch bản (luôn hiện bên trái) + Canvas Preview + Menu Sidebar bên phải */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* (1) CỘT KỊCH BẢN & CẤU HÌNH GIỌNG (Luôn luôn hiển thị) */}
        <div className="relative shrink-0 flex">
          <ScriptPanel
            width={leftWidth}
            shots={shots}
            characters={characters}
            activeShotId={activeShotId}
            selectedShotIds={selectedShotIds}
            onSelectShot={handleSelectShot}
            onToggleSelectShot={handleToggleSelectShot}
            onClearSelection={() => setSelectedShotIds([])}
            onTextChange={handleTextChange}
            onShotUpdate={handleShotUpdate}
            onToggleLock={handleToggleLock}
            onOpenResplitModal={() => setIsResplitModalOpen(true)}
            onRequestResplitScoped={handleRequestResplitScoped}
            proposal={proposal}
            onApplyProposal={handleApplyProposal}
            onCancelProposal={() => setProposal(null)}
            onMergeShots={handleMergeShots}
            onEditCharacter={handleEditCharacter}
            onSeekWord={(t) => setCurrentTime(t)}
            onAddNewCharacter={() => handleEditCharacter("new")}
            currentTime={currentTime}
            isPlaying={isPlaying}
          />
          {/* Handle kéo dãn thanh bên trái */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Kéo để thay đổi độ rộng cột kịch bản"
            tabIndex={0}
            onPointerDown={handleLeftResizeStart}
            title="Kéo để thay đổi độ rộng"
            className="group absolute -right-1.5 top-0 z-20 hidden h-full w-3 cursor-col-resize touch-none items-center justify-center lg:flex select-none"
          >
            <span className="h-full w-0.5 bg-transparent transition-colors group-hover:bg-brand/60 group-focus-visible:bg-brand" />
          </div>
        </div>

        {/* (2) KHUNG CANVAS PREVIEW (Tự co giãn flex-1 chiếm không gian trung tâm) */}
        <CanvasPreview
          timelineMode={timelineMode}
          onTimelineModeChange={setTimelineMode}
          activeShot={activeShot}
          shots={shots}
          characters={characters}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onSeek={(t) => setCurrentTime(t)}
          onRewind={(s) => setCurrentTime((t) => Math.max(0, t - s))}
          onSelectShot={handleSelectShot}
          onOpenVisualsDetail={handleOpenVisualsDetail}
          onOpenStoryAssets={() => setIsAssetsModalOpen(true)}
        />
      </div>

      {/* Modal chỉnh sửa hình ảnh phân cảnh (Overlayer dạng Modal/Dialog) */}
      <ShotVisualModal
        open={isVisualModalOpen}
        onOpenChange={setIsVisualModalOpen}
        shot={
          shots.find((s) => s.id === (visualModalShotId || activeShotId)) ||
          activeShot
        }
        onUpdateShotVisual={handleUpdateShotVisual}
        onOpenStoryAssetsForEdit={handleEditCharacter}
        onOpenStoryAssetsForCreate={() => {
          setIsVisualModalOpen(false);
          setIsAssetsModalOpen(true);
        }}
      />

      {/* Modal Tài sản truyện */}
      <StoryAssetsModal
        open={isAssetsModalOpen}
        onOpenChange={setIsAssetsModalOpen}
        selectedAssetId={selectedCharacterId}
        onSelectAssetId={setSelectedCharacterId}
      />

      {/* Modal Re-split all shots */}
      <ResplitAllModal
        open={isResplitModalOpen}
        onOpenChange={setIsResplitModalOpen}
        onApplyResplitAll={handleApplyResplitAll}
      />
    </div>
  );
}
