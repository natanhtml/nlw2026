import { db } from "../index";
import { type LeaderboardPeriod, leaderboard } from "../schema";

export async function updateLeaderboard(
  submissionId: string,
  rankPosition: number,
  period: LeaderboardPeriod,
) {
  const result = await db
    .insert(leaderboard)
    .values({ submissionId, rankPosition, period })
    .onConflictDoUpdate({
      target: [leaderboard.submissionId, leaderboard.period],
      set: { rankPosition, updatedAt: new Date() },
    })
    .returning({ id: leaderboard.id, updatedAt: leaderboard.updatedAt });
  return result[0];
}

export async function getLeaderboardByPeriod(period: LeaderboardPeriod) {
  const result = await db.execute(
    `SELECT l.id, l.submission_id as "submissionId", l.rank_position as "rankPosition",
            l.period, l.updated_at as "updatedAt",
            s.code, s.language, sc.total_score as "totalScore"
     FROM leaderboard l
     JOIN submissions s ON l.submission_id = s.id
     JOIN scores sc ON s.id = sc.submission_id
     WHERE l.period = '${period}'
     ORDER BY l.rank_position ASC`,
  );
  return result as unknown as {
    id: string;
    submissionId: string;
    rankPosition: number;
    period: LeaderboardPeriod;
    updatedAt: Date;
    code: string;
    language: string;
    totalScore: number;
  }[];
}

export async function getSubmissionRank(
  submissionId: string,
  period: LeaderboardPeriod,
) {
  const result = await db.execute(
    `SELECT rank_position as "rankPosition" FROM leaderboard WHERE submission_id = '${submissionId}' AND period = '${period}'`,
  );
  return (result as unknown as { rankPosition: number }[])[0] || null;
}
