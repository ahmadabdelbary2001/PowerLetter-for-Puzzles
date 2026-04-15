import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium select-none transition-shadow transition-colors ease-in-out",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-br from-primary via-primary-light to-secondary text-primary-foreground shadow-sm ring-1 ring-white/10",
        secondary:
          "bg-secondary/10 text-secondary-foreground border border-secondary/20 backdrop-blur-md shadow-sm",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20 shadow-sm font-bold",
        outline:
          "bg-transparent text-foreground border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all",
        subtle:
          "bg-muted/50 text-muted-foreground border border-border/30 backdrop-blur-sm",
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
