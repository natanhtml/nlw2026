"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function Metrics() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.getMetrics.queryOptions());

  return (
    <div className="flex items-center gap-6 font-mono text-xs text-text-secondary">
      <span>
        <NumberFlow
          value={data?.totalCodes ?? 0}
          format={{ notation: "standard" }}
        />
        {" codes roasted"}
      </span>
      <span>·</span>
      <span>
        {"avg score: "}
        <NumberFlow
          value={data?.avgScore ?? 0}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        /10
      </span>
    </div>
  );
}
