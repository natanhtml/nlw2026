"use client";

import { useState } from "react";
import { CodeInline } from "@/components/ui/code-inline";

type LeaderboardEntry = {
  rank: number;
  id: string;
  code: string;
  codeHtml: string;
  language: string;
  totalScore: number;
  lines: number;
};

export type LeaderboardData = {
  entries: LeaderboardEntry[];
  totalCodes: number;
  avgScore: number;
};

type LeaderboardContentProps = {
  data: LeaderboardData;
};

const MAX_LINES_PREVIEW = 3;

function LeaderboardEntryComponent({ entry }: { entry: LeaderboardEntry }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsExpansion = entry.lines > MAX_LINES_PREVIEW;

  return (
    <div className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-950">
      <div className="h-12 px-5 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-mono text-xs">#</span>
            <span className="text-amber-500 font-mono text-sm font-bold">
              {entry.rank}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-mono text-xs">score:</span>
            <span className="text-red-500 font-mono text-sm font-bold">
              {entry.totalScore.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 font-mono text-xs">
            {entry.language}
          </span>
          <span className="text-zinc-500 font-mono text-xs">
            {entry.lines} lines
          </span>
        </div>
      </div>
      <div className="relative">
        <div
          className={`bg-zinc-950 code-container font-mono text-[13px] leading-[1.1] ${
            isExpanded
              ? "max-h-[500px] overflow-y-auto"
              : "max-h-40 overflow-y-auto"
          }`}
        >
          <div className="p-3">
            <CodeInline codeHtml={entry.codeHtml} />
          </div>
        </div>
        {needsExpansion && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent flex items-end justify-center pb-3">
            <button
              onClick={() => setIsExpanded(true)}
              className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-300 font-mono text-xs rounded transition-colors"
            >
              show more
            </button>
          </div>
        )}
        {needsExpansion && isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-3 pointer-events-none">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-1.5 bg-zinc-800 text-zinc-400 font-mono text-xs rounded pointer-events-auto cursor-pointer"
            >
              show less
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function LeaderboardContent({ data }: LeaderboardContentProps) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-emerald-500 font-mono text-[32px] font-bold">
            &gt;
          </span>
          <h1 className="text-white font-mono text-[28px] font-bold">
            shame_leaderboard
          </h1>
        </div>
        <p className="text-zinc-400 font-mono text-sm">
          {"// the most roasted code on the internet"}
        </p>
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
          <span>{data.totalCodes.toLocaleString()} submissions</span>
          <span>·</span>
          <span>avg score: {data.avgScore}/10</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {data.entries.map((entry) => (
          <LeaderboardEntryComponent key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
