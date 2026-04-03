// src/components/ui/badgeVariants.ts
/**
 * Purpose: Centralized Badge style variants using class-variance-authority (cva).
 * Notes:
 * - Provides `variant` + `size` variants for consistent badges across the app.
 * - Uses subtle rings, rounded pills, and gentle gradients to create a modern look.
 */

import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  // base
  "inline-flex items-center justify-center rounded-full font-medium select-none transition-shadow transition-colors ease-in-out",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white shadow-sm ring-1 ring-indigo-200/20",
        secondary:
          "bg-clip-padding bg-white/60 text-indigo-700 border border-indigo-100 shadow-sm dark:bg-gray-800/60 dark:text-indigo-200 dark:border-gray-700",
        destructive:
          "bg-red-50 text-red-700 border border-red-100 shadow-sm dark:bg-red-900/60 dark:text-red-200",
        outline:
          "bg-transparent text-foreground border border-border/60 ring-1 ring-inset ring-transparent hover:ring-primary/20",
        subtle:
          "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-100",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
