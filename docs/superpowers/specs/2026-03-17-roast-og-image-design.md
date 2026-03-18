# Design: Geração Automática de OG Image para Roasts

**Data**: 2026-03-17
**Status**: Aprovado

## 1. Visão Geral

Gerar automaticamente uma imagem Open Graph (1200x630px) quando um roast é criado, usando o design do frame "Screen 4 - OG Image" do arquivo `devroast.pen`. A imagem será salva no filesystem local e associada ao roast.

## 2. Dados do Roast para OG Image

A imagem deve dinamicamente incluir:
- **Score**: Número de 0-10 (ex: "3.5")
- **Verdict**: Texto curto (ex: "needs_serious_help")
- **Linguagem**: ex: "javascript"
- **Linhas de código**: ex: "7 lines"
- **Citação do roast**: Trecho do conteúdo do roast

## 3. Integração com Takumi (CLI)

1. **Instalação**: Adicionar `@kane50613/takumi` como dependência dev
2. **Template**: Exportar o frame "Screen 4 - OG Image" como template HTML/Pug
3. **Geração**: Chamar CLI com dados do roast substituídos no template
4. **Output**: Salvar PNG em `public/roasts/{roastId}.png`

## 4. Fluxo de Dados

```
User submete código → AI gera roast → 
  → calculateRoastScore() → generateOgImage(roastData) →
    → Takumi CLI → Save to public/roasts/{id}.png →
      → Update roast record with ogImagePath →
        → Return shareable link
```

## 5. Schema (nova coluna)

```typescript
// Na tabela roasts
ogImagePath?: string;  // ex: "/roasts/{uuid}.png"
```

## 6. API de Share

Endpoint para acessar o roast com OG:
```
GET /roast/[id] → HTML com og:image pointing to /roasts/{id}.png
```

## 7. Detalhes de Implementação

### Takumi CLI
- Usar abordagem CLI via `child_process`
- Template baseado no design do frame "Screen 4 - OG Image" (1200x630px)
- Variáveis de template: `{{score}}`, `{{verdict}}`, `{{language}}`, `{{lines}}`, `{{quote}}`

### Armazenamento
- Filesystem local em `public/roasts/`
- Nome do arquivo: `{roastId}.png`
- Servir estaticamente via Next.js

### Tratamento de Erros
- Se geração falhar, continuar sem OG image (não bloquear criação do roast)
- Log de erro para debugging
