# Padrões tRPC

## Estrutura de Arquivos

```
src/trpc/
├── init.ts              # initTRPC, context, base procedures
├── query-client.ts      # QueryClient factory
├── client.tsx          # Provider para Client Components
├── server.tsx          # Proxy para Server Components
└── routers/
    └── _app.ts         # AppRouter principal
```

## Regras

- Server Components: usar `trpc` e `getQueryClient` de `server.tsx`
- Client Components: usar `useTRPC` de `client.tsx`
- Novas procedures: adicionar em `routers/_app.ts`
- Procedures simples: direto no router principal
- Procedures complexas: criar routers separados e fazer merge no appRouter

## Padrão de Procedure

```typescript
// query
export const appRouter = createTRPCRouter({
  nome: baseProcedure.query(async ({ ctx }) => {
    return dados;
  }),
});

// mutation
export const appRouter = createTRPCRouter({
  nome: baseProcedure
    .input(z.object({ campo: z.string() }))
    .mutation(async ({ input }) => {
      return resultado;
    }),
});
```

## Uso em Componentes

### Server Component (com prefetch/hydration)
```typescript
import { trpc } from "@/trpc/server";

export default async function Page() {
  trpc.nomeProcedure.queryOptions({ input });
  return <ClientComponent />;
}
```

### Client Component (query única)
```typescript
'use client';
import { useTRPC } from "@/trpc/client";

export function Component() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.nomeProcedure.queryOptions({ input }));
}
```

### Client Component (múltiplas queries em paralelo)
Usar `useQueries` para executar queries em paralelo:

```typescript
'use client';
import { useQueries } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function Component() {
  const trpc = useTRPC();

  const [query1, query2] = useQueries({
    queries: [
      trpc.procedure1.queryOptions(),
      trpc.procedure2.queryOptions(),
    ],
  });

  const isLoading = query1.isLoading || query2.isLoading;
  const data1 = query1.data;
  const data2 = query2.data;
}
```
