"use client";

import * as React from "react";
import { tv } from "tailwind-variants";

const toggleVariants = tv({
  base: "relative inline-flex h-[22px] w-[40px] cursor-pointer items-center rounded-full p-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2",
  variants: {
    checked: {
      true: "bg-accent-green",
      false: "border border-border-primary",
    },
  },
  defaultVariants: {
    checked: false,
  },
});

const thumbVariants = tv({
  base: "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
  variants: {
    checked: {
      true: "translate-x-[18px]",
      false: "translate-x-0",
    },
  },
});

export interface ToggleProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { className, checked, onCheckedChange, defaultChecked, children, ...props },
    ref,
  ) => {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = React.useState(
      defaultChecked ?? false,
    );
    const isChecked = isControlled ? checked : internalChecked;

    const handleClick = () => {
      const newValue = !isChecked;
      if (!isControlled) {
        setInternalChecked(newValue);
      }
      onCheckedChange?.(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        className={toggleVariants({ checked: isChecked, className })}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span className={thumbVariants({ checked: isChecked })} />
      </button>
    );
  },
);

Toggle.displayName = "Toggle";
