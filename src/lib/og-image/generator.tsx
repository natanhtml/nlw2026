import { ImageResponse } from "@takumi-rs/image-response";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";

export interface OgImageData {
  roastId: string;
  score: string | number;
  verdict: string;
  language: string;
  lines: string | number;
  quote: string;
}

interface OgImageComponentProps {
  score: string | number;
  verdict: string;
  language: string;
  lines: string | number;
  quote: string;
}

const ROASTS_DIR = path.join(process.cwd(), "public", "roasts");

function OgImageComponent({
  score,
  verdict,
  language,
  lines,
  quote,
}: OgImageComponentProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        backgroundColor: "#0A0A0A",
        padding: 64,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 20,
        }}
      >
        <span style={{ color: "#10B981", fontWeight: 700 }}>&gt;</span>
        <span style={{ color: "#FAFAFA" }}>devroast</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: "#F59E0B",
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span style={{ fontSize: 56, color: "#737373", lineHeight: 1 }}>
          /10
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#EF4444",
          }}
        />
        <span style={{ fontSize: 20, color: "#EF4444" }}>{verdict}</span>
      </div>

      <span style={{ fontSize: 16, color: "#737373" }}>
        lang: {language} · {lines} lines
      </span>

      <span style={{ fontSize: 22, color: "#FAFAFA", textAlign: "center" }}>
        "{quote}"
      </span>
    </div>
  );
}

export async function generateOgImage(
  data: OgImageData,
): Promise<string | null> {
  try {
    if (!existsSync(ROASTS_DIR)) {
      mkdirSync(ROASTS_DIR, { recursive: true });
    }

    const { roastId, score, verdict, language, lines, quote } = data;

    const truncatedQuote =
      quote.length > 200 ? quote.substring(0, 197) + "..." : quote;

    const outputPath = path.join(ROASTS_DIR, `${roastId}.png`);

    const imageResponse = new ImageResponse(
      <OgImageComponent
        score={score}
        verdict={verdict}
        language={language}
        lines={lines}
        quote={truncatedQuote}
      />,
      {
        width: 1200,
        height: 630,
      },
    );

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    writeFileSync(outputPath, buffer);

    console.log(`[OG Image] Generated: ${outputPath}`);

    return `/roasts/${roastId}.png`;
  } catch (error) {
    console.error("[OG Image] Failed to generate:", error);
    return null;
  }
}

export function calculateVerdict(score: number): string {
  if (score >= 8) return "excellent";
  if (score >= 6) return "decent";
  if (score >= 4) return "needs_work";
  return "needs_serious_help";
}
