import { Badge } from "@/components/ui/badge";
import { cn } from "cn";
import {
  CheckCircle2,
  Clock3,
  Flag,
  Flame,
  MapPin,
  RotateCcw,
  TrendingUp,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  mockStoryTimeline,
  type TimelineKind,
} from "@/mocks/mockStoryDetails";

interface KindStyle {
  icon: LucideIcon;
  dot: string;
  badge: string;
}

const KIND_STYLE: Record<TimelineKind, KindStyle> = {
  opening: {
    icon: Flag,
    dot: "from-brand to-orange-500",
    badge:
      "border-brand/30 bg-brand/10 text-brand-strong dark:text-brand",
  },
  conflict: {
    icon: Zap,
    dot: "from-rose-400 to-red-600",
    badge:
      "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  development: {
    icon: TrendingUp,
    dot: "from-sky-400 to-blue-600",
    badge:
      "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  flashback: {
    icon: RotateCcw,
    dot: "from-violet-400 to-purple-600",
    badge:
      "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  climax: {
    icon: Flame,
    dot: "from-orange-500 to-red-600",
    badge:
      "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  },
  resolution: {
    icon: CheckCircle2,
    dot: "from-emerald-400 to-teal-600",
    badge:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
};

const locations = new Set(mockStoryTimeline.map((event) => event.location));

export default function TimelineView() {
  return (
    <div className="space-y-4">
      {/* Thống kê chương */}
      <div className="rounded-xl border bg-card px-4 py-3 shadow-2xs flex flex-wrap items-center gap-x-6 gap-y-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Chương
          </p>
          <p className="text-sm font-semibold">Chương 1 · Lễ trắc nghiệm đấu khí</p>
        </div>
        <div className="h-8 w-px bg-border hidden sm:block" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock3 className="w-3.5 h-3.5" />
          <span>
            <span className="font-semibold text-foreground">
              {mockStoryTimeline.length}
            </span>{" "}
            sự kiện
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span>
            <span className="font-semibold text-foreground">
              {locations.size}
            </span>{" "}
            địa điểm
          </span>
        </div>
      </div>

      {/* Timeline dọc */}
      <div className="relative">
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-brand/60 via-border to-emerald-300 dark:from-brand/50 dark:to-emerald-500/50" />

        <div className="space-y-4">
          {mockStoryTimeline.map((event) => {
            const style = KIND_STYLE[event.kind];
            const Icon = style.icon;

            return (
              <div key={event.id} className="relative pl-14">
                <div
                  className={cn(
                    "absolute left-0 top-0 z-10 w-10 h-10 rounded-full bg-gradient-to-br text-white flex items-center justify-center shadow-md ring-4 ring-background",
                    style.dot
                  )}
                  title={`Sự kiện ${event.order}`}
                >
                  <span className="text-xs font-bold">{event.order}</span>
                </div>

                <div className="rounded-xl border bg-card p-3.5 shadow-2xs transition-shadow hover:shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] gap-1", style.badge)}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      {event.label}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-foreground">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {event.characters.map((character) => (
                      <span
                        key={character}
                        className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        <UserRound className="w-2.5 h-2.5" />
                        {character}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
