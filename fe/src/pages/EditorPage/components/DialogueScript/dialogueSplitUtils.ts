import type { DialogueBlock, Shot } from "@/types/script";
import { generateWordTimestamps } from "@/mocks/mockShots";

/**
 * Tính lại tổng thời lượng và ghép toàn bộ văn bản của các khối thoại trong phân cảnh
 */
export function calculateShotTextAndDuration(blocks: DialogueBlock[]): {
  text: string;
  duration: number;
} {
  const allTexts: string[] = [];
  let totalDuration = 0;

  for (const block of blocks) {
    for (const line of block.lines) {
      if (line.text.trim()) {
        allTexts.push(line.text.trim());
      }
      totalDuration += line.duration || 3;
    }
  }

  return {
    text: allTexts.join(" "),
    duration: Math.max(3, Number(totalDuration.toFixed(1))),
  };
}

/**
 * Hợp nhất các khối liên tiếp có cùng nhân vật để giao diện luôn gọn gàng
 */
export function mergeConsecutiveBlocks(blocks: DialogueBlock[]): DialogueBlock[] {
  if (blocks.length <= 1) return blocks;

  const result: DialogueBlock[] = [];

  for (const current of blocks) {
    if (result.length === 0) {
      result.push({ ...current, lines: [...current.lines] });
      continue;
    }

    const prev = result[result.length - 1];
    if (prev.characterId === current.characterId) {
      // Gộp vào khối liền trước
      prev.lines = [...prev.lines, ...current.lines];
      prev.totalDuration = (prev.totalDuration || 0) + (current.totalDuration || 0);
      prev.status = "stale";
    } else {
      result.push({ ...current, lines: [...current.lines] });
    }
  }

  return result;
}

/**
 * Đổi nhân vật đọc của toàn bộ một khối thoại
 */
export function updateBlockCharacter(
  blocks: DialogueBlock[],
  blockId: string,
  newCharacterId: string
): DialogueBlock[] {
  const updated = blocks.map((b) => {
    if (b.id === blockId) {
      return {
        ...b,
        characterId: newCharacterId,
        status: "stale" as const,
      };
    }
    return b;
  });

  return mergeConsecutiveBlocks(updated);
}

/**
 * Thuật toán Tách Khối Tự Động (Auto-split Algorithm) khi đổi nhân vật của một câu thoại riêng lẻ
 */
export function splitBlockWithLine(
  blocks: DialogueBlock[],
  blockId: string,
  lineId: string,
  newCharacterId: string,
  shotId: string
): DialogueBlock[] {
  const targetBlockIndex = blocks.findIndex((b) => b.id === blockId);
  if (targetBlockIndex === -1) return blocks;

  const targetBlock = blocks[targetBlockIndex];
  if (targetBlock.characterId === newCharacterId) return blocks;

  const lineIndex = targetBlock.lines.findIndex((l) => l.id === lineId);
  if (lineIndex === -1) return blocks;

  const targetLine = targetBlock.lines[lineIndex];

  // Trường hợp 0: Khối chỉ có đúng 1 câu duy nhất -> Đổi luôn nhân vật khối
  if (targetBlock.lines.length === 1) {
    const nextBlocks = [...blocks];
    nextBlocks[targetBlockIndex] = {
      ...targetBlock,
      characterId: newCharacterId,
      status: "stale",
    };
    return mergeConsecutiveBlocks(nextBlocks);
  }

  const newBlocks: DialogueBlock[] = [];

  // Tạo khối mới chứa đúng câu được đổi
  const splitBlock: DialogueBlock = {
    id: `block-${Date.now()}-split`,
    shotId,
    characterId: newCharacterId,
    status: "stale",
    totalDuration: targetLine.duration || 3,
    lines: [targetLine],
  };

  // Trường hợp 1: Đổi câu đầu tiên của khối
  if (lineIndex === 0) {
    const remainingBlock: DialogueBlock = {
      ...targetBlock,
      lines: targetBlock.lines.slice(1),
      totalDuration: targetBlock.lines.slice(1).reduce((s, l) => s + (l.duration || 3), 0),
      status: "stale",
    };

    newBlocks.push(splitBlock, remainingBlock);
  }
  // Trường hợp 2: Đổi câu cuối cùng của khối
  else if (lineIndex === targetBlock.lines.length - 1) {
    const remainingBlock: DialogueBlock = {
      ...targetBlock,
      lines: targetBlock.lines.slice(0, lineIndex),
      totalDuration: targetBlock.lines.slice(0, lineIndex).reduce((s, l) => s + (l.duration || 3), 0),
      status: "stale",
    };

    newBlocks.push(remainingBlock, splitBlock);
  }
  // Trường hợp 3: Đổi câu nằm ở giữa khối -> Tách thành 3 khối liên tiếp
  else {
    const firstPartBlock: DialogueBlock = {
      id: `${targetBlock.id}-part1`,
      shotId,
      characterId: targetBlock.characterId,
      status: "stale",
      lines: targetBlock.lines.slice(0, lineIndex),
      totalDuration: targetBlock.lines.slice(0, lineIndex).reduce((s, l) => s + (l.duration || 3), 0),
    };

    const lastPartBlock: DialogueBlock = {
      id: `${targetBlock.id}-part2`,
      shotId,
      characterId: targetBlock.characterId,
      status: "stale",
      lines: targetBlock.lines.slice(lineIndex + 1),
      totalDuration: targetBlock.lines.slice(lineIndex + 1).reduce((s, l) => s + (l.duration || 3), 0),
    };

    newBlocks.push(firstPartBlock, splitBlock, lastPartBlock);
  }

  // Thay thế targetBlock cũ bằng danh sách các khối mới tạo ra
  const combined = [
    ...blocks.slice(0, targetBlockIndex),
    ...newBlocks,
    ...blocks.slice(targetBlockIndex + 1),
  ];

  // Gộp các khối liền kề có cùng nhân vật nếu có
  return mergeConsecutiveBlocks(combined);
}

