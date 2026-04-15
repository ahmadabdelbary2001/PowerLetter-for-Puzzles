import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";
import { badgeVariants } from "./badge-variants";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof badgeVariants> {
  as?: React.ElementType;
}

function Badge({ as: Component = "div", className, variant, size, style, ...props }: BadgeProps) {
  return (
    <Component 
      className={cn(badgeVariants({ variant, size }), className)} 
      style={style} 
      {...props} 
    />
  );
}

export { Badge };
