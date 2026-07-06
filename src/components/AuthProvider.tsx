import type { ReactNode } from "react";

import { ClerkProvider } from "@clerk/nextjs";

// Auth is optional: without a publishable key (local dev, the Electron
// shell) the provider is skipped and the app runs unauthenticated.
export function AuthProvider({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
