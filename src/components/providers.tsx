"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "./ui/toaster";
import { usePathname } from "next/navigation";
import { SessionProvider } from 'next-auth/react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  // Create a client
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  const pathname = usePathname();

  return (
    <SessionProvider>
    <QueryClientProvider client={queryClient}>
          <Toaster />
          {children}
    </QueryClientProvider>
    </SessionProvider>
  );
};
