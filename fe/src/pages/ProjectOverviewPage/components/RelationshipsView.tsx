import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";
import { ArrowRight, Network } from "lucide-react";
import {
  mockStoryRelationships,
  type RelationshipTone,
} from "@/mocks/mockStoryDetails";
import PanelHeader from "./PanelHeader";

const NODE_POSITION: Record<string, { x: number; y: number }> = {
  "Tiêu Viêm": { x: 50, y: 48 },
  "Tiêu Huân Nhi": { x: 18, y: 19 },
  "Tiêu Mị": { x: 82, y: 19 },
  "Trắc nghiệm viên": { x: 16, y: 79 },
  "Gia tộc Tiêu gia": { x: 84, y: 79 },
};

const NODE_AVATAR: Record<string, string> = {
  "Tiêu Viêm": "from-amber-400 via-orange-500 to-rose-500",
  "Tiêu Huân Nhi": "from-emerald-400 to-teal-600",
  "Tiêu Mị": "from-sky-400 to-blue-600",
  "Trắc nghiệm viên": "from-slate-400 to-slate-600",
  "Gia tộc Tiêu gia": "from-rose-400 to-red-600",
};

const TONE_LABEL: Record<RelationshipTone, string> = {
  positive: "Tích cực",
  neutral: "Trung lập",
  conflict: "Xung đột",
};

const TONE_BADGE: Record<RelationshipTone, string> = {
  positive:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  neutral:
    "border-slate-400/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
  conflict:
    "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

const TONE_STROKE: Record<RelationshipTone, string> = {
  positive: "stroke-emerald-400/80",
  neutral: "stroke-slate-300 dark:stroke-slate-600",
  conflict: "stroke-rose-400/80",
};

const TONE_BAR: Record<RelationshipTone, string> = {
  positive: "bg-emerald-500",
  neutral: "bg-slate-400",
  conflict: "bg-rose-500",
};

const getInitial = (name: string) => {
  const words = name.trim().split(/\s+/);
  const mainWord = words[words.length - 1] || name;
  return mainWord.charAt(0).toUpperCase() || "?";
};

const nodes = Object.entries(NODE_POSITION);

export default function RelationshipsView() {
  const connections = useMemo(
    () =>
      mockStoryRelationships.flatMap((relationship) => {
        const from = NODE_POSITION[relationship.from];
        const to = NODE_POSITION[relationship.to];
        if (!from || !to) return [];
        return [{ ...relationship, fromPosition: from, toPosition: to }];
      }),
    []
  );

  return (
    <div className="space-y-5">
      <PanelHeader
        icon={Network}
        title="Quan hệ nhân vật"
        description="Sơ đồ liên kết giữa các nhân vật trong chương, kèm sắc thái và mức độ gắn kết."
        accent="sky"
      />

      {/* Sơ đồ quan hệ */}
      <div className="rounded-xl border bg-card shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-2.5">
          <p className="text-xs font-semibold text-foreground">
            Sơ đồ quan hệ
          </p>
          <p className="text-[11px] text-muted-foreground">
            {nodes.length} nhân vật · {connections.length} liên kết
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="relative h-[400px] min-w-[620px] bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.10),transparent_62%)]">

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {connections.map((connection) => (
                <line
                  key={connection.id}
                  x1={connection.fromPosition.x}
                  y1={connection.fromPosition.y}
                  x2={connection.toPosition.x}
                  y2={connection.toPosition.y}
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray={
                    connection.tone === "neutral" ? "4 4" : undefined
                  }
                  className={TONE_STROKE[connection.tone]}
                />
              ))}
            </svg>

            {nodes.map(([name, position]) => {
              const isCenter = name === "Tiêu Viêm";

              return (
                <div
                  key={name}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                >
                  <div
                    className={cn(
                      "rounded-full bg-gradient-to-br text-white flex items-center justify-center shadow-lg ring-4 ring-background",
                      NODE_AVATAR[name],
                      isCenter ? "w-16 h-16" : "w-12 h-12"
                    )}
                  >
                    <span
                      className={cn(
                        "font-bold",
                        isCenter ? "text-xl" : "text-base"
                      )}
                    >
                      {getInitial(name)}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "whitespace-nowrap rounded-full border bg-card/95 px-2 py-0.5 text-[11px] font-medium shadow-sm",
                      isCenter
                        ? "border-amber-500/50 text-amber-700 dark:text-amber-300"
                        : "text-foreground"
                    )}
                  >
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">Chú thích:</span>
          {(["positive", "neutral", "conflict"] as RelationshipTone[]).map(
            (tone) => (
              <span key={tone} className="inline-flex items-center gap-1.5">
                <span
                  className={cn("h-0.5 w-4 rounded-full", TONE_BAR[tone])}
                />
                {TONE_LABEL[tone]}
              </span>
            )
          )}
        </div>
      </div>

      {/* Danh sách quan hệ */}
      <div className="grid gap-3 md:grid-cols-2">
        {mockStoryRelationships.map((relationship) => (
          <article
            key={relationship.id}
            className="rounded-xl border bg-card p-4 shadow-2xs transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0 text-xs font-semibold">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0">
                  {getInitial(relationship.from)}
                </span>
                <span className="truncate">{relationship.from}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0">
                  {getInitial(relationship.to)}
                </span>
                <span className="truncate">{relationship.to}</span>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] shrink-0",
                  TONE_BADGE[relationship.tone]
                )}
              >
                {TONE_LABEL[relationship.tone]}
              </Badge>
            </div>

            <p className="mt-2.5 text-sm font-medium text-foreground">
              {relationship.label}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {relationship.description}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Độ gắn kết
              </span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-1.5 w-4 rounded-full",
                      index < relationship.strength
                        ? TONE_BAR[relationship.tone]
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
