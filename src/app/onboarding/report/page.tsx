'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { useUserStore } from '@/stores/userStore'
import { useRequireAuth } from '@/hooks/useAuth'

export default function OnboardingReportPage() {
  const router = useRouter()
  const { isAuthenticated } = useRequireAuth()
  const { profile, isOnboardingComplete } = useUserStore()

  useEffect(() => {
    // Redirect if onboarding not complete
    if (isAuthenticated && !isOnboardingComplete) {
      router.push('/onboarding')
    }
  }, [isAuthenticated, isOnboardingComplete, router])

  const handleContinue = () => {
    router.push('/dashboard')
  }

  if (!isAuthenticated || !isOnboardingComplete) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Setup Complete!</h1>
            <p className="mt-2 text-lg text-gray-600">
              Your personalized marathon training plan is ready.
            </p>
          </div>

          {/* Training Plan Summary */}
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Your Training Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-blue-800">Marathon Goal</h3>
                  <p className="text-blue-700">
                    {profile?.marathonGoal?.targetDate ? 
                      new Date(profile.marathonGoal.targetDate).toLocaleDateString() : 
                      'Target date set'
                    }
                  </p>
                  {profile?.marathonGoal?.targetTime && (
                    <p className="text-blue-700">Target time: {profile.marathonGoal.targetTime}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Training Schedule</h3>
                  <p className="text-blue-700">
                    {profile?.weeklyAvailability?.daysPerWeek || 4} days per week
                  </p>
                  <p className="text-blue-700">
                    {profile?.weeklyAvailability?.totalHours || 6} hours total
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mr-3">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Review Your Dashboard</h3>
                    <p className="text-gray-600">Check your daily tasks and training schedule.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mr-3">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Connect Your Devices</h3>
                    <p className="text-gray-600">Link your fitness tracker for automatic progress tracking.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mr-3">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Start Training</h3>
                    <p className="text-gray-600">Begin with today's recommended activities.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="h-8 w-8 mx-auto mb-2 text-primary">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Progress Tracking</h3>
                <p className="text-sm text-gray-600">Monitor your daily activities and improvements</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="h-8 w-8 mx-auto mb-2 text-primary">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">AI Coach</h3>
                <p className="text-sm text-gray-600">Get personalized advice and motivation</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="h-8 w-8 mx-auto mb-2 text-primary">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Adaptive Plans</h3>
                <p className="text-sm text-gray-600">Training adjusts based on your progress</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 text-center">
            <Button 
              onClick={handleContinue}
              size="lg"
              className="px-8"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 