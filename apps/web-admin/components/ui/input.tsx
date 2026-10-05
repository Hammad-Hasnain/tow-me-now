import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-2 text-sm text-white outline-none transition-all",
          "placeholder:text-[#94A3B8]",
          "hover:border-white/25",
          "focus:border-[#8B5CF6] focus:bg-white/[0.09] focus:ring-2 focus:ring-[#8B5CF6]/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
