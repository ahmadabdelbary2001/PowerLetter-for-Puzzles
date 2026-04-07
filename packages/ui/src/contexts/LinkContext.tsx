"use client";

import React, { createContext, useContext, forwardRef } from 'react';

/**
 * Universal Link props that are compatible with both Next.js and React Router
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
}

export type LinkComponent = React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;

const LinkContext = createContext<LinkComponent | undefined>(undefined);

/**
 * A provider to inject a framework-specific Link component.
 */
export const LinkProvider: React.FC<{ component: LinkComponent; children: React.ReactNode }> = ({ component, children }) => (
  <LinkContext.Provider value={component}>{children}</LinkContext.Provider>
);

/**
 * Custom hook to get the configured Link component
 */
export const useLinkComponent = () => {
    return useContext(LinkContext) || DefaultLink;
};

/**
 * Default fallback link component (standard <a> tag)
 */
const DefaultLink = forwardRef<HTMLAnchorElement, LinkProps>(({ to, href, children, ...props }, ref) => {
  return (
    <a ref={ref} href={href || to} {...props}>
      {children}
    </a>
  );
});

DefaultLink.displayName = 'DefaultLink';
