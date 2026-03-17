# Leaderboard Backend + Frontend Integration

**Date:** 2026-03-17  
**Status:** Approved

## Overview

Implementar a tela de leaderboard (`/leaderboard`) com dados vindos do backend via tRPC, exibindo os 20 piores códigos ordenados por score (menor = pior).

## Backend

### Procedure: `getLeaderboard`

**File:** `src/trpc/routers/_app.ts`

**Input:** none (query procedure)

**Output:**

```typescript
{
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
}
```

**Logic:**

1. Query submissions ordenadas por `totalScore ASC` (menor primeiro), limite 20
2. Query metrics (total submissions, avg score)
3. Para cada entry, gerar codeHtml com `shiki` (theme: "vesper")
4. Retornar entries com rank, codeHtml e lines calculados

## Frontend

### Server Component: `src/app/leaderboard/page.tsx`

- Buscar dados via `trpc.getLeaderboard.queryOptions()`
- Passar dados para `LeaderboardContent`
- Mostrar Suspense fallback durante carregamento

### Client Component: `src/app/leaderboard/leaderboard-content.tsx`

- Renderizar header com metrics (`totalCodes`, `avgScore`)
- Renderizar lista de entries com collapsible
- Cada entry: rank, score, language, lines
- Código só aparece quando expandido (expanding collapsible)
- Reutilizar padrão existente em `leaderboard-preview-content.tsx`

### UI Pattern

Seguir mesmo padrão visual do existente em `leaderboard/page.tsx`:
- Header com título "shame_leaderboard"
- Entry: border rounded, header com rank/score/lang/lines
- Collapsible para expandir código
- CodeBlock com syntax highlight

## Error Handling

- **DB vazio:** retornar array vazio com `totalCodes: 0`, `avgScore: 0`
- **Highlight falhar:** usar codeHtml fallback (plain text)
- **Timeout:** 10s para query completa

## Testing

- Verificar que retorna 20 entries quando há dados suficientes
- Verificar ordenação ASC por totalScore
- Verificar que metrics estão corretos
- Verificar collapsible abre/fecha corretamente

## Implementation Order

1. Adicionar `getLeaderboard` procedure no tRPC router
2. Criar `leaderboard-content.tsx` (Client Component)
3. Atualizar `page.tsx` para Server Component com dados do backend
4. Testar integração