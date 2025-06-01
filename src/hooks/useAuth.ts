import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

export const useAuth = (options: { redirectTo?: string; redirectIfFound?: boolean } = {}) => {
  const router = useRouter()
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error,
    login, 
    logout, 
    checkAuth 
  } = useAuthStore()

  useEffect(() => {
    // Check authentication status on mount
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    // Handle redirects based on auth state
    if (!isLoading) {
      if (options.redirectTo && !isAuthenticated) {
        router.push(options.redirectTo)
      } else if (options.redirectIfFound && isAuthenticated) {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, isLoading, router, options])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth
  }
}

// Hook for protecting routes
export const useRequireAuth = () => {
  return useAuth({ redirectTo: '/login' })
}

// Hook for public routes (redirect if authenticated)
export const usePublicRoute = () => {
  return useAuth({ redirectIfFound: true })
} 