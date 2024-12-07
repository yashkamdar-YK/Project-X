'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { get } from '@/lib/axios-factory'
import { useAuthStore, UserProfile } from '@/lib/store/authStore'
import { authService } from '@/app/(root)/(auth)/login/_actions'


export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter()
    const { user, setUser, isLoading } = useAuthStore()

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await authService.getProfile()
          if (response.email) {
            setUser(response)
          }
        } catch (error) {
          router.push('/login')
        }
      }

      if (!user) {
        fetchProfile()
      }
    }, [user])

    if (isLoading) {
      return <div>Loading...</div>
    }

    return <WrappedComponent {...props} />
  }
}