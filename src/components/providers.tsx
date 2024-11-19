"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "./ui/toaster";
import { usePathname } from "next/navigation";

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
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
          <Toaster />
          {children}
      </SessionProvider>
    </QueryClientProvider>
  );
};
