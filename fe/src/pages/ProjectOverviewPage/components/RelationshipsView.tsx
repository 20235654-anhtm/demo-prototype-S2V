import { Badge } from "@/components/ui/badge";
import { cn } from "cn";
import { ArrowRight } from "lucide-react";
import {
  mockStoryRelationships,
  type RelationshipTone,
} from "@/mocks/mockStoryDetails";

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

export default function RelationshipsView() {
  return (
    <div className="space-y-3">
      {mockStoryRelationships.map((relationship) => (
        <article
          key={relationship.id}
          className="rounded-xl border bg-card p-3.5 shadow-2xs transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 text-[11px] font-semibold">
              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold shrink-0">
                {getInitial(relationship.from)}
              </span>
              <span className="truncate">{relationship.from}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold shrink-0">
                {getInitial(relationship.to)}
              </span>
              <span className="truncate">{relationship.to}</span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] px-1.5 shrink-0",
                TONE_BADGE[relationship.tone]
              )}
            >
              {TONE_LABEL[relationship.tone]}
            </Badge>
          </div>

          <p className="mt-2 text-xs font-medium text-foreground">
            {relationship.label}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {relationship.description}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
              Độ gắn kết
            </span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-1.5 w-3.5 rounded-full",
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
  );
}
