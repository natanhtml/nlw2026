import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const scoreRingVariants = tv({
  base: "relative inline-flex items-center justify-center",
  variants: {
    size: {
      lg: "w-44 h-44",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export interface ScoreRingProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scoreRingVariants> {
  score: number;
  maxScore?: number;
}

export const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, size, score, maxScore = 10, ...props }, ref) => {
    const percentage = Math.min(Math.max(score / maxScore, 0), 1);
    const strokeDasharray = 2 * Math.PI * 70;
    const strokeDashoffset = strokeDasharray * (1 - percentage);

    const getColor = () => {
      if (percentage >= 0.7) return "text-accent-green";
      if (percentage >= 0.35) return "text-accent-amber";
      return "text-accent-red";
    };

    return (
      <div
        ref={ref}
        className={scoreRingVariants({ size, className })}
        {...props}
      >
        <svg
          aria-label={`Pontuacao: ${score} de ${maxScore}`}
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 180 180"
        >
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-border-primary"
          />
          <defs>
            <linearGradient
              id="scoreGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="36%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="flex flex-col items-center justify-center z-10">
          <span
            className={cn(
              "font-mono text-4xl font-bold leading-none",
              getColor(),
            )}
          >
            {score.toFixed(1)}
          </span>
          <span className="font-mono text-xs text-text-secondary mt-1">
            /{maxScore}
          </span>
        </div>
      </div>
    );
  },
);

ScoreRing.displayName = "ScoreRing";
