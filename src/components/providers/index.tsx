"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "../ui/toaster";
import { ThemeProvider } from "./theme-provider";
import { CSPostHogProvider } from "./posthog-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            // Add retry and refetchOnWindowFocus options
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Add onSettled callback for mutations
            onSettled: () => {
              // Ensure proper cleanup after mutations
              queryClient.resumePausedMutations?.();
            },
          },
        },
      })
  );

  return (
    <CSPostHogProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
      </CSPostHogProvider>
  );
};