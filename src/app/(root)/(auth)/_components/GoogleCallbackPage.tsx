'use client'
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

export const GoogleCallbackPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const callbackMutation = useMutation({
    mutationFn: async (params: URLSearchParams) => {
      // Construct the query string from the search parameters
      const queryString = params.toString();
      
      const response = await fetch(`/api/auth/google/callback?${queryString}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to authenticate');
      }
    },
    onSuccess: (data) => {
      toast({
        title: 'Authentication Successful',
        description: `Welcome, ${data.user.name}!`,
      });
      router.push('/dashboard');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'Unable to complete authentication',
      });
      // router.push('/login');
    }
  });

  // Handle callback on component mount
  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      // Pass all the search params to the mutation
      callbackMutation.mutate(searchParams);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Callback',
        description: 'No authorization code found',
      });
      // router.push('/login');
    }
  }, [searchParams]);

  // Render loading state
  return (
    <div className="flex items-center justify-center min-h-screen flex-col space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        {callbackMutation.isPending && (
          <p className="text-muted-foreground">Processing your Google authentication</p>
        )}

        {callbackMutation.isError && (
          <div className="mt-4">
            <p className="text-destructive mb-2">
              Authentication failed. Please try again.
            </p>
            <Button onClick={() => router.push('/login')}>
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
