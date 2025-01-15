'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { get } from '@/lib/axios-factory'
import { useAuthStore, UserProfile } from '@/lib/store/authStore'
import { authService } from '@/app/(root)/(auth)/login/_actions'
import Spinner from '../spinner'


export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirect=true
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter()
    const { user, setUser, isLoading, setLoading } = useAuthStore()

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          setLoading(true)
          const response = await authService.getProfile()
          if (response.email) {
            setUser(response)
          }
        } catch (error) {
          if(redirect) router.push('/login')
        } finally {
          setLoading(false)
        }
      }

      if (!user) {
        fetchProfile()
      }
    }, [user])

    if (isLoading) {
      return <div className='flex justify-center items-center h-full w-screen flex-col'>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className='text-gray-500 text-center'>
          Just a second
        </p>
      </div>
    }

    return <WrappedComponent {...props} />
  }
}