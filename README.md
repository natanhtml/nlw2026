# devroast

Drop your code, get brutally honest feedback. DevRoast é uma aplicação que analisa código e fornece feedback sarcástico e humorado sobre a qualidade do código.

## Funcionalidades

- **Submeta seu código** - Interface simples para enviar código em qualquer linguagem
- **Roast Mode** - Análise sarcástica e honesta do seu código usando IA
- **Leaderboard** - Veja os piores códigos ranqueados por vergonha
- **Syntax highlighting** - Código destacado com Shiki usando tema Vesper
- **Métricas** - Estatísticas globais de todos os códigos submetidos
- **OG Images** - Imagens Open Graph geradas automaticamente para compartilhamento

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS** + tailwind-variants
- **tRPC** (API type-safe)
- **Drizzle ORM** + PostgreSQL
- **Shiki** (syntax highlighting)
- **Google Gemini AI** (análise de código)

## Como rodar

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run db:push

# (Opcional) Popular banco com dados de exemplo
npm run db:seed

# Rodar em desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa Biome linter |
| `npm run format` | Formata código com Biome |
| `npm run db:push` | Sincroniza schema com banco |
| `npm run db:generate` | Gera migrations Drizzle |
| `npm run db:seed` | Popula banco com dados de exemplo |
| `npm run db:studio` | Abre Drizzle Studio |

## Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página principal
│   ├── leaderboard/       # Página do leaderboard
│   └── layout.tsx         # Layout raiz
├── components/
│   └── ui/               # Componentes UI reutilizáveis
├── db/                    # Schema e conexão com banco
├── lib/                   # Utilitários e serviços
│   ├── ai-service.ts     # Integração com Gemini AI
│   └── cache.ts          # Sistema de cache
└── trpc/                  # API tRPC
    ├── init.ts           # Configuração tRPC
    ├── routers/          # Rotas da API
    └── client.tsx        # Provider para Client Components
```

## Variáveis de Ambiente

```env
DATABASE_URL=postgresql://...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

## Feito durante NLW

Desenvolvido durante o evento **NLW** da [Rocketseat](https://www.rocketseat.com.br).