/**
 * Cập nhật nội dung văn bản của một câu thoại và tạo lại word timestamps
 */
export function updateLineTextInBlocks(
  blocks: DialogueBlock[],
  lineId: string,
  newText: string
): DialogueBlock[] {
  return blocks.map((b) => {
    let hasMatch = false;
    const lines = b.lines.map((l) => {
      if (l.id === lineId) {
        hasMatch = true;
        const dur = Math.max(1.5, Number((newText.trim().split(/\s+/).length * 0.35).toFixed(1)));
        return {
          ...l,
          text: newText,
          duration: dur,
          words: generateWordTimestamps(newText, 0, dur),
        };
      }
      return l;
    });

    if (hasMatch) {
      return {
        ...b,
        lines,
        status: "stale" as const,
        totalDuration: lines.reduce((sum, l) => sum + (l.duration || 3), 0),
      };
    }
    return b;
  });
}

export interface AudioTimelineClip {
  id: string;
  shotId: string;
  characterId: string;
  startTime: number;
  duration: number;
  status: "ready" | "generating" | "not_generated" | "stale";
  text: string;
}

/**
 * Tính toán danh sách clips âm thanh trên toàn bộ kịch bản
 */
export function computeAudioClips(shots: Shot[]): AudioTimelineClip[] {
  const clips: AudioTimelineClip[] = [];
  let currentOffset = 0;

  shots.forEach((shot) => {
    const blocks =
      shot.blocks && shot.blocks.length > 0
        ? shot.blocks
        : [
            {
              id: `block-${shot.id}`,
              shotId: shot.id,
              characterId: "char-narrator",
              status: "ready" as const,
              totalDuration: shot.duration,
              lines: [
                {
                  id: `line-${shot.id}`,
                  text: shot.text,
                  duration: shot.duration,
                },
              ],
            },
          ];

    blocks.forEach((block) => {
      const blockDur =
        block.totalDuration ||
        block.lines.reduce((s, l) => s + (l.duration || 3), 0);
      const firstLineText = block.lines[0]?.text || shot.text;

      clips.push({
        id: block.id,
        shotId: shot.id,
        characterId: block.characterId,
        startTime: Number(currentOffset.toFixed(2)),
        duration: Number(blockDur.toFixed(2)),
        status: block.status || "ready",
        text: firstLineText,
      });

      currentOffset += blockDur;
    });
  });

  return clips;
}

