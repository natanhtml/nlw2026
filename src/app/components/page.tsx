import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiffLine } from "@/components/ui/diff-line";
import {
  AnalysisCardRoot,
  AnalysisCardDot,
  AnalysisCardLabel,
  AnalysisCardTitle,
  AnalysisCardDescription,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { ToggleSection } from "@/components/ui/toggle-section";
import { ScoreRing } from "@/components/ui/score-ring";

export default function ComponentsPage() {
  const buttonVariants = [
    "primary",
    "secondary",
    "outline",
    "ghost",
    "destructive",
  ] as const;
  const buttonSizes = ["sm", "md", "lg"] as const;
  const badgeVariants = ["critical", "warning", "good", "neutral"] as const;
  const cardVariants = ["critical", "warning", "good"] as const;

  const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

  const diffLines = [
    { prefix: "-" as const, code: "var total = 0;", type: "removed" as const },
    { prefix: "+" as const, code: "const total = 0;", type: "added" as const },
    {
      prefix: " " as const,
      code: "for (let i = 0; i < items.length; i++) {",
      type: "context" as const,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-950">
      <h1 className="mb-8 text-3xl font-bold">Componentes UI</h1>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Button</h2>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Componente de botao com multiplas variantes e tamanhos.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-lg font-medium">Variantes</h3>
            <div className="flex flex-wrap gap-4">
              {buttonVariants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium">Tamanhos</h3>
            <div className="flex flex-wrap items-center gap-4">
              {buttonSizes.map((size) => (
                <Button key={size} size={size}>
                  Size {size.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium">Estados</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button isLoading>Loading</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Toggle</h2>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Componente de toggle com estado Ligado/Desligado.
        </p>

        <ToggleSection />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Badge</h2>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Componente de badge com indicador de cor.
        </p>

        <div className="flex flex-wrap gap-4">
          {badgeVariants.map((variant) => (
            <Badge key={variant} variant={variant} dot>
              {variant}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Badge variant="critical">needs_serious_help</Badge>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">DiffLine</h2>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Componente para exibir linhas de diff (removido, adicionado,
          contexto).
        </p>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden w-full max-w-xl">
          {diffLines.map((line) => (
            <DiffLine
              key={line.code}
              prefix={line.prefix}
              code={line.code}
              type={line.type}
            />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">AnalysisCard</h2>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Card especifico para exibir analises de codigo.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cardVariants.map((variant) => (
            <AnalysisCardRoot key={variant}>
              <div className="flex items-center gap-2 mb-3">
                <AnalysisCardDot variant={variant} />
                <AnalysisCardLabel variant={variant}>
                  {variant}
                </AnalysisCardLabel>
              </div>
              <AnalysisCardTitle>
                Using var instead of const/let
              </AnalysisCardTitle>
              <AnalysisCardDescription>
                The var keyword is function-scoped rather than block-scoped,
                which can lead to unexpected behavior and bugs.
              </AnalysisCardDescription>
            </AnalysisCardRoot>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">CodeBlock</h2>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Bloco de codigo com syntax highlighting (Server Component).
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <CodeBlock
            code={sampleCode}
            lang="javascript"
            filename="calculate.js"
          />
        </div>
      </section>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">ScoreRing</h2>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Componente de ring circular para exibir pontuacao.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={1.5} />
            <span className="text-sm text-zinc-500">Baixo (red)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={5.0} />
            <span className="text-sm text-zinc-500">Medio (amber)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={8.5} />
            <span className="text-sm text-zinc-500">Alto (green)</span>
          </div>
        </div>
      </section>
    </main>
  );
}
