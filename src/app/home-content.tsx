"use client";

import Link from "next/link";
import { useState } from "react";
import { Metrics } from "@/components/metrics";
import { Button } from "@/components/ui/button";
import { CodeInput } from "@/components/ui/code-input";
import { Toggle } from "@/components/ui/toggle";

const leaderboardData = [
  {
    rank: 1,
    score: 1.2,
    code: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ],
    lang: "javascript",
  },
  {
    rank: 2,
    score: 1.8,
    code: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
    lang: "typescript",
  },
  {
    rank: 3,
    score: 2.1,
    code: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
    lang: "sql",
  },
];

export function HomeContent() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);
  const maxLength = 2000;
  const isOverLimit = code.length > maxLength;

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

            <Button disabled={!code.trim() || isOverLimit}>
              $ roast_my_code
            </Button>
          </div>

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
              <Link
                href="/leaderboard"
                className="px-3 py-1.5 font-mono text-xs text-text-secondary border border-border-primary rounded hover:bg-bg-input transition-colors"
              >
                view all &gt;&gt;
              </Link>
            </div>

            <div className="rounded-lg border border-border-primary overflow-hidden">
              {/* Table Header */}
              <div className="h-10 px-5 flex items-center bg-bg-surface border-b border-border-primary">
                <span className="w-12 font-mono text-xs text-text-tertiary font-medium">
                  #
                </span>
                <span className="w-16 font-mono text-xs text-text-tertiary font-medium">
                  score
                </span>
                <span className="flex-1 font-mono text-xs text-text-tertiary font-medium">
                  code
                </span>
                <span className="w-24 font-mono text-xs text-text-tertiary font-medium">
                  lang
                </span>
              </div>

              {/* Table Rows */}
              {leaderboardData.map((item) => (
                <div
                  key={`rank-${item.rank}`}
                  className="px-5 py-4 flex items-center border-b border-border-primary last:border-b-0"
                >
                  <span
                    className={`w-12 font-mono text-xs font-medium ${
                      item.rank === 1
                        ? "text-accent-amber"
                        : "text-text-secondary"
                    }`}
                  >
                    {item.rank}
                  </span>
                  <span className="w-16 font-mono text-xs font-bold text-accent-red">
                    {item.score.toFixed(1)}
                  </span>
                  <div className="flex-1 flex flex-col gap-0.5">
                    {item.code.map((line, idx) => (
                      <span
                        key={`code-${item.rank}-${idx}`}
                        className="font-mono text-xs text-text-primary truncate"
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                  <span className="w-24 font-mono text-xs text-text-secondary">
                    {item.lang}
                  </span>
                </div>
              ))}

              {/* Footer Hint */}
              <div className="px-5 py-3 text-center">
                <span className="font-mono text-xs text-text-tertiary">
                  showing top 3 of 2,847 ·{" "}
                  <Link href="/leaderboard" className="hover:underline">
                    view full leaderboard &gt;&gt;
                  </Link>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Spacer */}
          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}
