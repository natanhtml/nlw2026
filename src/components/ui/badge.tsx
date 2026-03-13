import { forwardRef, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  base: "inline-flex items-center gap-2 font-mono text-xs font-normal",
  variants: {
    variant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
      neutral: "text-zinc-500 dark:text-zinc-400",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  dot?: boolean;
  children?: ReactNode;
  className?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={badgeVariants({ variant, className })}
        {...props}
      >
        {dot && (
          <span
            className={
              {
                critical: "bg-accent-red",
                warning: "bg-accent-amber",
                good: "bg-accent-green",
                neutral: "bg-zinc-500 dark:bg-zinc-400",
              }[variant || "neutral"]
            }
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              display: "inline-block",
            }}
          />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
