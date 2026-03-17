import { db } from "../index";
import { scores } from "../schema";

export async function createScore(
  submissionId: string,
  totalScore: number,
  codeQuality: number,
  readability: number,
  bestPractices: number,
) {
  const result = await db
    .insert(scores)
    .values({
      submissionId,
      totalScore,
      codeQuality,
      readability,
      bestPractices,
    })
    .returning({ id: scores.id, createdAt: scores.createdAt });
  return result[0];
}

export async function getScoreBySubmissionId(submissionId: string) {
  const result = await db.execute(
    `SELECT id, submission_id as "submissionId", total_score as "totalScore", 
            code_quality as "codeQuality", readability, best_practices as "bestPractices",
            created_at as "createdAt"
     FROM scores 
     WHERE submission_id = '${submissionId}'`,
  );
  return (
    (
      result as unknown as {
        id: string;
        submissionId: string;
        totalScore: number;
        codeQuality: number;
        readability: number;
        bestPractices: number;
        createdAt: Date;
      }[]
    )[0] || null
  );
}

export async function getTopScores(limit = 10) {
  const result = await db.execute(
    `SELECT s.id, s.submission_id as "submissionId", s.total_score as "totalScore",
            s.code_quality as "codeQuality", s.readability, s.best_practices as "bestPractices",
            s.created_at as "createdAt",
            sub.code, sub.language
     FROM scores s
     JOIN submissions sub ON s.submission_id = sub.id
     ORDER BY s.total_score DESC
     LIMIT ${limit}`,
  );
  return result as unknown as {
    id: string;
    submissionId: string;
    totalScore: number;
    codeQuality: number;
    readability: number;
    bestPractices: number;
    createdAt: Date;
    code: string;
    language: string;
  }[];
}
