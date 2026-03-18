"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LeaderboardPreview from "@/components/leaderboard-preview";
import { Metrics } from "@/components/metrics";
import { Button } from "@/components/ui/button";
import { CodeInput } from "@/components/ui/code-input";
import { Toggle } from "@/components/ui/toggle";

export function HomeContent({
  leaderboardPreviewData,
}: {
  leaderboardPreviewData?: {
    worstCodes: any[];
    metrics: { totalCodes: number; avgScore: number };
  };
}) {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const maxLength = 2000;
  const isOverLimit = code.length > maxLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isOverLimit || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: "javascript",
          roastType: roastMode ? "sarcastic" : "constructive",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to submit code");
      }

      if (response.redirected) {
        router.push(response.url);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page">
      <div className="max-w-[1440px] mx-auto px-10 py-20">
        <div className="flex flex-col items-center gap-8">
          {/* Hero Title */}
          <div className="text-center">
            <h1 className="font-mono text-4xl font-bold text-text-primary flex items-center justify-center gap-3">
              <span className="text-accent-green">$</span>
              paste your code. get roasted.
            </h1>
            <p className="font-mono text-sm text-text-secondary mt-3">
              {/* drop your code below and we&apos;ll rate it — brutally honest or full roast mode */}
            </p>
          </div>

          {/* Code Editor */}
          <div className="w-full max-w-[780px]">
            <CodeInput
              value={code}
              onChange={setCode}
              onLanguageDetected={(lang) => console.log("Detected:", lang)}
              maxLength={maxLength}
            />
          </div>

          {/* Actions Bar */}
          <div className="w-full max-w-[780px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Toggle checked={roastMode} onCheckedChange={setRoastMode}>
                <span
                  className={
                    roastMode ? "text-accent-green" : "text-text-tertiary"
                  }
                >
                  roast mode
                </span>
              </Toggle>
              <span className="font-mono text-xs text-text-tertiary">
                {"// maximum sarcasm enabled"}
              </span>
            </div>

            <Button
              disabled={!code.trim() || isOverLimit || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "roasting..." : "$ roast_my_code"}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-[780px] p-4 bg-accent-red/10 border border-accent-red rounded">
              <span className="font-mono text-sm text-accent-red">{error}</span>
            </div>
          )}

          {/* Footer Stats */}
          <Metrics />

          {/* Spacer */}
          <div className="h-16" />

          {/* Leaderboard Preview */}
          <div className="w-full max-w-[960px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-lg font-bold text-text-primary">
                {/* the worst code on the internet, ranked by shame */}
              </h2>
              <a
                href="/leaderboard"
                className="px-3 py-1.5 font-mono text-xs text-text-secondary border border-border-primary rounded hover:bg-bg-input transition-colors"
              >
                view all &gt;&gt;
              </a>
            </div>

            {leaderboardPreviewData ? (
              <LeaderboardPreview
                worstCodes={leaderboardPreviewData.worstCodes}
                metrics={leaderboardPreviewData.metrics}
              />
            ) : (
              <LeaderboardPreview
                worstCodes={[]}
                metrics={{ totalCodes: 0, avgScore: 0 }}
              />
            )}
          </div>

          {/* Bottom Spacer */}
          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}
