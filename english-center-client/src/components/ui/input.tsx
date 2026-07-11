import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-md border border-line bg-white px-4 py-2 text-[14px] font-medium text-body transition-all duration-200 outline-none",
        "placeholder:text-faint",
        "hover:border-hover-line",
        "focus:border-mint focus:ring-4 focus:ring-mint/15",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-soft disabled:text-faint disabled:border-line-soft",
        "aria-invalid:border-coral aria-invalid:ring-4 aria-invalid:ring-coral/15",
        "file:inline-flex file:h-7 file:border-0 file:rounded-full file:bg-surface-soft file:px-3 file:text-[12px] file:font-semibold file:text-muted file:mr-3 file:cursor-pointer file:transition-colors file:hover:bg-line-soft",
        className
      )}
      {...props}
    />
  );
}

export { Input };
