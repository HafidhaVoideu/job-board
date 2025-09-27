"use client";
import { useIsDarkMode } from "@/hooks/useDarkMode";
import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";

import { dark } from "@clerk/themes";
import { Suspense } from "react";

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const isDarkMode = useIsDarkMode();
  return (
    <Suspense>
      <OriginalClerkProvider
        appearance={isDarkMode ? { baseTheme: [dark] } : undefined}
      >
        {children}
      </OriginalClerkProvider>
    </Suspense>
  );
}
