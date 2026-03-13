"use client";

import { useState } from "react";
import { Toggle } from "./toggle";

export function ToggleSection() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <Toggle checked={checked} onCheckedChange={setChecked}>
        <span className={checked ? "text-emerald-500" : "text-zinc-500"}>
          roast mode
        </span>
      </Toggle>
      <span className="text-sm text-zinc-500">
        Estado: {checked ? "ligado" : "desligado"}
      </span>
    </div>
  );
}
