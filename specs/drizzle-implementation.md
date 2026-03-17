# Especificação - Drizzle ORM

## Visão Geral

- **Projeto**: devroast - Sistema de análise sarcástica de código
- **Stack**: Next.js 16 + Drizzle ORM + PostgreSQL + Docker Compose
- **Autenticação**: Anônima (sem usuários)

## Banco de Dados

### Docker Compose

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Variáveis de Ambiente

```env
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

## Tabelas

### 1. submissions

Armazena os códigos submetidos para análise.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK - Identificador único |
| code | text | Código submetido |
| language | varchar(50) | Linguagem do código |
| created_at | timestamp | Data de criação |

### 2. roasts

Armazena as análises/roasts gerados para cada submissão.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK - Identificador único |
| submission_id | uuid | FK - Referência à submission |
| content | text | Conteúdo do roast |
| roast_type | enum | Tipo de roast (sarcastic, constructive, brutal) |
| created_at | timestamp | Data de criação |

### 3. scores

Armazena as métricas/shame scores calculados para cada submissão.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK - Identificador único |
| submission_id | uuid | FK - Referência à submission |
| total_score | integer | Score total de "vergonha" |
| code_quality | integer | Nota de qualidade do código |
| readability | integer | Nota de legibilidade |
| best_practices | integer | Nota de boas práticas |
| created_at | timestamp | Data de criação |

### 4. leaderboard

Armazena os rankings agregados (cache para performance).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK - Identificador único |
| submission_id | uuid | FK - Referência à submission |
| rank_position | integer | Posição no ranking |
| period | varchar(20) | Período (daily, weekly, all_time) |
| updated_at | timestamp | Última atualização |

## Enums

### roast_type

```typescript
export const roastTypes = ['sarcastic', 'constructive', 'brutal'] as const;
export type RoastType = typeof roastTypes[number];
```

### leaderboard_period

```typescript
export const leaderboardPeriods = ['daily', 'weekly', 'all_time'] as const;
export type LeaderboardPeriod = typeof leaderboardPeriods[number];
```

### programming_language

```typescript
export const languages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'go',
  'rust',
  'ruby',
  'php',
  'c',
  'cpp',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
] as const;
export type ProgrammingLanguage = typeof languages[number];
```

## To-Dos para Implementação

### Fase 1: Configuração do Ambiente

- [ ] Criar `docker-compose.yml` com PostgreSQL
- [ ] Criar arquivo `.env` com `DATABASE_URL`
- [ ] Instalar dependências: `drizzle-orm`, `drizzle-kit`, `postgres`
- [ ] Criar `drizzle.config.ts`

### Fase 2: Schema

- [ ] Criar pasta `src/db/`
- [ ] Criar `src/db/schema.ts` com todas as tabelas e enums
- [ ] Criar `src/db/index.ts` para conexão e instance do db

### Fase 3: Migrações

- [ ] Executar `drizzle-kit push` para criar tabelas
- [ ] Verificar se todas as tabelas foram criadas no banco

### Fase 4: Queries e Operations

- [ ] Criar `src/db/queries/submissions.ts`
- [ ] Criar `src/db/queries/roasts.ts`
- [ ] Criar `src/db/queries/scores.ts`
- [ ] Criar `src/db/queries/leaderboard.ts`

### Fase 5: Integração com UI

- [ ] Criar server actions para submissão de código
- [ ] Criar server actions para buscar roasts
- [ ] Criar server actions para leaderboard
- [ ] Atualizar componentes para usar dados do banco

## Estrutura de Arquivos

```
src/
└── db/
    ├── schema.ts        # Definição das tabelas
    ├── index.ts         # Conexão com banco
    ├── migrations/      # Migrações do drizzle-kit
    └── queries/        # Queries específicas por domínio
        ├── submissions.ts
        ├── roasts.ts
        ├── scores.ts
        └── leaderboard.ts
```

## Comandos Úteis

```bash
# Subir banco
docker-compose up -d

# Criar migração
npx drizzle-kit generate

# Executar migração
npx drizzle-kit push

# Resetar banco (cuidado!)
npx drizzle-kit drop
```
