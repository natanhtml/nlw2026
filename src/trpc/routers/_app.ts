import { asc, avg, count, eq } from "drizzle-orm";
import { codeToHtml } from "shiki";
import { db } from "@/db";
import { scores, submissions } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  getMetrics: baseProcedure.query(async () => {
    const [totalCountResult] = await db
      .select({ count: count() })
      .from(submissions);

    const [avgScoreResult] = await db
      .select({ avg: avg(scores.totalScore) })
      .from(scores);

    const totalCodes = totalCountResult?.count ?? 0;
    const avgScore = avgScoreResult?.avg ? Number(avgScoreResult.avg) : 0;

    return {
      totalCodes,
      avgScore: Math.round((avgScore + Number.EPSILON) * 10) / 10,
    };
  }),

  getTopWorstCodes: baseProcedure.query(async () => {
    const result = await db
      .select({
        id: submissions.id,
        code: submissions.code,
        language: submissions.language,
        totalScore: scores.totalScore,
      })
      .from(scores)
      .innerJoin(submissions, eq(submissions.id, scores.submissionId))
      .orderBy(asc(scores.totalScore))
      .limit(3);

    return result.map((item) => ({
      id: item.id,
      code: item.code,
      language: item.language,
      totalScore: item.totalScore,
    }));
  }),

  getTopWorstCodesWithHighlight: baseProcedure.query(async () => {
    const result = await db
      .select({
        id: submissions.id,
        code: submissions.code,
        language: submissions.language,
        totalScore: scores.totalScore,
      })
      .from(scores)
      .innerJoin(submissions, eq(submissions.id, scores.submissionId))
      .orderBy(asc(scores.totalScore))
      .limit(3);

    const withHighlight = await Promise.all(
      result.map(async (item) => {
        const html = await codeToHtml(item.code, {
          lang: item.language,
          theme: "vesper",
          transformers: [
            {
              line(node) {
                this.addClassToHast(node, "code-line");
              },
            },
          ],
        });
        return {
          id: item.id,
          code: item.code,
          codeHtml: html,
          language: item.language,
          totalScore: item.totalScore,
        };
      }),
    );

    return withHighlight;
  }),

  getLeaderboard: baseProcedure.query(async () => {
    const [totalCountResult] = await db
      .select({ count: count() })
      .from(submissions);

    const [avgScoreResult] = await db
      .select({ avg: avg(scores.totalScore) })
      .from(scores);

    const totalCodes = totalCountResult?.count ?? 0;
    const avgScore = avgScoreResult?.avg ? Number(avgScoreResult.avg) : 0;

    const leaderboardData = await db
      .select({
        id: submissions.id,
        code: submissions.code,
        language: submissions.language,
        totalScore: scores.totalScore,
      })
      .from(scores)
      .innerJoin(submissions, eq(submissions.id, scores.submissionId))
      .orderBy(asc(scores.totalScore))
      .limit(20);

    const entries = await Promise.all(
      leaderboardData.map(async (entry, index) => {
        const codeLines = entry.code.split("\n").filter((line) => line !== "");
        const codeHtml = await codeToHtml(entry.code, {
          lang: entry.language,
          theme: "vesper",
          transformers: [
            {
              line(node) {
                this.addClassToHast(node, "code-line");
              },
            },
          ],
        });

        return {
          rank: index + 1,
          id: entry.id,
          code: entry.code,
          codeHtml,
          language: entry.language,
          totalScore: entry.totalScore,
          lines: codeLines.length,
        };
      }),
    );

    return {
      entries,
      totalCodes,
      avgScore: Math.round((avgScore + Number.EPSILON) * 10) / 10,
    };
  }),
});

export type AppRouter = typeof appRouter;
