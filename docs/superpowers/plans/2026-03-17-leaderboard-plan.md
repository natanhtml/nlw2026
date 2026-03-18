# Leaderboard Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar a tela de leaderboard com dados do backend via tRPC, exibindo os 20 piores códigos com collapsible e syntax highlight.

**Architecture:** Criar procedure tRPC dedicada que retorna entries + metrics, consumir em Server Component que passa dados para Client Component com collapsible.

**Tech Stack:** Next.js 16 (App Router), tRPC, Drizzle ORM, Shiki (syntax highlight)

---

### Task 1: Adicionar getLeaderboard procedure no tRPC router

**Files:**
- Modify: `src/trpc/routers/_app.ts`

- [ ] **Step 1: Ler o arquivo existente para entender a estrutura**

```bash
Read: src/trpc/routers/_app.ts
```

- [ ] **Step 2: Adicionar a procedure getLeaderboard após getTopWorstCodesWithHighlight**

Adicionar em `src/trpc/routers/_app.ts` (após linha 85, antes do fechamento de `appRouter`):

```typescript
getLeaderboard: baseProcedure.query(async () => {
  const result = await db
    .select({
      id: submissions.id,
      code: submissions.code,
      language: submissions.language,
      totalScore: scores.totalScore,
      createdAt: submissions.createdAt,
    })
    .from(scores)
    .innerJoin(submissions, eq(submissions.id, scores.submissionId))
    .orderBy(asc(scores.totalScore))
    .limit(20);

  const [totalCountResult] = await db
    .select({ count: count() })
    .from(submissions);
  const [avgScoreResult] = await db
    .select({ avg: avg(scores.totalScore) })
    .from(scores);

  const entries = await Promise.all(
    result.map(async (item, index) => {
      const codeLines = item.code.split("\n");
      const html = await codeToHtml(item.code, {
        lang: item.language,
        theme: "vesper",
        transformers: [
          {
            line(node) {
              this.addClassToHast(node, "code-line");
            },
          },
        ],
      });
      return {
        rank: index + 1,
        id: item.id,
        code: item.code,
        codeHtml: html,
        language: item.language,
        totalScore: item.totalScore,
        lines: codeLines.length,
      };
    })
  );

  const totalCodes = totalCountResult?.count ?? 0;
  const avgScore = avgScoreResult?.avg ? Math.round((Number(avgScoreResult.avg) + Number.EPSILON) * 10) / 10 : 0;

  return {
    entries,
    totalCodes,
    avgScore,
  };
}),
```

- [ ] **Step 3: Verificar se o código compila**

```bash
cd C:\Users\natan\developer\nlw2026
npx tsc --noEmit
```

Expected: sem erros de TypeScript

- [ ] **Step 4: Commit**

```bash
git add src/trpc/routers/_app.ts
git commit -m "feat: add getLeaderboard tRPC procedure"
```

---

### Task 2: Criar LeaderboardContent Client Component

**Files:**
- Create: `src/app/leaderboard/leaderboard-content.tsx`

- [ ] **Step 1: Criar o componente com collapsible e códigohighlight**

```typescript
"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";
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
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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

function LeaderboardEntry({
  entry,
}: {
  entry: {
    rank: number;
    id: string;
    code: string;
    codeHtml: string;
    language: string;
    totalScore: number;
    lines: number;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isLongCode = entry.lines > 2;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
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
                {entry.totalScore.toFixed(1)}
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
            {isLongCode && (
              <CollapsibleTrigger className="flex items-center gap-1 text-text-tertiary hover:text-text-primary transition-colors ml-2">
                <span className="font-mono text-xs">
                  {isOpen ? "collapse" : "expand"}
                </span>
                <ChevronIcon open={isOpen} />
              </CollapsibleTrigger>
            )}
          </div>
        </div>
        <CollapsibleContent>
          <div className="bg-bg-input">
            <CodeBlock code={entry.code} lang={entry.language} showHeader={false} />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function LeaderboardContent({
  data,
}: {
  data: {
    entries: Array<{
      rank: number;
      id: string;
      code: string;
      codeHtml: string;
      language: string;
      totalScore: number;
      lines: number;
    }>;
    totalCodes: number;
    avgScore: number;
  };
}) {
  return (
    <div className="flex flex-col gap-10">
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
          <span>{data.totalCodes.toLocaleString()} submissions</span>
          <span>·</span>
          <span>avg score: {data.avgScore}/10</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {data.entries.map((entry) => (
          <LeaderboardEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/leaderboard/leaderboard-content.tsx
git commit -m "feat: create LeaderboardContent component with collapsible"
```

---

### Task 3: Atualizar page.tsx para Server Component

**Files:**
- Modify: `src/app/leaderboard/page.tsx`

- [ ] **Step 1: Ler o arquivo atual**

```bash
Read: src/app/leaderboard/page.tsx
```

- [ ] **Step 2: Substituir o conteúdo para usar Server Component com dados do backend**

Substituir todo o conteúdo do arquivo por:

```typescript
import type { Metadata } from "next";
import { Suspense } from "react";
import { getQueryClient } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import { LeaderboardContent } from "./leaderboard-content";

export const metadata: Metadata = {
  title: "Shame Leaderboard - devroast",
  description: "The most roasted code on the internet",
};

function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-accent-green font-mono text-[32px] font-bold">
            &gt;
          </span>
          <div className="h-8 w-48 bg-text-tertiary/20 animate-pulse rounded" />
        </div>
        <div className="h-4 w-64 bg-text-tertiary/20 animate-pulse rounded" />
        <div className="h-4 w-32 bg-text-tertiary/20 animate-pulse rounded" />
      </div>
      <div className="flex flex-col gap-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-32 border border-border-primary rounded-md overflow-hidden"
          >
            <div className="h-12 px-5 flex items-center justify-between border-b border-border-primary bg-bg-surface">
              <div className="flex items-center gap-4">
                <div className="h-4 w-8 bg-text-tertiary/20 animate-pulse rounded" />
                <div className="h-4 w-12 bg-text-tertiary/20 animate-pulse rounded" />
              </div>
              <div className="h-4 w-16 bg-text-tertiary/20 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function LeaderboardData() {
  const queryClient = getQueryClient();
  const data = await queryClient.fetch(trpc.getLeaderboard.queryOptions());
  return <LeaderboardContent data={data} />;
}

export default function LeaderboardPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-10 py-10">
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardData />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 3: Verificar se o código compila**

```bash
cd C:\Users\natan\developer\nlw2026
npx tsc --noEmit
```

Expected: sem erros de TypeScript

- [ ] **Step 4: Commit**

```bash
git add src/app/leaderboard/page.tsx
git commit -m "feat: integrate leaderboard with tRPC backend"
```

---

### Task 4: Verificar se a página funciona

**Files:**
- Test: `http://localhost:3000/leaderboard`

- [ ] **Step 1: Iniciar o servidor de desenvolvimento**

```bash
cd C:\Users\natan\developer\nlw2026
npm run dev
```

- [ ] **Step 2: Acessar a página**

Abrir no browser: `http://localhost:3000/leaderboard`

- [ ] **Step 3: Verificar se os dados aparecem corretamente**
- Título "shame_leaderboard" visível
- Métricas no topo (submissions, avg score)
- 20 entries com rank, score, language, lines
- Collapsible funcionando para expandir código

- [ ] **Step 4: Commit final**

```bash
git add -A
git commit -m "feat: complete leaderboard page integration"
```