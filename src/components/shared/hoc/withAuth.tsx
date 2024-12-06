'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { get } from '@/lib/axios-factory'
import { useAuthStore, UserProfile } from '@/lib/store/authStore'

type APIResponse = {
  message: string
  error: boolean
  status: boolean
  data:UserProfile
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter()
    const { user, setUser, isLoading } = useAuthStore()

    // useEffect(() => {
    //   const fetchProfile = async () => {
    //     try {
    //       const response = await get<APIResponse>('/v1/profile')
    //       if (response.data.status) {
    //         setUser(response.data.data)
    //       }
    //     } catch (error) {
    //       router.push('/login')
    //     }
    //   }

    //   if (!user) {
    //     fetchProfile()
    //   }
    // }, [user])

    if (isLoading) {
      return <div>Loading...</div>
    }

    return <WrappedComponent {...props} />
  }
}