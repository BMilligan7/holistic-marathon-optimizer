import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { config, isDemoMode } from '@/lib/constants'
import type { 
  UserProfile, 
  OnboardingData, 
  MarathonGoal,
  RunningExperience,
  WeeklyAvailability,
  FitnessLevel,
  TrainingGoals,
  TrainingConstraints
} from '@/types'

interface UserStore {
  // State
  profile: UserProfile | null
  onboardingData: OnboardingData | null
  isOnboardingComplete: boolean
  isLoading: boolean
  error: string | null

  // Actions
  updateProfile: (data: Partial<UserProfile>) => void
  updateOnboarding: (data: Partial<OnboardingData>) => void
  submitOnboarding: () => Promise<void>
  completeOnboarding: () => void
  resetOnboarding: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  loadDemoData: () => void
}

// Demo data for fallback
const demoUserProfile: UserProfile = {
  id: 'profile-demo-1',
  userId: 'demo-user-1',
  marathonGoal: {
    targetDate: '2024-10-15',
    targetTime: '4:00:00',
    isFirstMarathon: false,
    previousMarathonTime: '4:30:00'
  },
  experience: {
    yearsRunning: 3,
    longestRun: 25,
    weeklyMileage: 35,
    previousRaces: [
      {
        distance: '10K',
        time: '00:50:00',
        date: '2024-01-15'
      },
      {
        distance: 'half-marathon',
        time: '01:55:00',
        date: '2024-03-20'
      }
    ]
  },
  weeklyAvailability: {
    totalHours: 6,
    daysPerWeek: 4,
    preferredDays: ['monday', 'wednesday', 'friday', 'sunday'],
    timeOfDay: 'morning'
  },
  currentFitness: {
    selfRating: 3,
    currentPace: '5:45',
    recentActivity: 'Regular running 3-4 times per week'
  },
  goals: {
    primary: 'time-goal',
    enjoyment: true,
    'injury-prevention': true,
    socialAspect: false
  },
  constraints: {
    injuries: ['knee sensitivity'],
    equipment: ['running shoes', 'gps watch'],
    location: 'suburban',
    weatherPreferences: ['mild', 'cool']
  },
  ouraRingConnected: isDemoMode(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      onboardingData: null,
      isOnboardingComplete: false,
      isLoading: false,
      error: null,

      // Actions
      updateProfile: (data: Partial<UserProfile>) => {
        const currentProfile = get().profile
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              ...data,
              updatedAt: new Date().toISOString()
            }
          })
        }
      },

      updateOnboarding: (data: Partial<OnboardingData>) => {
        const current = get().onboardingData
        set({
          onboardingData: {
            ...current,
            ...data,
            currentStep: data.currentStep || current?.currentStep || 1,
            totalSteps: data.totalSteps || current?.totalSteps || 8,
            isComplete: data.isComplete || false
          }
        })
      },

      submitOnboarding: async () => {
        const onboardingData = get().onboardingData
        if (!onboardingData || !onboardingData.isComplete) {
          set({ error: 'Onboarding data incomplete' })
          return
        }

        set({ isLoading: true, error: null })

        try {
          if (isDemoMode()) {
            // Demo mode: simulate API call and use demo data
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            set({
              profile: demoUserProfile,
              isOnboardingComplete: true,
              isLoading: false
            })
            return
          }

          // Real API call would happen here
          const response = await fetch('/api/users/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(onboardingData)
          })

          if (!response.ok) {
            throw new Error('Failed to submit onboarding data')
          }

          const profile = await response.json()
          set({
            profile,
            isOnboardingComplete: true,
            isLoading: false
          })

          // Send to n8n for plan generation
          await fetch('/api/webhooks/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              type: 'onboarding_complete',
              data: profile 
            })
          })

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Submission failed',
            isLoading: false
          })
        }
      },

      completeOnboarding: () => {
        set({ isOnboardingComplete: true })
      },

      resetOnboarding: () => {
        set({
          onboardingData: null,
          isOnboardingComplete: false,
          error: null
        })
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),

      loadDemoData: () => {
        if (isDemoMode()) {
          set({
            profile: demoUserProfile,
            isOnboardingComplete: true
          })
        }
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        onboardingData: state.onboardingData,
        isOnboardingComplete: state.isOnboardingComplete
      })
    }
  )
)

// Selectors for optimized re-renders
export const useUserProfile = () => useUserStore((state) => state.profile)
export const useOnboardingData = () => useUserStore((state) => state.onboardingData)
export const useIsOnboardingComplete = () => useUserStore((state) => state.isOnboardingComplete) 