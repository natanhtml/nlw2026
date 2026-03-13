import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  lang: string;
  filename?: string;
}

export async function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
    transformers: [
      {
        line(node) {
          this.addClassToHast(node, "code-line");
        },
      },
    ],
  });

  return (
    <div className="rounded-lg border border-border-primary overflow-hidden w-full max-w-xl">
      <div className="flex items-center gap-3 h-10 px-4 border-b border-border-primary bg-bg-input">
        <span className="w-2.5 h-2.5 rounded-full bg-accent-red" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent-green" />
        {filename && (
          <span className="ml-auto text-xs text-text-tertiary font-mono">
            {filename}
          </span>
        )}
      </div>
      <div
        className="bg-bg-input p-3 overflow-x-auto text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
