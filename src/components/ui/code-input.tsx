"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { codeToHtml } from "shiki";

const LANGUAGE_PATTERNS: Record<string, RegExp[]> = {
  javascript: [
    /\bconst\b/,
    /\blet\b/,
    /\bvar\b/,
    /\bfunction\b/,
    /\b=>/,
    /\brequire\s*\(/,
    /\bimport\s+.*\s+from/,
    /\bexport\s+(default\s+)?/,
    /\bconsole\.\w+/,
    /\bdocument\.\w+/,
    /\bwindow\.\w+/,
  ],
  typescript: [
    /\binterface\b/,
    /\btype\b.*=\s*{/,
    /:\s*(string|number|boolean|any|void|never)\b/,
    /<[A-Z]\w*>/,
    /\bas\s+\w+/,
    /\bnamespace\b/,
  ],
  python: [
    /\bdef\b/,
    /\bclass\b.*:/,
    /\bimport\b/,
    /\bfrom\b.*\bimport\b/,
    /\bprint\s*\(/,
    /\bif\s+__name__\s*==\s*['"]__main__['"]/,
    /\bself\./,
    /\bNone\b/,
    /\belif\b/,
  ],
  html: [
    /<\/?[a-z][\s\S]*>/i,
    /<!DOCTYPE\s+html>/i,
    /<html/i,
    /<head>/i,
    /<body/i,
  ],
  css: [
    /\{[\s\S]*:[^}]+\}/,
    /@media\s*\(/,
    /@import\s+/,
    /\.[a-z][\w-]*\s*\{/i,
    /#[a-z][\w-]*\s*\{/i,
  ],
  rust: [
    /\bfn\b/,
    /\blet\s+mut\b/,
    /\bimpl\b/,
    /\bstruct\b/,
    /\benum\b/,
    /\bmatch\b/,
  ],
  go: [/\bpackage\s+\w+/, /\bfunc\s+/, /\bimport\s+\(/, /\bfmt\.\w+/],
  java: [
    /\bpublic\s+(class|interface)/,
    /\bprivate\b/,
    /\bstatic\s+void\s+main\b/,
  ],
  sql: [/\bSELECT\b/i, /\bFROM\b/i, /\bWHERE\b/i, /\bJOIN\b/i],
  php: [/<\?php/, /\$\w+\s*=/, /\bfunction\s+\w+/],
};

function detectLanguage(code: string): string {
  const scores: Record<string, number> = {};
  for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    scores[lang] = patterns.filter((p) => p.test(code)).length;
  }
  const max = Math.max(...Object.values(scores));
  if (max === 0) return "plaintext";
  const detected =
    Object.entries(scores).find(([, s]) => s === max)?.[0] || "plaintext";
  if (detected === "javascript" && scores.typescript >= scores.javascript)
    return "typescript";
  return detected;
}

export function CodeInput({
  value,
  onChange,
  onLanguageDetected,
  maxLength = 2000,
  placeholder = "// paste your code here...",
}: {
  value: string;
  onChange: (value: string) => void;
  onLanguageDetected?: (language: string) => void;
  maxLength?: number;
  placeholder?: string;
}) {
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const isOverLimit = value.length > maxLength;

  const highlightCode = useCallback(async (code: string) => {
    if (!code.trim()) {
      setHighlightedHtml("");
      return;
    }
    const lang = detectLanguage(code);
    try {
      const html = await codeToHtml(code, {
        lang: lang === "plaintext" ? "text" : lang,
        theme: "vesper",
        transformers: [
          {
            line(node) {
              this.addClassToHast(node, "code-line");
            },
          },
        ],
      });
      setHighlightedHtml(html);
    } catch {
      setHighlightedHtml("");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    highlightCode(newValue);
    if (newValue) {
      onLanguageDetected?.(detectLanguage(newValue));
    }
  };

  useEffect(() => {
    if (value) {
      highlightCode(value);
      onLanguageDetected?.(detectLanguage(value));
    }
  }, [highlightCode, onLanguageDetected, value]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (highlightRef.current) highlightRef.current.scrollTop = target.scrollTop;
    if (highlightRef.current)
      highlightRef.current.scrollLeft = target.scrollLeft;
    if (lineNumbersRef.current)
      lineNumbersRef.current.scrollTop = target.scrollTop;
  };

  const lines = value ? value.split("\n").filter((line) => line !== "") : [""];
  const lineCount = Math.max(lines.length, 15);

  return (
    <div className="w-full rounded-lg border border-border-primary overflow-hidden bg-bg-input">
      <div className="flex items-center gap-3 h-10 px-4 border-b border-border-primary bg-bg-input">
        <span className="w-3 h-3 rounded-full bg-accent-red" />
        <span className="w-3 h-3 rounded-full bg-accent-amber" />
        <span className="w-3 h-3 rounded-full bg-accent-green" />
      </div>

      <div className="flex min-h-[360px] max-h-[500px] overflow-hidden">
        <div
          ref={lineNumbersRef}
          className="w-12 py-4 pr-3 pl-4 text-right border-r border-border-primary bg-bg-input shrink-0 font-mono text-xs text-text-tertiary leading-6 overflow-hidden"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-6">
              {i + 1}
            </div>
          ))}
        </div>

        <div className="relative flex-1 overflow-y-auto bg-bg-input">
          <div
            ref={highlightRef}
            className="code-highlight absolute inset-0 overflow-y-auto font-mono text-sm leading-6 pointer-events-none"
            style={{
              padding: "1rem",
              backgroundColor: "transparent !important",
              zIndex: 1,
            }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
          <textarea
            value={value}
            onChange={handleChange}
            onScroll={handleScroll}
            className="code-input-textarea absolute inset-0 w-full h-full p-4 bg-transparent font-mono text-sm leading-6 resize-none focus:outline-none caret-white"
            style={{
              color: "transparent !important",
              WebkitTextFillColor: "transparent !important",
              background: "transparent !important",
              zIndex: 2,
            }}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      <div
        className={`
          h-8 px-4 flex items-center justify-end border-t border-border-primary bg-bg-input
          font-mono text-xs
          ${isOverLimit ? "text-accent-red" : "text-text-tertiary"}
        `}
      >
        <span>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
