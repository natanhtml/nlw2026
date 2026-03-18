import Link from "next/link";
import { useState } from "react";
import { CodeInline } from "@/components/ui/code-inline";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`transform transition-${open ? "rotate-180" : "rotate-0"} duration-200`}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LeaderboardRow({
  item,
  index,
}: {
  item: {
    id: string;
    code: string;
    codeHtml: string;
    language: string;
    totalScore: number;
  };
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const codeLines = item.code.split("\n").filter((line) => line !== "");
  const isLongCode = codeLines.length > 2;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border-b border-border-primary last:border-b-0">
        <div className="px-5 py-3 flex items-center gap-4 hover:bg-bg-input/50 transition-colors">
          <span
            className={`w-6 font-mono text-xs font-medium ${
              index === 0 ? "text-accent-amber" : "text-text-secondary"
            }`}
          >
            {index + 1}
          </span>
          <span className="w-14 font-mono text-xs font-bold text-accent-red">
            {item.totalScore.toFixed(1)}
          </span>
          <div className="flex-1 font-mono text-xs text-text-primary truncate">
            {codeLines[0]}
          </div>
          <span className="w-20 font-mono text-xs text-text-secondary">
            {item.language}
          </span>
          {isLongCode && (
            <CollapsibleTrigger className="flex items-center gap-1 text-text-tertiary hover:text-text-primary transition-colors">
              <span className="font-mono text-xs">
                {isOpen ? "collapse" : "expand"}
              </span>
              <ChevronIcon open={isOpen} />
            </CollapsibleTrigger>
          )}
        </div>
        <CollapsibleContent>
          <div className="px-5 py-3 bg-bg-input">
            <CodeInline codeHtml={item.codeHtml} />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function LeaderboardPreviewContent({
  worstCodes,
  metrics,
}: {
  worstCodes: {
    id: string;
    code: string;
    codeHtml: string;
    language: string;
    totalScore: number;
  }[];
  metrics: {
    totalCodes: number;
    avgScore: number;
  };
}) {
  return (
    <div className="rounded-lg border border-border-primary overflow-hidden">
      <div className="h-10 px-5 flex items-center bg-bg-surface border-b border-border-primary">
        <span className="w-6 font-mono text-xs text-text-tertiary font-medium">
          #
        </span>
        <span className="w-14 font-mono text-xs text-text-tertiary font-medium">
          score
        </span>
        <span className="flex-1 font-mono text-xs text-text-tertiary font-medium">
          code
        </span>
        <span className="w-20 font-mono text-xs text-text-tertiary font-medium">
          lang
        </span>
      </div>

      {(worstCodes ?? []).map((item, index) => (
        <LeaderboardRow key={item.id} item={item} index={index} />
      ))}

      <div className="px-5 py-3 text-center">
        <span className="font-mono text-xs text-text-tertiary">
          {metrics ? (
            <>
              showing top 3 of {metrics.totalCodes.toLocaleString()} ·{" "}
              <Link href="/leaderboard" className="hover:underline">
                view full leaderboard &gt;&gt;
              </Link>
            </>
          ) : (
            <span className="animate-pulse bg-text-tertiary/20 h-4 w-48 inline-block rounded" />
          )}
        </span>
      </div>
    </div>
  );
}
