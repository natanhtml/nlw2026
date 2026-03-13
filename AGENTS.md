# Padrões do Projeto

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Biome (lint/format)
- Shiki (syntax highlighting)

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
