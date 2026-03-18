# Padrões do Projeto

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Biome (lint/format)
- Shiki (syntax highlighting)
- tRPC (camada de API type-safe)

## Componentes UI
- Composition pattern (sub-componentes)
- tailwind-variants para estilização
- Named exports sempre
- Server Components quando possível

## Variáveis Tailwind
```
bg-bg-page, bg-bg-input, bg-bg-surface
text-text-primary, text-text-secondary, text-text-tertiary
border-border-primary
accent-green, accent-red, accent-amber
```

## Regras
- Não usar cn() com tv() - passar className diretamente
- Server Components para dados estáticos
- Client Components apenas quando necessário (useState, etc)

## Estrutura de Páginas
- Page principal (page.tsx): Server Component que carrega dados
- Componente de conteúdo (page-content.tsx): Client Component se precisar de estado
- Components pequenos: client components quando necessário interactivity

## Specs
- Criar specs em `specs/` antes de implementar novas features
- Formato definido em `specs/AGENTS.md`
