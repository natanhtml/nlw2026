import { getLeaderboardPreviewCache } from "@/lib/cache";
import { HomeContent } from "./home-content";

export default async function HomePage() {
  const leaderboardPreviewData = await getLeaderboardPreviewCache();

  return <HomeContent leaderboardPreviewData={leaderboardPreviewData} />;
}
