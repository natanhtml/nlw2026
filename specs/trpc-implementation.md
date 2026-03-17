# Especificação - tRPC com Next.js App Router

## Visão Geral

Implementar tRPC como camada de API para comunicação type-safe entre frontend e backend no Next.js 16 com App Router.

## Requisitos Funcionais

- API type-safe entre Server Components, Client Components e backend
- Integração com TanStack React Query
- Suporte a Server Components (RSC) com prefetch e hydration
- Validação com Zod

## Estrutura de Arquivos

```
src/
├── trpc/
│   ├── init.ts              # initTRPC, context, base procedures
│   ├── query-client.ts      # QueryClient factory
│   ├── client.tsx           # Provider para Client Components
│   ├── server.tsx           # Proxy para Server Components
│   └── routers/
│       └── _app.ts          # AppRouter principal
├── app/api/trpc/[trpc]/
│   └── route.ts             # API route handler
```

## Implementação

### 1. Instalação

```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod server-only
```

### 2. Backend (init.ts)

```typescript
// src/trpc/init.ts
import { initTRPC } from '@trpc/server';
import { cache } from 'react';

export const createTRPCContext = cache(async () => {
  return {}; // context (ex: userId, headers)
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

### 3. Router (routers/_app.ts)

```typescript
// src/trpc/routers/_app.ts
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(z.object({ text: z.string() }))
    .query((opts) => ({ greeting: `hello ${opts.input.text}` })),
});

export type AppRouter = typeof appRouter;
```

### 4. API Route (app/api/trpc/[trpc]/route.ts)

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### 5. Query Client (query-client.ts)

```typescript
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000 },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}
```

### 6. Client Provider (client.tsx)

```typescript
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

function getUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: `${getUrl()}/api/trpc` })],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
```

### 7. Server Proxy (server.tsx)

```typescript
import 'server-only';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(createTRPCContext());

export function HydrateClient({ children }: { children: React.ReactNode }) {
  return (
    <HydrationBoundary state={dehydrate(getQueryClient())}>
      {children}
    </HydrationBoundary>
  );
}
```

## Uso

### Server Component (com prefetch)

```typescript
// app/page.tsx
import { trpc, HydrateClient } from '@/trpc/server';
import { ClientComponent } from './client-component';

export default async function Page() {
  trpc.hello.queryOptions({ text: 'world' });

  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}
```

### Client Component

```typescript
// app/client-component.tsx
'use client';
import { useTRPC } from '@/trpc/client';

export function ClientComponent() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: 'world' }));
  return <div>{data?.greeting}</div>;
}
```

### Server Component (dados diretos)

```typescript
import { caller } from '@/trpc/server';

export default async function Page() {
  const greeting = await caller.hello({ text: 'server' });
  return <div>{greeting.greeting}</div>;
}
```

## To-dos

- [x] 1. Instalar dependências
- [x] 2. Criar src/trpc/init.ts
- [x] 3. Criar src/trpc/query-client.ts
- [x] 4. Criar src/trpc/routers/_app.ts com procedure getMetrics
- [x] 5. Criar API route app/api/trpc/[trpc]/route.ts
- [x] 6. Criar src/trpc/client.tsx (Provider)
- [x] 7. Criar src/trpc/server.tsx (Server proxy)
- [x] 8. Adicionar TRPCReactProvider no layout.tsx
- [x] 9. Testar comunicação client <-> server
- [ ] 10. Criar routers específicos (submissions, roasts, etc)
