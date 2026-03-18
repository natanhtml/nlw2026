import { Suspense } from "react";
import { LeaderboardPreviewContent } from "./leaderboard-preview-content";

function LeaderboardSkeleton() {
  return (
    <div className="rounded-lg border border-border-primary overflow-hidden">
      <div className="h-10 px-5 flex items-center bg-bg-surface border-b border-border-primary">
        <span className="w-12 font-mono text-xs text-text-tertiary font-medium">
          #
        </span>
        <span className="w-16 font-mono text-xs text-text-tertiary font-medium">
          score
        </span>
        <span className="flex-1 font-mono text-xs text-text-tertiary font-medium">
          code
        </span>
        <span className="w-24 font-mono text-xs text-text-tertiary font-medium">
          lang
        </span>
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="px-5 py-4 flex items-center border-b border-border-primary last:border-b-0"
        >
          <span className="w-12 font-mono text-xs font-medium">
            <span className="animate-pulse bg-text-tertiary/20 h-4 w-4 block rounded" />
          </span>
          <span className="w-16 font-mono text-xs font-bold">
            <span className="animate-pulse bg-text-tertiary/20 h-4 w-8 block rounded" />
          </span>
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="animate-pulse bg-text-tertiary/20 h-4 w-3/4 block rounded" />
            <span className="animate-pulse bg-text-tertiary/20 h-4 w-1/2 block rounded" />
          </div>
          <span className="w-24 font-mono text-xs text-text-secondary">
            <span className="animate-pulse bg-text-tertiary/20 h-4 w-12 block rounded" />
          </span>
        </div>
      ))}
      <div className="px-5 py-3 text-center">
        <span className="font-mono text-xs text-text-tertiary">
          <span className="animate-pulse bg-text-tertiary/20 h-4 w-48 inline-block rounded" />
        </span>
      </div>
    </div>
  );
}

export default function LeaderboardPreview({
  worstCodes,
  metrics,
}: {
  worstCodes: any[];
  metrics: { totalCodes: number; avgScore: number };
}) {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardPreviewContent worstCodes={worstCodes} metrics={metrics} />
    </Suspense>
  );
}
