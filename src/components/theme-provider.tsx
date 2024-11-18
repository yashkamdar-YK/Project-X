"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      defaultTheme="light" 
      // forcedTheme="light" // This forces light theme
      enableSystem={false} // Disable system theme
      attribute="class"
      themes={['light', 'dark']}
    >
      {children}
    </NextThemesProvider>
  );
}
