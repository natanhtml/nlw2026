import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
  title: "Shame Leaderboard - devroast",
  description: "The most roasted code on the internet",
};

const leaderboardEntries = [
  {
    rank: 1,
    score: "1.2",
    language: "javascript",
    lines: 3,
    code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
  },
  {
    rank: 2,
    score: "1.8",
    language: "typescript",
    lines: 3,
    code: `if (x == true) { return true; }
else if (x == false) { return false; }
else { return !false; }`,
  },
  {
    rank: 3,
    score: "2.1",
    language: "sql",
    lines: 2,
    code: `SELECT * FROM users WHERE 1=1
-- TODO: add authentication`,
  },
  {
    rank: 4,
    score: "2.3",
    language: "java",
    lines: 3,
    code: `catch (e) {
  // ignore
}`,
  },
  {
    rank: 5,
    score: "2.5",
    language: "javascript",
    lines: 3,
    code: `const sleep = (ms) =>
  new Date(Date.now() + ms)
  while(new Date() < end) {}`,
  },
];

function LeaderboardEntry({
  entry,
}: {
  entry: (typeof leaderboardEntries)[0];
}) {
  return (
    <div className="border border-border-primary rounded-md overflow-hidden">
      <div className="h-12 px-5 flex items-center justify-between border-b border-border-primary bg-bg-surface">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-text-tertiary font-mono text-xs">#</span>
            <span className="text-accent-amber font-mono text-sm font-bold">
              {entry.rank}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-tertiary font-mono text-xs">score:</span>
            <span className="text-accent-red font-mono text-sm font-bold">
              {entry.score}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-text-secondary font-mono text-xs">
            {entry.language}
          </span>
          <span className="text-text-tertiary font-mono text-xs">
            {entry.lines} lines
          </span>
        </div>
      </div>
      <CodeBlock code={entry.code} lang={entry.language} showHeader={false} />
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-10 py-10 flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-accent-green font-mono text-[32px] font-bold">
            &gt;
          </span>
          <h1 className="text-text-primary font-mono text-[28px] font-bold">
            shame_leaderboard
          </h1>
        </div>
        <p className="text-text-secondary font-mono text-sm">
          {"// the most roasted code on the internet"}
        </p>
        <div className="flex items-center gap-2 text-text-tertiary font-mono text-xs">
          <span>2,847 submissions</span>
          <span>·</span>
          <span>avg score: 4.2/10</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {leaderboardEntries.map((entry) => (
          <LeaderboardEntry key={entry.rank} entry={entry} />
        ))}
      </div>
    </div>
  );
}
