import { NotFound } from "@powerletter/ui";

/**
 * Explicit Next.js App Router not-found page.
 *
 * This ensures Next always emits a concrete `_not-found` app entry
 * during build, which helps stabilize trace file generation on Windows.
 */
export default function AppNotFoundPage() {
  return <NotFound />;
}
