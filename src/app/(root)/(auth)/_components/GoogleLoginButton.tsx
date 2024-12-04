'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { authService } from '../login/_actions'

export const GoogleLoginButton: React.FC = () => {
  const { toast } = useToast()
  const router = useRouter()

  const loginUrl = useMutation({
    mutationFn: authService.getGoogleLoginUrl,
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: error.message || 'Unable to generate login URL',
      })
    },
    onSuccess: (data) => {
      return data
    },
  })

  const handleGoogleLogin = async () => {
    try {
      const url = await loginUrl.mutateAsync()
      window.location.href = url
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: 'Unable to generate login URL',
      })
    }
  }

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={loginUrl.isPending}
      className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      {loginUrl.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Login with Google ...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
            />
            <path
              fill="#34A853"
              d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
            />
            <path
              fill="#4A90E2"
              d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.7272727 L18.4363636,14.7272727 C18.1187732,16.6814551 17.2662994,18.2290984 16.0407269,19.0125889 L19.834192,20.9995801 Z"
            />
            <path
              fill="#FBBC05"
              d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
            />
          </svg>
          Login with Google
        </>
      )}
    </Button>
  )
}

