import { Loader2 } from "lucide-react";

export default function CharactersSkeleton() {
  return (
    <div className="flex-1 min-h-0 flex flex-col justify-center items-center py-10 px-4">
      {/* Detecting indicator */}
      <div className="flex items-center gap-3 mb-8">
        <Loader2 className="w-5 h-5 text-brand animate-spin" />
        <span className="font-semibold text-sm text-foreground">
          Đang nhận diện nhân vật...
        </span>
      </div>

      {/* Shimmer Placeholder Rows */}
      <div className="w-full max-w-xl space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-3.5 border rounded-xl bg-card/60 flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
              <div className="w-10 h-10 rounded-full bg-muted/80 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted/80 rounded w-1/3" />
                <div className="h-3 bg-muted/60 rounded w-4/5" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-muted/70" />
              <div className="w-8 h-8 rounded-md bg-muted/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
