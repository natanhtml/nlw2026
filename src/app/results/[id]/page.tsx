import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { db } from "@/db";
import { roasts, scores, submissions } from "@/db/schema";

export const metadata: Metadata = {
  title: "Roast Results - devroast",
  description: "Your code got roasted",
};

async function getRoastData(id: string) {
  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    console.error("Invalid UUID format:", id);
    return null;
  }

  const submission = await db.query.submissions.findFirst({
    where: (submissions, { eq }) => eq(submissions.id, id),
  });

  if (!submission) return null;

  const roast = await db.query.roasts.findFirst({
    where: (roasts, { eq }) => eq(roasts.submissionId, id),
  });

  const score = await db.query.scores.findFirst({
    where: (scores, { eq }) => eq(scores.submissionId, id),
  });

  return { submission, roast, score };
}

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

export default async function RoastResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getRoastData(id);

  if (!data) {
    return (
      <div className="max-w-[1440px] mx-auto px-10 py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="font-mono text-2xl text-text-primary mb-4">
          Roast not found
        </h1>
        <p className="font-mono text-sm text-text-secondary">
          This roast doesn&apos;t exist or has been deleted.
        </p>
      </div>
    );
  }

  const { submission, roast, score } = data;
  const codeLines = submission.code.split("\n").length;

  return (
    <div className="max-w-[1440px] mx-auto px-10 py-10 flex flex-col gap-10">
      <div className="flex items-center gap-12">
        <ScoreRing score={score?.totalScore ?? 0} />
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="font-mono text-sm font-medium text-accent-red">
              verdict: {(score?.totalScore ?? 0) < 5 ? "needs_work" : "decent"}
            </span>
          </div>
          <h1 className="font-mono text-xl text-text-primary leading-relaxed">
            &quot;{roast?.content ?? "No roast generated"}&quot;
          </h1>
          <div className="flex items-center gap-4 text-text-tertiary font-mono text-xs">
            <span>lang: {submission.language}</span>
            <span>·</span>
            <span>{codeLines} lines</span>
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
          code={submission.code}
          lang={submission.language}
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
          <IssueCard
            type="critical"
            title="Code Quality"
            description={`Score: ${score?.codeQuality ?? 0}/10 - ${(score?.codeQuality ?? 0) < 5 ? "Needs improvement" : "Looking good"}`}
          />
          <IssueCard
            type="warning"
            title="Readability"
            description={`Score: ${score?.readability ?? 0}/10 - ${(score?.readability ?? 0) < 5 ? "Hard to read" : "Easy to follow"}`}
          />
          <IssueCard
            type="good"
            title="Best Practices"
            description={`Score: ${score?.bestPractices ?? 0}/10 - ${(score?.bestPractices ?? 0) < 5 ? "Room for improvement" : "Follows best practices"}`}
          />
        </div>
      </div>
    </div>
  );
}
