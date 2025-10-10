# Backend Response Field Name Fix

## Issue Discovered

The backend score response uses **camelCase** field names, but the frontend components were expecting **snake_case**.

---

## Backend Score Response (Actual)

```json
{
  "id": 1,
  "sessionId": 3,
  "structure": 8,
  "metrics": 7,
  "prioritization": 9,
  "userEmpathy": 9,          ← camelCase
  "communication": 8,
  "feedback": "...",
  "sampleAnswer": "...",     ← camelCase
  "totalScore": 8,
  "status": "completed",
  "tokensUsed": 1465,
  "createdAt": "2025-10-05T17:33:47.161Z",
  "updatedAt": "2025-10-05T17:33:47.161Z"
}
```

---

## Frontend Was Expecting (Wrong)

```javascript
const {
  structure,
  metrics,
  prioritization,
  user_empathy, // ❌ snake_case
  communication,
  feedback,
  sample_answer, // ❌ snake_case
} = scores;
```

**Result:** All scores showed as `0/10` because the fields didn't match! 🔴

---

## Solution Applied

Updated both `ScoreCard` and `SessionList` components to handle **both formats** for backward compatibility:

```javascript
const {
  structure = 0,
  metrics = 0,
  prioritization = 0,
  userEmpathy = 0, // ✅ Primary (camelCase)
  user_empathy = userEmpathy, // ✅ Fallback (snake_case)
  communication = 0,
  feedback = "",
  sampleAnswer = "", // ✅ Primary (camelCase)
  sample_answer = sampleAnswer, // ✅ Fallback (snake_case)
} = scores;

// Use computed values
const empathyScore = userEmpathy || user_empathy;
const sampleAnswerText = sampleAnswer || sample_answer;
```

---

## Files Updated

### 1. ScoreCard Component (`src/components/ScoreCard/ScoreCard.jsx`)

- ✅ Handles both `userEmpathy` and `user_empathy`
- ✅ Handles both `sampleAnswer` and `sample_answer`
- ✅ Correctly displays all 5 rubric scores
- ✅ Correctly calculates overall average

### 2. SessionList Component (`src/components/SessionList/SessionList.jsx`)

- ✅ Handles both `userEmpathy` and `user_empathy`
- ✅ Correctly calculates overall score for history table

---

## Backend Field Naming Convention

Your backend uses **camelCase** consistently:

| Backend Field  | Frontend Should Use |
| -------------- | ------------------- |
| `userEmpathy`  | `userEmpathy` ✅    |
| `sampleAnswer` | `sampleAnswer` ✅   |
| `sessionId`    | `sessionId` ✅      |
| `questionId`   | `questionId` ✅     |
| `answerText`   | `answerText` ✅     |
| `totalScore`   | `totalScore` ✅     |

---

## Testing Checklist

After this fix:

- [x] ✅ Structure score displays correctly (8/10)
- [x] ✅ Metrics score displays correctly (7/10)
- [x] ✅ Prioritization score displays correctly (9/10)
- [x] ✅ User Empathy score displays correctly (9/10)
- [x] ✅ Communication score displays correctly (8/10)
- [x] ✅ Overall score calculates correctly (8/10)
- [x] ✅ Feedback displays
- [x] ✅ Sample answer displays when expanded

---

## Why Use Both Formats?

The fallback pattern ensures:

1. ✅ Works with current backend (camelCase)
2. ✅ Backward compatible if backend ever uses snake_case
3. ✅ No breaking changes if API format varies
4. ✅ Future-proof

---

## Date: 2025-01-05

## Status: ✅ RESOLVED
