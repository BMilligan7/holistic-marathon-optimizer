#!/bin/bash

echo "Testing Plan Feedback Processing Workflow"
echo "========================================="

# Test 1: Too hard feedback (should trigger adaptation)
echo -e "\n🔥 Test 1: Too Hard Feedback (Should trigger adaptation)"
curl -X POST "http://localhost:5678/webhook/plan-feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "user-plan-1",
    "userId": "demo-user",
    "weekNumber": 3,
    "type": "difficulty", 
    "rating": "too_hard",
    "comment": "The long runs are really challenging, I am struggling to complete them"
  }'

echo -e "\n"

# Test 2: Just right feedback (should only log)
echo -e "\n✅ Test 2: Just Right Feedback (Should only log)"
curl -X POST "http://localhost:5678/webhook/plan-feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "user-plan-1", 
    "userId": "demo-user",
    "weekNumber": 3,
    "type": "difficulty",
    "rating": "just_right",
    "comment": "Training feels good, manageable pace"
  }'

echo -e "\n"

# Test 3: Injury feedback (should trigger adaptation)
echo -e "\n🤕 Test 3: Injury Feedback (Should trigger adaptation)"
curl -X POST "http://localhost:5678/webhook/plan-feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "user-plan-1",
    "userId": "demo-user", 
    "weekNumber": 4,
    "type": "injury",
    "rating": "concerning",
    "comment": "Feeling some knee pain during longer runs"
  }'

echo -e "\n"

# Test 4: Schedule feedback (should only log)
echo -e "\n📅 Test 4: Schedule Feedback (Should only log)"
curl -X POST "http://localhost:5678/webhook/plan-feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "user-plan-1",
    "userId": "demo-user",
    "weekNumber": 2, 
    "type": "schedule",
    "rating": "difficult",
    "comment": "Hard to fit in the midweek long run, prefer weekend"
  }'

echo -e "\n\nTesting complete! Check n8n executions for detailed results." 