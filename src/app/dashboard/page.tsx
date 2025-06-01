'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, LoadingSpinner } from '@/components/ui'
import { useRequireAuth } from '@/hooks/useAuth'
import { useUserStore } from '@/stores/userStore'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useRequireAuth()
  const { profile, isOnboardingComplete, loadDemoData } = useUserStore()

  useEffect(() => {
    // Redirect to onboarding if not completed
    if (isAuthenticated && !isOnboardingComplete) {
      router.push('/onboarding')
      return
    }

    // Load demo data if in demo mode and no profile exists
    if (isAuthenticated && !profile) {
      loadDemoData()
    }
  }, [isAuthenticated, isOnboardingComplete, profile, loadDemoData, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!isAuthenticated) {
    return null // ProtectedRoute handles auth
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const daysToMarathon = profile.marathonGoal?.targetDate 
    ? Math.ceil((new Date(profile.marathonGoal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Left side - Welcome & Marathon info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'Runner'}! 👋
              </h1>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                <span>Today is {formatDate(new Date())}</span>
                {daysToMarathon && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-primary">
                      {daysToMarathon} days to marathon
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Right side - Quick actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/plan')}
              >
                View Plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Tasks */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
                <span className="text-sm text-gray-500">3 of 3 completed</span>
              </div>
              
              <div className="space-y-3">
                {/* Task 1 - Steps */}
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Daily Steps Goal</h3>
                      <p className="text-sm text-gray-600">9,250 / 8,000 steps</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">Completed</span>
                </div>

                {/* Task 2 - Sleep */}
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Quality Sleep</h3>
                      <p className="text-sm text-gray-600">Sleep score: 82/100</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">Completed</span>
                </div>

                {/* Task 3 - Hydration */}
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Hydration</h3>
                      <p className="text-sm text-gray-600">2.0L / 2.0L water</p>
                    </div>
                  </div>
                  <Button size="sm">Mark Complete</Button>
                </div>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Progress</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4</div>
                  <div className="text-sm text-gray-600">Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">32km</div>
                  <div className="text-sm text-gray-600">Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5:45</div>
                  <div className="text-sm text-gray-600">Avg Pace</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">85%</div>
                  <div className="text-sm text-gray-600">Completion</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Weekly Goal Progress</span>
                  <span>85%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Secondary Content */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push('/plan')}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View Training Plan
                </Button>
                
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat with AI Coach
                </Button>
                
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Progress
                </Button>
              </div>
            </div>

            {/* Training Insights */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Training Insights</h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900">Great Progress!</h3>
                  <p className="text-sm text-blue-800 mt-1">
                    You're ahead of schedule this week. Consider adding a recovery run.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900">Sleep Quality</h3>
                  <p className="text-sm text-green-800 mt-1">
                    Your sleep score has improved 15% this week. Keep it up!
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h3 className="font-medium text-yellow-900">Hydration Reminder</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Don't forget to complete your daily hydration goal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 