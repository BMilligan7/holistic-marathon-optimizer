# Holistic Marathon Optimizer MVP

## overview

### project summary
The Holistic Marathon Optimizer MVP is a personalized, adaptive marathon training agent delivered as a conversational web app. It leverages onboarding, continuous user profiling, chat input, and Oura Ring integration to provide tailored daily tasks, adaptive training plans, and holistic advice—covering exercise, nutrition, sleep, and mental preparation. The MVP is grounded in Hal Higdon's marathon training frameworks and adapts plans over time based on user feedback and real/simulated wearable data via n8n backend orchestration.

### purpose of the document
This Product Requirements Document (PRD) defines all critical requirements, user stories, technical stack, flows, and known risks for a rapid, demo-ready MVP. The focus is on delivering a minimal yet functional, testable product experience for a live demo before 5:00 PM tomorrow.

---

## goals and objectives

### primary goals
- Deliver a personalized marathon training experience using AI-driven profiling and adaptive training plans.
- Adjust training and advice based on onboarding, ongoing feedback, Oura Ring biometric data, and user chat.
- Provide actionable, holistic guidance—exercise, nutrition, sleep, and mental prep—for marathon readiness.
- Minimize manual effort by automating daily task tracking and completion via biometric thresholds.

### "Personalized" definition
- Users report that their plan feels tailored to their needs and fosters comfort and confidence.
- The plan dynamically updates in response to onboarding data, feedback, and wearable input.
- The AI adapts recommendations based on user's ongoing interactions.

### time frame
- MVP must be ready for a live demo by 5:00 PM tomorrow.

---

## success metrics

- **Onboarding completion rate:** ≥ 70% of sign-ups successfully complete onboarding flow.
- **Oura Ring integration rate:** ≥ 60% of users connect Oura Ring (for demo, simulated data is acceptable).
- **Daily task completion rate:** ≥ 80% among active users (for demo, user/AI should be able to complete daily tasks).
- **User-reported plan satisfaction:** ≥ 80% "just right" or "satisfied" feedback (for demo, measured by simulated user feedback).
- **Active user retention:** ≥ 50% after 4 weeks (*post-demo/iteration metric*).

---

## scope

### in-scope for MVP
- Conversational onboarding chatbot to collect goals, marathon experience, schedule, and constraints.
- Generation of an instant report summarizing user's training readiness and first step.
- Post-onboarding integration with Oura Ring (or simulated wearable data).
- Dashboard displaying daily tasks, with auto-completion via Oura data and option for manual completion.
- Basic insights on sleep, nutrition, and mental preparation based on Oura metrics.
- Visual progress indicator (simple progress bar or equivalent).
- Adaptive training plan page with week/day view and rationale for plan changes.
- Feedback loop: user input, chat, and wearable data drive plan recalibration.
- Secure account creation/login (email/social or basic authentication).
- MVP-level integration with OpenAI for plan generation and adaptation.
- Data storage in Google Sheets with n8n memory feature for user context.
- Real-time notification system via webhooks/Server-Sent Events.
- Hourly biometric data processing and task completion automation.

### out-of-scope for MVP
- All wearables except Oura Ring.
- Badges, streaks, race countdown, and motivational gamification.
- Accessibility features (acknowledged, to be added post-demo).
- In-depth race simulation, post-marathon analytics, advanced nutritional/injury planning.
- Social, group, meme, or community features.
- Native mobile apps (web app only).
- Complex calendar integration (UI stub only if included).

---

## user personas

- **aspiring marathoner:** New to marathons, wants a structured, adaptive, beginner-friendly plan.
- **experienced runner:** Has marathon experience, seeks data-driven, advanced personalization.
- **tech-forward athlete:** Uses Oura Ring, values automation, analytics, and actionable insights.
- **motivated improver:** Wants holistic guidance (nutrition, sleep, mental) beyond just training.

---

## user stories and acceptance criteria

### onboarding

- **US-001:** As a new user, I answer onboarding questions via chatbot so my plan is tailored to me.
  - Chatbot collects goals, experience, schedule, and constraints.
  - Handles skipped/ambiguous answers by prompting clarification.
  - Shows confirmation of user profile before plan is generated.

- **US-002:** As a new user, I receive an instant report with my readiness and first actionable step.
  - Report generated from onboarding answers.
  - Clearly explains readiness status and at least one actionable "quick win."

### authentication and secure access

- **US-003:** As a user, I can securely create an account and log in (email/social or basic auth).
  - Secure password policies or OAuth supported.
  - Password reset and session management.
  - User data protected from unauthorized access.

### Oura Ring integration

- **US-004:** As a user, I can connect my Oura Ring so my real biometric data is used for plan personalization and automatic task completion.
  - User prompted to connect Oura Ring after onboarding.
  - Auto-completes tasks based on Oura activity, sleep, and readiness data.
  - If Oura data is missing/delayed, user is notified and can proceed with manual input.

- **US-005:** If Oura Ring is unsupported or unsynced, I see clear error messages and basic troubleshooting instructions.

### dashboard and daily tasks

- **US-006:** I see my daily tasks and can mark them as complete manually, with automatic completion via Oura data.
  - Daily tasks displayed on dashboard.
  - Auto-complete with Oura biometric thresholds, manual mark otherwise.
  - Manual input always overrides wearable data in case of conflict.

- **US-007:** I see actionable, basic insights about sleep, nutrition, and mental prep based on Oura metrics.
  - Insights update as user data/feedback changes.
  - Insights remain basic and clear for MVP.

- **US-008:** I see my progress visually (e.g., progress bar)—no badges, streaks, or race countdown for MVP.

### plan page and adaptivity

