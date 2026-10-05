import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-lg shadow-violet-500/20 hover:from-[#7C3AED] hover:to-[#4F46E5] hover:shadow-violet-500/30",
        outline:
          "border border-white/15 bg-white/[0.06] text-white hover:border-[#8B5CF6] hover:bg-white/[0.1]",
        ghost:
          "text-[#CBD5E1] hover:bg-white/[0.08] hover:text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
