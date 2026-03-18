import type { Metadata } from "next";
import { Suspense } from "react";
import { getLeaderboardCache } from "@/lib/cache";
import { LeaderboardContent } from "./leaderboard-content";

export const metadata: Metadata = {
  title: "Shame Leaderboard - devroast",
  description: "The most roasted code on the internet",
};

function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-accent-green font-mono text-[32px] font-bold">
            &gt;
          </span>
          <div className="h-8 w-48 bg-text-tertiary/20 animate-pulse rounded" />
        </div>
        <div className="h-4 w-64 bg-text-tertiary/20 animate-pulse rounded" />
        <div className="h-4 w-32 bg-text-tertiary/20 animate-pulse rounded" />
      </div>
      <div className="flex flex-col gap-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-32 border border-border-primary rounded-md overflow-hidden"
          >
            <div className="h-12 px-5 flex items-center justify-between border-b border-border-primary bg-bg-surface">
              <div className="flex items-center gap-4">
                <div className="h-4 w-8 bg-text-tertiary/20 animate-pulse rounded" />
                <div className="h-4 w-12 bg-text-tertiary/20 animate-pulse rounded" />
              </div>
              <div className="h-4 w-16 bg-text-tertiary/20 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function LeaderboardPage() {
  const data = await getLeaderboardCache();

  return (
    <div className="max-w-[1440px] mx-auto px-10 py-10">
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardContent data={data} />
      </Suspense>
    </div>
  );
}
