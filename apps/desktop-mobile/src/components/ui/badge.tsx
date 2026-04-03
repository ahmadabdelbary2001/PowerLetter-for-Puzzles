// src/components/ui/badge.tsx
/**
 * Purpose: Small, reusable Badge component that supports variants and sizes.
 * Exports only components (Fast Refresh safe).
 * Applies golden-ratio gradient (via CSS vars) for `variant === 'default'`.
 */

import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { badgeVariants } from "./badgeVariants";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof badgeVariants> {
  as?: React.ElementType;
}

/**
 * Render a badge. Use `as` prop if you want a different element (e.g. 'span' or 'button').
 * No `any` casts — props are strongly typed as HTML attributes.
 */
function Badge({ as: Component = "div", className, variant, size, style, ...props }: BadgeProps) {
  const gradientStyle =
    variant === "default"
      ? {
          backgroundImage:
            "linear-gradient(90deg, var(--brand-primary) 0%, var(--brand-secondary) 60%, var(--brand-accent) 100%)",
        }
      : undefined;

  const mergedStyle = { ...(style || {}), ...(gradientStyle || {}) };

  return <Component className={cn(badgeVariants({ variant, size }), className)} style={mergedStyle} {...props} />;
}

export { Badge };
export default Badge;
