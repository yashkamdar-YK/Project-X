'use client'
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { setCookie } from 'cookies-next';
import { Loader2 } from 'lucide-react';
import { authService } from '../../../login/_actions';

const SparkCallbackPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const sparkCallbackMutation = useMutation({
    mutationFn: async (code: string) => {
      return authService.sparkCallBack(code);
    },
    onSuccess: (data) => {
      toast({
        title: 'Spark Authentication Successful',
      });
      setCookie('token', data.access_token, {
        maxAge: 60 * 60 * 24 * 2, // 48 hours
      });
      const path = sessionStorage.getItem("afterAuthRedirection");
      router.push(path ? path : '/dashboard/my-strategies');
      sessionStorage.removeItem("afterAuthRedirection");
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'Unable to complete Spark authentication',
      });
      router.push('/login');
    }
  });

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      sparkCallbackMutation.mutate(code);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Callback',
        description: 'No authorization code found',
      });
      router.push('/login');
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen flex-col space-y-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Spark Authentication
        </h1>
        
        {sparkCallbackMutation.isPending && (
          <div className="space-y-3">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Processing your Spark authentication...
            </p>
          </div>
        )}

        {sparkCallbackMutation.isError && (
          <div className="mt-4 space-y-4">
            <p className="text-red-600 dark:text-red-400 mb-2">
              Authentication failed. Please try again.
            </p>
            <Button 
              onClick={() => router.push('/login')}
              className="w-full"
              variant="secondary"
            >
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SparkCallbackPage;