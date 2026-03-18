# Padrões de Componentes UI

## Estrutura de Arquivos

```
src/components/ui/
├── button.tsx      # Componente Button
├── input.tsx       # Componente Input
└── agents.md       # Este arquivo
```

## Regras para Criação de Componentes

### 1. Always Use Named Exports

```tsx
// ✅ Correto
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)

// ❌ Errado
export default function Button(...) { ... }
```

### 2. Usar tailwind-variants (tv)

```tsx
import { tv, type VariantProps } from 'tailwind-variants';

const buttonVariants = tv({
  base: 'classes base sempre aplicadas',
  variants: {
    variant: {
      primary: 'classes para variant primary',
      secondary: 'classes para variant secondary',
    },
    size: {
      sm: 'classes para size sm',
      md: 'classes para size md',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: md,
  },
});
```

### 3. NÃO usar cn() ou twMerge

O tailwind-variants já faz merge automaticamente. Passe className diretamente:

```tsx
// ✅ Correto - className faz merge automático
className={buttonVariants({ variant, size, className })}

// ❌ Errado - não precisa de cn/twMerge
className={cn(buttonVariants({ variant, size }), className)}
```

### 4. Extender Props Nativas do HTML

```tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}
```

### 5. Usar forwardRef

```tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
```

### 6. Variantes Recomendadas

- variant: primary | secondary | outline | ghost | destructive
- size: sm | md | lg

### 7. Accessibility

- SVGs devem ter aria-label
- Botões desabilitados devem ter disabled
- Usar focus-visible para keyboard navigation

## Criando Novos Componentes

1. Criar arquivo em src/components/ui/[nome].tsx
2. Definir buttonVariants com tv()
3. Criar interface ComponentProps estendendo props nativas
4. Criar componente com forwardRef
5. Usar named export
6. Criar página de exemplo em src/app/components/page.tsx

## Collapsible

Usar `@base-ui/react` para primitivos de collapsible:

```tsx
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <BaseCollapsible.Root ref={ref} className={className} {...props}>
        {children}
      </BaseCollapsible.Root>
    );
  }
);

export const CollapsibleTrigger = React.forwardRef<...>(...);
export const CollapsibleContent = React.forwardRef<...>(...);
```

Para código highlightado (shiki) em Client Components:

1. Criar procedure tRPC que retorna `codeHtml` pré-processado
2. Criar componente `CodeInline` que renderiza HTML:
```tsx
export function CodeInline({ codeHtml }: { codeHtml: string }) {
  return <div dangerouslySetInnerHTML={{ __html: codeHtml }} />;
}
```
