import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const cardRootVariants = tv({
  base: "rounded-lg border border-border-primary p-5",
});

export interface AnalysisCardRootProps extends HTMLAttributes<HTMLDivElement> {}

export const AnalysisCardRoot = forwardRef<
  HTMLDivElement,
  AnalysisCardRootProps
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cardRootVariants({ className })} {...props}>
      {children}
    </div>
  );
});

AnalysisCardRoot.displayName = "AnalysisCardRoot";

const dotVariants = tv({
  base: "rounded-full",
  variants: {
    variant: {
      critical: "bg-accent-red",
      warning: "bg-accent-amber",
      good: "bg-accent-green",
    },
  },
  defaultVariants: {
    variant: "critical",
  },
});

export interface AnalysisCardDotProps
  extends VariantProps<typeof dotVariants> {}

export function AnalysisCardDot({ variant }: AnalysisCardDotProps) {
  return (
    <span
      className={dotVariants({ variant })}
      style={{ width: 8, height: 8 }}
    />
  );
}

const labelVariants = tv({
  base: "font-mono text-xs",
  variants: {
    variant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
    },
  },
  defaultVariants: {
    variant: "critical",
  },
});

export interface AnalysisCardLabelProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof labelVariants> {
  children?: ReactNode;
}

export const AnalysisCardLabel = forwardRef<
  HTMLSpanElement,
  AnalysisCardLabelProps
>(({ className, variant, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={labelVariants({ variant, className })}
      {...props}
    >
      {children}
    </span>
  );
});

AnalysisCardLabel.displayName = "AnalysisCardLabel";

export interface AnalysisCardTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export function AnalysisCardTitle({
  className,
  children,
  ...props
}: AnalysisCardTitleProps) {
  return (
    <h3
      className={`font-mono text-[13px] text-text-primary mb-2 ${className || ""}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export interface AnalysisCardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export function AnalysisCardDescription({
  className,
  children,
  ...props
}: AnalysisCardDescriptionProps) {
  return (
    <p
      className={`font-mono text-xs text-text-secondary leading-relaxed ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  );
}
