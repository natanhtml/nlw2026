import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLineVariants = tv({
  base: "flex font-mono text-[13px]",
  variants: {
    type: {
      removed: "bg-[#1A0A0A]",
      added: "bg-[#0A1A0F]",
      context: "",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

const prefixVariants = tv({
  base: "w-4 flex-shrink-0",
  variants: {
    type: {
      removed: "text-accent-red",
      added: "text-accent-green",
      context: "text-text-tertiary",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

const codeVariants = tv({
  base: "",
  variants: {
    type: {
      removed: "text-zinc-400",
      added: "text-text-primary",
      context: "text-text-secondary",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

export interface DiffLineProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof diffLineVariants> {
  prefix?: "-" | "+" | " ";
  code: string;
}

export const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, type, prefix = " ", code, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={diffLineVariants({ type, className })}
        {...props}
      >
        <span className={prefixVariants({ type })}>{prefix}</span>
        <span className={codeVariants({ type })}>{code}</span>
      </div>
    );
  },
);

DiffLine.displayName = "DiffLine";
