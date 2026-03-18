"use client";

import { useState } from "react";
import { Metrics } from "@/components/metrics";
import { Button } from "@/components/ui/button";
import { CodeInput } from "@/components/ui/code-input";
import { Toggle } from "@/components/ui/toggle";

export function HomeForm() {
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
        </div>
      </div>
    </div>
  );
}
