import { eq } from "drizzle-orm";
import { db } from "@/db";
import { roasts, submissions } from "@/db/schema";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  const result = await db
    .select({
      content: roasts.content,
      ogImagePath: roasts.ogImagePath,
      language: submissions.language,
    })
    .from(roasts)
    .innerJoin(submissions, eq(roasts.submissionId, submissions.id))
    .where(eq(submissions.id, id))
    .limit(1);

  const row = result[0];

  if (!row) {
    return { title: "Roast Not Found | devroast" };
  }

  const imageUrl = row.ogImagePath
    ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${row.ogImagePath}`
    : undefined;

  return {
    title: "Check out my roast | devroast",
    description: row.content.substring(0, 160),
    openGraph: imageUrl
      ? {
          images: [{ url: imageUrl }],
        }
      : undefined,
    twitter: imageUrl
      ? {
          card: "summary_large_image",
          images: [imageUrl],
        }
      : undefined,
  };
}

export default async function RoastSharePage({ params }: Props) {
  const { id } = await params;

  const result = await db
    .select({
      id: roasts.id,
      content: roasts.content,
      roastType: roasts.roastType,
      ogImagePath: roasts.ogImagePath,
      language: submissions.language,
      code: submissions.code,
    })
    .from(roasts)
    .innerJoin(submissions, eq(roasts.submissionId, submissions.id))
    .where(eq(submissions.id, id))
    .limit(1);

  const row = result[0];

  if (!row) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Roast not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Share your roast
        </h1>

        {row.ogImagePath && (
          <div className="mb-6">
            <img
              src={row.ogImagePath}
              alt="Roast OG Image"
              className="w-full rounded-lg"
            />
          </div>
        )}

        <div className="bg-bg-surface rounded-lg p-4 mb-4">
          <p className="text-text-primary">{row.content}</p>
        </div>

        <p className="text-text-tertiary text-sm">Language: {row.language}</p>
      </div>
    </div>
  );
}
