import { db } from "../index";
import { type RoastType, roasts } from "../schema";

export async function createRoast(
  submissionId: string,
  content: string,
  roastType: RoastType,
) {
  const result = await db
    .insert(roasts)
    .values({ submissionId, content, roastType })
    .returning({ id: roasts.id, createdAt: roasts.createdAt });
  return result[0];
}

export async function getRoastsBySubmissionId(submissionId: string) {
  const result = await db.execute(
    `SELECT r.id, r.content, r.roast_type as "roastType", r.created_at as "createdAt", 
            s.code, s.language, s.created_at as "submissionCreatedAt"
     FROM roasts r
     JOIN submissions s ON r.submission_id = s.id
     WHERE r.submission_id = '${submissionId}'
     ORDER BY r.created_at DESC`,
  );
  return result as unknown as {
    id: string;
    content: string;
    roastType: RoastType;
    createdAt: Date;
    code: string;
    language: string;
    submissionCreatedAt: Date;
  }[];
}

export async function getRecentRoasts(limit = 10, offset = 0) {
  const result = await db.execute(
    `SELECT r.id, r.content, r.roast_type as "roastType", r.created_at as "createdAt",
            s.code, s.language, s.id as "submissionId", s.created_at as "submissionCreatedAt"
     FROM roasts r
     JOIN submissions s ON r.submission_id = s.id
     ORDER BY r.created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
  );
  return result as unknown as {
    id: string;
    content: string;
    roastType: RoastType;
    createdAt: Date;
    code: string;
    language: string;
    submissionId: string;
    submissionCreatedAt: Date;
  }[];
}
