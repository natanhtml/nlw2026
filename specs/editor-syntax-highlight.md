# Especificação: Editor de Código com Syntax Highlighting

## Visão Geral

Este documento especifica a implementação de um componente de editor de código com syntax highlighting para a homepage do projeto.

### Requisitos Funcionais

- **Tipo**: Apenas visualização (não editável)
- **Detecção**: Automática de linguagem via análise do código
- **Local**: Homepage

---

## Análise de Alternativas

### Comparativo de Bibliotecas

| Biblioteca | Tamanho (gzip) | Qualidade | Suporte a Detecção Automática | Uso Ideal |
|-----------|----------------|-----------|-------------------------------|-----------|
| **Shiki** | ~280KB | Excelente | Não (requer heurística) | Alta qualidade visual |
| **Highlight.js** | ~16KB | Boa | Sim | Performance crítica |
| **Prism.js** | ~15KB | Regular | Não | Leveza |

### Recomendação

**Shiki** é a escolha recomendada porque:
- Usa a mesma engine de highlighting do VS Code
- Temas consistentes com VS Code
- Mantido ativamente
- Suporta 100+ linguagens

> Nota: Para detecção automática, usaremos heurísticas ou integração com highlight.js.

---

## Arquitetura

### Estrutura de Arquivos

```
src/
├── components/
│   └── code-editor/
│       ├── code-editor.tsx        # Componente principal
│       ├── highlighted-code.tsx    # Renderização do código destacado
│       ├── language-detector.ts    # Detecção automática de linguagem
│       └── index.ts               # Exports
```

### Fluxo de Dados

1. Usuário cola código no textarea da homepage
2. Sistema detecta automaticamente a linguagem
3. Componente de código aplica syntax highlighting
4. Código destacado é renderizado

---

## Detecção Automática de Linguagem

### Abordagem

Como Shiki não tem detecção automática nativa, usaremos uma das abordagens:

1. **Heurísticas simples** (recomendado para começar):
   - Analisar palavras-chave específicas
   - Verificar estrutura de imports/sintaxe
   - Detectar por padrões (ex: `def` → Python, `fn` → Rust)

2. **Biblioteca dedicada** (flourite ou highlight.js):
   - `flourite`: Leve, TypeScript, ~25KB
   - `highlight.js`: Suporte nativo, mais pesado

### Linguagens Iniciais Suportadas

Prioridade alta:
- JavaScript
- TypeScript
- Python
- HTML
- CSS
- JSON

Prioridade média:
- Rust
- Go
- Java
- C/C++

---

## Implementação

### To-dos

- [ ] 1. Instalar dependências (shiki)
- [ ] 2. Criar componente `CodeEditor`
- [ ] 3. Implementar `LanguageDetector` com heurísticas
- [ ] 4. Configurar temas (herdar do tema do app)
- [ ] 5. Criar componente `HighlightedCode`
- [ ] 6. Integrar na homepage
- [ ] 7. Adicionar testes

### Instalação de Dependências

```bash
npm install shiki
# ou com bundle otimizado
npm install @shikijs/core
```

### Exemplo de Uso

```tsx
import { CodeEditor } from '@/components/code-editor';

<CodeEditor 
  code="const hello = 'world';" 
  onLanguageDetected={(lang) => console.log(lang)} // javascript
/>
```

---

## Decisões Confirmadas

- **Tema**: Usar tema existente do projeto (já existe tema "vesper" em uso)
- **Performance**: Processamento no cliente (browser)
- **Componente**: Textarea para colar código + syntax highlighting

---

## To-dos de Implementação

- [x] 1. Criar componente `CodeInput` com textarea e highlight overlay
- [x] 2. Implementar `LanguageDetector` com heurísticas
- [x] 3. Configurar Shiki com tema existente
- [x] 4. Integrar na homepage (substituir textarea atual)
- [ ] 5. Adicionar suporte a linguagens adicionais