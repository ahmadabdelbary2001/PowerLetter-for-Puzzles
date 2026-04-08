"use client";

import { forwardRef } from 'react';
import { useLinkComponent } from '../contexts/LinkContext';
import type { LinkProps } from '../contexts/LinkContext';

/**
 * Universal Link component for the monorepo UI system.
 * Transparently uses the framework-provided Link (Next.js Link or React Router Link)
 * when used inside a LinkProvider.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ to, href, replace, scroll, prefetch, ...props }, ref) => {
  const Component = useLinkComponent();

  // Normalize path between 'to' (React Router) and 'href' (Next.js)
  const target = href || to || '#';

  return (
    <Component
      ref={ref}
      href={target}
      to={target}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch}
      {...props}
    />
  );
});

Link.displayName = 'Link';
