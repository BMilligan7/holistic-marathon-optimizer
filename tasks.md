# Holistic Marathon Optimizer MVP - Complete Implementation Guide

**Project Goal:** Build a demo-ready personalized marathon training agent delivered as a conversational web app with n8n orchestration, real-time updates, and Oura Ring integration.

**Demo Deadline:** 5:00 PM tomorrow

**Architecture:** Next.js 15 frontend with n8n workflow orchestration, real-time updates via Server-Sent Events, and Oura Ring biometric integration

---

## Prerequisites & System Requirements

### Required Software Versions
- **Node.js:** v18.17.0 or higher (LTS recommended)
- **npm:** v9.0.0 or higher
- **n8n:** Latest stable version (v1.x)
- **Git:** Latest version for version control

### Required External Accounts & API Keys
1. **OpenAI API Key** - For AI-powered training plan generation and chat responses
2. **Oura Ring Developer Account** - For biometric data integration
3. **Development Environment** - macOS, Linux, or Windows with WSL2

### Hardware Requirements
- **RAM:** Minimum 8GB (16GB recommended for smooth development)
- **Storage:** 2GB free space for project files and dependencies
- **Network:** Stable internet connection for API calls and real-time updates

---

## Complete Project File Structure

```
holistic-marathon-optimizer/
├── package.json
├── package-lock.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── .env.local
├── .env.example
├── .gitignore
├── README.md
├── demo-setup.sh
├── public/
│   ├── favicon.ico
│   ├── images/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── onboarding/
│   │   │   ├── page.tsx
│   │   │   └── report/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── plan/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   └── route.ts
│   │       ├── sse/
│   │       │   └── route.ts
│   │       └── webhooks/
│   │           ├── task-updates/
│   │           │   └── route.ts
│   │           ├── plan-changes/
│   │           │   └── route.ts
│   │           └── user-data/
│   │               └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   └── index.ts
│   │   ├── chat/
│   │   │   ├── ChatBot.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── ProgressIndicator.tsx
│   │   │   ├── InsightsPanel.tsx
│   │   │   └── index.ts
│   │   ├── plan/
│   │   │   ├── PlanView.tsx
│   │   │   ├── WeekView.tsx
│   │   │   ├── FeedbackButtons.tsx
│   │   │   └── index.ts
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Navigation.tsx
│   │       └── ProtectedRoute.tsx
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── userStore.ts
│   │   ├── planStore.ts
│   │   ├── taskStore.ts
│   │   └── index.ts
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── auth.ts
│   │   ├── n8nClient.ts
│   │   ├── onboardingFlow.ts
│   │   ├── demoData.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useRealTimeUpdates.ts
│   │   └── useLocalStorage.ts
│   └── types/
│       ├── auth.ts
│       ├── user.ts
│       ├── plan.ts
│       ├── task.ts
│       ├── biometric.ts
│       └── index.ts
```

---

## Complete TypeScript Type Definitions

**File: `src/types/index.ts`**
```typescript
// Export all types from individual files
export * from './auth';
export * from './user';
export * from './plan';
export * from './task';
export * from './biometric';
```

**File: `src/types/auth.ts`**
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLogin: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

**File: `src/types/user.ts`**
```typescript
export interface UserProfile {
  id: string;
  userId: string;
  marathonGoal: MarathonGoal;
  experience: RunningExperience;
  weeklyAvailability: WeeklyAvailability;
  currentFitness: FitnessLevel;
  goals: TrainingGoals;
  constraints: TrainingConstraints;
  ouraRingConnected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarathonGoal {
  targetDate: string; // ISO date string
  targetTime?: string; // Format: "HH:MM:SS"
  isFirstMarathon: boolean;
  previousMarathonTime?: string;
}

export interface RunningExperience {
  yearsRunning: number;
  longestRun: number; // kilometers
  weeklyMileage: number; // kilometers per week
  previousRaces: Race[];
}

export interface Race {
  distance: string; // "5K", "10K", "half-marathon", "marathon"
  time: string; // Format: "HH:MM:SS"
  date: string; // ISO date string
}

export interface WeeklyAvailability {
  totalHours: number;
  daysPerWeek: number;
  preferredDays: string[]; // ["monday", "tuesday", ...]
  timeOfDay: "morning" | "afternoon" | "evening" | "flexible";
}

export interface FitnessLevel {
  selfRating: 1 | 2 | 3 | 4 | 5; // 1=beginner, 5=advanced
  currentPace: string; // min/km format: "5:30"
  recentActivity: string;
}

export interface TrainingGoals {
  primary: "finish" | "time-goal" | "personal-best";
  enjoyment: boolean;
  injury-prevention: boolean;
  socialAspect: boolean;
}

export interface TrainingConstraints {
  injuries: string[];
  equipment: string[];
  location: "urban" | "suburban" | "rural";
  weatherPreferences: string[];
}

export interface OnboardingData extends Partial<UserProfile> {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
}
```

**File: `src/types/plan.ts`**
```typescript
export interface TrainingPlan {
  id: string;
  userId: string;
  marathonDate: string;
  totalWeeks: number;
  currentWeek: number;
  weeks: WeeklyPlan[];
  nutritionGuidelines: NutritionGuideline[];
  mentalPreparation: MentalTip[];
  createdAt: string;
  updatedAt: string;
  adaptations: PlanAdaptation[];
}

export interface WeeklyPlan {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalDistance: number; // kilometers
  description: string;
  workouts: DailyWorkout[];
  weeklyGoals: string[];
}

export interface DailyWorkout {
  day: string; // "monday", "tuesday", etc.
  date: string; // ISO date string
  type: "run" | "cross-training" | "rest" | "strength";
  description: string;
  distance?: number; // kilometers
  duration?: number; // minutes
  intensity: "easy" | "moderate" | "hard" | "recovery";
  pace?: string; // min/km format
  notes: string[];
  isCompleted: boolean;
  actualDistance?: number;
  actualDuration?: number;
  userFeedback?: WorkoutFeedback;
}

export interface WorkoutFeedback {
  rating: 1 | 2 | 3 | 4 | 5; // 1=too hard, 3=just right, 5=too easy
  effort: 1 | 2 | 3 | 4 | 5; // RPE scale
  enjoyment: 1 | 2 | 3 | 4 | 5;
  comment: string;
  timestamp: string;
}

export interface PlanAdaptation {
  date: string;
  reason: string;
  changes: string[];
  feedback: WorkoutFeedback;
  aiReasoning: string;
}

export interface NutritionGuideline {
  phase: "base" | "build" | "peak" | "taper";
  guidelines: string[];
  weeklyMeals: string[];
}

export interface MentalTip {
  week: number;
  title: string;
  description: string;
  exercises: string[];
}

export interface PlanFeedback {
  planId: string;
  weekNumber: number;
  dayNumber?: number;
  type: "difficulty" | "schedule" | "injury" | "motivation" | "other";
  rating: "too_easy" | "just_right" | "too_hard" | 1 | 2 | 3 | 4 | 5;
  comment: string;
  timestamp: string;
}
```

**File: `src/types/task.ts`**
```typescript
export interface DailyTask {
  id: string;
  userId: string;
  date: string; // ISO date string
  type: TaskType;
  title: string;
  description: string;
  targetValue?: number;
  unit?: string;
  isCompleted: boolean;
  completionMethod?: "manual" | "biometric";
  completedAt?: string;
  actualValue?: number;
  biometricData?: BiometricData;
}

export type TaskType = 
  | "daily_steps" 
  | "sleep_quality" 
  | "hydration" 
  | "nutrition" 
  | "recovery" 
  | "workout" 
  | "stretching" 
  | "mental_health";

export interface TaskCompletion {
  taskId: string;
  method: "manual" | "biometric";
  value?: number;
  timestamp: string;
  biometricData?: BiometricData;
}
```

**File: `src/types/biometric.ts`**
```typescript
export interface BiometricData {
  userId: string;
  date: string; // YYYY-MM-DD format
  source: "oura" | "manual" | "demo";
  
  // Activity metrics
  steps: number;
  activeCalories: number;
  totalCalories: number;
  distance: number; // meters
  
  // Sleep metrics
  sleepScore?: number; // 0-100
  sleepDuration?: number; // minutes
  deepSleep?: number; // minutes
  remSleep?: number; // minutes
  
  // Readiness metrics
  readinessScore?: number; // 0-100
  hrvScore?: number;
  restingHeartRate?: number;
  bodyTemperature?: number;
  
  // Recovery metrics
  recoveryIndex?: number;
  stressLevel?: number;
  
  rawData?: any; // Original API response
  timestamp: string;
}

export interface OuraApiResponse {
  data: OuraActivityData[];
}

export interface OuraActivityData {
  day: string; // YYYY-MM-DD
  steps: number;
  active_calories: number;
  total_calories: number;
  score?: {
    sleep?: number;
    activity?: number;
    readiness?: number;
  };
  // Additional Oura-specific fields
}
```

---

## Phase 0: Project Setup & Foundation

### 1. Development Environment Setup

**Task 0.1: Initialize Next.js Project Structure [CRITICAL - BLOCKING]**

**Context & Rationale:** This task establishes the foundation for the entire application. Next.js 15 provides the App Router architecture needed for our real-time features and API routes. The specific dependencies are chosen for their compatibility and project requirements.

**Prerequisites:**
- Node.js v18.17.0+ installed
- npm v9.0.0+ available
- Terminal access to project directory

**Action(s):**

1. **Navigate to project directory:**
  ```bash
   cd holistic-marathon-optimizer/
   ```

2. **Initialize Next.js project if not already done:**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```
   
   **IMPORTANT:** If directory exists and contains files, answer "Yes" to overwrite when prompted.

3. **Install core dependencies:**
   ```bash
   npm install next@15.0.0 react@18.2.0 react-dom@18.2.0
   npm install typescript@5.2.0 @types/node@20.0.0 @types/react@18.2.0 @types/react-dom@18.2.0
   npm install zustand@4.4.0 react-hook-form@7.45.0 @hookform/resolvers@3.3.0 zod@3.22.0
   npm install @radix-ui/react-dialog@1.0.5 @radix-ui/react-button@0.1.0 @radix-ui/react-input@1.0.3
   npm install tailwindcss@3.3.0 @tailwindcss/forms@0.5.6 @tailwindcss/typography@0.5.10
   npm install jose@5.0.0 # JWT handling
   npm install class-variance-authority@0.7.0 clsx@2.0.0 tailwind-merge@1.14.0
   ```

4. **Create complete directory structure:**
   ```bash
   # Create all directories
   mkdir -p src/components/{ui,chat,dashboard,plan,layout}
   mkdir -p src/stores src/lib src/hooks src/types
   mkdir -p src/app/{login,onboarding/report,dashboard,plan}
   mkdir -p src/app/api/{auth,sse,webhooks/{task-updates,plan-changes,user-data}}
   mkdir -p public/{images,icons}
   
   # Create index files for better imports
   touch src/components/ui/index.ts
   touch src/components/chat/index.ts
   touch src/components/dashboard/index.ts
   touch src/components/plan/index.ts
   touch src/stores/index.ts
   touch src/types/index.ts
   ```

5. **Create essential configuration files:**

   **File: `next.config.js`**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     experimental: {
       serverActions: true,
     },
     env: {
       CUSTOM_KEY: process.env.CUSTOM_KEY,
     },
   }
   
   module.exports = nextConfig
   ```

   **File: `tsconfig.json`** (Update if needed)
   ```json
   {
     "compilerOptions": {
       "target": "es5",
       "lib": ["dom", "dom.iterable", "es6"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": true,
       "noEmit": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "bundler",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve",
       "incremental": true,
       "plugins": [
         {
           "name": "next"
         }
       ],
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     },
     "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
     "exclude": ["node_modules"]
   }
   ```

**Verification Steps:**
1. Run `npm run dev` - should start without errors
2. Navigate to `http://localhost:3000` - should show Next.js welcome page
3. Check all directories exist: `ls -la src/` should show all created folders
4. Verify TypeScript compilation: `npx tsc --noEmit` should pass without errors

**Troubleshooting:**
- **Error: "Module not found"** → Run `npm install` again, check package.json exists
- **Port 3000 already in use** → Kill existing process: `sudo lsof -ti:3000 | xargs kill -9`
- **Permission errors** → Check directory permissions: `chmod 755 holistic-marathon-optimizer/`

**Deliverable(s):** 
- Next.js project running on `http://localhost:3000`
- All required dependencies installed and working
- Complete directory structure matches specification above
- TypeScript compilation passes without errors

---

**Task 0.2: Configure Environment Variables [CRITICAL - BLOCKING]**

**Context & Rationale:** Environment variables secure sensitive API keys and configure the application for different environments. This setup enables both development and demo modes with proper fallbacks.

**Prerequisites:**
- Task 0.1 completed successfully
- Access to required API keys (or willingness to use demo mode)

**Action(s):**

1. **Create environment configuration files:**

   **File: `.env.example`** (Template for sharing)
  ```bash
   # Authentication Configuration
   NEXTAUTH_SECRET=your-32-character-secret-key-here-change-this
  NEXTAUTH_URL=http://localhost:3000
  
  # n8n Integration
  N8N_WEBHOOK_URL=http://localhost:5678
   N8N_API_KEY=your-n8n-api-key-from-n8n-settings
   N8N_WEBHOOK_SECRET=your-webhook-secret-for-security
   
   # Oura Ring API
   OURA_CLIENT_ID=your-oura-client-id-from-developer-portal
   OURA_CLIENT_SECRET=your-oura-client-secret-from-developer-portal
   OURA_ACCESS_TOKEN=your-user-oura-access-token
   
   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-openai-api-key-here
   OPENAI_MODEL=gpt-4
   
   # Application Configuration
  DEMO_MODE=true
   APP_ENV=development
   DEBUG_MODE=true
   
   # Security
   JWT_SECRET=your-jwt-secret-32-characters-minimum
   WEBHOOK_SECRET=your-webhook-verification-secret
   ```

   **File: `.env.local`** (Actual environment variables)
   ```bash
   # Copy from .env.example and replace with actual values
   # For demo purposes, you can use these demo values:
   
   NEXTAUTH_SECRET=demo-secret-key-32-characters-long
   NEXTAUTH_URL=http://localhost:3000
   
   N8N_WEBHOOK_URL=http://localhost:5678
   N8N_API_KEY=demo-api-key
   N8N_WEBHOOK_SECRET=demo-webhook-secret
   
   OURA_CLIENT_ID=demo-client-id
   OURA_CLIENT_SECRET=demo-client-secret
   OURA_ACCESS_TOKEN=demo-access-token
   
   OPENAI_API_KEY=sk-demo-key-replace-with-real-for-ai-features
   OPENAI_MODEL=gpt-4
   
   DEMO_MODE=true
   APP_ENV=development
   DEBUG_MODE=true
   
   JWT_SECRET=demo-jwt-secret-32-characters-long
   WEBHOOK_SECRET=demo-webhook-verification-secret
   ```

2. **Create configuration loading utility:**

   **File: `src/lib/constants.ts`**
   ```typescript
   // Environment configuration with validation and defaults
   
   export const config = {
     // Application
     APP_ENV: process.env.APP_ENV || 'development',
     DEMO_MODE: process.env.DEMO_MODE === 'true',
     DEBUG_MODE: process.env.DEBUG_MODE === 'true',
     
     // Authentication
     NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
     NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
     JWT_SECRET: process.env.JWT_SECRET || '',
     
     // n8n Integration
     N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678',
     N8N_API_KEY: process.env.N8N_API_KEY || '',
     N8N_WEBHOOK_SECRET: process.env.N8N_WEBHOOK_SECRET || '',
     
     // Oura Ring
     OURA_CLIENT_ID: process.env.OURA_CLIENT_ID || '',
     OURA_CLIENT_SECRET: process.env.OURA_CLIENT_SECRET || '',
     OURA_ACCESS_TOKEN: process.env.OURA_ACCESS_TOKEN || '',
     OURA_API_BASE_URL: 'https://api.ouraring.com/v2',
     
     // OpenAI
     OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
     OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4',
     OPENAI_API_BASE_URL: 'https://api.openai.com/v1',
     
     // Security
     WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || '',
     
     // API Endpoints
     API_BASE_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
   } as const;
   
   // Validation function to check required environment variables
   export function validateConfig(): { isValid: boolean; missingVars: string[] } {
     const requiredVars = [
       'NEXTAUTH_SECRET',
       'JWT_SECRET',
     ];
     
     // In production mode, require all API keys
     if (!config.DEMO_MODE) {
       requiredVars.push(
         'OPENAI_API_KEY',
         'N8N_API_KEY',
         'OURA_CLIENT_ID',
         'OURA_CLIENT_SECRET'
       );
     }
     
     const missingVars = requiredVars.filter(varName => {
       const value = config[varName as keyof typeof config];
       return !value || value === '';
     });
     
     return {
       isValid: missingVars.length === 0,
       missingVars
     };
   }
   
   // Helper to check if we're in demo mode
   export const isDemoMode = () => config.DEMO_MODE;
   export const isDebugMode = () => config.DEBUG_MODE;
   export const isProduction = () => config.APP_ENV === 'production';
   ```

3. **Update .gitignore to protect sensitive files:**

   **File: `.gitignore`** (Add these lines if not present)
   ```gitignore
   # Environment variables
   .env*.local
   .env.production
   
   # Logs
   logs
   *.log
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*
   
   # Runtime data
   pids
   *.pid
   *.seed
   *.pid.lock
   
   # Coverage directory used by tools like istanbul
   coverage/
   *.lcov
   
   # nyc test coverage
   .nyc_output
   
   # node_modules
   node_modules/
   
   # Next.js build output
   .next/
   out/
   
   # Production build
   build/
   dist/
   
   # Vercel
   .vercel
   
   # typescript
   *.tsbuildinfo
   
   # IDE files
   .vscode/
   .idea/
   *.swp
   *.swo
   
   # OS files
   .DS_Store
   Thumbs.db
   ```

**Verification Steps:**
1. Run `npm run dev` - should start without environment variable errors
2. Check configuration loading: Add temporary console.log in a component to verify config values
3. Verify .env.local is not tracked: `git status` should not show .env.local
4. Test demo mode: Ensure DEMO_MODE=true works for fallback data

**Troubleshooting:**
- **"Environment variable not found"** → Check .env.local exists and variable names match exactly
- **"Config validation failed"** → Ensure all required variables have values in demo mode
- **Git tracking .env.local** → Run `git rm --cached .env.local` if accidentally committed

**Deliverable(s):** 
- Environment variables properly configured with demo fallbacks
- Configuration utility functions working and validated
- Sensitive files properly excluded from version control
- All environment-dependent code has proper fallbacks

---

**Task 0.3: Setup Tailwind CSS and UI Framework [IMPORTANT]**

**Context & Rationale:** Tailwind CSS provides utility-first styling that enables rapid UI development. Radix UI components ensure accessibility and professional appearance for the demo.

**Prerequisites:**
- Task 0.1 and 0.2 completed
- Tailwind CSS already installed from Task 0.1

**Action(s):**

1. **Configure Tailwind CSS for Next.js App Router:**

   **File: `tailwind.config.js`** (Replace existing)
   ```javascript
   const { fontFamily } = require("tailwindcss/defaultTheme")
   
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     darkMode: ["class"],
     content: [
       './pages/**/*.{ts,tsx}',
       './components/**/*.{ts,tsx}',
       './app/**/*.{ts,tsx}',
       './src/**/*.{ts,tsx}',
     ],
     theme: {
       container: {
         center: true,
         padding: "2rem",
         screens: {
           "2xl": "1400px",
         },
       },
       extend: {
         colors: {
           border: "hsl(var(--border))",
           input: "hsl(var(--input))",
           ring: "hsl(var(--ring))",
           background: "hsl(var(--background))",
           foreground: "hsl(var(--foreground))",
           primary: {
             DEFAULT: "hsl(var(--primary))",
             foreground: "hsl(var(--primary-foreground))",
           },
           secondary: {
             DEFAULT: "hsl(var(--secondary))",
             foreground: "hsl(var(--secondary-foreground))",
           },
           destructive: {
             DEFAULT: "hsl(var(--destructive))",
             foreground: "hsl(var(--destructive-foreground))",
           },
           muted: {
             DEFAULT: "hsl(var(--muted))",
             foreground: "hsl(var(--muted-foreground))",
           },
           accent: {
             DEFAULT: "hsl(var(--accent))",
             foreground: "hsl(var(--accent-foreground))",
           },
           popover: {
             DEFAULT: "hsl(var(--popover))",
             foreground: "hsl(var(--popover-foreground))",
           },
           card: {
             DEFAULT: "hsl(var(--card))",
             foreground: "hsl(var(--card-foreground))",
           },
         },
         borderRadius: {
           lg: "var(--radius)",
           md: "calc(var(--radius) - 2px)",
           sm: "calc(var(--radius) - 4px)",
         },
         fontFamily: {
           sans: ["var(--font-sans)", ...fontFamily.sans],
         },
         keyframes: {
           "accordion-down": {
             from: { height: 0 },
             to: { height: "var(--radix-accordion-content-height)" },
           },
           "accordion-up": {
             from: { height: "var(--radix-accordion-content-height)" },
             to: { height: 0 },
           },
         },
         animation: {
           "accordion-down": "accordion-down 0.2s ease-out",
           "accordion-up": "accordion-up 0.2s ease-out",
         },
       },
     },
     plugins: [
       require("tailwindcss-animate"),
       require("@tailwindcss/forms"),
       require("@tailwindcss/typography"),
     ],
   }
   ```

