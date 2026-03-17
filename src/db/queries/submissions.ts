import { db } from "../index";
import { type ProgrammingLanguage, submissions } from "../schema";

export async function createSubmission(
  code: string,
  language: ProgrammingLanguage,
) {
  const result = await db
    .insert(submissions)
    .values({ code, language })
    .returning({ id: submissions.id, createdAt: submissions.createdAt });
  return result[0];
}

export async function getSubmissionById(id: string) {
  const result = await db.execute(
    `SELECT id, code, language, created_at as "createdAt" FROM submissions WHERE id = '${id}'`,
  );
  return (
    (
      result as unknown as {
        id: string;
        code: string;
        language: string;
        createdAt: Date;
      }[]
    )[0] || null
  );
}

export async function getRecentSubmissions(limit = 10, offset = 0) {
  const result = await db.execute(
    `SELECT id, code, language, created_at as "createdAt" FROM submissions ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
  );
  return result as unknown as {
    id: string;
    code: string;
    language: string;
    createdAt: Date;
  }[];
}
