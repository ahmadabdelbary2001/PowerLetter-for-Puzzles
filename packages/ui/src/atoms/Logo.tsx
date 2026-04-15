// src/components/atoms/Logo.tsx
import { Link } from './Link';
import { Badge, cn } from "../index";
import { useTranslation } from "@powerletter/core";
import { motion } from "framer-motion";

interface LogoProps {
  showText?: boolean;
  showBadge?: boolean;
  className?: string;
}

export function Logo({ showText = true, showBadge = true, className }: LogoProps) {
  const { t } = useTranslation();

  return (
    <Link to="/" className={cn("flex items-center gap-3 group px-1", className)}>
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.4 }}
      >
        {/* Lightning bolt icon with enhanced gradient */}
        <div className="text-2xl sm:text-3xl font-bold bg-linear-to-br from-primary via-primary-light to-secondary bg-clip-text text-transparent filter drop-shadow-sm">
          ⚡
        </div>
        {/* Animated pulse indicator with custom color */}
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary rounded-full animate-pulse border-2 border-background" />
      </motion.div>

      {/* Logo text - enhanced tracking and weight */}
      {showText && (
        <div className="hidden sm:block">
          <motion.h1 
            className="text-lg sm:text-xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent leading-none tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            PowerLetter
          </motion.h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 -mt-0.5" suppressHydrationWarning>
            {t('tagline', { ns: 'landing' })}
          </p>
        </div>
      )}

      {/* Beta badge - premium styling */}
      {showBadge && (
        <Badge 
          variant="outline" 
          className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors hidden sm:inline-flex" 
          suppressHydrationWarning
        >
          {t('beta', { ns: 'landing' })}
        </Badge>
      )}
    </Link>
  );
}


