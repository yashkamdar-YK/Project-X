'use client'
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../login/_actions';
import {setCookie} from 'cookies-next'

export const GoogleCallbackPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const callbackMutation = useMutation({
    mutationFn: async (params: URLSearchParams) => {
      return authService.handleGoogleCallback(params.toString());
    },
    onSuccess: (data) => {
      toast({
        title: 'Authentication Successful',
      });
      setCookie('token', data.access_token, {
        maxAge: 60 * 60 * 24 * 2, //48 hours
      });
      router.push('/dashboard/my-strategies');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'Unable to complete authentication',
      });
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
