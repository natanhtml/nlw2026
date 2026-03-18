"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import * as React from "react";
import { tv } from "tailwind-variants";

const collapsibleStyles = tv({
  base: "w-full",
});

export interface CollapsibleProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <BaseCollapsible.Root
        ref={ref}
        className={collapsibleStyles({ className })}
        {...props}
      >
        {children}
      </BaseCollapsible.Root>
    );
  },
);

Collapsible.displayName = "Collapsible";

export const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <BaseCollapsible.Trigger ref={ref} className={className} {...props}>
      {children}
    </BaseCollapsible.Trigger>
  );
});

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <BaseCollapsible.Panel ref={ref} className={className} {...props}>
      {children}
    </BaseCollapsible.Panel>
  );
});

CollapsibleContent.displayName = "CollapsibleContent";
