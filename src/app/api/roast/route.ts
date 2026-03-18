import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import type { RoastType } from "@/db/schema";
import { roasts, scores, submissions } from "@/db/schema";
import { aiService } from "@/lib/ai-service";
import { calculateVerdict, generateOgImage } from "@/lib/og-image/generator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, language, roastType } = body as {
      code: string;
      language: string;
      roastType: RoastType;
    };

    if (!code || !language || !roastType) {
      return NextResponse.json(
        { error: "Missing required fields: code, language, roastType" },
        { status: 400 },
      );
    }

    const [submission] = await db
      .insert(submissions)
      .values({ code, language })
      .returning();

    const aiResponse = await aiService.generateRoast(code, language, roastType);

    const [roastRecord] = await db
      .insert(roasts)
      .values({
        submissionId: submission.id,
        content: aiResponse.roast,
        roastType,
      })
      .returning();

    await db.insert(scores).values({
      submissionId: submission.id,
      totalScore: aiResponse.score,
      codeQuality: aiResponse.codeQuality,
      readability: aiResponse.readability,
      bestPractices: aiResponse.bestPractices,
    });

    // Generate OG image
    const verdict = calculateVerdict(aiResponse.score);
    const codeLines = code.split("\n").length;

    const ogImagePath = await generateOgImage({
      roastId: roastRecord.id,
      score: aiResponse.score,
      verdict,
      language,
      lines: codeLines.toString(),
      quote: aiResponse.roast,
    });

    // Update roast with OG image path if generated
    if (ogImagePath) {
      await db
        .update(roasts)
        .set({ ogImagePath })
        .where(eq(roasts.id, roastRecord.id));
    }

    return NextResponse.redirect(
      new URL(`/results/${submission.id}`, request.url),
    );
  } catch (error) {
    console.error("Error processing roast:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 },
    );
  }
}