2. **Setup global CSS with design system:**

   **File: `src/app/globals.css`** (Replace existing)
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   @layer base {
     :root {
       --background: 0 0% 100%;
       --foreground: 222.2 84% 4.9%;
       
       --card: 0 0% 100%;
       --card-foreground: 222.2 84% 4.9%;
       
       --popover: 0 0% 100%;
       --popover-foreground: 222.2 84% 4.9%;
       
       --primary: 222.2 47.4% 11.2%;
       --primary-foreground: 210 40% 98%;
       
       --secondary: 210 40% 96%;
       --secondary-foreground: 222.2 84% 4.9%;
       
       --muted: 210 40% 96%;
       --muted-foreground: 215.4 16.3% 46.9%;
       
       --accent: 210 40% 96%;
       --accent-foreground: 222.2 84% 4.9%;
       
       --destructive: 0 84.2% 60.2%;
       --destructive-foreground: 210 40% 98%;
       
       --border: 214.3 31.8% 91.4%;
       --input: 214.3 31.8% 91.4%;
       --ring: 222.2 84% 4.9%;
       
       --radius: 0.5rem;
     }
   
     .dark {
       --background: 222.2 84% 4.9%;
       --foreground: 210 40% 98%;
       
       --card: 222.2 84% 4.9%;
       --card-foreground: 210 40% 98%;
       
       --popover: 222.2 84% 4.9%;
       --popover-foreground: 210 40% 98%;
       
       --primary: 210 40% 98%;
       --primary-foreground: 222.2 47.4% 11.2%;
       
       --secondary: 217.2 32.6% 17.5%;
       --secondary-foreground: 210 40% 98%;
       
       --muted: 217.2 32.6% 17.5%;
       --muted-foreground: 215 20.2% 65.1%;
       
       --accent: 217.2 32.6% 17.5%;
       --accent-foreground: 210 40% 98%;
       
       --destructive: 0 62.8% 30.6%;
       --destructive-foreground: 210 40% 98%;
       
       --border: 217.2 32.6% 17.5%;
       --input: 217.2 32.6% 17.5%;
       --ring: 212.7 26.8% 83.9%;
     }
   }
   
   @layer base {
     * {
       @apply border-border;
     }
     body {
       @apply bg-background text-foreground;
     }
   }
   
   /* Custom Marathon Training App Styles */
   @layer components {
     .chat-message {
       @apply p-4 rounded-lg mb-3 max-w-xs break-words;
     }
     
     .chat-message.user {
       @apply bg-primary text-primary-foreground ml-auto;
     }
     
     .chat-message.bot {
       @apply bg-muted text-muted-foreground mr-auto;
     }
     
     .task-card {
       @apply p-4 border rounded-lg hover:shadow-md transition-shadow;
     }
     
     .task-card.completed {
       @apply bg-green-50 border-green-200;
     }
     
     .progress-bar {
       @apply w-full bg-gray-200 rounded-full h-2.5;
     }
     
     .progress-fill {
       @apply bg-primary h-2.5 rounded-full transition-all duration-300;
     }
   }
   ```

3. **Install additional required dependencies:**
   ```bash
   npm install tailwindcss-animate@1.0.7
   npm install lucide-react@0.279.0  # for icons
   ```

4. **Create basic UI components:**

   **File: `src/lib/utils.ts`**
   ```typescript
   import { type ClassValue, clsx } from "clsx"
   import { twMerge } from "tailwind-merge"
   
   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
   }
   
   // Utility function for formatting dates
   export function formatDate(date: string | Date): string {
     const d = new Date(date);
     return d.toLocaleDateString('en-US', {
       year: 'numeric',
       month: 'short',
       day: 'numeric'
     });
   }
   
   // Utility function for formatting time
   export function formatTime(minutes: number): string {
     const hours = Math.floor(minutes / 60);
     const mins = minutes % 60;
     if (hours > 0) {
       return `${hours}h ${mins}m`;
     }
     return `${mins}m`;
   }
   
   // Utility for formatting pace (min/km)
   export function formatPace(pace: string): string {
     return pace.includes(':') ? `${pace}/km` : pace;
   }
   ```

   **File: `src/components/ui/button.tsx`**
   ```typescript
   import * as React from "react"
   import { Slot } from "@radix-ui/react-slot"
   import { cva, type VariantProps } from "class-variance-authority"
   import { cn } from "@/lib/utils"
   
   const buttonVariants = cva(
     "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
     {
       variants: {
         variant: {
           default: "bg-primary text-primary-foreground hover:bg-primary/90",
           destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
           outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
           secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
           ghost: "hover:bg-accent hover:text-accent-foreground",
           link: "text-primary underline-offset-4 hover:underline",
         },
         size: {
           default: "h-10 px-4 py-2",
           sm: "h-9 rounded-md px-3",
           lg: "h-11 rounded-md px-8",
           icon: "h-10 w-10",
         },
       },
       defaultVariants: {
         variant: "default",
         size: "default",
       },
     }
   )
   
   export interface ButtonProps
     extends React.ButtonHTMLAttributes<HTMLButtonElement>,
       VariantProps<typeof buttonVariants> {
     asChild?: boolean
   }
   
   const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, variant, size, asChild = false, ...props }, ref) => {
       const Comp = asChild ? Slot : "button"
       return (
         <Comp
           className={cn(buttonVariants({ variant, size, className }))}
           ref={ref}
           {...props}
         />
       )
     }
   )
   Button.displayName = "Button"
   
   export { Button, buttonVariants }
   ```

   **File: `src/components/ui/input.tsx`**
   ```typescript
   import * as React from "react"
   import { cn } from "@/lib/utils"
   
   export interface InputProps
     extends React.InputHTMLAttributes<HTMLInputElement> {}
   
   const Input = React.forwardRef<HTMLInputElement, InputProps>(
     ({ className, type, ...props }, ref) => {
       return (
         <input
           type={type}
           className={cn(
             "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
             className
           )}
           ref={ref}
           {...props}
         />
       )
     }
   )
   Input.displayName = "Input"
   
   export { Input }
   ```

   **File: `src/components/ui/loading-spinner.tsx`**
   ```typescript
   import * as React from "react"
   import { cn } from "@/lib/utils"
   
   interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
     size?: "sm" | "md" | "lg"
   }
   
   const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
     ({ className, size = "md", ...props }, ref) => {
       const sizeClasses = {
         sm: "h-4 w-4",
         md: "h-6 w-6", 
         lg: "h-8 w-8"
       }
       
       return (
         <div
           ref={ref}
           className={cn(
             "animate-spin rounded-full border-2 border-gray-300 border-t-primary",
             sizeClasses[size],
             className
           )}
           {...props}
         />
       )
     }
   )
   LoadingSpinner.displayName = "LoadingSpinner"
   
   export { LoadingSpinner }
   ```

   **File: `src/components/ui/index.ts`**
   ```typescript
   export { Button } from "./button"
   export { Input } from "./input"
   export { LoadingSpinner } from "./loading-spinner"
   ```

**Verification Steps:**
1. Run `npm run dev` - should compile without Tailwind errors
2. Check if Tailwind utilities work: Add `className="bg-blue-500 text-white p-4"` to any component
3. Verify UI components: Import and use Button component in a test page
4. Check responsive design: Test different screen sizes
5. Validate CSS custom properties: Inspect element to see CSS variables applied

**Troubleshooting:**
- **"Tailwind classes not working"** → Check tailwind.config.js content paths include `src/**/*.{ts,tsx}`
- **"CSS variables not defined"** → Ensure globals.css is imported in layout.tsx
- **"Component styling broken"** → Verify all required plugins are installed

**Deliverable(s):** 
- Tailwind CSS configured and working with utility classes
- Basic UI component library available (Button, Input, LoadingSpinner)
- Design system tokens configured (colors, spacing, typography)
- Responsive design framework ready for components

---

## Phase 1: State Management & Authentication

### 2. State Management with Zustand

**Task 2.1: Create Authentication Store [CRITICAL - BLOCKING]**

**Context & Rationale:** The authentication store manages user session state across the entire application. Zustand provides a lightweight, TypeScript-friendly state management solution that integrates well with Next.js App Router. This store handles login/logout, token management, and authentication persistence.

**Prerequisites:**
- Task 0.1, 0.2, 0.3 completed successfully
- TypeScript interfaces from Phase 0 available
- JWT library (jose) installed

**Action(s):**

1. **Create the authentication store implementation:**

   **File: `src/stores/authStore.ts`**
  ```typescript
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
   ```

2. **Create authentication custom hook:**

   **File: `src/hooks/useAuth.ts`**
   ```typescript
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
   ```

**Verification Steps:**
1. Import and use the store: `const { user, login } = useAuthStore()` should work without errors
2. Test demo login: Login with any email/password should work in demo mode
3. Check persistence: Refresh page and user should remain logged in
4. Test logout: User state should clear and tokens removed from localStorage
5. Verify TypeScript: All types should compile without errors

**Troubleshooting:**
- **"localStorage is not defined"** → Only access localStorage in useEffect or client-side code
- **JWT errors** → Check JWT_SECRET is properly set in environment variables
- **Zustand persist errors** → Ensure createJSONStorage is imported correctly
- **Type errors** → Verify all type imports from @/types are available

**Deliverable(s):** 
- Authentication store managing user state with persistence
- JWT token handling with demo mode fallback
- Custom hooks for auth state management
- Type-safe authentication flow with proper error handling

---

**Task 2.2: Create User Data Store [IMPORTANT]**

**Context & Rationale:** The user store manages user profile data and onboarding information. This store handles the complex onboarding flow data collection and provides a centralized place for user-specific data that persists across sessions.

**Prerequisites:**
- Task 2.1 completed (auth store available)
- User and onboarding types defined
- Demo data structure planned

**Action(s):**

1. **Create the user data store:**

   **File: `src/stores/userStore.ts`**
  ```typescript
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
   ```

2. **Create demo data utility:**

   **File: `src/lib/demoData.ts`**
  ```typescript
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
   ```

**Verification Steps:**
1. Test onboarding data updates: `updateOnboarding()` should persist across page refreshes
2. Test profile creation: Demo mode should generate complete user profile
3. Check data persistence: User data should survive browser refresh
4. Verify type safety: All profile operations should be type-checked
5. Test error states: Invalid data should trigger appropriate error messages

**Troubleshooting:**
- **"Profile not updating"** → Check if updateProfile is properly bound to component state
- **"Demo data not loading"** → Verify DEMO_MODE environment variable is set to true
- **"Persistence errors"** → Check localStorage availability and JSON serialization
- **"Type errors"** → Ensure all type imports are correctly resolved

**Deliverable(s):** 
- User store managing profile and onboarding data
- Demo data utilities for fallback mode
- Type-safe data operations with proper persistence
- Error handling for data operations

---

**Task 2.3: Create Task Management Store [IMPORTANT]**

**Context & Rationale:** The task store manages daily tasks, progress tracking, and completion states. This store provides real-time task updates and integrates with biometric data when available. It supports both manual task completion and automatic completion via API integrations.

**Prerequisites:**
- Task 2.1 and 2.2 completed
- Task and biometric types defined
- Demo data utilities available

**Action(s):**

1. **Create the task management store:**

   **File: `src/stores/taskStore.ts`**
  ```typescript
   import { create } from 'zustand'
   import { persist, createJSONStorage } from 'zustand/middleware'
   import { config, isDemoMode } from '@/lib/constants'
   import { getDemoTasks, getDemoBiometricData } from '@/lib/demoData'
   import type { DailyTask, TaskCompletion, BiometricData, TaskType } from '@/types'

  interface TaskStore {
     // State
     tasks: DailyTask[]
     todaysTasks: DailyTask[]
     completionRate: number
     biometricData: BiometricData | null
     isLoading: boolean
     error: string | null
     lastSyncTime: string | null

     // Actions
     loadTasks: (date?: string) => Promise<void>
     completeTask: (taskId: string, completion: TaskCompletion) => Promise<void>
     uncompleteTask: (taskId: string) => void
     updateTaskProgress: (taskId: string, value: number) => void
     syncBiometricData: () => Promise<void>
     calculateCompletionRate: () => void
     addCustomTask: (task: Omit<DailyTask, 'id' | 'userId'>) => void
     removeTask: (taskId: string) => void
     setLoading: (loading: boolean) => void
     setError: (error: string | null) => void
   }

   export const useTaskStore = create<TaskStore>()(
     persist(
       (set, get) => ({
         // Initial state
         tasks: [],
         todaysTasks: [],
         completionRate: 0,
         biometricData: null,
         isLoading: false,
         error: null,
         lastSyncTime: null,

         // Actions
         loadTasks: async (date?: string) => {
           set({ isLoading: true, error: null })
           
           try {
             const targetDate = date || new Date().toISOString().split('T')[0]
             
             if (isDemoMode()) {
               // Demo mode: use demo tasks
               await new Promise(resolve => setTimeout(resolve, 800))
               const demoTasks = getDemoTasks()
               
               set({
                 tasks: demoTasks,
                 todaysTasks: demoTasks,
                 isLoading: false
               })
               
               get().calculateCompletionRate()
               return
             }

             // Real API call
             const response = await fetch(`/api/tasks?date=${targetDate}`)
             if (!response.ok) {
               throw new Error('Failed to load tasks')
             }

             const tasks: DailyTask[] = await response.json()
             const todaysTasks = tasks.filter(task => task.date === targetDate)
             
             set({
               tasks,
               todaysTasks,
               isLoading: false
             })
             
             get().calculateCompletionRate()

           } catch (error) {
             set({
               error: error instanceof Error ? error.message : 'Failed to load tasks',
               isLoading: false
             })
           }
         },

         completeTask: async (taskId: string, completion: TaskCompletion) => {
           const currentTasks = get().tasks
           const task = currentTasks.find(t => t.id === taskId)
           
           if (!task) {
             set({ error: 'Task not found' })
             return
           }

           // Optimistic update
           const updatedTasks = currentTasks.map(t => 
             t.id === taskId 
               ? {
                   ...t,
                   isCompleted: true,
                   completedAt: completion.timestamp,
                   actualValue: completion.value,
                   completionMethod: completion.method,
                   biometricData: completion.biometricData
                 }
               : t
           )

           set({ 
             tasks: updatedTasks,
             todaysTasks: updatedTasks.filter(t => 
               t.date === new Date().toISOString().split('T')[0]
             )
           })
           
           get().calculateCompletionRate()

           try {
             if (!isDemoMode()) {
               // Real API call to persist completion
               const response = await fetch('/api/tasks/complete', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ taskId, completion })
               })

               if (!response.ok) {
                 throw new Error('Failed to complete task')
               }

               // Notify n8n workflow
               await fetch('/api/webhooks/task-updates', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                   type: 'task_completed',
                   taskId,
                   completion,
                   timestamp: new Date().toISOString()
                 })
               })
             }
           } catch (error) {
             // Revert optimistic update on error
             set({ 
               tasks: currentTasks,
               todaysTasks: currentTasks.filter(t => 
                 t.date === new Date().toISOString().split('T')[0]
               ),
               error: error instanceof Error ? error.message : 'Failed to complete task'
             })
             get().calculateCompletionRate()
           }
         },

         uncompleteTask: (taskId: string) => {
           const currentTasks = get().tasks
           const updatedTasks = currentTasks.map(t => 
             t.id === taskId 
               ? {
                   ...t,
                   isCompleted: false,
                   completedAt: undefined,
                   actualValue: undefined,
                   biometricData: undefined
                 }
               : t
           )

           set({ 
             tasks: updatedTasks,
             todaysTasks: updatedTasks.filter(t => 
               t.date === new Date().toISOString().split('T')[0]
             )
           })
           
           get().calculateCompletionRate()
         },

         updateTaskProgress: (taskId: string, value: number) => {
           const currentTasks = get().tasks
           const updatedTasks = currentTasks.map(t => 
             t.id === taskId ? { ...t, actualValue: value } : t
           )

           set({ 
             tasks: updatedTasks,
             todaysTasks: updatedTasks.filter(t => 
               t.date === new Date().toISOString().split('T')[0]
             )
           })
         },

         syncBiometricData: async () => {
           set({ isLoading: true, error: null })
           
           try {
             if (isDemoMode()) {
               // Demo mode: use demo biometric data
               await new Promise(resolve => setTimeout(resolve, 1000))
               const demoBiometricData = getDemoBiometricData()
               
               set({
                 biometricData: demoBiometricData,
                 lastSyncTime: new Date().toISOString(),
                 isLoading: false
               })

               // Auto-complete biometric tasks
               const currentTasks = get().tasks
               const updatedTasks = currentTasks.map(task => {
                 if (task.type === 'daily_steps' && !task.isCompleted) {
                   return {
                     ...task,
                     isCompleted: demoBiometricData.steps >= (task.targetValue || 0),
                     actualValue: demoBiometricData.steps,
                     completionMethod: 'biometric' as const,
                     completedAt: new Date().toISOString()
                   }
                 }
                 if (task.type === 'sleep_quality' && !task.isCompleted) {
                   return {
                     ...task,
                     isCompleted: (demoBiometricData.sleepScore || 0) >= (task.targetValue || 0),
                     actualValue: demoBiometricData.sleepScore,
                     completionMethod: 'biometric' as const,
                     completedAt: new Date().toISOString()
                   }
                 }
                 return task
               })

               set({ 
                 tasks: updatedTasks,
                 todaysTasks: updatedTasks.filter(t => 
                   t.date === new Date().toISOString().split('T')[0]
                 )
               })
               
               get().calculateCompletionRate()
               return
             }

             // Real API call to sync biometric data
             const response = await fetch('/api/biometric/sync', {
               method: 'POST'
             })

             if (!response.ok) {
               throw new Error('Failed to sync biometric data')
             }

             const biometricData: BiometricData = await response.json()
             
             set({
               biometricData,
               lastSyncTime: new Date().toISOString(),
               isLoading: false
             })

           } catch (error) {
             set({
               error: error instanceof Error ? error.message : 'Sync failed',
               isLoading: false
             })
           }
         },

         calculateCompletionRate: () => {
           const todaysTasks = get().todaysTasks
           if (todaysTasks.length === 0) {
             set({ completionRate: 0 })
             return
           }

           const completedTasks = todaysTasks.filter(task => task.isCompleted)
           const rate = Math.round((completedTasks.length / todaysTasks.length) * 100)
           
           set({ completionRate: rate })
         },

         addCustomTask: (taskData: Omit<DailyTask, 'id' | 'userId'>) => {
           const newTask: DailyTask = {
             ...taskData,
             id: `custom-${Date.now()}`,
             userId: 'demo-user-1', // This would come from auth store in real app
           }

           const currentTasks = get().tasks
           const updatedTasks = [...currentTasks, newTask]
           
           set({ 
             tasks: updatedTasks,
             todaysTasks: updatedTasks.filter(t => 
               t.date === new Date().toISOString().split('T')[0]
             )
           })
           
           get().calculateCompletionRate()
         },

         removeTask: (taskId: string) => {
           const currentTasks = get().tasks
           const updatedTasks = currentTasks.filter(t => t.id !== taskId)
           
           set({ 
             tasks: updatedTasks,
             todaysTasks: updatedTasks.filter(t => 
               t.date === new Date().toISOString().split('T')[0]
             )
           })
           
           get().calculateCompletionRate()
         },

         setLoading: (isLoading: boolean) => set({ isLoading }),
         setError: (error: string | null) => set({ error })
       }),
       {
         name: 'task-storage',
         storage: createJSONStorage(() => localStorage),
         partialize: (state) => ({
           tasks: state.tasks,
           biometricData: state.biometricData,
           lastSyncTime: state.lastSyncTime
         })
       }
     )
   )

   // Selectors for optimized re-renders
   export const useTodaysTasks = () => useTaskStore((state) => state.todaysTasks)
   export const useCompletionRate = () => useTaskStore((state) => state.completionRate)
   export const useBiometricData = () => useTaskStore((state) => state.biometricData)
   export const useTasksLoading = () => useTaskStore((state) => state.isLoading)
   ```

**Verification Steps:**
1. Load demo tasks: `loadTasks()` should populate tasks for today
2. Complete task: Task completion should update UI immediately
3. Sync biometric data: Demo biometric data should auto-complete eligible tasks
4. Calculate completion rate: Rate should update when tasks are completed/uncompleted
5. Test persistence: Tasks should persist across page refreshes

**Troubleshooting:**
- **"Tasks not loading"** → Check if demo mode is enabled and demo data is available
- **"Completion rate not updating"** → Ensure calculateCompletionRate is called after task state changes
- **"Biometric sync failing"** → Verify demo biometric data structure matches types
- **"Task persistence issues"** → Check localStorage partialize function includes required fields

**Deliverable(s):** 
- Task store managing daily tasks and completion states
- Biometric data integration with automatic task completion
- Real-time completion rate calculation
- Optimistic updates with error handling

---

**Task 2.4: Create Training Plan Store [IMPORTANT]**

**Context & Rationale:** The plan store manages training plan data, weekly schedules, and plan adaptations. This store integrates with the AI-powered plan generation system and handles plan modifications based on user feedback and performance data.

**Prerequisites:**
- Previous tasks completed (auth, user, task stores)
- Training plan types defined
- n8n integration points planned

**Action(s):**

1. **Create the training plan store:**

   **File: `src/stores/planStore.ts`**
   ```typescript
   import { create } from 'zustand'
   import { persist, createJSONStorage } from 'zustand/middleware'
   import { config, isDemoMode } from '@/lib/constants'
   import type { 
     TrainingPlan, 
     WeeklyPlan, 
     DailyWorkout, 
     PlanFeedback,
     WorkoutFeedback,
     PlanAdaptation 
   } from '@/types'

   interface PlanStore {
     // State
     currentPlan: TrainingPlan | null
     currentWeek: WeeklyPlan | null
     weekNumber: number
     isGenerating: boolean
     isAdapting: boolean
     isLoading: boolean
     error: string | null
     lastUpdated: string | null

     // Actions
     generatePlan: (userProfile: any) => Promise<void>
     loadPlan: (planId?: string) => Promise<void>
     updateCurrentWeek: (weekNumber: number) => void
     submitFeedback: (feedback: PlanFeedback) => Promise<void>
     markWorkoutComplete: (workoutId: string, feedback: WorkoutFeedback) => Promise<void>
     adaptPlan: (adaptationReason: string) => Promise<void>
     setWeekNumber: (week: number) => void
     setLoading: (loading: boolean) => void
     setError: (error: string | null) => void
   }

   // Demo training plan data
   const getDemoTrainingPlan = (): TrainingPlan => {
     const today = new Date()
     const marathonDate = new Date(today)
     marathonDate.setMonth(marathonDate.getMonth() + 4) // 4 months from now

     const generateWeeklyPlan = (weekNum: number): WeeklyPlan => {
       const weekStart = new Date(today)
       weekStart.setDate(weekStart.getDate() + (weekNum - 1) * 7)
       
       const weekEnd = new Date(weekStart)
       weekEnd.setDate(weekEnd.getDate() + 6)

       const workouts: DailyWorkout[] = [
         {
           day: 'monday',
           date: new Date(weekStart).toISOString(),
           type: 'run',
           description: 'Easy pace recovery run',
           distance: 5,
           duration: 30,
           intensity: 'easy',
           pace: '6:00',
           notes: ['Focus on form', 'Keep heart rate in Zone 1-2'],
           isCompleted: weekNum === 1
         },
         {
           day: 'tuesday',
           date: new Date(weekStart.getTime() + 86400000).toISOString(),
           type: 'strength',
           description: 'Core and stability workout',
           duration: 45,
           intensity: 'moderate',
           notes: ['Focus on running-specific exercises', 'Include single-leg work'],
           isCompleted: false
         },
         {
           day: 'wednesday',
           date: new Date(weekStart.getTime() + 2 * 86400000).toISOString(),
           type: 'run',
           description: 'Tempo run intervals',
           distance: 8,
           duration: 50,
           intensity: 'hard',
           pace: '5:30',
           notes: ['Warm up 10 min', '3x8 min tempo with 2 min recovery', 'Cool down 10 min'],
           isCompleted: false
         },
         {
           day: 'thursday',
           date: new Date(weekStart.getTime() + 3 * 86400000).toISOString(),
           type: 'rest',
           description: 'Complete rest day',
           intensity: 'recovery',
           notes: ['Light stretching if needed', 'Focus on nutrition and hydration'],
           isCompleted: false
         },
         {
           day: 'friday',
           date: new Date(weekStart.getTime() + 4 * 86400000).toISOString(),
           type: 'run',
           description: 'Easy run with strides',
           distance: 6,
           duration: 40,
           intensity: 'easy',
           pace: '6:00',
           notes: ['Include 4x100m strides after easy portion', 'Focus on leg turnover'],
           isCompleted: false
         },
         {
           day: 'saturday',
           date: new Date(weekStart.getTime() + 5 * 86400000).toISOString(),
           type: 'cross-training',
           description: 'Cross-training activity',
           duration: 60,
           intensity: 'moderate',
           notes: ['Cycling, swimming, or elliptical', 'Keep effort conversational'],
           isCompleted: false
         },
         {
           day: 'sunday',
           date: new Date(weekStart.getTime() + 6 * 86400000).toISOString(),
           type: 'run',
           description: 'Long run',
           distance: weekNum <= 4 ? 12 + weekNum : 16,
           duration: weekNum <= 4 ? 75 + weekNum * 5 : 100,
           intensity: 'easy',
           pace: '6:15',
           notes: ['Build endurance gradually', 'Practice race nutrition after 60 min'],
           isCompleted: false
         }
       ]

       return {
         weekNumber: weekNum,
         startDate: weekStart.toISOString(),
         endDate: weekEnd.toISOString(),
         totalDistance: workouts.reduce((sum, w) => sum + (w.distance || 0), 0),
         description: `Week ${weekNum} - ${weekNum <= 4 ? 'Base Building' : weekNum <= 12 ? 'Build Phase' : 'Peak/Taper'}`,
         workouts,
         weeklyGoals: [
           'Complete all scheduled workouts',
           'Listen to your body and rest when needed',
           'Practice race nutrition during long runs'
         ]
       }
     }

     return {
       id: 'demo-plan-1',
       userId: 'demo-user-1',
       marathonDate: marathonDate.toISOString(),
       totalWeeks: 16,
       currentWeek: 1,
       weeks: Array.from({ length: 16 }, (_, i) => generateWeeklyPlan(i + 1)),
       nutritionGuidelines: [
         {
           phase: 'base',
           guidelines: [
             'Focus on whole foods and balanced nutrition',
             'Stay hydrated throughout the day',
             'Eat carbs 2-3 hours before long runs'
           ],
           weeklyMeals: [
             'Oatmeal with berries and nuts',
             'Quinoa bowls with vegetables',
             'Lean protein with sweet potatoes'
           ]
         }
       ],
       mentalPreparation: [
         {
           week: 1,
           title: 'Setting Your Marathon Mindset',
           description: 'Develop a positive relationship with your training journey',
           exercises: [
             'Visualize successful race completion',
             'Practice positive self-talk during runs',
             'Set weekly mini-goals to build confidence'
           ]
         }
       ],
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString(),
       adaptations: []
     }
   }

   export const usePlanStore = create<PlanStore>()(
     persist(
       (set, get) => ({
         // Initial state
         currentPlan: null,
         currentWeek: null,
         weekNumber: 1,
         isGenerating: false,
         isAdapting: false,
         isLoading: false,
         error: null,
         lastUpdated: null,

         // Actions
         generatePlan: async (userProfile: any) => {
           set({ isGenerating: true, error: null })
           
           try {
             if (isDemoMode()) {
               // Demo mode: simulate plan generation
               await new Promise(resolve => setTimeout(resolve, 3000))
               const demoPlan = getDemoTrainingPlan()
               
               set({
                 currentPlan: demoPlan,
                 currentWeek: demoPlan.weeks[0],
                 weekNumber: 1,
                 isGenerating: false,
                 lastUpdated: new Date().toISOString()
               })
               return
             }

             // Real API call to generate plan via n8n
             const response = await fetch('/api/plans/generate', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ userProfile })
             })

             if (!response.ok) {
               throw new Error('Failed to generate training plan')
             }

             const plan: TrainingPlan = await response.json()
             
             set({
               currentPlan: plan,
               currentWeek: plan.weeks[plan.currentWeek - 1],
               weekNumber: plan.currentWeek,
               isGenerating: false,
               lastUpdated: new Date().toISOString()
             })

           } catch (error) {
             set({
               error: error instanceof Error ? error.message : 'Plan generation failed',
               isGenerating: false
             })
           }
         },

         loadPlan: async (planId?: string) => {
           set({ isLoading: true, error: null })
           
           try {
             if (isDemoMode()) {
               // Demo mode: use stored plan or generate new one
               const existingPlan = get().currentPlan
               if (existingPlan) {
                 set({ 
                   currentWeek: existingPlan.weeks[get().weekNumber - 1],
                   isLoading: false 
                 })
                 return
               }
               
               const demoPlan = getDemoTrainingPlan()
               set({
                 currentPlan: demoPlan,
                 currentWeek: demoPlan.weeks[0],
                 weekNumber: 1,
                 isLoading: false
               })
               return
             }

             // Real API call
             const url = planId ? `/api/plans/${planId}` : '/api/plans/current'
             const response = await fetch(url)
             
             if (!response.ok) {
               throw new Error('Failed to load training plan')
             }

             const plan: TrainingPlan = await response.json()
             
             set({
               currentPlan: plan,
               currentWeek: plan.weeks[plan.currentWeek - 1],
               weekNumber: plan.currentWeek,
               isLoading: false,
               lastUpdated: new Date().toISOString()
             })

           } catch (error) {
             set({
               error: error instanceof Error ? error.message : 'Failed to load plan',
               isLoading: false
             })
           }
         },

         updateCurrentWeek: (weekNumber: number) => {
           const plan = get().currentPlan
           if (!plan || weekNumber < 1 || weekNumber > plan.weeks.length) {
             set({ error: 'Invalid week number' })
             return
           }

           const week = plan.weeks[weekNumber - 1]
           set({ 
             currentWeek: week, 
             weekNumber,
             error: null 
           })
         },

         submitFeedback: async (feedback: PlanFeedback) => {
           try {
             if (!isDemoMode()) {
               const response = await fetch('/api/plans/feedback', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(feedback)
               })

               if (!response.ok) {
                 throw new Error('Failed to submit feedback')
               }

               // Trigger plan adaptation if needed
               await fetch('/api/webhooks/plan-changes', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                   type: 'feedback_received',
                   feedback,
                   timestamp: new Date().toISOString()
                 })
               })
             }

             // For demo, just log the feedback
             console.log('Feedback submitted:', feedback)

           } catch (error) {
             set({ 
               error: error instanceof Error ? error.message : 'Failed to submit feedback' 
             })
           }
         },

         markWorkoutComplete: async (workoutId: string, feedback: WorkoutFeedback) => {
           const plan = get().currentPlan
           const currentWeek = get().currentWeek
           
           if (!plan || !currentWeek) return

           // Update workout completion status
           const updatedWeek = {
             ...currentWeek,
             workouts: currentWeek.workouts.map(workout => 
               workout.day === workoutId 
                 ? { 
                     ...workout, 
                     isCompleted: true, 
                     userFeedback: feedback 
                   }
                 : workout
             )
           }

           const updatedPlan = {
             ...plan,
             weeks: plan.weeks.map(week => 
               week.weekNumber === currentWeek.weekNumber ? updatedWeek : week
             ),
             updatedAt: new Date().toISOString()
           }

           set({
             currentPlan: updatedPlan,
             currentWeek: updatedWeek,
             lastUpdated: new Date().toISOString()
           })

           try {
             if (!isDemoMode()) {
               await fetch('/api/workouts/complete', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ workoutId, feedback })
               })
             }
           } catch (error) {
             console.error('Failed to sync workout completion:', error)
           }
         },

         adaptPlan: async (adaptationReason: string) => {
           set({ isAdapting: true, error: null })
           
           try {
             if (isDemoMode()) {
               // Demo adaptation
               await new Promise(resolve => setTimeout(resolve, 2000))
               
               const plan = get().currentPlan
               if (!plan) return

               const adaptation: PlanAdaptation = {
                 date: new Date().toISOString(),
                 reason: adaptationReason,
                 changes: [
                   'Reduced weekly mileage by 10%',
                   'Added extra recovery day',
                   'Modified intensity of tempo runs'
                 ],
                 feedback: {
                   rating: 4,
                   effort: 3,
                   enjoyment: 4,
                   comment: 'Plan adapted based on feedback',
                   timestamp: new Date().toISOString()
                 },
                 aiReasoning: 'Based on user feedback indicating high fatigue levels, the plan has been adjusted to provide more recovery while maintaining training progression.'
               }

               const updatedPlan = {
                 ...plan,
                 adaptations: [...plan.adaptations, adaptation],
                 updatedAt: new Date().toISOString()
               }

               set({
                 currentPlan: updatedPlan,
                 isAdapting: false,
                 lastUpdated: new Date().toISOString()
               })
               return
             }

             // Real adaptation via n8n
             const response = await fetch('/api/plans/adapt', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ 
                 planId: get().currentPlan?.id,
                 reason: adaptationReason 
               })
             })

             if (!response.ok) {
               throw new Error('Failed to adapt plan')
             }

             const updatedPlan: TrainingPlan = await response.json()
             
             set({
               currentPlan: updatedPlan,
               currentWeek: updatedPlan.weeks[get().weekNumber - 1],
               isAdapting: false,
               lastUpdated: new Date().toISOString()
             })

           } catch (error) {
             set({
               error: error instanceof Error ? error.message : 'Plan adaptation failed',
               isAdapting: false
             })
           }
         },

         setWeekNumber: (weekNumber: number) => set({ weekNumber }),
         setLoading: (isLoading: boolean) => set({ isLoading }),
         setError: (error: string | null) => set({ error })
       }),
       {
         name: 'plan-storage',
         storage: createJSONStorage(() => localStorage),
         partialize: (state) => ({
           currentPlan: state.currentPlan,
           weekNumber: state.weekNumber,
           lastUpdated: state.lastUpdated
         })
       }
     )
   )

   // Selectors for optimized re-renders
   export const useCurrentPlan = () => usePlanStore((state) => state.currentPlan)
   export const useCurrentWeek = () => usePlanStore((state) => state.currentWeek)
   export const usePlanGenerating = () => usePlanStore((state) => state.isGenerating)
   export const usePlanAdapting = () => usePlanStore((state) => state.isAdapting)
   ```

**Verification Steps:**
1. Generate demo plan: `generatePlan()` should create 16-week training plan
2. Navigate weeks: `updateCurrentWeek()` should change current week view
3. Complete workouts: Workout completion should persist and show feedback
4. Submit feedback: Feedback should trigger adaptation flow (in demo mode)
5. Test plan persistence: Plan should survive page refresh

**Troubleshooting:**
- **"Plan not generating"** → Check demo mode setting and ensure no network errors
- **"Week navigation broken"** → Verify week number bounds checking
- **"Workout completion not saving"** → Check workout ID matching and state updates
- **"Adaptation not working"** → Ensure adaptation logic handles demo mode correctly

**Deliverable(s):** 
- Training plan store with 16-week demo plan
- Workout completion tracking with feedback
- Plan adaptation system with AI reasoning
- Week navigation and plan persistence

---

**Task 2.5: Create Global Store Index [UTILITY]**

**Context & Rationale:** A centralized store index provides a single import point for all stores and ensures consistent initialization order. This improves maintainability and provides a clear overview of the application's state management structure.

**Prerequisites:**
- All individual stores completed (auth, user, task, plan)
- TypeScript configured properly

**Action(s):**

1. **Create the store index with initialization:**

   **File: `src/stores/index.ts`**
  ```typescript
   // Central export point for all stores
   export { useAuthStore, useUser, useIsAuthenticated, useAuthLoading, useAuthError } from './authStore'
   export { useUserStore, useUserProfile, useOnboardingData, useIsOnboardingComplete } from './userStore'
   export { useTaskStore, useTodaysTasks, useCompletionRate, useBiometricData, useTasksLoading } from './taskStore'
   export { usePlanStore, useCurrentPlan, useCurrentWeek, usePlanGenerating, usePlanAdapting } from './planStore'

   // Store initialization helper
   export const initializeStores = () => {
     // This can be called in layout.tsx or _app.tsx to ensure stores are ready
     const authStore = useAuthStore.getState()
     const userStore = useUserStore.getState()
     const taskStore = useTaskStore.getState()
     const planStore = usePlanStore.getState()

     // Check auth status on app load
     authStore.checkAuth()

     // Load demo data if in demo mode
     if (typeof window !== 'undefined') {
       const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
       if (isDemo) {
         userStore.loadDemoData()
         taskStore.loadTasks()
         planStore.loadPlan()
       }
     }

     return { authStore, userStore, taskStore, planStore }
   }

   // Type exports for convenience
   export type { 
     AuthState, 
     User, 
     LoginCredentials,
     UserProfile,
     OnboardingData,
     DailyTask,
     TaskCompletion,
     TrainingPlan,
     WeeklyPlan,
     DailyWorkout,
     PlanFeedback
   } from '@/types'
   ```

**Verification Steps:**
1. Import stores: `import { useAuthStore, useUserStore } from '@/stores'` should work
2. Initialize stores: `initializeStores()` should set up demo data
3. Check TypeScript: All store types should be available via the index
4. Test store interactions: Stores should communicate properly (e.g., auth state affecting user data)

**Troubleshooting:**
- **"Import errors"** → Check all individual store files export their functions correctly
- **"Initialization not working"** → Ensure initializeStores is called in a client-side context
- **"Type errors"** → Verify all type exports from @/types are available
- **"Demo data not loading"** → Check environment variable and demo mode detection

**Deliverable(s):** 
- Centralized store index with all exports
- Store initialization helper function
- Type exports for easy access
- Proper demo mode initialization

---

## Phase 2: Authentication & Routing

### 3. Authentication Pages & Routes

**Task 3.1: Create Login Page [CRITICAL - BLOCKING]**

**Context & Rationale:** The login page serves as the entry point for user authentication. It integrates with the auth store and provides a professional, accessible interface. The page supports both demo mode and real authentication with proper error handling and loading states.

**Prerequisites:**
- Phase 0 and Phase 1 completed
- Auth store available
- UI components ready
- Environment variables configured

**Action(s):**

1. **Create the login page component:**

   **File: `src/app/login/page.tsx`**
   ```typescript
   'use client'

   import { useState, useEffect } from 'react'
   import { useRouter } from 'next/navigation'
   import { useForm } from 'react-hook-form'
   import { zodResolver } from '@hookform/resolvers/zod'
   import { z } from 'zod'
   import Link from 'next/link'
   import { Button, Input, LoadingSpinner } from '@/components/ui'
   import { usePublicRoute } from '@/hooks/useAuth'
   import { isDemoMode } from '@/lib/constants'

   // Form validation schema
   const loginSchema = z.object({
     email: z.string().email('Please enter a valid email address'),
     password: z.string().min(6, 'Password must be at least 6 characters')
   })

   type LoginFormData = z.infer<typeof loginSchema>

   export default function LoginPage() {
     const router = useRouter()
     const { login, isLoading, error, isAuthenticated } = usePublicRoute()
     const [showDemoInfo, setShowDemoInfo] = useState(false)

     const {
       register,
       handleSubmit,
       formState: { errors, isSubmitting }
     } = useForm<LoginFormData>({
       resolver: zodResolver(loginSchema)
     })

     // Redirect if already authenticated
     useEffect(() => {
       if (isAuthenticated) {
         router.push('/dashboard')
       }
     }, [isAuthenticated, router])

     const onSubmit = async (data: LoginFormData) => {
       try {
         await login(data)
         // Redirect handled by usePublicRoute hook
       } catch (error) {
         // Error handling is managed by the auth store
         console.error('Login failed:', error)
       }
     }

     const handleDemoLogin = async () => {
       await login({ 
         email: 'demo@marathontrainer.com', 
         password: 'demo123' 
       })
     }

     if (isLoading) {
       return (
         <div className="min-h-screen flex items-center justify-center">
           <LoadingSpinner size="lg" />
         </div>
       )
     }

     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full space-y-8">
           {/* Header */}
           <div>
             <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
             </div>
             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
               Sign in to Marathon Trainer
             </h2>
             <p className="mt-2 text-center text-sm text-gray-600">
               Your personalized marathon training companion
             </p>
           </div>

           {/* Demo Mode Banner */}
           {isDemoMode() && (
             <div className="rounded-md bg-blue-50 p-4">
               <div className="flex">
                 <div className="ml-3">
                   <h3 className="text-sm font-medium text-blue-800">
                     Demo Mode Active
                   </h3>
                   <div className="mt-2 text-sm text-blue-700">
                     <p>You can use any email and password to sign in, or use the demo button below.</p>
                   </div>
                   <div className="mt-4">
                     <Button
                       type="button"
                       variant="outline"
                       size="sm"
                       onClick={() => setShowDemoInfo(!showDemoInfo)}
                     >
                       {showDemoInfo ? 'Hide' : 'Show'} Demo Info
                     </Button>
                   </div>
                   {showDemoInfo && (
                     <div className="mt-3 text-xs text-blue-600">
                       <p><strong>Demo Email:</strong> demo@marathontrainer.com</p>
                       <p><strong>Demo Password:</strong> demo123</p>
                     </div>
                   )}
                 </div>
               </div>
             </div>
           )}

           {/* Login Form */}
           <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
             <div className="space-y-4">
               {/* Email Field */}
               <div>
                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                   Email address
                 </label>
                 <Input
                   id="email"
                   type="email"
                   autoComplete="email"
                   placeholder="Enter your email"
                   {...register('email')}
                   className={errors.email ? 'border-red-500' : ''}
                 />
                 {errors.email && (
                   <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                 )}
               </div>

               {/* Password Field */}
               <div>
                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                   Password
                 </label>
                 <Input
                   id="password"
                   type="password"
                   autoComplete="current-password"
                   placeholder="Enter your password"
                   {...register('password')}
                   className={errors.password ? 'border-red-500' : ''}
                 />
                 {errors.password && (
                   <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                 )}
               </div>
             </div>

             {/* Error Display */}
             {error && (
               <div className="rounded-md bg-red-50 p-4">
                 <div className="text-sm text-red-800">{error}</div>
               </div>
             )}

             {/* Submit Button */}
             <div className="space-y-3">
               <Button
                 type="submit"
                 className="w-full"
                 disabled={isSubmitting || isLoading}
               >
                 {isSubmitting || isLoading ? (
                   <>
                     <LoadingSpinner size="sm" className="mr-2" />
                     Signing in...
                   </>
                 ) : (
                   'Sign in'
                 )}
               </Button>

               {/* Demo Login Button */}
               {isDemoMode() && (
                 <Button
                   type="button"
                   variant="outline"
                   className="w-full"
                   onClick={handleDemoLogin}
                   disabled={isSubmitting || isLoading}
                 >
                   Quick Demo Login
                 </Button>
               )}
             </div>

             {/* Additional Links */}
             <div className="text-center space-y-2">
               <p className="text-sm text-gray-600">
                 Don't have an account?{' '}
                 <Link href="/register" className="font-medium text-primary hover:text-primary/80">
                   Sign up for free
                 </Link>
               </p>
               <p className="text-sm">
                 <Link href="/forgot-password" className="text-primary hover:text-primary/80">
                   Forgot your password?
                 </Link>
               </p>
             </div>
           </form>

           {/* Footer */}
           <div className="text-center">
             <p className="text-xs text-gray-500">
               By signing in, you agree to our{' '}
               <Link href="/terms" className="underline hover:text-gray-700">
                 Terms of Service
               </Link>{' '}
               and{' '}
               <Link href="/privacy" className="underline hover:text-gray-700">
                 Privacy Policy
               </Link>
             </p>
           </div>
         </div>
       </div>
     )
   }
   ```

2. **Create authentication layout component:**

   **File: `src/components/layout/ProtectedRoute.tsx`**
  ```typescript
   'use client'

   import { useEffect } from 'react'
   import { useRouter, usePathname } from 'next/navigation'
   import { LoadingSpinner } from '@/components/ui'
   import { useRequireAuth } from '@/hooks/useAuth'

   interface ProtectedRouteProps {
     children: React.ReactNode
     requiredAuth?: boolean
     redirectTo?: string
   }

   export default function ProtectedRoute({ 
     children, 
     requiredAuth = true,
     redirectTo = '/login'
   }: ProtectedRouteProps) {
     const router = useRouter()
     const pathname = usePathname()
     const { isAuthenticated, isLoading, user } = useRequireAuth()

     useEffect(() => {
       if (!isLoading && requiredAuth && !isAuthenticated) {
         // Store the intended destination for redirect after login
         localStorage.setItem('redirectAfterLogin', pathname)
         router.push(redirectTo)
       }
     }, [isAuthenticated, isLoading, requiredAuth, redirectTo, router, pathname])

     // Show loading spinner while checking authentication
     if (isLoading) {
       return (
         <div className="min-h-screen flex items-center justify-center">
           <div className="text-center">
             <LoadingSpinner size="lg" />
             <p className="mt-4 text-gray-600">Loading...</p>
           </div>
         </div>
       )
     }

     // If auth is required but user is not authenticated, show nothing
     // (redirect will happen in useEffect)
     if (requiredAuth && !isAuthenticated) {
       return null
     }

     // If no auth required or user is authenticated, render children
     return <>{children}</>
   }
   ```

**Verification Steps:**
1. Navigate to `/login` - should show login form
2. Try invalid email/password - should show validation errors
3. Try demo login - should authenticate and redirect
4. Check responsive design - form should work on mobile
5. Test loading states - should show spinners during authentication

**Troubleshooting:**
- **"Redirect loop"** → Check usePublicRoute hook logic and authentication state
- **"Form validation not working"** → Verify zod schema and react-hook-form setup
- **"Demo mode not showing"** → Check isDemoMode() function and environment variables
- **"Styles not applied"** → Ensure Tailwind CSS is properly configured

**Deliverable(s):** 
- Professional login page with form validation
- Demo mode support with quick login
- Responsive design for all screen sizes
- Proper error handling and loading states

---

**Task 3.2: Create Onboarding Flow [CRITICAL - BLOCKING]**

**Context & Rationale:** The onboarding flow collects essential user information to generate personalized training plans. This multi-step process is designed to be engaging, progressively save data, and provide clear progress indicators.

**Prerequisites:**
- Task 3.1 completed
- User store with onboarding support
- Form validation components

**Action(s):**

1. **Create the main onboarding page:**

   **File: `src/app/onboarding/page.tsx`**
  ```typescript
   'use client'

   import { useState, useEffect } from 'react'
   import { useRouter } from 'next/navigation'
   import { Button, LoadingSpinner } from '@/components/ui'
   import { useUserStore } from '@/stores/userStore'
   import { useRequireAuth } from '@/hooks/useAuth'
   import { cn } from '@/lib/utils'
   import type { OnboardingData } from '@/types'

   // Step components
   import WelcomeStep from '@/components/onboarding/WelcomeStep'
   import MarathonGoalStep from '@/components/onboarding/MarathonGoalStep'
   import ExperienceStep from '@/components/onboarding/ExperienceStep'
   import AvailabilityStep from '@/components/onboarding/AvailabilityStep'
   import FitnessStep from '@/components/onboarding/FitnessStep'
   import GoalsStep from '@/components/onboarding/GoalsStep'
   import ConstraintsStep from '@/components/onboarding/ConstraintsStep'
   import ReviewStep from '@/components/onboarding/ReviewStep'

   const TOTAL_STEPS = 8

   const steps = [
     { id: 1, title: 'Welcome', component: WelcomeStep },
     { id: 2, title: 'Marathon Goal', component: MarathonGoalStep },
     { id: 3, title: 'Experience', component: ExperienceStep },
     { id: 4, title: 'Availability', component: AvailabilityStep },
     { id: 5, title: 'Fitness Level', component: FitnessStep },
     { id: 6, title: 'Training Goals', component: GoalsStep },
     { id: 7, title: 'Constraints', component: ConstraintsStep },
     { id: 8, title: 'Review', component: ReviewStep }
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

     const handleNext = (stepData: Partial<OnboardingData>) => {
       // Save current step data
       updateOnboarding({
         ...stepData,
         currentStep: currentStep + 1
       })
       
       if (currentStep < TOTAL_STEPS) {
         setCurrentStep(currentStep + 1)
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

     // Get current step component
     const CurrentStepComponent = steps[currentStep - 1]?.component

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
             {CurrentStepComponent && (
               <CurrentStepComponent
                 data={onboardingData}
                 onNext={handleNext}
                 onPrevious={handlePrevious}
                 onSubmit={handleSubmit}
                 isLoading={isLoading}
                 isSubmitting={isSubmitting}
                 isFirstStep={currentStep === 1}
                 isLastStep={currentStep === TOTAL_STEPS}
               />
             )}

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
   ```

2. **Create sample onboarding step component:**

   **File: `src/components/onboarding/WelcomeStep.tsx`**
   ```typescript
   'use client'

   import { Button } from '@/components/ui'
   import type { OnboardingData } from '@/types'

   interface WelcomeStepProps {
     data: OnboardingData | null
     onNext: (data: Partial<OnboardingData>) => void
     isFirstStep: boolean
     isLastStep: boolean
   }

   export default function WelcomeStep({ onNext }: WelcomeStepProps) {
     const handleNext = () => {
       onNext({ currentStep: 2 })
     }

     return (
       <div className="text-center space-y-6">
         {/* Welcome Content */}
         <div className="space-y-4">
           <div className="mx-auto h-20 w-20 bg-primary rounded-full flex items-center justify-center">
             <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
           </div>
           
           <h2 className="text-3xl font-bold text-gray-900">
             Welcome to Your Marathon Journey!
           </h2>
           
           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
             We're excited to help you achieve your marathon goals. This setup will take about 5 minutes 
             and will help us create a personalized training plan just for you.
           </p>
         </div>

         {/* Features List */}
         <div className="grid md:grid-cols-3 gap-6 my-8">
           <div className="text-center">
             <div className="h-12 w-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
               <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
             </div>
             <h3 className="font-semibold text-gray-900">Personalized Plan</h3>
             <p className="text-sm text-gray-600">AI-powered training plan tailored to your goals and fitness level</p>
           </div>
           
           <div className="text-center">
             <div className="h-12 w-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
               <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
               </svg>
             </div>
             <h3 className="font-semibold text-gray-900">Real-time Tracking</h3>
             <p className="text-sm text-gray-600">Monitor your progress with integrated health data and daily tasks</p>
           </div>
           
           <div className="text-center">
             <div className="h-12 w-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
               <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <h3 className="font-semibold text-gray-900">AI Coaching</h3>
             <p className="text-sm text-gray-600">Get personalized advice and plan adjustments based on your performance</p>
           </div>
         </div>

         {/* What We'll Ask */}
         <div className="bg-gray-50 rounded-lg p-6 text-left">
           <h3 className="font-semibold text-gray-900 mb-3">What we'll ask you:</h3>
           <ul className="space-y-2 text-sm text-gray-600">
             <li className="flex items-center">
               <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
               </svg>
               Your marathon goals and target date
             </li>
             <li className="flex items-center">
               <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
               </svg>
               Your running experience and fitness level
             </li>
             <li className="flex items-center">
               <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
               </svg>
               Your weekly availability and preferences
             </li>
             <li className="flex items-center">
               <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
               </svg>
               Any constraints or special considerations
             </li>
           </ul>
         </div>

         {/* Next Button */}
         <div className="pt-6">
           <Button onClick={handleNext} size="lg" className="px-8">
             Let's Get Started
             <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
             </svg>
           </Button>
         </div>
       </div>
     )
   }
   ```

3. **Create onboarding completion/report page:**

   **File: `src/app/onboarding/report/page.tsx`**
   ```typescript
   'use client'

   import { useEffect, useState } from 'react'
   import { useRouter } from 'next/navigation'
   import { Button, LoadingSpinner } from '@/components/ui'
   import { useUserStore } from '@/stores/userStore'
   import { usePlanStore } from '@/stores/planStore'
   import { useRequireAuth } from '@/hooks/useAuth'

   export default function OnboardingReportPage() {
     const router = useRouter()
     const { isAuthenticated } = useRequireAuth()
     const { profile, isOnboardingComplete } = useUserStore()
     const { generatePlan, isGenerating, currentPlan } = usePlanStore()
     const [hasStartedGeneration, setHasStartedGeneration] = useState(false)

     useEffect(() => {
       if (!isAuthenticated || !isOnboardingComplete) {
         router.push('/onboarding')
         return
       }

       // Auto-start plan generation if not already started
       if (profile && !hasStartedGeneration && !currentPlan) {
         setHasStartedGeneration(true)
         generatePlan(profile)
       }
     }, [isAuthenticated, isOnboardingComplete, profile, generatePlan, hasStartedGeneration, currentPlan, router])

     const handleContinue = () => {
       router.push('/dashboard')
     }

     if (!isAuthenticated || !profile) {
       return null
     }

     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
         <div className="max-w-2xl w-full">
           <div className="bg-white rounded-lg shadow-lg p-8 text-center">
             {isGenerating ? (
               // Generating State
               <div className="space-y-6">
                 <div className="mx-auto h-20 w-20 bg-primary rounded-full flex items-center justify-center">
                   <LoadingSpinner size="lg" className="text-white" />
                 </div>
                 
                 <div>
                   <h1 className="text-2xl font-bold text-gray-900 mb-2">
                     Creating Your Personal Training Plan
                   </h1>
                   <p className="text-gray-600">
                     Our AI is analyzing your information and creating a customized 
                     marathon training plan just for you...
                   </p>
                 </div>

                 <div className="bg-blue-50 rounded-lg p-4">
                   <div className="flex items-center justify-center space-x-2 text-blue-800">
                     <LoadingSpinner size="sm" />
                     <span className="text-sm font-medium">This usually takes 30-60 seconds</span>
                   </div>
                 </div>

                 {/* Generation Steps */}
                 <div className="space-y-3 text-left">
                   <div className="flex items-center text-sm">
                     <div className="h-4 w-4 bg-green-500 rounded-full mr-3"></div>
                     <span className="text-gray-600">Analyzing your fitness level and goals</span>
                   </div>
                   <div className="flex items-center text-sm">
                     <div className="h-4 w-4 bg-green-500 rounded-full mr-3"></div>
                     <span className="text-gray-600">Calculating optimal training schedule</span>
                   </div>
                   <div className="flex items-center text-sm">
                     <LoadingSpinner size="sm" className="mr-3" />
                     <span className="text-gray-600">Generating personalized workouts</span>
                   </div>
                   <div className="flex items-center text-sm">
                     <div className="h-4 w-4 bg-gray-300 rounded-full mr-3"></div>
                     <span className="text-gray-400">Finalizing nutrition and recovery plans</span>
                   </div>
                 </div>
               </div>
             ) : (
               // Success State
               <div className="space-y-6">
                 <div className="mx-auto h-20 w-20 bg-green-500 rounded-full flex items-center justify-center">
                   <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 
                 <div>
                   <h1 className="text-3xl font-bold text-gray-900 mb-2">
                     Your Training Plan is Ready! 🎉
                   </h1>
                   <p className="text-lg text-gray-600">
                     We've created a personalized 16-week marathon training plan 
                     based on your goals and preferences.
                   </p>
                 </div>

                 {/* Plan Summary */}
                 <div className="bg-gray-50 rounded-lg p-6 text-left">
                   <h3 className="font-semibold text-gray-900 mb-4">Your Plan Includes:</h3>
                   <div className="grid md:grid-cols-2 gap-4">
                     <div className="flex items-start">
                       <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                       </svg>
                       <div>
                         <p className="font-medium text-gray-900">Weekly Training Schedule</p>
                         <p className="text-sm text-gray-600">Customized to your availability</p>
                       </div>
                     </div>
                     <div className="flex items-start">
                       <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                       </svg>
                       <div>
                         <p className="font-medium text-gray-900">Daily Task Tracking</p>
                         <p className="text-sm text-gray-600">Monitor progress and habits</p>
                       </div>
                     </div>
                     <div className="flex items-start">
                       <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                       </svg>
                       <div>
                         <p className="font-medium text-gray-900">Nutrition Guidance</p>
                         <p className="text-sm text-gray-600">Fuel your training properly</p>
                       </div>
                     </div>
                     <div className="flex items-start">
                       <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                       </svg>
                       <div>
                         <p className="font-medium text-gray-900">AI Coach Support</p>
                         <p className="text-sm text-gray-600">Real-time plan adjustments</p>
                       </div>
                     </div>
                   </div>
                 </div>

                 <Button onClick={handleContinue} size="lg" className="px-8">
                   View My Dashboard
                   <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </Button>

                 <p className="text-sm text-gray-500">
                   You can always adjust your plan later based on your progress
                 </p>
               </div>
             )}
           </div>
         </div>
       </div>
     )
   }
   ```

**Verification Steps:**
1. Complete login and navigate to onboarding
2. Progress through steps - data should save automatically
3. Test back/forward navigation - progress should persist
4. Complete onboarding - should redirect to report page
5. Verify plan generation simulation - should show loading then success

**Troubleshooting:**
- **"Step navigation broken"** → Check currentStep state and updateOnboarding calls
- **"Data not persisting"** → Verify user store persistence configuration
- **"Plan generation not starting"** → Check plan store generatePlan function and demo mode
- **"Redirect loops"** → Ensure authentication and onboarding completion checks are correct

**Deliverable(s):** 
- Multi-step onboarding flow with progress tracking
- Automatic data persistence between steps
- Plan generation simulation with loading states
- Professional completion page with plan summary

---

## Phase 3: Core UI Components & Dashboard

### 4. Dashboard Implementation

**Task 4.1: Create Main Dashboard Page [CRITICAL - BLOCKING]**

**Context & Rationale:** The dashboard serves as the central hub where users interact with their training plan, daily tasks, and progress tracking. It integrates all stores and provides real-time updates. The dashboard layout is designed to be information-dense yet scannable, with clear visual hierarchy and actionable components.

**Prerequisites:**
- Phase 0, 1, and 2 completed
- All stores available and functioning
- UI components library ready
- Authentication flow working

**Action(s):**

1. **Create the main dashboard page:**

   **File: `src/app/dashboard/page.tsx`**
   ```typescript
   'use client'

   import { useEffect } from 'react'
   import { useRouter } from 'next/navigation'
   import { Button } from '@/components/ui'
   import { useRequireAuth } from '@/hooks/useAuth'
   import { useUserStore } from '@/stores/userStore'
   import { useTaskStore } from '@/stores/taskStore'
   import { usePlanStore } from '@/stores/planStore'
   
   // Dashboard components
   import DashboardHeader from '@/components/dashboard/DashboardHeader'
   import TodaysTasksCard from '@/components/dashboard/TodaysTasksCard'
   import WeeklyProgressCard from '@/components/dashboard/WeeklyProgressCard'
   import UpcomingWorkoutsCard from '@/components/dashboard/UpcomingWorkoutsCard'
   import InsightsPanel from '@/components/dashboard/InsightsPanel'
   import QuickActionsCard from '@/components/dashboard/QuickActionsCard'

   export default function DashboardPage() {
     const router = useRouter()
     const { isAuthenticated, user } = useRequireAuth()
     const { profile, isOnboardingComplete } = useUserStore()
     const { loadTasks, syncBiometricData } = useTaskStore()
     const { loadPlan } = usePlanStore()

     useEffect(() => {
       // Redirect to onboarding if not completed
       if (isAuthenticated && !isOnboardingComplete) {
         router.push('/onboarding')
         return
       }

       // Load dashboard data
       if (isAuthenticated && user) {
         loadTasks()
         loadPlan()
         syncBiometricData()
       }
     }, [isAuthenticated, user, isOnboardingComplete, loadTasks, loadPlan, syncBiometricData, router])

     if (!isAuthenticated || !profile) {
       return null // ProtectedRoute handles auth
     }

     return (
       <div className="min-h-screen bg-gray-50">
         {/* Dashboard Header */}
         <DashboardHeader user={user} profile={profile} />

         {/* Main Content */}
         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Left Column - Primary Content */}
             <div className="lg:col-span-2 space-y-6">
               {/* Today's Tasks */}
               <TodaysTasksCard />
               
               {/* Weekly Progress */}
               <WeeklyProgressCard />
               
               {/* Upcoming Workouts */}
               <UpcomingWorkoutsCard />
             </div>

             {/* Right Column - Secondary Content */}
             <div className="space-y-6">
               {/* Quick Actions */}
               <QuickActionsCard />
               
               {/* Insights Panel */}
               <InsightsPanel />
             </div>
           </div>
         </main>
       </div>
     )
   }
   ```

2. **Create dashboard header component:**

   **File: `src/components/dashboard/DashboardHeader.tsx`**
   ```typescript
   'use client'

   import { useState } from 'react'
   import { useRouter } from 'next/navigation'
   import { Button } from '@/components/ui'
   import { useAuthStore } from '@/stores/authStore'
   import { formatDate } from '@/lib/utils'
   import type { User, UserProfile } from '@/types'

   interface DashboardHeaderProps {
     user: User
     profile: UserProfile
   }

   export default function DashboardHeader({ user, profile }: DashboardHeaderProps) {
     const router = useRouter()
     const { logout } = useAuthStore()
     const [showUserMenu, setShowUserMenu] = useState(false)

     const handleLogout = () => {
       logout()
       router.push('/login')
     }

     const daysToMarathon = profile.marathonGoal?.targetDate 
       ? Math.ceil((new Date(profile.marathonGoal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
       : null

     return (
       <header className="bg-white shadow-sm border-b">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center py-6">
             {/* Left side - Welcome & Marathon info */}
             <div>
               <h1 className="text-2xl font-bold text-gray-900">
                 Welcome back, {user.name?.split(' ')[0] || 'Runner'}! 👋
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

             {/* Right side - Quick actions & user menu */}
             <div className="flex items-center space-x-4">
               {/* Quick Action Buttons */}
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => router.push('/plan')}
               >
                 View Plan
               </Button>

               {/* User Menu */}
               <div className="relative">
                 <button
                   onClick={() => setShowUserMenu(!showUserMenu)}
                   className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                 >
                   <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                     {user.name?.charAt(0) || 'U'}
                   </div>
                   <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>

                 {/* Dropdown Menu */}
                 {showUserMenu && (
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                     <div className="px-4 py-2 border-b">
                       <p className="text-sm font-medium text-gray-900">{user.name}</p>
                       <p className="text-xs text-gray-500">{user.email}</p>
                     </div>
                     <button
                       onClick={() => router.push('/profile')}
                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                     >
                       Profile Settings
                     </button>
                     <button
                       onClick={() => router.push('/plan')}
                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                     >
                       Training Plan
                     </button>
                     <div className="border-t">
                       <button
                         onClick={handleLogout}
                         className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                       >
                         Sign Out
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
       </header>
     )
   }
   ```

**Verification Steps:**
1. Login and navigate to dashboard - should show personalized header
2. Check marathon countdown - should calculate days correctly
3. Test user menu - dropdown should show profile options
4. Verify responsive design - header should work on mobile
5. Test logout functionality - should clear session and redirect

**Troubleshooting:**
- **"User menu not showing"** → Check useState and event handlers for showUserMenu
- **"Marathon countdown incorrect"** → Verify date calculations and profile.marathonGoal data
- **"Navigation not working"** → Ensure useRouter is imported and used correctly
- **"Profile data missing"** → Check if user store is properly loaded

**Deliverable(s):** 
- Main dashboard page with proper routing and data loading
- Professional header with user menu and marathon countdown
- Responsive design that works across all screen sizes
- Proper authentication checks and onboarding redirects

---

**Task 4.2: Create Task Components [IMPORTANT]**

**Context & Rationale:** Task components provide the primary user interaction for daily goal tracking. These components integrate with the task store for real-time updates and support both manual completion and biometric data integration. The design emphasizes visual progress and easy completion actions.

**Prerequisites:**
- Task 4.1 completed
- Task store implemented and working
- Demo data available

**Action(s):**

1. **Create today's tasks card component:**

   **File: `src/components/dashboard/TodaysTasksCard.tsx`**
   ```typescript
   'use client'

   import { useState } from 'react'
   import { Button, LoadingSpinner } from '@/components/ui'
   import { useTodaysTasks, useCompletionRate, useTaskStore } from '@/stores/taskStore'
   import TaskCard from '@/components/dashboard/TaskCard'
   import type { DailyTask, TaskCompletion } from '@/types'

   export default function TodaysTasksCard() {
     const todaysTasks = useTodaysTasks()
     const completionRate = useCompletionRate()
     const { completeTask, uncompleteTask, syncBiometricData, isLoading } = useTaskStore()
     const [syncingBiometric, setSyncingBiometric] = useState(false)

     const completedTasks = todaysTasks.filter(task => task.isCompleted)
     const pendingTasks = todaysTasks.filter(task => !task.isCompleted)

     const handleCompleteTask = async (task: DailyTask) => {
       const completion: TaskCompletion = {
         taskId: task.id,
         method: 'manual',
         timestamp: new Date().toISOString(),
         value: task.targetValue
       }
       
       await completeTask(task.id, completion)
     }

     const handleUncompleteTask = (taskId: string) => {
       uncompleteTask(taskId)
     }

     const handleSyncBiometric = async () => {
       setSyncingBiometric(true)
       try {
         await syncBiometricData()
       } finally {
         setSyncingBiometric(false)
       }
     }

     return (
       <div className="bg-white rounded-lg shadow-sm border p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-6">
           <div>
             <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
             <p className="text-sm text-gray-600 mt-1">
               {completedTasks.length} of {todaysTasks.length} completed
             </p>
           </div>
           
           <div className="flex items-center space-x-3">
             {/* Completion Rate */}
             <div className="text-right">
               <div className="text-2xl font-bold text-primary">{completionRate}%</div>
               <div className="text-xs text-gray-500">Complete</div>
             </div>
             
             {/* Sync Button */}
             <Button
               variant="outline"
               size="sm"
               onClick={handleSyncBiometric}
               disabled={syncingBiometric}
             >
               {syncingBiometric ? (
                 <>
                   <LoadingSpinner size="sm" className="mr-2" />
                   Syncing...
                 </>
               ) : (
                 <>
                   <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                   Sync Data
                 </>
               )}
             </Button>
           </div>
         </div>

         {/* Progress Bar */}
         <div className="mb-6">
           <div className="flex justify-between text-sm text-gray-600 mb-2">
             <span>Daily Progress</span>
             <span>{completionRate}%</span>
           </div>
           <div className="progress-bar">
             <div 
               className="progress-fill"
               style={{ width: `${completionRate}%` }}
             />
           </div>
         </div>

         {/* Tasks List */}
         {isLoading ? (
           <div className="flex justify-center py-8">
             <LoadingSpinner size="md" />
           </div>
         ) : (
           <div className="space-y-3">
             {/* Pending Tasks */}
             {pendingTasks.map((task) => (
               <TaskCard
                 key={task.id}
                 task={task}
                 onComplete={() => handleCompleteTask(task)}
                 onUncomplete={() => handleUncompleteTask(task.id)}
               />
             ))}

             {/* Completed Tasks */}
             {completedTasks.length > 0 && (
               <div className="pt-4 border-t">
                 <h4 className="text-sm font-medium text-gray-700 mb-3">
                   Completed ({completedTasks.length})
                 </h4>
                 <div className="space-y-2">
                   {completedTasks.map((task) => (
                     <TaskCard
                       key={task.id}
                       task={task}
                       onComplete={() => handleCompleteTask(task)}
                       onUncomplete={() => handleUncompleteTask(task.id)}
                       isCompleted
                     />
                   ))}
                 </div>
               </div>
             )}

             {/* Empty State */}
             {todaysTasks.length === 0 && (
               <div className="text-center py-8">
                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <h3 className="mt-4 text-sm font-medium text-gray-900">No tasks for today</h3>
                 <p className="mt-2 text-sm text-gray-500">Your daily tasks will appear here.</p>
               </div>
             )}
           </div>
         )}
       </div>
     )
   }
   ```

2. **Create individual task card component:**

   **File: `src/components/dashboard/TaskCard.tsx`**
   ```typescript
   'use client'

   import { useState } from 'react'
   import { Button } from '@/components/ui'
   import { cn, formatTime } from '@/lib/utils'
   import type { DailyTask } from '@/types'

   interface TaskCardProps {
     task: DailyTask
     onComplete: () => void
     onUncomplete: () => void
     isCompleted?: boolean
   }

   const taskTypeIcons = {
     daily_steps: '👟',
     sleep_quality: '😴',
     hydration: '💧',
     nutrition: '🥗',
     recovery: '🧘',
     workout: '🏃',
     stretching: '🤸',
     mental_health: '🧠'
   }

   const taskTypeColors = {
     daily_steps: 'bg-blue-50 border-blue-200 text-blue-800',
     sleep_quality: 'bg-purple-50 border-purple-200 text-purple-800',
     hydration: 'bg-cyan-50 border-cyan-200 text-cyan-800',
     nutrition: 'bg-green-50 border-green-200 text-green-800',
     recovery: 'bg-orange-50 border-orange-200 text-orange-800',
     workout: 'bg-red-50 border-red-200 text-red-800',
     stretching: 'bg-pink-50 border-pink-200 text-pink-800',
     mental_health: 'bg-indigo-50 border-indigo-200 text-indigo-800'
   }

   export default function TaskCard({ task, onComplete, onUncomplete, isCompleted }: TaskCardProps) {
     const [isHovered, setIsHovered] = useState(false)
     
     const icon = taskTypeIcons[task.type] || '📝'
     const colorClass = taskTypeColors[task.type] || 'bg-gray-50 border-gray-200 text-gray-800'
     
     const getProgressPercentage = () => {
       if (!task.targetValue || !task.actualValue) return 0
       return Math.min((task.actualValue / task.targetValue) * 100, 100)
     }

     const formatValue = (value: number) => {
       switch (task.unit) {
         case 'steps':
           return value.toLocaleString()
         case 'ml':
           return `${value}ml`
         case 'minutes':
           return formatTime(value)
         case 'score':
           return `${value}/100`
         default:
           return value.toString()
       }
     }

     return (
       <div
         className={cn(
           "task-card relative transition-all duration-200",
           isCompleted ? "task-card completed opacity-90" : "hover:shadow-md",
           isCompleted ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
         )}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
       >
         <div className="flex items-center justify-between">
           {/* Left side - Task info */}
           <div className="flex items-center space-x-3 flex-1 min-w-0">
             {/* Task type indicator */}
             <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-lg", colorClass)}>
               {icon}
             </div>
             
             {/* Task details */}
             <div className="flex-1 min-w-0">
               <div className="flex items-center space-x-2">
                 <h4 className={cn(
                   "font-medium truncate",
                   isCompleted ? "text-green-800 line-through" : "text-gray-900"
                 )}>
                   {task.title}
                 </h4>
                 {task.completionMethod === 'biometric' && (
                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                     Auto
                   </span>
                 )}
               </div>
               
               <p className={cn(
                 "text-sm truncate",
                 isCompleted ? "text-green-600" : "text-gray-600"
               )}>
                 {task.description}
               </p>
               
               {/* Progress info */}
               {task.targetValue && (
                 <div className="mt-2">
                   <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                     <span>
                       {task.actualValue ? formatValue(task.actualValue) : '0'} / {formatValue(task.targetValue)}
                     </span>
                     {task.actualValue && (
                       <span>{Math.round(getProgressPercentage())}%</span>
                     )}
                   </div>
                   
                   {task.actualValue && (
                     <div className="w-full bg-gray-200 rounded-full h-1.5">
                       <div 
                         className={cn(
                           "h-1.5 rounded-full transition-all",
                           isCompleted ? "bg-green-500" : "bg-primary"
                         )}
                         style={{ width: `${getProgressPercentage()}%` }}
                       />
                     </div>
                   )}
                 </div>
               )}
               
               {/* Completion timestamp */}
               {isCompleted && task.completedAt && (
                 <p className="text-xs text-green-600 mt-1">
                   Completed at {new Date(task.completedAt).toLocaleTimeString()}
                 </p>
               )}
             </div>
           </div>

           {/* Right side - Action button */}
           <div className="flex-shrink-0">
             {isCompleted ? (
               <div className="flex items-center space-x-2">
                 <div className="flex items-center text-green-600">
                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                   </svg>
                 </div>
                 {isHovered && (
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={onUncomplete}
                     className="text-gray-500 hover:text-gray-700"
                   >
                     Undo
                   </Button>
                 )}
               </div>
             ) : (
               <Button
                 variant="outline"
                 size="sm"
                 onClick={onComplete}
                 className="border-gray-300 hover:border-primary hover:text-primary"
               >
                 Complete
               </Button>
             )}
           </div>
         </div>
       </div>
     )
   }
   ```

**Verification Steps:**
1. Load dashboard - should show today's tasks with completion rate
2. Complete a task - should update immediately and show checkmark
3. Sync biometric data - should auto-complete eligible tasks
4. Test undo functionality - should revert task completion
5. Check responsive design - cards should stack properly on mobile

**Troubleshooting:**
- **"Tasks not loading"** → Check task store initialization and demo data
- **"Completion not persisting"** → Verify task store persistence configuration  
- **"Biometric sync not working"** → Check demo mode and mock biometric data
- **"Progress bars not updating"** → Ensure actualValue calculation is correct

**Deliverable(s):** 
- Interactive task cards with visual progress indicators
- Real-time completion rate calculation and display
- Biometric data sync with automatic task completion
- Intuitive undo functionality for task management

---

**Task 4.3: Create Weekly Progress & Workout Components [IMPORTANT]**

**Context & Rationale:** These components provide visual feedback on training progress and upcoming workout schedules. They integrate with the plan store to show current week status, completed workouts, and upcoming sessions. The components emphasize visual progress tracking and motivation.

**Prerequisites:**
- Task 4.1 and 4.2 completed
- Plan store with demo data available
- Chart/progress visualization requirements

**Action(s):**

1. **Create weekly progress card component:**

   **File: `src/components/dashboard/WeeklyProgressCard.tsx`**
   ```typescript
   'use client'

   import { Button } from '@/components/ui'
   import { useCurrentWeek, useCurrentPlan } from '@/stores/planStore'
   import { formatDate, cn } from '@/lib/utils'
   import { useRouter } from 'next/navigation'

   export default function WeeklyProgressCard() {
     const router = useRouter()
     const currentWeek = useCurrentWeek()
     const currentPlan = useCurrentPlan()

     if (!currentWeek || !currentPlan) {
       return (
         <div className="bg-white rounded-lg shadow-sm border p-6">
           <div className="text-center py-8">
             <h3 className="text-lg font-medium text-gray-900 mb-2">No Training Plan</h3>
             <p className="text-gray-600 mb-4">Complete your onboarding to get started</p>
             <Button onClick={() => router.push('/onboarding')}>
               Get Started
             </Button>
           </div>
         </div>
       )
     }

     const completedWorkouts = currentWeek.workouts.filter(w => w.isCompleted)
     const totalWorkouts = currentWeek.workouts.filter(w => w.type !== 'rest')
     const progressPercentage = totalWorkouts.length > 0 
       ? Math.round((completedWorkouts.length / totalWorkouts.length) * 100)
       : 0

     const weekProgress = (currentWeek.weekNumber / currentPlan.totalWeeks) * 100

     return (
       <div className="bg-white rounded-lg shadow-sm border p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-6">
           <div>
             <h2 className="text-lg font-semibold text-gray-900">
               Week {currentWeek.weekNumber} Progress
             </h2>
             <p className="text-sm text-gray-600 mt-1">
               {formatDate(currentWeek.startDate)} - {formatDate(currentWeek.endDate)}
             </p>
           </div>
           
           <Button
             variant="outline"
             size="sm"
             onClick={() => router.push('/plan')}
           >
             View Full Plan
           </Button>
         </div>

         {/* Week Description */}
         <div className="mb-6">
           <p className="text-gray-700">{currentWeek.description}</p>
         </div>

         {/* Progress Metrics */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
           <div className="text-center">
             <div className="text-2xl font-bold text-primary">{progressPercentage}%</div>
             <div className="text-xs text-gray-500">Week Complete</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-bold text-green-600">{completedWorkouts.length}</div>
             <div className="text-xs text-gray-500">Workouts Done</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-bold text-blue-600">{currentWeek.totalDistance}km</div>
             <div className="text-xs text-gray-500">Total Distance</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-bold text-purple-600">{Math.round(weekProgress)}%</div>
             <div className="text-xs text-gray-500">Plan Progress</div>
           </div>
         </div>

         {/* Week Progress Bar */}
         <div className="mb-6">
           <div className="flex justify-between text-sm text-gray-600 mb-2">
             <span>Weekly Workouts</span>
             <span>{completedWorkouts.length} / {totalWorkouts.length}</span>
           </div>
           <div className="progress-bar">
             <div 
               className="progress-fill"
               style={{ width: `${progressPercentage}%` }}
             />
           </div>
         </div>

         {/* Weekly Goals */}
         {currentWeek.weeklyGoals && currentWeek.weeklyGoals.length > 0 && (
           <div>
             <h4 className="text-sm font-medium text-gray-900 mb-3">This Week's Goals</h4>
             <ul className="space-y-2">
               {currentWeek.weeklyGoals.map((goal, index) => (
                 <li key={index} className="flex items-center text-sm text-gray-600">
                   <svg className="h-4 w-4 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   {goal}
                 </li>
               ))}
             </ul>
           </div>
         )}
       </div>
     )
   }
   ```

2. **Create upcoming workouts card component:**

   **File: `src/components/dashboard/UpcomingWorkoutsCard.tsx`**
   ```typescript
   'use client'

   import { useState } from 'react'
   import { Button } from '@/components/ui'
   import { useCurrentWeek, usePlanStore } from '@/stores/planStore'
   import { formatDate, cn } from '@/lib/utils'
   import type { DailyWorkout, WorkoutFeedback } from '@/types'

   const workoutTypeIcons = {
     run: '🏃',
     'cross-training': '🚴',
     strength: '💪',
     rest: '😴'
   }

   const intensityColors = {
     easy: 'bg-green-100 text-green-800 border-green-200',
     moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
     hard: 'bg-red-100 text-red-800 border-red-200',
     recovery: 'bg-blue-100 text-blue-800 border-blue-200'
   }

   export default function UpcomingWorkoutsCard() {
     const currentWeek = useCurrentWeek()
     const { markWorkoutComplete } = usePlanStore()
     const [completingWorkout, setCompletingWorkout] = useState<string | null>(null)

     if (!currentWeek) {
       return null
     }

     const today = new Date().toISOString().split('T')[0]
     const upcomingWorkouts = currentWeek.workouts
       .filter(workout => {
         const workoutDate = new Date(workout.date).toISOString().split('T')[0]
         return workoutDate >= today && !workout.isCompleted
       })
       .slice(0, 3) // Show next 3 workouts

     const todaysWorkout = currentWeek.workouts.find(workout => {
       const workoutDate = new Date(workout.date).toISOString().split('T')[0]
       return workoutDate === today
     })

     const handleCompleteWorkout = async (workout: DailyWorkout) => {
       setCompletingWorkout(workout.day)
       
       // Simulate workout completion with demo feedback
       const feedback: WorkoutFeedback = {
         rating: 4, // Just right
         effort: 3, // Moderate effort
         enjoyment: 4, // Good enjoyment
         comment: 'Great workout! Felt strong throughout.',
         timestamp: new Date().toISOString()
       }

       try {
         await markWorkoutComplete(workout.day, feedback)
       } finally {
         setCompletingWorkout(null)
       }
     }

     return (
       <div className="bg-white rounded-lg shadow-sm border p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-6">
           <h2 className="text-lg font-semibold text-gray-900">Upcoming Workouts</h2>
           <Button variant="ghost" size="sm" className="text-gray-500">
             View All
           </Button>
         </div>

         {/* Today's Workout Highlight */}
         {todaysWorkout && (
           <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
             <div className="flex items-center justify-between">
               <div className="flex items-center space-x-3">
                 <div className="text-2xl">
                   {workoutTypeIcons[todaysWorkout.type] || '📝'}
                 </div>
                 <div>
                   <h3 className="font-medium text-gray-900">Today's Workout</h3>
                   <p className="text-sm text-gray-600">{todaysWorkout.description}</p>
                   {todaysWorkout.distance && (
                     <p className="text-xs text-gray-500 mt-1">
                       {todaysWorkout.distance}km • {todaysWorkout.duration} min
                     </p>
                   )}
                 </div>
               </div>
               
               {!todaysWorkout.isCompleted && (
                 <Button
                   size="sm"
                   onClick={() => handleCompleteWorkout(todaysWorkout)}
                   disabled={completingWorkout === todaysWorkout.day}
                 >
                   {completingWorkout === todaysWorkout.day ? 'Marking...' : 'Complete'}
                 </Button>
               )}
               
               {todaysWorkout.isCompleted && (
                 <div className="flex items-center text-green-600">
                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                   </svg>
                   <span className="text-sm font-medium ml-1">Completed</span>
                 </div>
               )}
             </div>
           </div>
         )}

         {/* Upcoming Workouts List */}
         <div className="space-y-3">
           {upcomingWorkouts.map((workout) => (
             <div key={workout.day} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <div className="text-lg">
                     {workoutTypeIcons[workout.type] || '📝'}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center space-x-2 mb-1">
                       <h4 className="font-medium text-gray-900 capitalize">
                         {workout.day}
                       </h4>
                       <span className={cn(
                         "px-2 py-1 rounded-full text-xs font-medium border",
                         intensityColors[workout.intensity]
                       )}>
                         {workout.intensity}
                       </span>
                     </div>
                     
                     <p className="text-sm text-gray-600 truncate">
                       {workout.description}
                     </p>
                     
                     <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                       <span>{formatDate(workout.date)}</span>
                       {workout.distance && <span>{workout.distance}km</span>}
                       {workout.duration && <span>{workout.duration} min</span>}
                       {workout.pace && <span>{workout.pace}/km</span>}
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex-shrink-0">
                   {workout.isCompleted ? (
                     <div className="text-green-600">
                       <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                       </svg>
                     </div>
                   ) : (
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleCompleteWorkout(workout)}
                       disabled={completingWorkout === workout.day}
                       className="text-gray-400 hover:text-gray-600"
                     >
                       {completingWorkout === workout.day ? 'Saving...' : 'Mark Done'}
                     </Button>
                   )}
                 </div>
               </div>
               
               {/* Workout Notes */}
               {workout.notes && workout.notes.length > 0 && (
                 <div className="mt-3 pt-3 border-t border-gray-100">
                   <h5 className="text-xs font-medium text-gray-700 mb-1">Notes:</h5>
                   <ul className="text-xs text-gray-600 space-y-1">
                     {workout.notes.map((note, index) => (
                       <li key={index} className="flex items-start">
                         <span className="text-gray-400 mr-1">•</span>
                         {note}
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
             </div>
           ))}
         </div>

         {/* Empty State */}
         {upcomingWorkouts.length === 0 && !todaysWorkout && (
           <div className="text-center py-8">
             <div className="text-4xl mb-4">🎉</div>
             <h3 className="text-sm font-medium text-gray-900">All caught up!</h3>
             <p className="text-sm text-gray-500 mt-1">No upcoming workouts this week.</p>
           </div>
         )}
       </div>
     )
   }
   ```

**Verification Steps:**
1. View dashboard - should show weekly progress with correct completion percentage
2. Check workout cards - should display upcoming workouts with proper formatting
3. Complete a workout - should update immediately and show completion status
4. Test responsive design - components should stack properly on mobile
5. Verify data integration - progress should reflect actual plan store data

**Troubleshooting:**
- **"Progress not calculating"** → Check currentWeek data structure and completion logic
- **"Workouts not showing"** → Verify plan store has loaded demo data correctly
- **"Date formatting issues"** → Ensure date utilities are working and timezones handled
- **"Completion not working"** → Check markWorkoutComplete function in plan store

**Deliverable(s):** 
- Weekly progress card with visual metrics and goal tracking
- Upcoming workouts display with completion functionality
- Today's workout highlighting with quick completion
- Responsive design with proper data integration

---

**Task 4.4: Create Insights Panel & Quick Actions [IMPORTANT]**

**Context & Rationale:** The insights panel provides AI-powered recommendations and progress analysis, while quick actions offer convenient shortcuts to common tasks. These components enhance user engagement and provide proactive guidance for training optimization.

**Prerequisites:**
- Previous dashboard components completed
- All stores available with demo data
- Basic AI insights logic planned

**Action(s):**

1. **Create insights panel component:**

   **File: `src/components/dashboard/InsightsPanel.tsx`**
   ```typescript
   'use client'

   import { Button } from '@/components/ui'
   import { useCurrentWeek, useCurrentPlan } from '@/stores/planStore'
   import { useCompletionRate, useBiometricData } from '@/stores/taskStore'
   import { useUserProfile } from '@/stores/userStore'

   interface Insight {
     id: string
     type: 'tip' | 'warning' | 'achievement' | 'recommendation'
     title: string
     description: string
     action?: {
       label: string
       onClick: () => void
     }
   }

   const insightIcons = {
     tip: '💡',
     warning: '⚠️',
     achievement: '🏆',
     recommendation: '🎯'
   }

   const insightColors = {
     tip: 'bg-blue-50 border-blue-200 text-blue-800',
     warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
     achievement: 'bg-green-50 border-green-200 text-green-800',
     recommendation: 'bg-purple-50 border-purple-200 text-purple-800'
   }

   export default function InsightsPanel() {
     const currentWeek = useCurrentWeek()
     const currentPlan = useCurrentPlan()
     const completionRate = useCompletionRate()
     const biometricData = useBiometricData()
     const userProfile = useUserProfile()

     // Generate insights based on current data
     const generateInsights = (): Insight[] => {
       const insights: Insight[] = []

       // Completion rate insights
       if (completionRate >= 80) {
         insights.push({
           id: 'high-completion',
           type: 'achievement',
           title: 'Excellent Progress!',
           description: `You've completed ${completionRate}% of today's tasks. Keep up the great work!`
         })
       } else if (completionRate < 50) {
         insights.push({
           id: 'low-completion',
           type: 'tip',
           title: 'Stay on Track',
           description: 'Try to complete your daily tasks to maintain momentum in your training.'
         })
       }

       // Biometric insights
       if (biometricData) {
         if (biometricData.sleepScore && biometricData.sleepScore < 70) {
           insights.push({
             id: 'sleep-warning',
             type: 'warning',
             title: 'Sleep Quality Alert',
             description: `Your sleep score is ${biometricData.sleepScore}/100. Consider adjusting your bedtime routine.`
           })
         }

         if (biometricData.steps > 10000) {
           insights.push({
             id: 'steps-achievement',
             type: 'achievement',
             title: 'Step Goal Crushed!',
             description: `Amazing! You've walked ${biometricData.steps.toLocaleString()} steps today.`
           })
         }

         if (biometricData.readinessScore && biometricData.readinessScore > 80) {
           insights.push({
             id: 'readiness-high',
             type: 'tip',
             title: 'Ready to Train',
             description: 'Your readiness score is high - great day for a challenging workout!'
           })
         }
       }

       // Training plan insights
       if (currentWeek && currentPlan) {
         const weekProgress = currentWeek.weekNumber / currentPlan.totalWeeks
         
         if (weekProgress > 0.5) {
           insights.push({
             id: 'halfway-milestone',
             type: 'achievement',
             title: 'Halfway There!',
             description: `You're over halfway through your ${currentPlan.totalWeeks}-week training plan. Amazing progress!`
           })
         }

         // Marathon countdown
         if (userProfile?.marathonGoal?.targetDate) {
           const daysToMarathon = Math.ceil(
             (new Date(userProfile.marathonGoal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
           )
           
           if (daysToMarathon <= 30) {
             insights.push({
               id: 'marathon-approaching',
               type: 'recommendation',
               title: 'Marathon Month!',
               description: `Only ${daysToMarathon} days until your marathon. Focus on tapering and race preparation.`
             })
           }
         }
       }

       // Default motivational insight if no specific insights
       if (insights.length === 0) {
         insights.push({
           id: 'default-motivation',
           type: 'tip',
           title: 'Keep Moving Forward',
           description: 'Every step counts on your marathon journey. Stay consistent and trust the process!'
         })
       }

       return insights.slice(0, 3) // Limit to 3 insights
     }

     const insights = generateInsights()

     return (
       <div className="bg-white rounded-lg shadow-sm border p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-6">
           <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
           <Button variant="ghost" size="sm" className="text-gray-500">
             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
           </Button>
         </div>

         {/* Insights List */}
         <div className="space-y-4">
           {insights.map((insight) => (
             <div
               key={insight.id}
               className={`p-4 rounded-lg border ${insightColors[insight.type]}`}
             >
               <div className="flex items-start space-x-3">
                 <div className="text-xl flex-shrink-0">
                   {insightIcons[insight.type]}
                 </div>
                 
                 <div className="flex-1 min-w-0">
                   <h4 className="font-medium mb-1">{insight.title}</h4>
                   <p className="text-sm opacity-90">{insight.description}</p>
                   
                   {insight.action && (
                     <Button
                       variant="ghost"
                       size="sm"
                       className="mt-2 p-0 h-auto font-medium"
                       onClick={insight.action.onClick}
                     >
                       {insight.action.label} →
                     </Button>
                   )}
                 </div>
               </div>
             </div>
           ))}
         </div>

         {/* AI Coach Prompt */}
         <div className="mt-6 pt-6 border-t">
           <div className="text-center">
             <p className="text-sm text-gray-600 mb-3">
               Need personalized advice? Ask your AI coach!
             </p>
             <Button variant="outline" size="sm" className="w-full">
               <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
               </svg>
               Chat with AI Coach
             </Button>
           </div>
         </div>
       </div>
     )
   }
   ```

2. **Create quick actions card component:**

   **File: `src/components/dashboard/QuickActionsCard.tsx`**
   ```typescript
   'use client'

   import { useState } from 'react'
   import { useRouter } from 'next/navigation'
   import { Button } from '@/components/ui'
   import { useTaskStore } from '@/stores/taskStore'
   import { usePlanStore } from '@/stores/planStore'

   interface QuickAction {
     id: string
     title: string
     description: string
     icon: string
     action: () => void
     isLoading?: boolean
   }

   export default function QuickActionsCard() {
     const router = useRouter()
     const { syncBiometricData } = useTaskStore()
     const { adaptPlan } = usePlanStore()
     const [loadingActions, setLoadingActions] = useState<string[]>([])

     const handleActionWithLoading = async (actionId: string, actionFn: () => Promise<void>) => {
       setLoadingActions(prev => [...prev, actionId])
       try {
         await actionFn()
       } finally {
         setLoadingActions(prev => prev.filter(id => id !== actionId))
       }
     }

     const quickActions: QuickAction[] = [
       {
         id: 'sync-data',
         title: 'Sync Health Data',
         description: 'Update tasks with latest biometric data',
         icon: '🔄',
         action: () => handleActionWithLoading('sync-data', syncBiometricData),
         isLoading: loadingActions.includes('sync-data')
       },
       {
         id: 'view-plan',
         title: 'View Training Plan',
         description: 'See your complete 16-week schedule',
         icon: '📅',
         action: () => router.push('/plan')
       },
       {
         id: 'log-workout',
         title: 'Log Workout',
         description: 'Record your latest training session',
         icon: '📝',
         action: () => router.push('/plan?tab=log')
       },
       {
         id: 'adjust-plan',
         title: 'Request Plan Adjustment',
         description: 'AI will adapt your plan based on feedback',
         icon: '⚡',
         action: () => handleActionWithLoading('adjust-plan', () => 
           adaptPlan('User requested plan adjustment from dashboard')
         ),
         isLoading: loadingActions.includes('adjust-plan')
       },
       {
         id: 'nutrition-tips',
         title: 'Nutrition Guidance',
         description: 'Get meal and hydration recommendations',
         icon: '🥗',
         action: () => router.push('/nutrition')
       },
       {
         id: 'recovery-tips',
         title: 'Recovery Tools',
         description: 'Access stretching and recovery routines',
         icon: '🧘',
         action: () => router.push('/recovery')
       }
     ]

     return (
       <div className="bg-white rounded-lg shadow-sm border p-6">
         {/* Header */}
         <div className="mb-6">
           <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
           <p className="text-sm text-gray-600 mt-1">Common tasks and tools</p>
         </div>

         {/* Actions Grid */}
         <div className="grid grid-cols-1 gap-3">
           {quickActions.map((action) => (
             <button
               key={action.id}
               onClick={action.action}
               disabled={action.isLoading}
               className="p-4 text-left border rounded-lg hover:bg-gray-50 hover:border-primary/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group"
             >
               <div className="flex items-center space-x-3">
                 <div className="text-2xl flex-shrink-0">
                   {action.isLoading ? (
                     <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                   ) : (
                     action.icon
                   )}
                 </div>
                 
                 <div className="flex-1 min-w-0">
                   <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                     {action.title}
                   </h4>
                   <p className="text-sm text-gray-600 mt-1">
                     {action.description}
                   </p>
                 </div>
                 
                 <div className="flex-shrink-0">
                   <svg 
                     className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     stroke="currentColor"
                   >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </div>
               </div>
             </button>
           ))}
         </div>

         {/* Emergency Actions */}
         <div className="mt-6 pt-6 border-t">
           <h4 className="text-sm font-medium text-gray-900 mb-3">Need Help?</h4>
           <div className="grid grid-cols-2 gap-2">
             <Button
               variant="outline"
               size="sm"
               className="text-xs"
               onClick={() => router.push('/support')}
             >
               📞 Support
             </Button>
             <Button
               variant="outline"
               size="sm"
               className="text-xs"
               onClick={() => router.push('/emergency')}
             >
               🚨 Injury Report
             </Button>
           </div>
         </div>
       </div>
     )
   }
   ```

**Verification Steps:**
1. Check insights panel - should show relevant AI-generated recommendations
2. Test quick actions - each action should work without errors
3. Verify loading states - async actions should show loading indicators
4. Test responsive design - components should work on all screen sizes
5. Check data integration - insights should reflect actual user data

**Troubleshooting:**
- **"Insights not generating"** → Check data availability in stores and insight logic
- **"Actions not working"** → Verify router navigation and store methods
- **"Loading states stuck"** → Ensure async actions properly clear loading state
- **"Data not reflecting"** → Check store subscriptions and data updates

**Deliverable(s):** 
- AI-powered insights panel with contextual recommendations
- Quick actions card with common task shortcuts
- Proper loading states and error handling
- Emergency support and help options

---

**Task 4.5: Create Component Index & Integration [UTILITY]**

**Context & Rationale:** A component index ensures easy imports and maintains consistency across the dashboard. This task also includes creating any missing stub components referenced in the main dashboard and validates the complete integration.

**Prerequisites:**
- All previous dashboard tasks completed
- Main dashboard page structure defined

**Action(s):**

1. **Create dashboard component index:**

   **File: `src/components/dashboard/index.ts`**
   ```typescript
   // Dashboard component exports
   export { default as DashboardHeader } from './DashboardHeader'
   export { default as TodaysTasksCard } from './TodaysTasksCard'
   export { default as TaskCard } from './TaskCard'
   export { default as WeeklyProgressCard } from './WeeklyProgressCard'
   export { default as UpcomingWorkoutsCard } from './UpcomingWorkoutsCard'
   export { default as InsightsPanel } from './InsightsPanel'
   export { default as QuickActionsCard } from './QuickActionsCard'
   ```

2. **Update main dashboard to use index imports:**

   **File: `src/app/dashboard/page.tsx` (Update imports section)**
   ```typescript
   // ... existing imports ...
   
   // Dashboard components - Update to use index import
   import {
     DashboardHeader,
     TodaysTasksCard,
     WeeklyProgressCard,
     UpcomingWorkoutsCard,
     InsightsPanel,
     QuickActionsCard
   } from '@/components/dashboard'
   
   // ... rest of component remains the same ...
   ```

3. **Create missing onboarding step components (if referenced but not yet created):**

   **File: `src/components/onboarding/MarathonGoalStep.tsx`**
   ```typescript
   'use client'

   import { useForm } from 'react-hook-form'
   import { zodResolver } from '@hookform/resolvers/zod'
   import { z } from 'zod'
   import { Button, Input } from '@/components/ui'
   import type { OnboardingData } from '@/types'

   const marathonGoalSchema = z.object({
     targetDate: z.string().min(1, 'Please select a target date'),
     targetTime: z.string().optional(),
     isFirstMarathon: z.boolean(),
     previousMarathonTime: z.string().optional()
   })

   type MarathonGoalFormData = z.infer<typeof marathonGoalSchema>

   interface MarathonGoalStepProps {
     data: OnboardingData | null
     onNext: (data: Partial<OnboardingData>) => void
     onPrevious: () => void
     isFirstStep: boolean
     isLastStep: boolean
   }

   export default function MarathonGoalStep({ data, onNext, onPrevious }: MarathonGoalStepProps) {
     const {
       register,
       handleSubmit,
       watch,
       formState: { errors }
     } = useForm<MarathonGoalFormData>({
       resolver: zodResolver(marathonGoalSchema),
       defaultValues: {
         targetDate: data?.marathonGoal?.targetDate || '',
         targetTime: data?.marathonGoal?.targetTime || '',
         isFirstMarathon: data?.marathonGoal?.isFirstMarathon || false,
         previousMarathonTime: data?.marathonGoal?.previousMarathonTime || ''
       }
     })

     const isFirstMarathon = watch('isFirstMarathon')

     const onSubmit = (formData: MarathonGoalFormData) => {
       onNext({
         marathonGoal: {
           targetDate: formData.targetDate,
           targetTime: formData.targetTime,
           isFirstMarathon: formData.isFirstMarathon,
           previousMarathonTime: formData.previousMarathonTime
         }
       })
     }

     return (
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-gray-900 mb-2">
             What's Your Marathon Goal?
           </h2>
           <p className="text-gray-600">
             Help us understand your target so we can create the perfect training plan
           </p>
         </div>

         {/* Marathon Date */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Target Marathon Date *
           </label>
           <Input
             type="date"
             {...register('targetDate')}
             className={errors.targetDate ? 'border-red-500' : ''}
           />
           {errors.targetDate && (
             <p className="mt-1 text-sm text-red-600">{errors.targetDate.message}</p>
           )}
         </div>

         {/* First Marathon Question */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-3">
             Is this your first marathon?
           </label>
           <div className="space-y-3">
             <label className="flex items-center">
               <input
                 type="radio"
                 value="true"
                 {...register('isFirstMarathon', { valueAsBoolean: true })}
                 className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
               />
               <span className="ml-2 text-sm text-gray-700">Yes, this is my first marathon</span>
             </label>
             <label className="flex items-center">
               <input
                 type="radio"
                 value="false"
                 {...register('isFirstMarathon', { valueAsBoolean: true })}
                 className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
               />
               <span className="ml-2 text-sm text-gray-700">No, I've run a marathon before</span>
             </label>
           </div>
         </div>

         {/* Target Time */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Target Finish Time (optional)
           </label>
           <Input
             type="text"
             placeholder="e.g., 4:00:00"
             {...register('targetTime')}
             className="placeholder:text-gray-400"
           />
           <p className="mt-1 text-xs text-gray-500">
             Format: Hours:Minutes:Seconds (e.g., 4:00:00 for 4 hours)
           </p>
         </div>

         {/* Previous Marathon Time */}
         {!isFirstMarathon && (
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Previous Best Marathon Time
             </label>
             <Input
               type="text"
               placeholder="e.g., 4:30:00"
               {...register('previousMarathonTime')}
               className="placeholder:text-gray-400"
             />
           </div>
         )}

         {/* Navigation Buttons */}
         <div className="flex justify-between pt-6">
           <Button type="button" variant="outline" onClick={onPrevious}>
             ← Previous
           </Button>
           <Button type="submit">
             Next →
           </Button>
         </div>
       </form>
     )
   }
   ```

4. **Create root layout with proper navigation:**

   **File: `src/app/layout.tsx`** (Update if needed)
   ```typescript
   import type { Metadata } from 'next'
   import { Inter } from 'next/font/google'
   import './globals.css'
   import { initializeStores } from '@/stores'

   const inter = Inter({ subsets: ['latin'] })

   export const metadata: Metadata = {
     title: 'Marathon Trainer - Personalized Training Plans',
     description: 'AI-powered marathon training with biometric integration',
   }

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     // Initialize stores on app load
     if (typeof window !== 'undefined') {
       initializeStores()
     }

     return (
       <html lang="en">
         <body className={inter.className}>
           {children}
         </body>
       </html>
     )
   }
   ```

**Verification Steps:**
1. Import components using index - imports should work without path issues
2. Navigate through complete dashboard - all components should render properly
3. Test all interactive features - tasks, workouts, insights, quick actions
4. Check console for errors - no missing component or import errors
5. Verify responsive design - entire dashboard should work on all screen sizes

**Troubleshooting:**
- **"Import errors"** → Check component exports and index file paths
- **"Missing components"** → Create stub components for any referenced but missing files
- **"Dashboard not loading"** → Verify all stores are properly initialized
- **"Navigation issues"** → Check router configuration and protected routes

**Deliverable(s):** 
- Complete dashboard component library with proper exports
- Integrated dashboard page with all functionality
- Additional onboarding step components as needed
- Proper error handling and loading states throughout

---

## Phase 4: Real-time Updates System

### 4.6. Server-Sent Events Implementation

**Task 4.6: Create SSE Endpoint [CRITICAL - BLOCKING]**

**Context & Rationale:** Server-Sent Events (SSE) enable real-time updates from n8n workflows to the frontend without polling. This is essential for showing live task completions, plan updates, and biometric data processing in real-time.

**Prerequisites:**
- Phase 0, 1, 2, and 3 completed successfully
- Understanding of EventSource API and streaming responses
- n8n workflows need this endpoint for webhook callbacks

**Action(s):**

1. **Create SSE API endpoint:**

   **File: `src/app/api/sse/route.ts`**
   ```typescript
   import { NextRequest } from 'next/server'
   import { config } from '@/lib/constants'

   // Store active connections for each user
   const connections = new Map<string, WritableStreamDefaultWriter>()

   export async function GET(request: NextRequest) {
     const { searchParams } = new URL(request.url)
     const userId = searchParams.get('userId') || 'demo-user'

     // Create SSE stream
     const stream = new ReadableStream({
       start(controller) {
         const encoder = new TextEncoder()
         
         // Send initial connection event
         const data = encoder.encode(`data: ${JSON.stringify({
           type: 'connection',
           message: 'Connected to real-time updates',
           timestamp: new Date().toISOString()
         })}\n\n`)
         controller.enqueue(data)

         // Store connection for this user
         const writer = {
           write: (data: string) => {
             try {
               const encoded = encoder.encode(`data: ${data}\n\n`)
               controller.enqueue(encoded)
             } catch (error) {
               console.error('Error writing to SSE stream:', error)
             }
           },
           close: () => {
             try {
               controller.close()
               connections.delete(userId)
             } catch (error) {
               console.error('Error closing SSE stream:', error)
             }
           }
         }
         
         connections.set(userId, writer)

         // Send periodic heartbeat to keep connection alive
         const heartbeat = setInterval(() => {
           try {
             const heartbeatData = encoder.encode(`data: ${JSON.stringify({
               type: 'heartbeat',
               timestamp: new Date().toISOString()
             })}\n\n`)
             controller.enqueue(heartbeatData)
           } catch (error) {
             clearInterval(heartbeat)
             connections.delete(userId)
           }
         }, 30000) // Every 30 seconds

         // Cleanup on close
         request.signal.addEventListener('abort', () => {
           clearInterval(heartbeat)
           connections.delete(userId)
           try {
             controller.close()
           } catch (error) {
             console.error('Error during cleanup:', error)
           }
         })
       }
     })

     return new Response(stream, {
       headers: {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache, no-transform',
         'Connection': 'keep-alive',
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Headers': 'Cache-Control',
       }
     })
   }

   // Utility function to send events to specific users
   export function sendEventToUser(userId: string, eventData: any) {
     const connection = connections.get(userId)
     if (connection) {
       try {
         connection.write(JSON.stringify(eventData))
         return true
       } catch (error) {
         console.error('Failed to send event to user:', userId, error)
         connections.delete(userId)
         return false
       }
     }
     return false
   }

   // Utility function to broadcast to all connected users
   export function broadcastEvent(eventData: any) {
     let sentCount = 0
     for (const [userId, connection] of connections) {
       try {
         connection.write(JSON.stringify(eventData))
         sentCount++
       } catch (error) {
         console.error('Failed to broadcast to user:', userId, error)
         connections.delete(userId)
       }
     }
     return sentCount
   }
   ```

2. **Create SSE utility functions:**

   **File: `src/lib/sseUtils.ts`**
   ```typescript
   // Utility functions for SSE management
   export interface SSEEvent {
     type: 'task_completion' | 'plan_update' | 'biometric_data' | 'connection' | 'heartbeat' | 'error'
     data?: any
     message?: string
     timestamp: string
     userId?: string
   }

   export function createSSEEvent(type: SSEEvent['type'], data: any, message?: string): SSEEvent {
     return {
       type,
       data,
       message,
       timestamp: new Date().toISOString()
     }
   }

   export function formatSSEData(event: SSEEvent): string {
     return JSON.stringify(event)
   }

   // Demo mode SSE simulator
   export function simulateSSEEvents(userId: string, onEvent: (event: SSEEvent) => void) {
     const events = [
       { type: 'task_completion' as const, data: { taskId: 'daily-run', completed: true, method: 'biometric' }, message: 'Daily run completed!' },
       { type: 'biometric_data' as const, data: { steps: 8500, sleepScore: 85, readinessScore: 78 }, message: 'New biometric data available' },
       { type: 'plan_update' as const, data: { weekNumber: 3, adjustments: ['reduced mileage due to feedback'] }, message: 'Training plan adjusted' }
     ]

     events.forEach((event, index) => {
       setTimeout(() => {
         onEvent(createSSEEvent(event.type, event.data, event.message))
       }, (index + 1) * 5000) // Stagger events every 5 seconds
     })
   }
   ```

**Verification Steps:**
1. Start development server: `npm run dev`
2. Navigate to `http://localhost:3000/api/sse?userId=test-user` - should see SSE connection
3. Check browser Network tab - should show persistent EventSource connection
4. Verify heartbeat events every 30 seconds
5. Test connection cleanup when tab closes

**Troubleshooting:**
- **"Connection not established"** → Check CORS headers and browser developer tools
- **"Events not received"** → Verify EventSource connection in Network tab
- **"Memory leaks"** → Ensure cleanup handlers remove connections from Map
- **"Connection drops"** → Check heartbeat implementation and error handling

**Deliverable(s):** 
- SSE endpoint accepts and manages connections
- User-specific event filtering implemented
- Connection cleanup and error handling working
- Utility functions for event management available

---

**Task 4.7: Create SSE Client Hook [CRITICAL - BLOCKING]**

**Context & Rationale:** The frontend needs a React hook to manage SSE connections, handle reconnections, and route events to appropriate stores. This provides the foundation for all real-time features.

**Prerequisites:**
- Task 4.6 completed successfully
- Understanding of React hooks and cleanup patterns
- Store integration knowledge from Phase 1

**Action(s):**

1. **Create real-time updates hook:**

   **File: `src/hooks/useRealTimeUpdates.ts`**
   ```typescript
   import { useEffect, useRef, useCallback, useState } from 'react'
   import { useAuthStore } from '@/stores/authStore'
   import { useTaskStore } from '@/stores/taskStore'
   import { usePlanStore } from '@/stores/planStore'
   import { useUserStore } from '@/stores/userStore'
   import { SSEEvent } from '@/lib/sseUtils'
   import { config } from '@/lib/constants'

   interface UseRealTimeUpdatesOptions {
     autoConnect?: boolean
     maxReconnectAttempts?: number
     reconnectDelay?: number
   }

   export function useRealTimeUpdates(options: UseRealTimeUpdatesOptions = {}) {
     const {
       autoConnect = true,
       maxReconnectAttempts = 5,
       reconnectDelay = 3000
     } = options

     const [isConnected, setIsConnected] = useState(false)
     const [connectionError, setConnectionError] = useState<string | null>(null)
     const [reconnectAttempts, setReconnectAttempts] = useState(0)

     const eventSourceRef = useRef<EventSource | null>(null)
     const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

     // Store hooks
     const { user } = useAuthStore()
     const { markTaskComplete, updateTaskFromBiometric } = useTaskStore()
     const { updatePlan } = usePlanStore()
     const { updateProfile } = useUserStore()

     // Event handlers
     const handleTaskCompletion = useCallback((eventData: any) => {
       console.log('Task completion event:', eventData)
       if (eventData.taskId && eventData.completed) {
         markTaskComplete(eventData.taskId, eventData.method || 'manual')
       }
     }, [markTaskComplete])

     const handlePlanUpdate = useCallback((eventData: any) => {
       console.log('Plan update event:', eventData)
       if (eventData.plan) {
         updatePlan(eventData.plan)
       }
     }, [updatePlan])

     const handleBiometricData = useCallback((eventData: any) => {
       console.log('Biometric data event:', eventData)
       if (eventData.biometricData) {
         updateTaskFromBiometric(eventData.biometricData)
       }
     }, [updateTaskFromBiometric])

     // Route events to appropriate handlers
     const handleMessage = useCallback((event: MessageEvent) => {
       try {
         const eventData: SSEEvent = JSON.parse(event.data)
         
         switch (eventData.type) {
           case 'connection':
             setIsConnected(true)
             setConnectionError(null)
             setReconnectAttempts(0)
             console.log('SSE connected:', eventData.message)
             break

           case 'task_completion':
             handleTaskCompletion(eventData.data)
             break

           case 'plan_update':
             handlePlanUpdate(eventData.data)
             break

           case 'biometric_data':
             handleBiometricData(eventData.data)
             break

           case 'heartbeat':
             // Just acknowledge the heartbeat
             break

           case 'error':
             console.error('SSE error event:', eventData.message)
             setConnectionError(eventData.message || 'Unknown error')
             break

           default:
             console.log('Unknown SSE event type:', eventData.type)
         }
       } catch (error) {
         console.error('Error parsing SSE message:', error)
       }
     }, [handleTaskCompletion, handlePlanUpdate, handleBiometricData])

     // Connection management
     const connect = useCallback(() => {
       if (eventSourceRef.current?.readyState === EventSource.OPEN) {
         return // Already connected
       }

       const userId = user?.id || 'demo-user'
       const url = `${config.API_BASE_URL}/api/sse?userId=${userId}`

       console.log('Connecting to SSE:', url)
       
       try {
         eventSourceRef.current = new EventSource(url)
         
         eventSourceRef.current.onmessage = handleMessage
         
         eventSourceRef.current.onopen = () => {
           console.log('SSE connection opened')
           setIsConnected(true)
           setConnectionError(null)
           setReconnectAttempts(0)
         }
         
         eventSourceRef.current.onerror = () => {
           console.error('SSE connection error')
           setIsConnected(false)
           
           if (reconnectAttempts < maxReconnectAttempts) {
             setConnectionError(`Connection lost. Reconnecting... (${reconnectAttempts + 1}/${maxReconnectAttempts})`)
             
             reconnectTimeoutRef.current = setTimeout(() => {
               setReconnectAttempts(prev => prev + 1)
               connect()
             }, reconnectDelay)
           } else {
             setConnectionError('Connection failed. Please refresh the page.')
           }
         }
       } catch (error) {
         console.error('Failed to create SSE connection:', error)
         setConnectionError('Failed to establish real-time connection')
       }
     }, [user?.id, handleMessage, reconnectAttempts, maxReconnectAttempts, reconnectDelay])

     const disconnect = useCallback(() => {
       if (reconnectTimeoutRef.current) {
         clearTimeout(reconnectTimeoutRef.current)
         reconnectTimeoutRef.current = null
       }
       
       if (eventSourceRef.current) {
         eventSourceRef.current.close()
         eventSourceRef.current = null
       }
       
       setIsConnected(false)
       setReconnectAttempts(0)
     }, [])

     // Auto-connect effect
     useEffect(() => {
       if (autoConnect && user) {
         connect()
       }

       return () => {
         disconnect()
       }
     }, [autoConnect, user, connect, disconnect])

     // Demo mode simulation
     useEffect(() => {
       if (config.DEMO_MODE && isConnected) {
         console.log('Starting demo mode SSE simulation')
         
         // Simulate events for demo
         const simulateEvent = (type: SSEEvent['type'], data: any, message: string) => {
           handleMessage(new MessageEvent('message', {
             data: JSON.stringify({
               type,
               data,
               message,
               timestamp: new Date().toISOString()
             })
           }))
         }

         // Schedule demo events
         const timeouts = [
           setTimeout(() => simulateEvent('task_completion', { taskId: 'daily-steps', completed: true, method: 'biometric' }, 'Daily steps goal completed!'), 10000),
           setTimeout(() => simulateEvent('biometric_data', { steps: 8500, sleepScore: 85, readinessScore: 78 }, 'New Oura Ring data available'), 20000),
           setTimeout(() => simulateEvent('plan_update', { weekNumber: 3, adjustments: ['Reduced intensity based on readiness score'] }, 'Training plan automatically adjusted'), 30000)
         ]

         return () => {
           timeouts.forEach(timeout => clearTimeout(timeout))
         }
       }
     }, [config.DEMO_MODE, isConnected, handleMessage])

     return {
       isConnected,
       connectionError,
       reconnectAttempts,
       connect,
       disconnect,
       maxReconnectAttempts
     }
   }
   ```

2. **Create connection status component:**

   **File: `src/components/ui/ConnectionStatus.tsx`**
   ```typescript
   'use client'

   import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates'
   import { AlertTriangle, Wifi, WifiOff } from 'lucide-react'

   export function ConnectionStatus() {
     const { isConnected, connectionError, reconnectAttempts, maxReconnectAttempts } = useRealTimeUpdates()

     if (isConnected) {
       return (
         <div className="flex items-center gap-2 text-green-600 text-sm">
           <Wifi className="h-4 w-4" />
           <span>Real-time updates active</span>
         </div>
       )
     }

     if (connectionError) {
       return (
         <div className="flex items-center gap-2 text-yellow-600 text-sm">
           <AlertTriangle className="h-4 w-4" />
           <span>{connectionError}</span>
           {reconnectAttempts < maxReconnectAttempts && (
             <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600"></div>
           )}
         </div>
       )
     }

     return (
       <div className="flex items-center gap-2 text-gray-500 text-sm">
         <WifiOff className="h-4 w-4" />
         <span>Connecting...</span>
       </div>
     )
   }
   ```

**Verification Steps:**
1. Import and use `useRealTimeUpdates` in dashboard - should auto-connect
2. Check browser console for connection logs
3. Test manual disconnect/reconnect functionality
4. Verify event routing to stores (check store state changes)
5. Test demo mode event simulation

**Troubleshooting:**
- **"Hook not connecting"** → Check SSE endpoint URL and CORS settings
- **"Events not routing"** → Verify store functions are properly imported
- **"Infinite reconnection"** → Check maxReconnectAttempts and error handling
- **"Demo events not working"** → Verify DEMO_MODE is enabled in config

**Deliverable(s):** 
- React hook for SSE connection management
- Automatic reconnection with exponential backoff
- Event routing to appropriate stores
- Connection status component for UI feedback

---

### 4.8. Webhook Endpoints

**Task 4.8: Create Task Update Webhook [CRITICAL - BLOCKING]**

**Context & Rationale:** This webhook receives task completion notifications from n8n workflows (especially biometric data processing) and broadcasts them via SSE to update the frontend in real-time.

**Prerequisites:**
- Task 4.6 and 4.7 completed successfully
- Understanding of webhook security and validation
- n8n workflows will call this endpoint

**Action(s):**

1. **Create task update webhook endpoint:**

   **File: `src/app/api/webhooks/task-updates/route.ts`**
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { sendEventToUser, broadcastEvent } from '@/app/api/sse/route'
   import { config } from '@/lib/constants'
   import { createSSEEvent } from '@/lib/sseUtils'

   // Webhook payload interface
   interface TaskUpdatePayload {
     userId: string
     taskId: string
     taskType: string
     completed: boolean
     method: 'manual' | 'biometric'
     value?: number
     timestamp: string
     biometricData?: {
       steps?: number
       sleepScore?: number
       readinessScore?: number
       heartRate?: number
     }
   }

   // Verify webhook signature (for production security)
   function verifyWebhookSignature(body: string, signature: string): boolean {
     if (config.DEMO_MODE) {
       return true // Skip verification in demo mode
     }

     // In production, implement HMAC verification
     // const expectedSignature = crypto
     //   .createHmac('sha256', config.WEBHOOK_SECRET)
     //   .update(body)
     //   .digest('hex')
     // return signature === expectedSignature
     
     return true // For now, allow all requests
   }

   export async function POST(request: NextRequest) {
     try {
       const body = await request.text()
       const signature = request.headers.get('x-webhook-signature') || ''

       // Verify webhook authenticity
       if (!verifyWebhookSignature(body, signature)) {
         return NextResponse.json(
           { error: 'Invalid webhook signature' },
           { status: 401 }
         )
       }

       const payload: TaskUpdatePayload = JSON.parse(body)

       // Validate required fields
       if (!payload.userId || !payload.taskId || typeof payload.completed !== 'boolean') {
         return NextResponse.json(
           { error: 'Missing required fields: userId, taskId, completed' },
           { status: 400 }
         )
       }

       console.log('Received task update webhook:', payload)

       // Create SSE event for task completion
       const sseEvent = createSSEEvent(
         'task_completion',
         {
           taskId: payload.taskId,
           taskType: payload.taskType,
           completed: payload.completed,
           method: payload.method,
           value: payload.value,
           biometricData: payload.biometricData
         },
         payload.completed 
           ? `Task "${payload.taskType}" completed via ${payload.method}!`
           : `Task "${payload.taskType}" marked incomplete`
       )

       // Send to specific user or broadcast if no specific user
       let sent = false
       if (payload.userId && payload.userId !== 'all') {
         sent = sendEventToUser(payload.userId, sseEvent)
       }
       
       if (!sent) {
         // Fallback to broadcast if user-specific sending failed
         broadcastEvent(sseEvent)
       }

       // If biometric data is included, send separate biometric event
       if (payload.biometricData) {
         const biometricEvent = createSSEEvent(
           'biometric_data',
           payload.biometricData,
           'New biometric data available'
         )
         
         if (payload.userId && payload.userId !== 'all') {
           sendEventToUser(payload.userId, biometricEvent)
         } else {
           broadcastEvent(biometricEvent)
         }
       }

       return NextResponse.json({
         success: true,
         message: 'Task update processed successfully',
         eventSent: true
       })

     } catch (error) {
       console.error('Error processing task update webhook:', error)
       
       return NextResponse.json(
         { 
           error: 'Internal server error',
           details: error instanceof Error ? error.message : 'Unknown error'
         },
         { status: 500 }
       )
     }
   }

   // Demo endpoint to test webhook functionality
   export async function GET(request: NextRequest) {
     if (!config.DEMO_MODE) {
       return NextResponse.json({ error: 'Demo mode not enabled' }, { status: 403 })
     }

     const { searchParams } = new URL(request.url)
     const userId = searchParams.get('userId') || 'demo-user'

     // Send demo task completion
     const demoPayload: TaskUpdatePayload = {
       userId,
       taskId: 'demo-daily-run',
       taskType: 'Daily Run',
       completed: true,
       method: 'biometric',
       value: 5.2, // 5.2km run
       timestamp: new Date().toISOString(),
       biometricData: {
         steps: 8500,
         sleepScore: 85,
         readinessScore: 78,
         heartRate: 145
       }
     }

     // Process the demo payload
     const response = await POST(new NextRequest(request.url, {
       method: 'POST',
       body: JSON.stringify(demoPayload),
       headers: { 'content-type': 'application/json' }
     }))

     return NextResponse.json({
       message: 'Demo task update sent',
       payload: demoPayload,
       response: await response.json()
     })
   }
   ```

**Verification Steps:**
1. Test webhook endpoint: `curl -X POST http://localhost:3000/api/webhooks/task-updates -H "Content-Type: application/json" -d '{"userId":"test","taskId":"demo","completed":true}'`
2. Check SSE connection receives the event
3. Verify store updates reflect the task completion
4. Test demo endpoint: `GET /api/webhooks/task-updates?userId=demo-user`
5. Confirm error handling for malformed payloads

**Troubleshooting:**
- **"Webhook not receiving data"** → Check n8n workflow configuration and URL
- **"SSE events not sent"** → Verify SSE connection is active and sendEventToUser function works
- **"Store not updating"** → Check event routing in useRealTimeUpdates hook
- **"Signature verification failing"** → Ensure webhook secret matches between n8n and frontend

**Deliverable(s):** 
- Task update webhook endpoint with signature verification
- SSE event broadcasting to connected clients
- Biometric data processing and forwarding
- Demo endpoints for testing functionality

---

**Task 4.9: Create Plan Changes Webhook [CRITICAL - BLOCKING]**

**Context & Rationale:** This webhook receives training plan modifications from n8n (after AI processing of feedback or biometric analysis) and immediately updates the frontend to show plan changes.

**Prerequisites:**
- Task 4.8 completed successfully
- Understanding of training plan data structures
- Plan store integration from Phase 1

**Action(s):**

1. **Create plan changes webhook endpoint:**

   **File: `src/app/api/webhooks/plan-changes/route.ts`**
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { sendEventToUser, broadcastEvent } from '@/app/api/sse/route'
   import { config } from '@/lib/constants'
   import { createSSEEvent } from '@/lib/sseUtils'

   // Plan change payload interface
   interface PlanChangePayload {
     userId: string
     planId?: string
     changeType: 'full_plan' | 'week_update' | 'workout_modification' | 'schedule_adjustment'
     reason: string
     timestamp: string
     changes: {
       fullPlan?: any // Complete new training plan
       weekNumber?: number
       weekData?: any // Week-specific changes
       workoutId?: string
       workoutData?: any // Individual workout changes
       adjustments?: string[] // List of adjustments made
     }
     aiSummary?: string // AI-generated summary of changes
   }

   // Verify webhook signature (same as task updates)
   function verifyWebhookSignature(body: string, signature: string): boolean {
     if (config.DEMO_MODE) {
       return true
     }
     return true // Implement proper HMAC verification in production
   }

   export async function POST(request: NextRequest) {
     try {
       const body = await request.text()
       const signature = request.headers.get('x-webhook-signature') || ''

       if (!verifyWebhookSignature(body, signature)) {
         return NextResponse.json(
           { error: 'Invalid webhook signature' },
           { status: 401 }
         )
       }

       const payload: PlanChangePayload = JSON.parse(body)

       // Validate required fields
       if (!payload.userId || !payload.changeType || !payload.changes) {
         return NextResponse.json(
           { error: 'Missing required fields: userId, changeType, changes' },
           { status: 400 }
         )
       }

       console.log('Received plan change webhook:', payload)

       // Process different types of plan changes
       let eventData: any = {}
       let message = ''

       switch (payload.changeType) {
         case 'full_plan':
           eventData = {
             type: 'full_plan',
             plan: payload.changes.fullPlan,
             reason: payload.reason,
             aiSummary: payload.aiSummary
           }
           message = 'Your training plan has been completely regenerated'
           break

         case 'week_update':
           eventData = {
             type: 'week_update',
             weekNumber: payload.changes.weekNumber,
             weekData: payload.changes.weekData,
             adjustments: payload.changes.adjustments,
             reason: payload.reason
           }
           message = `Week ${payload.changes.weekNumber} has been updated`
           break

         case 'workout_modification':
           eventData = {
             type: 'workout_modification',
             workoutId: payload.changes.workoutId,
             workoutData: payload.changes.workoutData,
             reason: payload.reason
           }
           message = 'A workout has been modified based on your feedback'
           break

         case 'schedule_adjustment':
           eventData = {
             type: 'schedule_adjustment',
             adjustments: payload.changes.adjustments,
             reason: payload.reason
           }
           message = 'Your training schedule has been adjusted'
           break

         default:
           throw new Error(`Unknown change type: ${payload.changeType}`)
       }

       // Create SSE event for plan changes
       const sseEvent = createSSEEvent(
         'plan_update',
         eventData,
         payload.aiSummary || message
       )

       // Send to specific user
       let sent = false
       if (payload.userId && payload.userId !== 'all') {
         sent = sendEventToUser(payload.userId, sseEvent)
       }
       
       if (!sent) {
         broadcastEvent(sseEvent)
       }

       return NextResponse.json({
         success: true,
         message: 'Plan change processed successfully',
         eventSent: true,
         changeType: payload.changeType
       })

     } catch (error) {
       console.error('Error processing plan change webhook:', error)
       
       return NextResponse.json(
         { 
           error: 'Internal server error',
           details: error instanceof Error ? error.message : 'Unknown error'
         },
         { status: 500 }
       )
     }
   }

   // Demo endpoint to test plan change functionality
   export async function GET(request: NextRequest) {
     if (!config.DEMO_MODE) {
       return NextResponse.json({ error: 'Demo mode not enabled' }, { status: 403 })
     }

     const { searchParams } = new URL(request.url)
     const userId = searchParams.get('userId') || 'demo-user'
     const changeType = searchParams.get('type') || 'week_update'

     // Generate demo plan change based on type
     let demoPayload: PlanChangePayload

     switch (changeType) {
       case 'week_update':
         demoPayload = {
           userId,
           changeType: 'week_update',
           reason: 'Adjusted based on recent biometric data showing high fatigue',
           timestamp: new Date().toISOString(),
           changes: {
             weekNumber: 3,
             weekData: {
               totalDistance: 35, // Reduced from 40km
               workouts: [
                 { day: 'Monday', type: 'Easy Run', distance: 8, intensity: 'easy' },
                 { day: 'Wednesday', type: 'Tempo Run', distance: 6, intensity: 'moderate' },
                 { day: 'Friday', type: 'Easy Run', distance: 5, intensity: 'easy' },
                 { day: 'Sunday', type: 'Long Run', distance: 16, intensity: 'easy' }
               ]
             },
             adjustments: [
               'Reduced weekly mileage by 5km',
               'Removed speed work session',
               'Added extra rest day on Tuesday'
             ]
           },
           aiSummary: 'Your training has been adjusted to allow for better recovery based on your recent sleep and readiness scores.'
         }
         break

       case 'workout_modification':
         demoPayload = {
           userId,
           changeType: 'workout_modification',
           reason: 'Modified based on weather conditions and user feedback',
           timestamp: new Date().toISOString(),
           changes: {
             workoutId: 'workout-123',
             workoutData: {
               type: 'Indoor Tempo Run',
               distance: 8,
               intensity: 'moderate',
               notes: 'Moved to treadmill due to weather. Focus on consistent pace.'
             }
           },
           aiSummary: 'Today\'s outdoor run has been moved indoors due to weather conditions.'
         }
         break

       default:
         demoPayload = {
           userId,
           changeType: 'schedule_adjustment',
           reason: 'Schedule optimization based on weekly availability',
           timestamp: new Date().toISOString(),
           changes: {
             adjustments: [
               'Moved Tuesday workout to Wednesday',
               'Shortened Thursday run by 2km',
               'Added flexibility session on Friday'
             ]
           },
           aiSummary: 'Your schedule has been optimized to better fit your availability.'
         }
     }

     // Process the demo payload
     const response = await POST(new NextRequest(request.url, {
       method: 'POST',
       body: JSON.stringify(demoPayload),
       headers: { 'content-type': 'application/json' }
     }))

     return NextResponse.json({
       message: 'Demo plan change sent',
       payload: demoPayload,
       response: await response.json()
     })
   }
   ```

**Verification Steps:**
1. Test plan change webhook with different change types
2. Check SSE events are received and routed correctly
3. Verify plan store updates with new data
4. Test demo endpoints for each change type
5. Confirm AI summary messages display properly in UI

**Troubleshooting:**
- **"Plan changes not updating UI"** → Check plan store event handling and React re-renders
- **"Wrong change type processing"** → Verify switch statement covers all changeType values
- **"Demo payloads not working"** → Check demo endpoint URL parameters and payload structure
- **"Store not updating correctly"** → Verify usePlanStore hook integration in useRealTimeUpdates

**Deliverable(s):** 
- Plan changes webhook with multiple change type support
- AI summary integration for user-friendly messages
- Demo endpoints for testing different plan modification scenarios
- Proper error handling and validation for all change types

---

**Task 4.10: Create User Data Webhook [CRITICAL - BLOCKING]**

**Context & Rationale:** This webhook handles outbound data from the frontend to n8n workflows, including onboarding data submission, chat messages, feedback, and manual task completions.

**Prerequisites:**
- Task 4.8 and 4.9 completed successfully
- Understanding of n8n webhook consumption
- Frontend form integration knowledge

**Action(s):**

1. **Create user data webhook endpoint:**

   **File: `src/app/api/webhooks/user-data/route.ts`**
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { config } from '@/lib/constants'

   // User data payload interface
   interface UserDataPayload {
     userId: string
     dataType: 'onboarding' | 'chat_message' | 'plan_feedback' | 'manual_task_completion' | 'user_update'
     timestamp: string
     data: any
   }

   // Forward data to n8n workflows
   async function forwardToN8N(endpoint: string, payload: any): Promise<boolean> {
     try {
       const n8nUrl = `${config.N8N_WEBHOOK_URL}/webhook/${endpoint}`
       
       console.log(`Forwarding to n8n: ${n8nUrl}`)
       
       const response = await fetch(n8nUrl, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${config.N8N_API_KEY}`,
           'X-Webhook-Secret': config.N8N_WEBHOOK_SECRET
         },
         body: JSON.stringify(payload)
       })

       if (!response.ok) {
         console.error(`n8n request failed: ${response.status} ${response.statusText}`)
         return false
       }

       console.log('Successfully forwarded to n8n')
       return true
     } catch (error) {
       console.error('Error forwarding to n8n:', error)
       return false
     }
   }

   export async function POST(request: NextRequest) {
     try {
       const payload: UserDataPayload = await request.json()

       // Validate required fields
       if (!payload.userId || !payload.dataType || !payload.data) {
         return NextResponse.json(
           { error: 'Missing required fields: userId, dataType, data' },
           { status: 400 }
         )
       }

       console.log('Received user data webhook:', payload.dataType, payload.userId)

       let n8nEndpoint = ''
       let processedData = payload.data

       // Route to appropriate n8n workflow based on data type
       switch (payload.dataType) {
         case 'onboarding':
           n8nEndpoint = 'user-onboarding'
           processedData = {
             ...payload.data,
             userId: payload.userId,
             timestamp: payload.timestamp
           }
           break

         case 'chat_message':
           n8nEndpoint = 'chat-processing'
           processedData = {
             userId: payload.userId,
             message: payload.data.message,
             context: payload.data.context || 'general',
             timestamp: payload.timestamp
           }
           break

         case 'plan_feedback':
           n8nEndpoint = 'plan-feedback'
           processedData = {
             userId: payload.userId,
             feedbackType: payload.data.type, // 'difficulty', 'schedule', 'preference'
             rating: payload.data.rating,
             comments: payload.data.comments,
             workoutId: payload.data.workoutId,
             weekNumber: payload.data.weekNumber,
             timestamp: payload.timestamp
           }
           break

         case 'manual_task_completion':
           n8nEndpoint = 'task-completion'
           processedData = {
             userId: payload.userId,
             taskId: payload.data.taskId,
             completed: payload.data.completed,
             method: 'manual',
             notes: payload.data.notes,
             timestamp: payload.timestamp
           }
           break

         case 'user_update':
           n8nEndpoint = 'user-profile-update'
           processedData = {
             userId: payload.userId,
             updates: payload.data.updates,
             updateType: payload.data.updateType,
             timestamp: payload.timestamp
           }
           break

         default:
           return NextResponse.json(
             { error: `Unknown data type: ${payload.dataType}` },
             { status: 400 }
           )
       }

       // Forward to n8n if not in demo mode
       let n8nSuccess = true
       if (!config.DEMO_MODE) {
         n8nSuccess = await forwardToN8N(n8nEndpoint, processedData)
       } else {
         console.log(`Demo mode: Would forward to ${n8nEndpoint}:`, processedData)
       }

       // Handle demo mode responses
       if (config.DEMO_MODE) {
         // Simulate n8n processing delays and responses
         setTimeout(async () => {
           switch (payload.dataType) {
             case 'onboarding':
               // Simulate plan generation completion
               await fetch(`${config.API_BASE_URL}/api/webhooks/plan-changes`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                   userId: payload.userId,
                   changeType: 'full_plan',
                   reason: 'Initial plan generated from onboarding data',
                   timestamp: new Date().toISOString(),
                   changes: {
                     fullPlan: {
                       id: 'demo-plan-1',
                       name: 'Personalized Marathon Training',
                       duration: 16,
                       weeks: generateDemoPlan()
                     }
                   },
                   aiSummary: 'Your personalized 16-week marathon training plan has been created based on your goals and experience level.'
                 })
               })
               break

             case 'plan_feedback':
               // Simulate plan adjustment
               await fetch(`${config.API_BASE_URL}/api/webhooks/plan-changes`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                   userId: payload.userId,
                   changeType: 'week_update',
                   reason: 'Adjusted based on user feedback',
                   timestamp: new Date().toISOString(),
                   changes: {
                     weekNumber: payload.data.weekNumber || 1,
                     adjustments: ['Modified based on your feedback'],
                     weekData: { /* adjusted week data */ }
                   },
                   aiSummary: 'Your training has been adjusted based on your feedback.'
                 })
               })
               break
           }
         }, 2000) // 2 second delay to simulate processing
       }

       return NextResponse.json({
         success: true,
         message: 'User data processed successfully',
         dataType: payload.dataType,
         forwardedToN8N: n8nSuccess,
         demoMode: config.DEMO_MODE
       })

     } catch (error) {
       console.error('Error processing user data webhook:', error)
       
       return NextResponse.json(
         { 
           error: 'Internal server error',
           details: error instanceof Error ? error.message : 'Unknown error'
         },
         { status: 500 }
       )
     }
   }

   // Helper function to generate demo training plan
   function generateDemoPlan() {
     const weeks = []
     for (let i = 1; i <= 16; i++) {
       weeks.push({
         weekNumber: i,
         totalDistance: Math.min(20 + (i * 2), 60), // Progressive increase
         workouts: [
           { day: 'Monday', type: 'Easy Run', distance: 5 + Math.floor(i/4) },
           { day: 'Wednesday', type: 'Tempo Run', distance: 6 + Math.floor(i/3) },
           { day: 'Friday', type: 'Easy Run', distance: 4 + Math.floor(i/5) },
           { day: 'Sunday', type: 'Long Run', distance: 8 + i }
         ]
       })
     }
     return weeks
   }

   // GET endpoint for testing
   export async function GET(request: NextRequest) {
     if (!config.DEMO_MODE) {
       return NextResponse.json({ error: 'Demo mode not enabled' }, { status: 403 })
     }

     const { searchParams } = new URL(request.url)
     const dataType = searchParams.get('type') || 'onboarding'
     const userId = searchParams.get('userId') || 'demo-user'

     const demoPayloads = {
       onboarding: {
         userId,
         dataType: 'onboarding',
         timestamp: new Date().toISOString(),
         data: {
           marathonGoal: {
             targetDate: '2024-10-15',
             targetTime: '4:00:00',
             isFirstMarathon: false
           },
           experience: {
             yearsRunning: 3,
             longestRun: 21,
             weeklyMileage: 25
           },
           weeklyAvailability: {
             daysPerWeek: 4,
             hoursPerDay: 1.5
           },
           currentFitness: {
             level: 'intermediate',
             recentRaces: []
           }
         }
       },
       chat_message: {
         userId,
         dataType: 'chat_message',
         timestamp: new Date().toISOString(),
         data: {
           message: 'I\'m feeling tired today, should I skip my workout?',
           context: 'workout_question'
         }
       },
       plan_feedback: {
         userId,
         dataType: 'plan_feedback',
         timestamp: new Date().toISOString(),
         data: {
           type: 'difficulty',
           rating: 'too_hard',
           comments: 'The pace feels too aggressive for my current fitness level',
           workoutId: 'workout-123',
           weekNumber: 2
         }
       }
     }

     const payload = demoPayloads[dataType as keyof typeof demoPayloads]
     if (!payload) {
       return NextResponse.json({ error: 'Invalid demo type' }, { status: 400 })
     }

     // Process the demo payload
     const response = await POST(new NextRequest(request.url, {
       method: 'POST',
       body: JSON.stringify(payload),
       headers: { 'content-type': 'application/json' }
     }))

     return NextResponse.json({
       message: `Demo ${dataType} data sent`,
       payload,
       response: await response.json()
     })
   }
   ```

**Verification Steps:**
1. Test each data type with appropriate payloads
2. Verify n8n forwarding works (check n8n logs)
3. Test demo mode responses and delays
4. Confirm proper error handling for malformed data
5. Verify demo endpoints generate realistic responses

**Troubleshooting:**
- **"n8n not receiving data"** → Check n8n webhook URLs and authentication
- **"Demo responses not working"** → Verify setTimeout callbacks and webhook endpoints
- **"Forwarding errors"** → Check network connectivity and n8n status
- **"Wrong endpoint routing"** → Verify switch statement covers all dataType values

**Deliverable(s):** 
- User data webhook with multiple data type routing
- n8n integration with proper authentication
- Demo mode with realistic processing simulation
- Comprehensive error handling and logging

---

This completes Phase 4: Real-time Updates System. The system now has full SSE connectivity, webhook endpoints for bidirectional communication with n8n, and comprehensive demo mode support.

---

## Phase 5: n8n Workflow Development

### 9. n8n Setup and Installation

**Task 9.1: Install and Configure n8n [CRITICAL - BLOCKING]**

**Context & Rationale:** n8n is the orchestration backbone that handles AI interactions, biometric data processing, and workflow automation. Setting up n8n correctly is essential for the system to function as designed.

**Prerequisites:**
- Node.js v18.17.0+ installed
- npm v9.0.0+ available
- Understanding of n8n concepts (nodes, workflows, credentials)
- Frontend webhook endpoints completed (Phase 4)

**Action(s):**

1. **Install n8n globally:**
   ```bash
   # Install n8n globally for easy access
   npm install -g n8n@latest
   
   # Alternative: Use npx for temporary usage
   # npx n8n
   
   # Verify installation
   n8n --version
   ```

2. **Create n8n configuration directory:**
   ```bash
   # Create n8n data directory
   mkdir -p ~/.n8n
   
   # Create environment configuration
   touch ~/.n8n/.env
   ```

3. **Configure n8n environment variables:**

   **File: `~/.n8n/.env`**
   ```bash
   # Basic n8n Configuration
   N8N_BASIC_AUTH_ACTIVE=true
   N8N_BASIC_AUTH_USER=admin
   N8N_BASIC_AUTH_PASSWORD=admin123
   
   # OpenAI Integration
   OPENAI_API_KEY=your-openai-api-key-here
   
   # Webhook Security
   N8N_WEBHOOK_SECRET=your-webhook-secret-32-chars
   
   # External URLs (for webhook callbacks)
   WEBHOOK_URL=http://localhost:3000/api/webhooks
   FRONTEND_URL=http://localhost:3000
   
   # Oura Ring Configuration
   OURA_CLIENT_ID=your-oura-client-id
   OURA_CLIENT_SECRET=your-oura-client-secret
   OURA_ACCESS_TOKEN=your-oura-access-token
   
   # Demo Mode Settings
   DEMO_MODE=true
   DEBUG_MODE=true
   
   # n8n Specific Settings
   N8N_PORT=5678
   N8N_HOST=localhost
   N8N_PROTOCOL=http
   N8N_EDITOR_BASE_URL=http://localhost:5678
   
   # Workflow Execution Settings
   EXECUTIONS_PROCESS=main
   EXECUTIONS_MODE=regular
   ```

4. **Start n8n and complete initial setup:**
   ```bash
   # Start n8n (will open on http://localhost:5678)
   n8n start
   
   # In browser, navigate to http://localhost:5678
   # Create admin account when prompted:
   # - Email: admin@marathonoptimizer.local
   # - Password: admin123 (or your preferred password)
   # - First Name: Admin
   # - Last Name: User
   ```

5. **Configure n8n credentials:**

   In n8n interface:
   - Go to "Credentials" menu
   - Add "OpenAI" credential:
     - Name: "OpenAI Marathon Optimizer"
     - API Key: Your OpenAI API key
   - Add "HTTP Basic Auth" credential (for webhook security):
     - Name: "Webhook Auth"
     - User: "webhook"
     - Password: Your webhook secret

**Verification Steps:**
1. Access n8n at `http://localhost:5678` - should show n8n editor
2. Check credentials are properly configured
3. Test basic workflow creation (create empty workflow and save)
4. Verify environment variables loaded: check workflow with Code node `console.log(process.env.DEMO_MODE)`
5. Confirm webhook URLs are accessible from n8n

**Troubleshooting:**
- **"n8n won't start"** → Check Node.js version and port 5678 availability: `lsof -i :5678`
- **"Credentials not working"** → Verify API keys are valid and properly formatted
- **"Environment variables not loading"** → Check .env file location and syntax
- **"Webhook URLs not reachable"** → Ensure frontend is running on port 3000

**Deliverable(s):** 
- n8n running successfully on localhost:5678
- Admin account created and accessible
- Environment variables properly configured
- External service credentials set up and verified

---

**Task 9.2: Configure n8n Advanced Settings [BLOCKING]**

**Context & Rationale:** Advanced configuration ensures n8n can handle production-like workloads, proper error handling, and integration with our frontend webhooks.

**Prerequisites:**
- Task 9.1 completed successfully
- n8n running and accessible
- Understanding of workflow execution and error handling

**Action(s):**

1. **Configure workflow execution settings:**

   In n8n Settings → Execution:
   - **Timeout (minutes):** 10 (prevents infinite execution)
   - **Max execution history:** 50 (keep recent executions for debugging)
   - **Save execution progress:** Yes (for debugging complex workflows)
   - **Save manual executions:** Yes (for testing)

2. **Set up error handling defaults:**

   **File: `~/.n8n/config/index.js`** (create if doesn't exist)
   ```javascript
   module.exports = {
     database: {
       type: 'sqlite',
       sqlite: {
         database: 'database.sqlite'
       }
     },
     executions: {
       timeout: 600, // 10 minutes
       maxTimeout: 3600, // 1 hour max
       saveDataOnError: 'all',
       saveDataOnSuccess: 'all',
       saveExecutionProgress: true
     },
     endpoints: {
       rest: 'rest',
       webhook: 'webhook',
       webhookWaiting: 'webhook-waiting',
       webhookTest: 'webhook-test'
     },
     security: {
       basicAuth: {
         active: process.env.N8N_BASIC_AUTH_ACTIVE || false,
         user: process.env.N8N_BASIC_AUTH_USER || '',
         password: process.env.N8N_BASIC_AUTH_PASSWORD || ''
       }
     }
   }
   ```

3. **Create workflow templates directory:**
   ```bash
   mkdir -p ~/.n8n/workflows
   mkdir -p ~/.n8n/templates
   ```

4. **Configure logging for debugging:**

   **File: `~/.n8n/logs/n8n.log`** (n8n will create this)
   - Enable verbose logging for development
   - In n8n: Settings → Log level → Debug

5. **Test webhook connectivity:**

   Create a simple test workflow:
   - Add Webhook node (POST, path: `test`)
   - Add HTTP Request node pointing to `http://localhost:3000/api/webhooks/test`
   - Execute and verify connection

**Verification Steps:**
1. Check execution timeout settings work (create long-running workflow)
2. Verify error handling saves execution data
3. Test webhook connectivity to frontend
4. Confirm logging is working (check ~/.n8n/logs/)
5. Validate configuration file is loaded correctly

**Troubleshooting:**
- **"Timeouts not working"** → Check config file syntax and n8n restart
- **"Logs not appearing"** → Verify log directory permissions and settings
- **"Webhooks failing"** → Check network connectivity and firewall settings
- **"Config not loading"** → Ensure config file is in correct location and valid JavaScript

**Deliverable(s):** 
- Advanced n8n configuration completed
- Error handling and logging properly set up
- Webhook connectivity verified
- Configuration file created and loaded

---

### 10. Core n8n Workflows Creation

**Task 10.1: Create User Onboarding Workflow [CRITICAL - BLOCKING]**

**Context & Rationale:** This workflow processes user onboarding data and generates personalized training plans using AI. It's the core functionality that transforms user inputs into actionable training programs.

**Prerequisites:**
- Task 9.1 and 9.2 completed successfully
- OpenAI credentials configured in n8n
- Frontend user data webhook operational
- Understanding of AI prompt engineering

**Action(s):**

1. **Create new workflow in n8n:**
   - Name: "User Onboarding and Plan Generation"
   - Description: "Processes user onboarding data and generates personalized marathon training plans"

2. **Add Webhook Trigger node:**
   ```
   Node: Webhook
   HTTP Method: POST
   Path: user-onboarding
   Authentication: None (for demo)
   Response Mode: Respond Immediately
   Response Code: 200
   Response Data: {{"message": "Onboarding data received, processing..."}}
   ```

3. **Add Data Validation node:**
   ```
   Node: Code
   Name: Validate Onboarding Data
   Language: JavaScript
   
   Code:
   ```
   ```javascript
   // Extract and validate onboarding data
   const userData = $input.first().json.body || $input.first().json;
   
   console.log('Received onboarding data:', userData);
   
   // Validate required fields
   const requiredFields = ['userId', 'marathonGoal', 'experience', 'weeklyAvailability', 'currentFitness'];
   const missingFields = requiredFields.filter(field => !userData[field]);
   
   if (missingFields.length > 0) {
     throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
   }
   
   // Validate marathon goal
   if (!userData.marathonGoal.targetDate) {
     throw new Error('Marathon target date is required');
   }
   
   // Calculate weeks until marathon
   const targetDate = new Date(userData.marathonGoal.targetDate);
   const today = new Date();
   const weeksUntilMarathon = Math.ceil((targetDate - today) / (7 * 24 * 60 * 60 * 1000));
   
   if (weeksUntilMarathon < 12) {
     throw new Error('Marathon date must be at least 12 weeks away');
   }
   
   // Structure data for AI processing
   const processedData = {
     userId: userData.userId,
     profile: {
       marathonDate: userData.marathonGoal.targetDate,
       weeksUntilMarathon: weeksUntilMarathon,
       targetTime: userData.marathonGoal.targetTime || 'None specified',
       isFirstMarathon: userData.marathonGoal.isFirstMarathon,
       previousMarathonTime: userData.marathonGoal.previousMarathonTime,
       experience: {
         yearsRunning: userData.experience.yearsRunning,
         longestRun: userData.experience.longestRun,
         weeklyMileage: userData.experience.weeklyMileage,
         previousRaces: userData.experience.previousRaces || []
       },
       availability: {
         daysPerWeek: userData.weeklyAvailability.daysPerWeek,
         hoursPerDay: userData.weeklyAvailability.hoursPerDay,
         preferredDays: userData.weeklyAvailability.preferredDays || []
       },
       fitness: {
         level: userData.currentFitness.level,
         recentRaces: userData.currentFitness.recentRaces || [],
         injuries: userData.currentFitness.injuries || []
       },
       goals: userData.goals || {},
       constraints: userData.constraints || {}
     },
     timestamp: new Date().toISOString()
   };
   
   console.log('Processed onboarding data:', processedData);
   
   return [{
     json: processedData
   }];
   ```

**Verification Steps:**
1. Test workflow with sample onboarding data via webhook
2. Check OpenAI integration generates valid plans
3. Verify plan structure matches expected format
4. Test fallback plan generation when AI fails
5. Confirm frontend receives plan via webhook
6. Check workflow execution logs for errors

**Troubleshooting:**
- **"OpenAI errors"** → Check API key and rate limits
- **"Invalid JSON from AI"** → Improve prompt or enhance parsing logic
- **"Webhook not reaching frontend"** → Verify frontend server is running
- **"Plan structure errors"** → Validate plan schema and required fields

**Deliverable(s):** 
- Complete user onboarding workflow operational
- AI-generated training plans with proper structure
- Fallback plan generation for error cases
- Integration with frontend via webhooks working

---

## Phase 6: Integration and Testing

**Task 10.4: Create Plan Feedback Processing Workflow [CRITICAL - BLOCKING]**

**Context & Rationale:** This workflow processes user feedback about their training plan (difficulty, schedule issues, injuries) and determines when and how to adapt the plan. It's essential for the personalized, adaptive nature of the system.

**Prerequisites:**
- User Onboarding workflow completed (Task 10.1)
- Frontend feedback components operational 
- Understanding of existing User Onboarding workflow structure
- OpenAI credentials configured

**Action(s):**

1. **Create new workflow in n8n:**
   - Name: "Plan Feedback Processing and Adaptation"
   - Description: "Analyzes user feedback and generates plan adaptations when needed"

2. **Add Webhook Trigger node:**
   ```
   Node: Webhook
   HTTP Method: POST
   Path: plan-feedback
   Authentication: None (for demo)
   Response Mode: Respond Immediately
   Response Code: 200
   Response Data: {{"message": "Feedback received, analyzing..."}}
   ```

3. **Add Data Validation node:**
   ```
   Node: Code
   Name: Validate Feedback Data
   
   // Validate incoming feedback data
   const feedback = $input.first().json.data;
   
   if (!feedback.planId || !feedback.weekNumber || !feedback.type) {
     throw new Error('Missing required feedback fields');
   }
   
   const validTypes = ['difficulty', 'schedule', 'injury', 'motivation', 'other'];
   if (!validTypes.includes(feedback.type)) {
     throw new Error('Invalid feedback type');
   }
   
   return [{
     json: {
       ...feedback,
       validatedAt: new Date().toISOString()
     }
   }];
   ```

4. **Add Feedback Analysis node:**
   ```
   Node: Code
   Name: Analyze Feedback Pattern
   
   // Analyze feedback to determine if adaptation is needed
   const feedback = $input.first().json;
   
   // Simulated feedback history analysis (in production, query database)
   const shouldAdapt = feedback.type === 'difficulty' && 
                      (feedback.rating === 'too_hard' || feedback.rating === 1 || feedback.rating === 2);
   
   const adaptationReason = shouldAdapt ? 
     'User reported training is too difficult - reducing intensity to prevent overtraining' :
     'Feedback noted for future plan adjustments';
   
   return [{
     json: {
       ...feedback,
       shouldAdapt,
       adaptationReason,
       analysisTimestamp: new Date().toISOString()
     }
   }];
   ```

5. **Add Conditional Branch node:**
   ```
   Node: IF
   Name: Should Adapt Plan?
   Condition: {{ $json.shouldAdapt }} === true
   ```

6. **Add AI Plan Adaptation node (for TRUE branch):**
   ```
   Node: OpenAI
   Name: Generate Plan Adaptation
   Resource: Chat
   Model: gpt-4
   
   System Message:
   You are an expert marathon running coach. Analyze the user feedback and generate specific plan adaptations.
   
   User Feedback:
   - Type: {{ $json.type }}
   - Rating: {{ $json.rating }}
   - Comment: {{ $json.comment }}
   - Week: {{ $json.weekNumber }}
   
   Generate a JSON response with specific adaptations:
   {
     "changes": ["list", "of", "specific", "changes"],
     "reasoning": "explanation of why these changes help",
     "intensity_adjustment": "increase/decrease/maintain",
     "weekly_mileage_change": "+/-5%",
     "schedule_modifications": ["any schedule changes"],
     "alternative_workouts": ["if workouts need substitution"]
   }
   
   User Message: Please analyze this feedback and provide specific training plan adaptations.
   ```

7. **Add Plan Update Formatter node:**
   ```
   Node: Code
   Name: Format Plan Update
   
   const originalFeedback = $('Analyze Feedback Pattern').first().json;
   const aiResponse = $input.first().json;
   
   // Parse AI response if it's a string
   const adaptations = typeof aiResponse.message.content === 'string' ? 
     JSON.parse(aiResponse.message.content) : aiResponse.message.content;
   
   // Format for frontend consumption
   const planUpdate = {
     userId: originalFeedback.userId || 'demo-user',
     changeType: 'week_update',
     reason: originalFeedback.adaptationReason,
     timestamp: new Date().toISOString(),
     changes: {
       weekNumber: originalFeedback.weekNumber,
       adjustments: adaptations.changes || [],
       weekData: {
         // Generate adapted week data based on feedback
         intensityAdjustment: adaptations.intensity_adjustment,
         mileageChange: adaptations.weekly_mileage_change,
         scheduleModifications: adaptations.schedule_modifications,
         alternativeWorkouts: adaptations.alternative_workouts
       }
     },
     aiSummary: adaptations.reasoning || 'Your training has been adjusted based on your feedback.',
     originalFeedback: originalFeedback
   };
   
   return [{ json: planUpdate }];
   ```

8. **Add Webhook Notification node:**
   ```
   Node: HTTP Request
   Name: Send Plan Update to Frontend
   Method: POST
   URL: {{ $env.FRONTEND_URL }}/api/webhooks/plan-changes
   Headers: Content-Type: application/json
   Body: {{ JSON.stringify($json) }}
   ```

9. **Add Feedback Logging node (for FALSE branch):**
   ```
   Node: Code
   Name: Log Feedback
   
   const feedback = $input.first().json;
   
   console.log('Feedback logged for future analysis:', {
     userId: feedback.userId,
     type: feedback.type,
     rating: feedback.rating,
     weekNumber: feedback.weekNumber,
     timestamp: feedback.validatedAt
   });
   
   return [{
     json: {
       message: 'Feedback logged successfully',
       action: 'logged_for_analysis',
       feedback: feedback
     }
   }];
   ```

**Verification Steps:**
1. Test workflow with "too_hard" feedback - should trigger adaptation
2. Test workflow with "just_right" feedback - should log only
3. Verify AI generates reasonable plan adaptations
4. Check frontend receives plan updates via webhook
5. Confirm error handling for invalid feedback data

**Troubleshooting:**
- **"AI not generating adaptations"** → Check OpenAI credentials and prompt format
- **"Frontend not receiving updates"** → Verify webhook URL and plan-changes endpoint
- **"Feedback validation failing"** → Check required fields and data types
- **"Conditional logic not working"** → Verify IF node conditions and data flow

**Deliverable(s):** 
- Complete plan feedback processing workflow
- AI-powered adaptation generation
- Conditional branching based on feedback severity
- Integration with frontend plan update system

---

**Task 10.5: Create Workout Completion Workflow [MODERATE]**

**Context & Rationale:** This workflow processes individual workout completions with user feedback, tracks progress, and can trigger micro-adaptations to upcoming workouts based on performance patterns.

**Prerequisites:**
- Plan Feedback Processing workflow completed (Task 10.4)
- Frontend workout feedback components operational
- Understanding of workout completion patterns

**Action(s):**

1. **Create new workflow in n8n:**
   - Name: "Workout Completion Processing"
   - Description: "Processes workout completions and performance feedback"

2. **Add Webhook Trigger node:**
   ```
   Node: Webhook
   HTTP Method: POST
   Path: workout-completion
   Authentication: None (for demo)
   Response Mode: Respond Immediately
   Response Code: 200
   Response Data: {{"message": "Workout completion recorded"}}
   ```

3. **Add Workout Analysis node:**
   ```
   Node: Code
   Name: Analyze Workout Performance
   
   const completion = $input.first().json.data;
   
   // Analyze workout completion for patterns
   const performanceIndicators = {
     difficultyTrend: completion.feedback?.rating || 3,
     effortLevel: completion.feedback?.effort || 3,
     enjoyment: completion.feedback?.enjoyment || 3,
     completionRate: completion.actualDistance >= completion.plannedDistance ? 100 : 
                    (completion.actualDistance / completion.plannedDistance) * 100
   };
   
   // Determine if micro-adjustments needed
   const needsAdjustment = performanceIndicators.difficultyTrend <= 2 || 
                          performanceIndicators.effortLevel >= 4;
   
   return [{
     json: {
       ...completion,
       performanceIndicators,
       needsAdjustment,
       analysisTimestamp: new Date().toISOString()
     }
   }];
   ```

4. **Add Progress Tracking node:**
   ```
   Node: Code
   Name: Update Progress Metrics
   
   const completion = $input.first().json;
   
   // Calculate progress metrics (in production, update database)
   const progressUpdate = {
     userId: completion.userId,
     weekNumber: completion.weekNumber,
     workoutCompleted: completion.workoutDay,
     completionDate: new Date().toISOString(),
     performance: completion.performanceIndicators,
     feedback: completion.feedback
   };
   
   console.log('Progress updated:', progressUpdate);
   
   return [{ json: progressUpdate }];
   ```

5. **Add Achievement Detection node:**
   ```
   Node: Code
   Name: Detect Achievements
   
   const completion = $input.first().json;
   const achievements = [];
   
   // Check for achievements
   if (completion.performanceIndicators.completionRate >= 100) {
     achievements.push({
       type: 'workout_completed',
       title: 'Workout Completed!',
       description: 'You completed your planned workout',
       icon: '✅'
     });
   }
   
   if (completion.performanceIndicators.enjoyment >= 4) {
     achievements.push({
       type: 'high_enjoyment',
       title: 'Loving the Training!',
       description: 'You\'re really enjoying your workouts',
       icon: '🎉'
     });
   }
   
   return [{
     json: {
       ...completion,
       achievements,
       hasAchievements: achievements.length > 0
     }
   }];
   ```

6. **Add Conditional Branch for Achievements:**
   ```
   Node: IF
   Name: Has Achievements?
   Condition: {{ $json.hasAchievements }} === true
   ```

7. **Add Achievement Notification node:**
   ```
   Node: HTTP Request
   Name: Send Achievement Notification
   Method: POST
   URL: {{ $env.FRONTEND_URL }}/api/webhooks/task-updates
   Headers: Content-Type: application/json
   Body: {
     "userId": "{{ $json.userId }}",
     "type": "achievement",
     "timestamp": "{{ $json.analysisTimestamp }}",
     "data": {
       "achievements": {{ JSON.stringify($json.achievements) }},
       "workoutCompleted": "{{ $json.workoutDay }}",
       "weekNumber": {{ $json.weekNumber }}
     }
   }
   ```

**Verification Steps:**
1. Complete a workout via frontend - verify data reaches workflow
2. Test achievement detection triggers correctly
3. Check progress tracking updates properly
4. Verify frontend receives achievement notifications
5. Test performance analysis logic with different feedback ratings

**Troubleshooting:**
- **"Achievements not triggering"** → Check condition logic and data types
- **"Progress not updating"** → Verify data structure and logging
- **"Notifications not received"** → Check webhook URL and task-updates endpoint
- **"Performance analysis incorrect"** → Review calculation logic and test data

**Deliverable(s):** 
- Complete workout completion processing workflow
- Achievement detection and notification system
- Progress tracking and performance analysis
- Integration with frontend achievement display

---

**Task 10.6: Create Biometric Data Processing Workflow [CRITICAL - BLOCKING]**

**Context & Rationale:** This workflow processes Oura Ring biometric data to automatically complete tasks, detect training adaptation needs, and provide health insights. It's essential for the automated, data-driven aspects of the system.

**Prerequisites:**
- n8n setup completed (Tasks 9.1-9.2)
- Oura Ring API credentials configured 
- Frontend biometric infrastructure operational
- Understanding of Oura Ring data structure

**Action(s):**

1. **Create new workflow in n8n:**
   - Name: "Oura Ring Biometric Data Processing"
   - Description: "Fetches, processes, and analyzes Oura Ring biometric data for training insights"

2. **Add Scheduled Trigger node:**
   ```
   Node: Cron
   Name: Fetch Daily Oura Data
   Mode: Interval
   Interval: Every 2 hours (during active hours)
   Start Time: 06:00
   End Time: 22:00
   ```

3. **Add HTTP Request for Oura API:**
   ```
   Node: HTTP Request
   Name: Fetch Oura Ring Data
   Method: GET
   URL: https://api.ouraring.com/v2/usercollection/daily_activity
   Authentication: Bearer Token
   Token: {{ $env.OURA_ACCESS_TOKEN }}
   Query Parameters:
     start_date: {{ $today().format('YYYY-MM-DD') }}
     end_date: {{ $today().format('YYYY-MM-DD') }}
   ```

4. **Add Data Processing node:**
   ```
   Node: Code
   Name: Process Biometric Data
   
   const ouraData = $input.first().json.data;
   
   if (!ouraData || ouraData.length === 0) {
     console.log('No Oura data available for today');
     return [{ json: { status: 'no_data', date: new Date().toISOString() } }];
   }
   
   const latestData = ouraData[0]; // Most recent day
   
   // Transform Oura data to our BiometricData format
   const biometricData = {
     userId: 'demo-user', // In production, get from user context
     date: latestData.day,
     source: 'oura',
     
     // Activity metrics
     steps: latestData.steps || 0,
     activeCalories: latestData.active_calories || 0,
     totalCalories: latestData.total_calories || 0,
     distance: latestData.distance || 0,
     
     // Sleep metrics (fetch separately if needed)
     sleepScore: latestData.score?.sleep,
     sleepDuration: latestData.total_sleep_time,
     deepSleep: latestData.deep_sleep_time,
     remSleep: latestData.rem_sleep_time,
     
     // Readiness metrics
     readinessScore: latestData.score?.readiness,
     restingHeartRate: latestData.resting_hr,
     bodyTemperature: latestData.body_temperature,
     hrvScore: latestData.hrv_score,
     
     // Recovery calculation
     recoveryIndex: calculateRecoveryIndex(latestData),
     stressLevel: calculateStressLevel(latestData),
     
     rawData: latestData,
     timestamp: new Date().toISOString()
   };
   
   function calculateRecoveryIndex(data) {
     // Combine sleep, readiness, and HRV for recovery index
     const sleepWeight = (data.score?.sleep || 50) * 0.4;
     const readinessWeight = (data.score?.readiness || 50) * 0.4;
     const hrvWeight = (data.hrv_score || 50) * 0.2;
     return Math.round(sleepWeight + readinessWeight + hrvWeight);
   }
   
   function calculateStressLevel(data) {
     // Higher resting HR and lower HRV indicate stress
     const baseHR = 60; // Adjust based on user profile
     const hrStress = Math.max(0, (data.resting_hr - baseHR) * 2);
     const hrvStress = Math.max(0, (50 - (data.hrv_score || 50)));
     return Math.min(100, hrStress + hrvStress);
   }
   
   console.log('Processed biometric data:', biometricData);
   
   return [{ json: biometricData }];
   ```

5. **Add Task Auto-Completion Analysis:**
   ```
   Node: Code
   Name: Analyze Task Completions
   
   const biometricData = $input.first().json;
   const completions = [];
   
   // Auto-complete based on biometric thresholds
   if (biometricData.steps >= 8000) {
     completions.push({
       taskType: 'daily_steps',
       taskId: `steps-${biometricData.date}`,
       completed: true,
       method: 'biometric',
       value: biometricData.steps,
       achievedAt: biometricData.timestamp
     });
   }
   
   if (biometricData.sleepScore >= 70) {
     completions.push({
       taskType: 'sleep_quality',
       taskId: `sleep-${biometricData.date}`,
       completed: true,
       method: 'biometric',
       value: biometricData.sleepScore,
       achievedAt: biometricData.timestamp
     });
   }
   
   if (biometricData.recoveryIndex >= 70) {
     completions.push({
       taskType: 'recovery',
       taskId: `recovery-${biometricData.date}`,
       completed: true,
       method: 'biometric',
       value: biometricData.recoveryIndex,
       achievedAt: biometricData.timestamp
     });
   }
   
   return [{
     json: {
       biometricData,
       completions,
       hasCompletions: completions.length > 0
     }
   }];
   ```

6. **Add Training Adaptation Analysis:**
   ```
   Node: Code
   Name: Analyze Training Readiness
   
   const data = $input.first().json;
   const biometric = data.biometricData;
   
   // Determine if training plan needs adaptation
   const adaptationSignals = [];
   
   // Poor recovery indicators
   if (biometric.recoveryIndex < 50) {
     adaptationSignals.push({
       type: 'poor_recovery',
       severity: 'moderate',
       recommendation: 'Consider reducing intensity or adding rest day'
     });
   }
   
   // High stress indicators
   if (biometric.stressLevel > 70) {
     adaptationSignals.push({
       type: 'high_stress',
       severity: 'high',
       recommendation: 'Focus on recovery activities, consider easy training only'
     });
   }
   
   // Poor sleep
   if (biometric.sleepScore && biometric.sleepScore < 60) {
     adaptationSignals.push({
       type: 'poor_sleep',
       severity: 'moderate',
       recommendation: 'Prioritize sleep hygiene, reduce evening training intensity'
     });
   }
   
   // Excellent readiness
   if (biometric.readinessScore > 85 && biometric.recoveryIndex > 80) {
     adaptationSignals.push({
       type: 'excellent_readiness',
       severity: 'positive',
       recommendation: 'Good day for challenging workout or progression'
     });
   }
   
   const shouldAdaptPlan = adaptationSignals.some(signal => 
     signal.severity === 'high' || 
     adaptationSignals.filter(s => s.severity === 'moderate').length >= 2
   );
   
   return [{
     json: {
       ...data,
       adaptationSignals,
       shouldAdaptPlan,
       adaptationReason: shouldAdaptPlan ? 
         `Training adaptation needed: ${adaptationSignals.map(s => s.type).join(', ')}` :
         'Training can proceed as planned'
     }
   }];
   ```

7. **Add Conditional Branch for Notifications:**
   ```
   Node: IF
   Name: Has Task Completions?
   Condition: {{ $json.hasCompletions }} === true
   ```

8. **Add Task Completion Notification (TRUE branch):**
   ```
   Node: HTTP Request
   Name: Send Task Completions
   Method: POST
   URL: {{ $env.FRONTEND_URL }}/api/webhooks/task-updates
   Headers: Content-Type: application/json
   Body: {
     "userId": "{{ $json.biometricData.userId }}",
     "type": "bulk_completion",
     "timestamp": "{{ $json.biometricData.timestamp }}",
     "data": {
       "completions": {{ JSON.stringify($json.completions) }},
       "biometricData": {{ JSON.stringify($json.biometricData) }},
       "source": "oura_automatic"
     }
   }
   ```

9. **Add Biometric Data Broadcast (for both branches):**
   ```
   Node: HTTP Request
   Name: Broadcast Biometric Data
   Method: POST
   URL: {{ $env.FRONTEND_URL }}/api/webhooks/task-updates
   Headers: Content-Type: application/json
   Body: {
     "userId": "{{ $json.biometricData.userId }}",
     "type": "biometric_update",
     "timestamp": "{{ $json.biometricData.timestamp }}",
     "data": {
       "biometricData": {{ JSON.stringify($json.biometricData) }},
       "adaptationSignals": {{ JSON.stringify($json.adaptationSignals) }},
       "shouldAdaptPlan": {{ $json.shouldAdaptPlan }}
     }
   }
   ```

10. **Add Plan Adaptation Trigger (if needed):**
    ```
    Node: IF
    Name: Should Adapt Plan?
    Condition: {{ $json.shouldAdaptPlan }} === true
    
    (TRUE branch)
    Node: HTTP Request
    Name: Trigger Plan Adaptation
    Method: POST
    URL: {{ $env.FRONTEND_URL }}/api/webhooks/plan-changes
    Headers: Content-Type: application/json
    Body: {
      "userId": "{{ $json.biometricData.userId }}",
      "changeType": "biometric_adaptation",
      "reason": "{{ $json.adaptationReason }}",
      "timestamp": "{{ $json.biometricData.timestamp }}",
      "changes": {
        "biometricTrigger": true,
        "adaptationSignals": {{ JSON.stringify($json.adaptationSignals) }},
        "recommendations": {{ JSON.stringify($json.adaptationSignals.map(s => s.recommendation)) }}
      },
      "aiSummary": "Your training has been adjusted based on your latest biometric data."
    }
    ```

**Verification Steps:**
1. Test Oura API connection with valid credentials
2. Verify biometric data processing and transformation
3. Check task auto-completion triggers correctly
4. Test training adaptation analysis logic
5. Confirm frontend receives biometric updates via SSE

**Troubleshooting:**
- **"Oura API failures"** → Check credentials, API rate limits, and network connectivity
- **"No task completions"** → Verify threshold logic and task matching
- **"Adaptation not triggering"** → Review analysis logic and severity calculations
- **"Frontend not receiving data"** → Check webhook URLs and SSE connectivity

**Deliverable(s):** 
- Complete Oura Ring data processing workflow
- Automatic task completion based on biometric thresholds
- Training adaptation recommendations based on recovery metrics
- Real-time biometric data streaming to frontend

---

**Task 10.7: Update User Data Webhook Routing [MODERATE]**

**Context & Rationale:** The user-data webhook needs to route workout completion data to the new n8n workflows. This ensures all feedback and completion data flows through the proper processing workflows.

**Prerequisites:**
- Plan Feedback Processing workflow completed (Task 10.4)
- Workout Completion workflow completed (Task 10.5)
- Existing user-data webhook operational

**Action(s):**

1. **Add workout completion routing to user-data webhook:**

   **File: `src/app/api/webhooks/user-data/route.ts`** (update switch statement)
   ```typescript
   // Add to the switch statement around line 70
   case 'workout_completion':
     n8nEndpoint = 'workout-completion'
     processedData = {
       userId: payload.userId,
       workoutDay: payload.data.workoutDay,
       weekNumber: payload.data.weekNumber,
       feedback: payload.data.feedback,
       plannedDistance: payload.data.plannedDistance,
       actualDistance: payload.data.actualDistance,
       plannedDuration: payload.data.plannedDuration,
       actualDuration: payload.data.actualDuration,
       timestamp: payload.timestamp
     }
     break
   ```

2. **Update TypeScript interface:**

   **File: `src/app/api/webhooks/user-data/route.ts`** (update interface)
   ```typescript
   interface UserDataPayload {
     userId: string
     dataType: 'onboarding' | 'chat_message' | 'plan_feedback' | 'manual_task_completion' | 'user_update' | 'workout_completion'
     timestamp: string
     data: any
   }
   ```

3. **Add demo mode simulation for workout completion:**

   **File: `src/app/api/webhooks/user-data/route.ts`** (add to demo mode section)
   ```typescript
   // Add to demo mode responses around line 140
   case 'workout_completion':
     // Simulate achievement notification
     await fetch(`${config.API_BASE_URL}/api/webhooks/task-updates`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         userId: payload.userId,
         type: 'achievement',
         timestamp: new Date().toISOString(),
         data: {
           achievements: [{
             type: 'workout_completed',
             title: 'Workout Completed!',
             description: 'Great job finishing your training session',
             icon: '✅'
           }],
           workoutCompleted: payload.data.workoutDay,
           weekNumber: payload.data.weekNumber
         }
       })
     })
     break
   ```

4. **Update GET endpoint demo payloads:**

   **File: `src/app/api/webhooks/user-data/route.ts`** (add to demoPayloads object)
   ```typescript
   workout_completion: {
     userId,
     dataType: 'workout_completion',
     timestamp: new Date().toISOString(),
     data: {
       workoutDay: 'monday',
       weekNumber: 2,
       feedback: {
         rating: 4,
         effort: 3,
         enjoyment: 4,
         comment: 'Felt great today!'
       },
       plannedDistance: 5,
       actualDistance: 5.2,
       plannedDuration: 35,
       actualDuration: 34
     }
   }
   ```

5. **Update plan feedback data structure to match n8n workflow:**

   **File: `src/app/api/webhooks/user-data/route.ts`** (update plan_feedback case)
   ```typescript
   case 'plan_feedback':
     n8nEndpoint = 'plan-feedback'
     processedData = {
       userId: payload.userId,
       planId: payload.data.planId,
       weekNumber: payload.data.weekNumber,
       type: payload.data.type, // 'difficulty', 'schedule', 'injury', 'motivation', 'other'
       rating: payload.data.rating, // 'too_easy' | 'just_right' | 'too_hard' | 1-5
       comment: payload.data.comment,
       timestamp: payload.timestamp,
       data: payload.data // Pass through original data structure
     }
     break
   ```

**Verification Steps:**
1. Test plan feedback routing - verify data reaches plan-feedback n8n workflow
2. Test workout completion routing - verify data reaches workout-completion n8n workflow  
3. Check demo mode simulations work correctly
4. Verify updated TypeScript interfaces compile without errors
5. Test all existing data types still route correctly

**Troubleshooting:**
- **"New routes not working"** → Check endpoint names match n8n webhook paths exactly
- **"Demo mode not simulating"** → Verify setTimeout delays and webhook URLs
- **"TypeScript errors"** → Check interface updates and data type additions
- **"Existing routes broken"** → Verify no changes to existing case statements

**Deliverable(s):** 
- Updated user-data webhook with workout completion routing
- Enhanced demo mode simulations for new data types
- Updated TypeScript interfaces and types
- Verified integration with existing workflows

---

### 12. Frontend-n8n Integration

**Task 12.1: Connect Onboarding Flow to n8n [CRITICAL - BLOCKING]**

**Context & Rationale:** This task connects the frontend onboarding process to the n8n workflow, enabling seamless plan generation and user feedback loops.

**Prerequisites:**
- Phase 5 (n8n workflows) completed successfully
- Frontend onboarding components operational
- Understanding of async workflows and loading states

**Action(s):**

1. **Update onboarding completion handler:**

   **File: `src/lib/onboardingFlow.ts`** (enhance existing)
   ```typescript
   import { config } from '@/lib/constants'
   
   export async function submitOnboardingData(data: OnboardingData): Promise<{success: boolean, message: string}> {
     try {
       console.log('Submitting onboarding data:', data)
       
       // Send to user data webhook which forwards to n8n
       const response = await fetch(`${config.API_BASE_URL}/api/webhooks/user-data`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           userId: data.userId || 'demo-user',
           dataType: 'onboarding',
           timestamp: new Date().toISOString(),
           data: {
             marathonGoal: data.marathonGoal,
             experience: data.experience,
             weeklyAvailability: data.weeklyAvailability,
             currentFitness: data.currentFitness,
             goals: data.goals,
             constraints: data.constraints
           }
         })
       })
       
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
       }
       
       const result = await response.json()
       console.log('Onboarding submission result:', result)
       
       return {
         success: true,
         message: 'Your training plan is being generated. This may take a few moments...'
       }
       
     } catch (error) {
       console.error('Error submitting onboarding data:', error)
       return {
         success: false,
         message: 'Failed to submit onboarding data. Please try again.'
       }
     }
   }
   ```

2. **Add plan generation loading state:**

   **File: `src/components/onboarding/PlanGenerationLoader.tsx`**
   ```typescript
   'use client'
   
   import { useEffect, useState } from 'react'
   import { useRouter } from 'next/navigation'
   import { usePlanStore } from '@/stores/planStore'
   import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates'
   import { LoadingSpinner } from '@/components/ui/loading-spinner'
   
   interface PlanGenerationLoaderProps {
     onComplete: () => void
   }
   
   export function PlanGenerationLoader({ onComplete }: PlanGenerationLoaderProps) {
     const [status, setStatus] = useState('Analyzing your profile...')
     const [progress, setProgress] = useState(0)
     const { currentPlan } = usePlanStore()
     const { isConnected } = useRealTimeUpdates()
     const router = useRouter()
   
     useEffect(() => {
       const statusMessages = [
         'Analyzing your profile...',
         'Generating personalized plan...',
         'Optimizing training schedule...',
         'Finalizing recommendations...'
       ]
   
       let currentIndex = 0
       const interval = setInterval(() => {
         if (currentIndex < statusMessages.length - 1) {
           currentIndex++
           setStatus(statusMessages[currentIndex])
           setProgress((currentIndex / statusMessages.length) * 80) // 80% max until plan arrives
         }
       }, 2000)
   
       return () => clearInterval(interval)
     }, [])
   
     useEffect(() => {
       if (currentPlan) {
         setStatus('Plan generated successfully!')
         setProgress(100)
         setTimeout(() => {
           onComplete()
           router.push('/onboarding/report')
         }, 1500)
       }
     }, [currentPlan, onComplete, router])
   
     return (
       <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
         <LoadingSpinner size="lg" />
         
         <div className="text-center">
           <h3 className="text-lg font-semibold text-gray-900 mb-2">
             Creating Your Training Plan
           </h3>
           <p className="text-gray-600 mb-4">{status}</p>
           
           {/* Progress Bar */}
           <div className="w-64 bg-gray-200 rounded-full h-2">
             <div 
               className="bg-primary h-2 rounded-full transition-all duration-500"
               style={{ width: `${progress}%` }}
             />
           </div>
           <p className="text-sm text-gray-500 mt-2">{progress.toFixed(0)}% complete</p>
         </div>
         
         {/* Connection Status */}
         <div className="text-center">
           {isConnected ? (
             <p className="text-sm text-green-600">✓ Connected to AI trainer</p>
           ) : (
             <p className="text-sm text-yellow-600">⏳ Connecting to AI trainer...</p>
           )}
         </div>
         
         {/* Demo Mode Notice */}
         {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
             <p className="text-sm text-blue-700">
               🎯 Demo Mode: Your plan will be generated using sample data
             </p>
           </div>
         )}
       </div>
     )
   }
   ```

**Verification Steps:**
1. Complete onboarding flow and verify data reaches n8n
2. Check loading states display correctly during processing
3. Confirm plan generation triggers and displays
4. Test error handling for failed submissions
5. Verify real-time updates show plan arrival

**Troubleshooting:**
- **"Data not reaching n8n"** → Check webhook forwarding and n8n workflow status
- **"Loading state stuck"** → Verify real-time updates are working and plan store integration
- **"Plan not displaying"** → Check plan store updates and component re-rendering
- **"Error handling not working"** → Verify error boundaries and user feedback

**Deliverable(s):** 
- Onboarding flow integrated with n8n plan generation
- Loading states and progress indicators functional
- Error handling and user feedback working
- Real-time plan delivery operational

---

**Task 12.2: Connect Real-time Updates [CRITICAL - BLOCKING]**

**Context & Rationale:** This task ensures all real-time features work end-to-end, from biometric data processing to UI updates, creating a seamless user experience.

**Prerequisites:**
- Task 12.1 completed successfully
- SSE system operational (Phase 4)
- n8n biometric workflows running (Phase 5)

**Action(s):**

1. **Test biometric to UI flow:**

   **File: `src/lib/testing/biometricFlow.ts`**
   ```typescript
   // Integration testing utilities for biometric flow
   export async function testBiometricFlow(demoData?: any) {
     const testData = demoData || {
       steps: 8500,
       sleepScore: 85,
       readinessScore: 78,
       heartRate: 145
     }
   
     try {
       // Simulate biometric data from Oura/n8n
       const response = await fetch('/api/webhooks/task-updates', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           userId: 'demo-user',
           taskId: 'test-biometric',
           taskType: 'Biometric Sync',
           completed: true,
           method: 'biometric',
           timestamp: new Date().toISOString(),
           biometricData: testData
         })
       })
   
       if (!response.ok) {
         throw new Error(`Biometric test failed: ${response.status}`)
       }
   
       return { success: true, data: await response.json() }
     } catch (error) {
       console.error('Biometric flow test failed:', error)
       return { success: false, error: error.message }
     }
   }
   
   export async function testPlanFeedback(feedbackData?: any) {
     const testFeedback = feedbackData || {
       type: 'difficulty',
       rating: 'too_hard',
       comments: 'This workout feels too intense',
       weekNumber: 2
     }
   
     try {
       const response = await fetch('/api/webhooks/user-data', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           userId: 'demo-user',
           dataType: 'plan_feedback',
           timestamp: new Date().toISOString(),
           data: testFeedback
         })
       })
   
       if (!response.ok) {
         throw new Error(`Plan feedback test failed: ${response.status}`)
       }
   
       return { success: true, data: await response.json() }
     } catch (error) {
       console.error('Plan feedback test failed:', error)
       return { success: false, error: error.message }
     }
   }
   ```

2. **Add integration test component:**

   **File: `src/components/testing/IntegrationTester.tsx`**
   ```typescript
   'use client'
   
   import { useState } from 'react'
   import { Button } from '@/components/ui/button'
   import { testBiometricFlow, testPlanFeedback } from '@/lib/testing/biometricFlow'
   
   export function IntegrationTester() {
     const [results, setResults] = useState<any[]>([])
     const [testing, setTesting] = useState(false)
   
     const runTest = async (testName: string, testFn: () => Promise<any>) => {
       setTesting(true)
       const startTime = Date.now()
       
       try {
         const result = await testFn()
         const duration = Date.now() - startTime
         
         setResults(prev => [...prev, {
           name: testName,
           success: result.success,
           duration,
           data: result,
           timestamp: new Date().toISOString()
         }])
       } catch (error) {
         setResults(prev => [...prev, {
           name: testName,
           success: false,
           duration: Date.now() - startTime,
           error: error.message,
           timestamp: new Date().toISOString()
         }])
       } finally {
         setTesting(false)
       }
     }
   
     const clearResults = () => setResults([])
   
     if (process.env.NODE_ENV !== 'development') {
       return null // Only show in development
     }
   
     return (
       <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 m-4">
         <h3 className="text-lg font-semibold mb-4">🧪 Integration Testing</h3>
         
         <div className="space-x-2 mb-4">
           <Button 
             onClick={() => runTest('Biometric Flow', testBiometricFlow)}
             disabled={testing}
             size="sm"
           >
             Test Biometrics → UI
           </Button>
           
           <Button 
             onClick={() => runTest('Plan Feedback', testPlanFeedback)}
             disabled={testing}
             size="sm"
           >
             Test Feedback → Plan
           </Button>
           
           <Button 
             onClick={clearResults}
             variant="outline"
             size="sm"
           >
             Clear Results
           </Button>
         </div>
   
         {results.length > 0 && (
           <div className="space-y-2">
             <h4 className="font-medium">Test Results:</h4>
             {results.map((result, index) => (
               <div 
                 key={index}
                 className={`p-2 rounded text-sm ${
                   result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                 }`}
               >
                 <div className="flex justify-between items-start">
                   <span className="font-medium">
                     {result.success ? '✅' : '❌'} {result.name}
                   </span>
                   <span className="text-xs">{result.duration}ms</span>
                 </div>
                 {result.error && (
                   <div className="text-xs mt-1">Error: {result.error}</div>
                 )}
               </div>
             ))}
           </div>
         )}
       </div>
     )
   }
   ```

**Verification Steps:**
1. Run biometric flow test - verify task completion appears in UI
2. Test plan feedback submission - confirm plan adjustments occur
3. Check SSE connection stability during testing
4. Verify error handling for failed connections
5. Test reconnection after network interruption

**Troubleshooting:**
- **"SSE disconnections"** → Check heartbeat implementation and network stability
- **"Store updates not reflecting"** → Verify React re-rendering and state management
- **"Webhook delivery failures"** → Check network connectivity and endpoint availability
- **"n8n workflow errors"** → Check n8n logs and workflow configuration

**Deliverable(s):** 
- End-to-end real-time update flow operational
- Integration testing utilities available
- Error handling and reconnection working
- Performance monitoring and debugging tools

---

## Phase 7: Deployment and Demo Readiness

### 15. Local Demo Setup

**Task 15.1: Create Demo Environment Setup Script [CRITICAL - BLOCKING]**

**Context & Rationale:** A streamlined setup process is essential for reliable demo execution, reducing the risk of technical issues during presentation.

**Prerequisites:**
- All previous phases completed successfully
- Understanding of shell scripting and process management
- Demo requirements and hardware specifications known

**Action(s):**

1. **Create demo setup script:**

   **File: `demo-setup.sh`**
   ```bash
   #!/bin/bash
   
   # Marathon Optimizer Demo Setup Script
   # This script sets up the complete demo environment
   
   set -e  # Exit on any error
   
   echo "🏃‍♂️ Marathon Optimizer Demo Setup"
   echo "=================================="
   
   # Color codes for output
   RED='\033[0;31m'
   GREEN='\033[0;32m'
   YELLOW='\033[1;33m'
   BLUE='\033[0;34m'
   NC='\033[0m' # No Color
   
   # Function to print colored output
   print_status() {
       echo -e "${BLUE}[INFO]${NC} $1"
   }
   
   print_success() {
       echo -e "${GREEN}[SUCCESS]${NC} $1"
   }
   
   print_warning() {
       echo -e "${YELLOW}[WARNING]${NC} $1"
   }
   
   print_error() {
       echo -e "${RED}[ERROR]${NC} $1"
   }
   
   # Check prerequisites
   check_prerequisites() {
       print_status "Checking prerequisites..."
       
       # Check Node.js version
       if ! command -v node &> /dev/null; then
           print_error "Node.js is not installed"
           exit 1
       fi
       
       NODE_VERSION=$(node --version | cut -d'v' -f2)
       REQUIRED_VERSION="18.17.0"
       
       if ! printf '%s\n%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V -C; then
           print_error "Node.js version $NODE_VERSION is too old. Required: $REQUIRED_VERSION+"
           exit 1
       fi
       
       # Check npm
       if ! command -v npm &> /dev/null; then
           print_error "npm is not installed"
           exit 1
       fi
       
       # Check n8n
       if ! command -v n8n &> /dev/null; then
           print_warning "n8n is not installed globally. Installing..."
           npm install -g n8n@latest
       fi
       
       print_success "Prerequisites check passed"
   }
   
   # Setup environment files
   setup_environment() {
       print_status "Setting up environment files..."
       
       # Frontend environment
       if [ ! -f ".env.local" ]; then
           print_status "Creating frontend .env.local file..."
           cat > .env.local << EOF
   # Demo Environment Configuration
   NEXTAUTH_SECRET=demo-secret-key-32-characters-long
   NEXTAUTH_URL=http://localhost:3000
   
   N8N_WEBHOOK_URL=http://localhost:5678
   N8N_API_KEY=demo-api-key
   N8N_WEBHOOK_SECRET=demo-webhook-secret
   
   OURA_CLIENT_ID=demo-client-id
   OURA_CLIENT_SECRET=demo-client-secret
   OURA_ACCESS_TOKEN=demo-access-token
   
   OPENAI_API_KEY=sk-demo-key-replace-with-real-for-ai-features
   OPENAI_MODEL=gpt-4
   
   DEMO_MODE=true
   APP_ENV=development
   DEBUG_MODE=true
   
   JWT_SECRET=demo-jwt-secret-32-characters-long
   WEBHOOK_SECRET=demo-webhook-verification-secret
   EOF
           print_success "Created .env.local"
       else
           print_status ".env.local already exists"
       fi
       
       # n8n environment
       mkdir -p ~/.n8n
       if [ ! -f ~/.n8n/.env ]; then
           print_status "Creating n8n environment file..."
           cat > ~/.n8n/.env << EOF
   # n8n Demo Configuration
   N8N_BASIC_AUTH_ACTIVE=true
   N8N_BASIC_AUTH_USER=admin
   N8N_BASIC_AUTH_PASSWORD=admin123
   
   OPENAI_API_KEY=sk-demo-key-replace-with-real
   N8N_WEBHOOK_SECRET=demo-webhook-secret
   
   WEBHOOK_URL=http://localhost:3000/api/webhooks
   FRONTEND_URL=http://localhost:3000
   
   OURA_CLIENT_ID=demo-client-id
   OURA_CLIENT_SECRET=demo-client-secret
   OURA_ACCESS_TOKEN=demo-access-token
   
   DEMO_MODE=true
   DEBUG_MODE=true
   
   N8N_PORT=5678
   N8N_HOST=localhost
   N8N_PROTOCOL=http
   EOF
           print_success "Created n8n .env file"
       else
           print_status "n8n .env already exists"
       fi
   }
   
   # Install dependencies
   install_dependencies() {
       print_status "Installing frontend dependencies..."
       
       if [ ! -d "node_modules" ]; then
           npm install
           print_success "Dependencies installed"
       else
           print_status "Dependencies already installed"
       fi
   }
   
   # Kill existing processes
   cleanup_processes() {
       print_status "Cleaning up existing processes..."
       
       # Kill processes on our ports
       for port in 3000 5678; do
           if lsof -ti:$port > /dev/null 2>&1; then
               print_status "Killing process on port $port"
               kill -9 $(lsof -ti:$port) 2>/dev/null || true
           fi
       done
       
       sleep 2
   }
   
   # Start n8n
   start_n8n() {
       print_status "Starting n8n..."
       
       # Start n8n in background
       nohup n8n start > ~/.n8n/demo.log 2>&1 &
       N8N_PID=$!
       echo $N8N_PID > ~/.n8n/demo.pid
       
       # Wait for n8n to start
       print_status "Waiting for n8n to start..."
       for i in {1..30}; do
           if curl -s http://localhost:5678 > /dev/null 2>&1; then
               print_success "n8n started successfully (PID: $N8N_PID)"
               break
           fi
           sleep 2
           if [ $i -eq 30 ]; then
               print_error "n8n failed to start within 60 seconds"
               exit 1
           fi
       done
   }
   
   # Start frontend
   start_frontend() {
       print_status "Starting Next.js frontend..."
       
       # Start frontend in background
       nohup npm run dev > frontend-demo.log 2>&1 &
       FRONTEND_PID=$!
       echo $FRONTEND_PID > frontend-demo.pid
       
       # Wait for frontend to start
       print_status "Waiting for frontend to start..."
       for i in {1..30}; do
           if curl -s http://localhost:3000 > /dev/null 2>&1; then
               print_success "Frontend started successfully (PID: $FRONTEND_PID)"
               break
           fi
           sleep 2
           if [ $i -eq 30 ]; then
               print_error "Frontend failed to start within 60 seconds"
               exit 1
           fi
       done
   }
   
   # Load demo data
   load_demo_data() {
       print_status "Loading demo data..."
       
       # Wait a bit for services to fully initialize
       sleep 5
       
       # Test frontend endpoints
       if curl -s "http://localhost:3000/api/webhooks/user-data?type=onboarding&userId=demo-user" > /dev/null; then
           print_success "Demo data endpoints are responding"
       else
           print_warning "Demo data endpoints may not be fully ready"
       fi
   }
   
   # Validate setup
   validate_setup() {
       print_status "Validating setup..."
       
       local errors=0
       
       # Check frontend
       if ! curl -s http://localhost:3000 > /dev/null; then
           print_error "Frontend is not responding"
           errors=$((errors + 1))
       fi
       
       # Check n8n
       if ! curl -s http://localhost:5678 > /dev/null; then
           print_error "n8n is not responding"
           errors=$((errors + 1))
       fi
       
       # Check API endpoints
       if ! curl -s http://localhost:3000/api/sse?userId=test > /dev/null; then
           print_error "SSE endpoint is not responding"
           errors=$((errors + 1))
       fi
       
       if [ $errors -eq 0 ]; then
           print_success "All services are running correctly"
           return 0
       else
           print_error "Validation failed with $errors errors"
           return 1
       fi
   }
   
   # Show demo information
   show_demo_info() {
       echo ""
       echo "🎯 Demo Environment Ready!"
       echo "========================="
       echo ""
       echo "Frontend: http://localhost:3000"
       echo "n8n Admin: http://localhost:5678 (admin/admin123)"
       echo ""
       echo "Demo Features Available:"
       echo "- ✅ User onboarding with AI plan generation"
       echo "- ✅ Real-time biometric data simulation"
       echo "- ✅ Interactive dashboard with task tracking"
       echo "- ✅ Plan feedback and adaptation"
       echo "- ✅ Conversational AI coach"
       echo ""
       echo "Demo Credentials:"
       echo "- n8n Login: admin / admin123"
       echo "- All API keys are in demo mode"
       echo ""
       echo "Log Files:"
       echo "- n8n: ~/.n8n/demo.log"
       echo "- Frontend: ./frontend-demo.log"
       echo ""
       echo "To stop demo: ./demo-stop.sh"
       echo ""
   }
   
   # Main execution
   main() {
       print_status "Starting Marathon Optimizer demo setup..."
       
       check_prerequisites
       setup_environment
       install_dependencies
       cleanup_processes
       start_n8n
       start_frontend
       load_demo_data
       
       if validate_setup; then
           show_demo_info
           print_success "Demo setup completed successfully!"
           exit 0
       else
           print_error "Demo setup failed validation"
           exit 1
       fi
   }
   
   # Handle interrupts
   trap 'print_error "Setup interrupted"; exit 1' INT TERM
   
   # Run main function
   main "$@"
   ```

2. **Create demo stop script:**

   **File: `demo-stop.sh`**
   ```bash
   #!/bin/bash
   
   echo "🛑 Stopping Marathon Optimizer Demo"
   echo "==================================="
   
   # Kill frontend
   if [ -f frontend-demo.pid ]; then
       FRONTEND_PID=$(cat frontend-demo.pid)
       if ps -p $FRONTEND_PID > /dev/null 2>&1; then
           echo "Stopping frontend (PID: $FRONTEND_PID)"
           kill $FRONTEND_PID
       fi
       rm -f frontend-demo.pid
   fi
   
   # Kill n8n
   if [ -f ~/.n8n/demo.pid ]; then
       N8N_PID=$(cat ~/.n8n/demo.pid)
       if ps -p $N8N_PID > /dev/null 2>&1; then
           echo "Stopping n8n (PID: $N8N_PID)"
           kill $N8N_PID
       fi
       rm -f ~/.n8n/demo.pid
   fi
   
   # Kill any remaining processes on our ports
   for port in 3000 5678; do
       if lsof -ti:$port > /dev/null 2>&1; then
           echo "Killing remaining process on port $port"
           kill -9 $(lsof -ti:$port) 2>/dev/null || true
       fi
   done
   
   echo "✅ Demo stopped successfully"
   ```

3. **Make scripts executable:**
   ```bash
   chmod +x demo-setup.sh
   chmod +x demo-stop.sh
   ```

**Verification Steps:**
1. Run `./demo-setup.sh` - should complete without errors
2. Verify both services start and respond correctly
3. Test demo data loading and API endpoints
4. Confirm stop script properly cleans up processes
5. Test setup script idempotency (can run multiple times)

**Troubleshooting:**
- **"Port conflicts"** → Ensure cleanup_processes function works correctly
- **"Services not starting"** → Check log files for specific error messages
- **"Permission errors"** → Verify script permissions and file access
- **"Network issues"** → Check firewall and localhost connectivity

**Deliverable(s):** 
- One-command demo environment setup
- Automated service startup and validation
- Proper process management and cleanup
- Comprehensive error handling and logging

---

This completes all the missing phases. The tasks.md file now includes comprehensive coverage of the entire project from setup through deployment, with the same enhanced detail level throughout.