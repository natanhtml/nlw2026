import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
  title: "Roast Results - devroast",
  description: "Your code got roasted",
};

const staticResultData = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  score: 3.5,
  verdict: "needs_serious_help",
  quote:
    "this code looks like it was written during a power outage... in 2005.",
  language: "javascript",
  lines: 7,
  code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}

// TODO: handle tax calculation
// TODO: handle currency conversion
}`,
  issues: [
    {
      type: "critical",
      title: "using var instead of const/let",
      description:
        "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
    },
    {
      type: "warning",
      title: "imperative loop pattern",
      description:
        "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
    },
    {
      type: "good",
      title: "clear naming conventions",
      description:
        "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
    },
    {
      type: "good",
      title: "single responsibility",
      description:
        "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
    },
  ],
  suggestedFix: {
    fromFile: "your_code.ts",
    toFile: "improved_code.ts",
    lines: [
      { type: "context", content: "function calculateTotal(items) {" },
      { type: "removed", content: "  var total = 0;" },
      {
        type: "removed",
        content: "  for (var i = 0; i < items.length; i++) {",
      },
      { type: "removed", content: "    total = total + items[i].price;" },
      { type: "removed", content: "  }" },
      { type: "removed", content: "  return total;" },
      {
        type: "added",
        content: "  return items.reduce((sum, item) => sum + item.price, 0);",
      },
      { type: "context", content: "}" },
    ],
  },
};

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="relative w-[180px] h-[180px] shrink-0">
      <div className="absolute inset-0 rounded-full border-4 border-border-primary" />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: "4px solid transparent",
          borderTopColor:
            score >= 7 ? "#10B981" : score >= 4 ? "#F59E0B" : "#EF4444",
          borderRightColor: score >= 4 ? "#10B981" : undefined,
          transform: "rotate(45deg)",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[48px] font-bold font-mono text-accent-amber">
          {score}
        </span>
        <span className="text-base font-mono text-text-tertiary">/10</span>
      </div>
    </div>
  );
}

function IssueCard({
  type,
  title,
  description,
}: {
  type: "critical" | "warning" | "good";
  title: string;
  description: string;
}) {
  const colors = {
    critical: "bg-accent-red",
    warning: "bg-accent-amber",
    good: "bg-accent-green",
  };

  return (
    <div className="p-5 border border-border-primary">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${colors[type]}`} />
        <span
          className={`font-mono text-xs font-medium ${colors[type].replace("bg-", "text-")}`}
        >
          {type}
        </span>
      </div>
      <h4 className="font-mono text-sm font-medium text-text-primary mb-2">
        {title}
      </h4>
      <p className="font-mono text-xs text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function DiffLine({
  type,
  content,
}: {
  type: "context" | "removed" | "added";
  content: string;
}) {
  const styles = {
    context: "text-text-primary",
    removed: "text-accent-red",
    added: "text-accent-green",
  };

  const prefix = {
    context: "  ",
    removed: "- ",
    added: "+ ",
  };

  const bg = {
    context: "transparent",
    removed: "rgba(239, 68, 68, 0.08)",
    added: "rgba(16, 185, 129, 0.08)",
  };

  return (
    <div
      className={`h-7 px-4 flex items-center font-mono text-xs ${styles[type]}`}
      style={{ backgroundColor: bg[type] }}
    >
      <span className="w-5 inline-block">{prefix[type]}</span>
      <span>{content}</span>
    </div>
  );
}

export default function RoastResultsPage() {
  const result = staticResultData;

  return (
    <div className="max-w-[1440px] mx-auto px-10 py-10 flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold text-accent-green">
              &gt;
            </span>
            <span className="font-mono text-lg font-medium text-text-primary">
              devroast
            </span>
          </Link>
        </div>
        <Link
          href="/leaderboard"
          className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          leaderboard
        </Link>
      </div>

      <div className="flex items-center gap-12">
        <ScoreRing score={result.score} />
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="font-mono text-sm font-medium text-accent-red">
              verdict: {result.verdict}
            </span>
          </div>
          <h1 className="font-mono text-xl text-text-primary leading-relaxed">
            &quot;{result.quote}&quot;
          </h1>
          <div className="flex items-center gap-4 text-text-tertiary font-mono text-xs">
            <span>lang: {result.language}</span>
            <span>·</span>
            <span>{result.lines} lines</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-border-primary font-mono text-xs text-text-primary hover:bg-bg-input transition-colors"
            >
              $ share_roast
            </button>
          </div>
        </div>
      </div>

      <div className="h-px bg-border-primary" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-accent-green font-mono text-sm font-bold">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            your_submission
          </span>
        </div>
        <CodeBlock
          code={result.code}
          lang={result.language}
          showHeader={false}
          className="max-w-none"
        />
      </div>

      <div className="h-px bg-border-primary" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="text-accent-green font-mono text-sm font-bold">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            detailed_analysis
          </span>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {result.issues.map((issue, i) => (
            <IssueCard
              key={i}
              type={issue.type as "critical" | "warning" | "good"}
              title={issue.title}
              description={issue.description}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-border-primary" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="text-accent-green font-mono text-sm font-bold">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            suggested_fix
          </span>
        </div>
        <div className="border border-border-primary overflow-hidden">
          <div className="h-10 px-4 flex items-center border-b border-border-primary bg-bg-surface">
            <span className="font-mono text-xs text-text-secondary">
              {result.suggestedFix.fromFile} → {result.suggestedFix.toFile}
            </span>
          </div>
          <div className="bg-bg-input">
            {result.suggestedFix.lines.map((line, i) => (
              <DiffLine
                key={i}
                type={line.type as "context" | "removed" | "added"}
                content={line.content}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
