import type { UserProfile, TrainingPlan, DailyTask, BiometricData } from '@/types'

export const getDemoUserProfile = (): UserProfile => ({
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
  ouraRingConnected: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

export const getDemoTasks = (): DailyTask[] => {
  const today = new Date().toISOString().split('T')[0]
  
  return [
    {
      id: 'task-1',
      userId: 'demo-user-1',
      date: today,
      type: 'daily_steps',
      title: 'Daily Steps Goal',
      description: 'Complete 8,000 steps today',
      targetValue: 8000,
      unit: 'steps',
      isCompleted: true,
      completionMethod: 'biometric',
      completedAt: new Date().toISOString(),
      actualValue: 9250
    },
    {
      id: 'task-2',
      userId: 'demo-user-1',
      date: today,
      type: 'hydration',
      title: 'Hydration',
      description: 'Drink at least 2L of water',
      targetValue: 2000,
      unit: 'ml',
      isCompleted: false
    },
    {
      id: 'task-3',
      userId: 'demo-user-1',
      date: today,
      type: 'sleep_quality',
      title: 'Quality Sleep',
      description: 'Get 7-8 hours of quality sleep',
      targetValue: 75,
      unit: 'score',
      isCompleted: true,
      completionMethod: 'biometric',
      completedAt: new Date().toISOString(),
      actualValue: 82
    }
  ]
}

export const getDemoBiometricData = (): BiometricData => ({
  userId: 'demo-user-1',
  date: new Date().toISOString().split('T')[0],
  source: 'demo',
  steps: 9250,
  activeCalories: 450,
  totalCalories: 2100,
  distance: 6800,
  sleepScore: 82,
  sleepDuration: 465,
  deepSleep: 95,
  remSleep: 120,
  readinessScore: 78,
  hrvScore: 85,
  restingHeartRate: 58,
  timestamp: new Date().toISOString()
}) 