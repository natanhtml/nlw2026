export interface CodeInlineProps {
  codeHtml: string;
  className?: string;
}

export function CodeInline({ codeHtml, className = "" }: CodeInlineProps) {
  return (
    <div
      className={`w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: codeHtml }}
    />
  );
}