- **US-009:** I view my complete marathon training plan by week and day, with explanations for any changes.
  - Plan page shows all scheduled workouts.
  - Week/day toggle supported.
  - When plan changes, rationale for changes is displayed.

- **US-010:** I provide feedback ("too easy/just right/too hard") so my plan adapts.
  - Quick feedback buttons after each workout or task.
  - Feedback triggers recalibration or updates to the plan.

- **US-011:** Plan adjusts automatically based on feedback or Oura data.
  - User is notified of adjustments via real-time updates.
  - User can accept/reject changes or revert to a previous plan version (UI-level for MVP).

### chatbot and ongoing engagement

- **US-012:** I interact with a chatbot to update my goal, reschedule my race, or ask questions.
  - Chatbot widget available on dashboard and plan page.
  - Chatbot responds to plan change requests and FAQs.

- **US-013:** I receive real-time notifications when tasks are completed or plans are updated.

### edge cases and error handling

- **US-014:** I can skip wearable integration and still use the app manually.
  - All features function with manual entry if no Oura data is present.

- **US-015:** I am informed if any feature is unavailable, network failures occur, or my device/input is not supported, with clear explanations.

---

## user flows

### onboarding flow
1. User signs up/logs in securely.
2. Conversational Q&A chatbot collects marathon profile, goals, and schedule.
3. Instant report presented with readiness and first action.
4. Prompt for Oura Ring connection (optional).
5. User lands on dashboard.

### daily use flow
1. User visits dashboard, sees daily tasks and insights.
2. Oura sync: tasks auto-complete hourly based on biometric thresholds or user marks tasks manually.
3. User provides feedback ("just right," "too hard," etc.).
4. Plan and insights update in real-time.

### plan adjustment flow
1. Feedback or Oura data triggers plan recalibration in n8n.
2. AI updates plan, rationale shown via webhook to frontend.
3. User reviews, accepts, or rejects new plan.

### chatbot interaction flow
1. User opens chatbot widget (dashboard or plan page).
2. User asks about plan, updates goal, or requests changes.
3. Chatbot responds or triggers plan update via n8n workflow.

---

## technical requirements

### architecture
- **backend:** n8n orchestrates AI calls, Oura Ring data fetching, biometric analysis, and core business logic.
- **frontend:** React/Next.js web app with webhook endpoints for real-time updates via Server-Sent Events.
- **database:** Google Sheets for data storage with n8n memory feature for user context and historical data.
- **integrations:** Oura Ring API, OpenAI (plan/advice generation, feedback-driven adaptation).

### data flow
```
Frontend → n8n webhooks (user input, chat data, manual overrides)
Oura Ring → n8n (hourly biometric data fetch)
n8n → AI processing → biometric threshold analysis → task completion logic
n8n → Frontend webhooks (task updates, plan changes, notifications)
Frontend → Real-time UI updates (dashboard, progress, notifications)
```

### biometric task completion thresholds
- **Quality Sleep:** sleepScore > 70 && sleepDuration > 7.5 && sleepEfficiency > 85
- **Daily Movement:** steps > 8000 && contributors.meet_daily_targets > 80
- **Training Readiness:** readinessScore > 70 && restingHeartRate < userBaseline + 5
- **Intense Workout:** active_calories > 300 && medium_activity_time > 2400 && score > 80
- **Recovery Day:** readinessScore < 50 triggers mandatory rest, overrides planned workouts

### security
- HTTPS for all user data transmission.
- OAuth or secure password authentication.
- No personally identifiable information (PII) in logs or API calls.

---

## out of scope / future enhancements

- All other wearables/integrations except Oura Ring.
- Motivational gamification (badges, streaks, race countdown).
- Advanced analytics, post-marathon reports, and deep nutrition/injury tracking.
- Social, group, or community features.
- Accessibility for users with disabilities (to be addressed post-demo).
- Native mobile application.
- Live calendar integration (stub only if needed).

---

## open questions & risks

- What is the fallback if Oura Ring integration fails or APIs change?
- How will user privacy and compliance be managed for MVP data flows?
- How can plan adjustment rationale be both simple and sufficiently transparent for demo?
- What's the backup if OpenAI or n8n integration is slow/unreliable?
- How to handle network failures between frontend and n8n webhooks?
- How to handle demo breakage or user error (e.g., skipping all onboarding, failing Oura connection)?
- What happens if biometric thresholds are incorrectly calibrated for individual users?

---

## appendices

### biometric threshold specifications
- **Sleep Tasks:** Based on Oura sleep summary (duration, efficiency, score)
- **Activity Tasks:** Based on Oura activity summary (steps, calories, activity time, score)
- **Recovery Tasks:** Based on Oura readiness summary (HRV, resting HR, readiness score)
- **Override Logic:** Manual user input always takes precedence over biometric completion

### webhook endpoints
- `/api/webhooks/task-updates` - Receives task completion updates from n8n
- `/api/webhooks/plan-changes` - Receives plan modifications from n8n
- `/api/webhooks/user-data` - Sends user input/feedback to n8n

### n8n workflow components
- Hourly Oura data fetch and processing
- Biometric threshold analysis and task completion
- OpenAI integration for plan adaptation
- Memory management for user context
- Webhook dispatching for frontend updates

---

### notes

- MVP supports only Oura Ring for wearable data.
- Manual entry takes precedence over device data in event of conflict.
- Real-time notification system via webhooks and Server-Sent Events.
- Accessibility and other integrations deferred to post-demo phases.
- Hourly processing prevents overwhelming n8n workflows while maintaining responsiveness.

---

**This detailed PRD is optimized for rapid implementation with n8n backend orchestration, real-time biometric integration, and webhook-based architecture for a focused live demo and immediate feedback.**
