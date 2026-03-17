import { avg, count } from "drizzle-orm";
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
});

export type AppRouter = typeof appRouter;
