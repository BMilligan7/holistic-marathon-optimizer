'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, LoadingSpinner } from '@/components/ui'
import { useUserStore } from '@/stores/userStore'
import { useRequireAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { OnboardingData } from '@/types'

const TOTAL_STEPS = 8

const steps = [
  { id: 1, title: 'Welcome' },
  { id: 2, title: 'Marathon Goal' },
  { id: 3, title: 'Experience' },
  { id: 4, title: 'Availability' },
  { id: 5, title: 'Fitness Level' },
  { id: 6, title: 'Training Goals' },
  { id: 7, title: 'Constraints' },
  { id: 8, title: 'Review' }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useRequireAuth()
  const { 
    onboardingData, 
    updateOnboarding, 
    submitOnboarding, 
    isLoading,
    error 
  } = useUserStore()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize onboarding data
  useEffect(() => {
    if (isAuthenticated && user && !onboardingData) {
      updateOnboarding({
        currentStep: 1,
        totalSteps: TOTAL_STEPS,
        isComplete: false,
        userId: user.id
      })
    }
  }, [isAuthenticated, user, onboardingData, updateOnboarding])

  // Load saved progress
  useEffect(() => {
    if (onboardingData?.currentStep) {
      setCurrentStep(onboardingData.currentStep)
    }
  }, [onboardingData])

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      updateOnboarding({ currentStep: nextStep })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      updateOnboarding({ currentStep: prevStep })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      updateOnboarding({ isComplete: true })
      await submitOnboarding()
      router.push('/onboarding/report')
    } catch (error) {
      console.error('Onboarding submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100

  if (!isAuthenticated) {
    return null // ProtectedRoute will handle redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Marathon Training Setup
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Step {currentStep} of {TOTAL_STEPS}: {steps[currentStep - 1]?.title}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {Math.round(progressPercentage)}% Complete
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            
            {/* Step Indicators */}
            <div className="mt-6 flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center text-xs",
                    step.id <= currentStep 
                      ? "text-primary" 
                      : "text-gray-400"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2",
                      step.id < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.id === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {step.id < currentStep ? '✓' : step.id}
                  </div>
                  <span className="hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Step Content */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="text-center space-y-6">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Welcome to Marathon Trainer</h2>
                  <p className="mt-4 text-lg text-gray-600">
                    Let's create your personalized marathon training plan. This will take about 5 minutes.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">What we'll cover:</h3>
                  <ul className="mt-2 text-sm text-blue-800 space-y-1">
                    <li>• Your marathon goals and timeline</li>
                    <li>• Running experience and fitness level</li>
                    <li>• Weekly availability and preferences</li>
                    <li>• Training constraints and equipment</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Marathon Goal</h2>
                <p className="text-gray-600">Tell us about your marathon aspirations.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Marathon Date
                    </label>
                    <input 
                      type="date" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Is this your first marathon?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="firstMarathon" value="yes" className="mr-2" />
                        Yes, this is my first marathon
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="firstMarathon" value="no" className="mr-2" />
                        No, I've run marathons before
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Running Experience</h2>
                <p className="text-gray-600">Help us understand your running background.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How many years have you been running?
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="">Select experience level</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-2">1-2 years</option>
                      <option value="2-5">2-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current weekly mileage (km)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 25"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep >= 4 && (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Step {currentStep}</h2>
                <p className="text-gray-600">
                  {steps[currentStep - 1]?.title} content will be implemented here.
                </p>
                <div className="bg-gray-50 p-8 rounded-lg">
                  <p className="text-gray-500">
                    This step is part of the onboarding flow and will collect specific information about your {steps[currentStep - 1]?.title.toLowerCase()}.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex space-x-3">
              {currentStep < TOTAL_STEPS ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating Plan...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {(isLoading || isSubmitting) && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">
                  {isSubmitting ? 'Creating your training plan...' : 'Loading...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 