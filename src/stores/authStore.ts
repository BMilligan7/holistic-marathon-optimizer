import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SignJWT, jwtVerify } from 'jose'
import { config } from '@/lib/constants'
import type { AuthState, User, LoginCredentials, AuthToken } from '@/types'

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  refreshToken: () => Promise<void>
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// JWT utilities
const JWT_SECRET = new TextEncoder().encode(config.JWT_SECRET)

const createToken = async (user: User): Promise<AuthToken> => {
  const accessToken = await new SignJWT({ 
    userId: user.id, 
    email: user.email 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(JWT_SECRET)

  const refreshToken = await new SignJWT({ 
    userId: user.id, 
    type: 'refresh' 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)

  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
  }
}

const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          // In demo mode, use mock authentication
          if (config.DEMO_MODE) {
            const mockUser: User = {
              id: 'demo-user-1',
              email: credentials.email,
              name: 'Demo User',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            }
            
            const token = await createToken(mockUser)
            
            // Store token in localStorage for demo
            localStorage.setItem('auth_token', JSON.stringify(token))
            
            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              isLoading: false 
            })
            return
          }

          // Real authentication would happen here
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          })

          if (!response.ok) {
            throw new Error('Authentication failed')
          }

          const { user, token } = await response.json()
          localStorage.setItem('auth_token', JSON.stringify(token))
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          })
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token')
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        })
      },

      checkAuth: async () => {
        set({ isLoading: true })
        
        try {
          const tokenData = localStorage.getItem('auth_token')
          if (!tokenData) {
            set({ isLoading: false })
            return
          }

          const token: AuthToken = JSON.parse(tokenData)
          
          // Check if token is expired
          if (Date.now() > token.expiresAt) {
            await get().refreshToken()
            return
          }

          // Verify token is valid
          const isValid = await verifyToken(token.accessToken)
          if (!isValid) {
            get().logout()
            return
          }

          // Token is valid, restore user session
          // In demo mode, create mock user
          if (config.DEMO_MODE) {
            const mockUser: User = {
              id: 'demo-user-1',
              email: 'demo@example.com',
              name: 'Demo User',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            }
            
            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              isLoading: false 
            })
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          get().logout()
        } finally {
          set({ isLoading: false })
        }
      },

      refreshToken: async () => {
        try {
          const tokenData = localStorage.getItem('auth_token')
          if (!tokenData) {
            get().logout()
            return
          }

          const token: AuthToken = JSON.parse(tokenData)
          
          // In demo mode, just refresh with new expiry
          if (config.DEMO_MODE) {
            const newToken = {
              ...token,
              expiresAt: Date.now() + (60 * 60 * 1000)
            }
            localStorage.setItem('auth_token', JSON.stringify(newToken))
            return
          }

          // Real token refresh would happen here
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: token.refreshToken })
          })

          if (!response.ok) {
            get().logout()
            return
          }

          const newToken = await response.json()
          localStorage.setItem('auth_token', JSON.stringify(newToken))
        } catch (error) {
          console.error('Token refresh failed:', error)
          get().logout()
        }
      },

      setUser: (user: User) => set({ user }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)

// Export individual selectors for optimized re-renders
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error) 