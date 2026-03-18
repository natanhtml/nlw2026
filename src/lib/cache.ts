import { unstable_cache } from "next/cache";
import { caller } from "@/trpc/server";

export const getLeaderboardCache = unstable_cache(
  async () => {
    return caller.getLeaderboard();
  },
  ["leaderboard"],
  {
    revalidate: 3600, // 1 hour
    tags: ["leaderboard"],
  },
);

export const getLeaderboardPreviewCache = unstable_cache(
  async () => {
    const [worstCodes, metrics] = await Promise.all([
      caller.getTopWorstCodesWithHighlight(),
      caller.getMetrics(),
    ]);
    return { worstCodes, metrics };
  },
  ["leaderboard-preview"],
  {
    revalidate: 3600, // 1 hour
    tags: ["leaderboard-preview"],
  },
);
