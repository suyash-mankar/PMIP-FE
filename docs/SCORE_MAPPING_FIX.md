# Score Mapping Fix

## 🐛 Issue

Score was showing as `NaN/10` instead of actual values (e.g., `8/10`).

---

## 🔍 Root Cause

### Backend Response Format

The backend returns scores in this format:

```json
{
  "message": "Session scored successfully",
  "score": {
    "id": 1,
    "sessionId": 1,
    "structure": 8,
    "metrics": 7,
    "prioritization": 8,
    "userEmpathy": 9,
    "communication": 8,
    "feedback": "Great use of frameworks...",
    "sampleAnswer": "I would approach this...",
    "totalScore": 8,
    "status": "completed",
    "tokensUsed": 850,
    "createdAt": "2024-...",
    "updatedAt": "2024-..."
  }
}
```

**Key field**: `score` (singular)

### Frontend Mapping (Before Fix)

```javascript
const scoresPayload = scoreData.scores || scoreData;
//                              ^^^^^^
//                              Looking for "scores" (plural) - DOESN'T EXIST!
```

This would fail to find `scores`, fall back to `scoreData` (the full response object), which doesn't have the individual score fields, resulting in:

```javascript
scoresPayload.structure    // undefined
scoresPayload.metrics      // undefined
// ...
totalScore = Math.round((undefined + undefined + ...) / 5)  // NaN
```

---

## ✅ Solution

### Updated Mapping (After Fix)

```javascript
// Backend returns { message, score: {...} }
const scoresPayload = scoreData.score || scoreData.scores || scoreData;
//                              ^^^^^
//                              Look for "score" FIRST (singular)
```

**Priority order:**

1. `scoreData.score` ← **Backend format** (now works!)
2. `scoreData.scores` ← Fallback for alternate format
3. `scoreData` ← Last resort fallback

---

## 🎯 Field Name Mapping

### Backend Field Names (from Prisma schema)

```javascript
{
  structure: 8,
  metrics: 7,
  prioritization: 8,
  userEmpathy: 9,        // camelCase
  communication: 8,
  feedback: "...",
  sampleAnswer: "...",   // camelCase
  totalScore: 8
}
```

### Frontend Compatibility (ScoreCard.jsx)

```javascript
const {
  structure = 0,
  metrics = 0,
  prioritization = 0,
  userEmpathy = 0,
  user_empathy = userEmpathy, // Fallback for snake_case
  communication = 0,
  feedback = "",
  sampleAnswer = "",
  sample_answer = sampleAnswer, // Fallback for snake_case
} = scores;
```

**Result:** Frontend handles both formats gracefully!

---

## 📊 Testing

### Before Fix

```
User submits answer → Scoring starts → Response received
→ scoresPayload = { message: "...", score: {...} }  // Wrong object!
→ scoresPayload.structure = undefined
→ totalScore = NaN
→ Displays: "You scored NaN/10"
```

### After Fix

```
User submits answer → Scoring starts → Response received
→ scoresPayload = { structure: 8, metrics: 7, ... }  // Correct!
→ scoresPayload.structure = 8
→ totalScore = 8
→ Displays: "You scored 8/10"
```

---

## 🔧 Additional Improvements

### Added Debug Logging

```javascript
console.log("Score response:", scoreResponse.data);
console.log("Scores payload:", scoresPayload);
```

**Purpose:** Helps debug future response format issues

---

## ✅ Files Modified

1. ✅ **`pages/Interview/Interview.jsx`**
   - Fixed score mapping: `scoreData.score` (not `scores`)
   - Added priority fallback chain
   - Added debug console.log statements

---

## 🎯 Backend API Format (Reference)

### Endpoint

```
POST /api/score
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "sessionId": 1
}
```

### Response

```json
{
  "message": "Session scored successfully",
  "score": {
    "id": 1,
    "sessionId": 1,
    "structure": 8,
    "metrics": 7,
    "prioritization": 8,
    "userEmpathy": 9,
    "communication": 8,
    "feedback": "Great answer! You demonstrated strong...",
    "sampleAnswer": "I would approach this by first...",
    "totalScore": 8,
    "status": "completed",
    "tokensUsed": 850,
    "createdAt": "2024-10-06T...",
    "updatedAt": "2024-10-06T..."
  }
}
```

### Already Scored Response

```json
{
  "message": "Session already scored",
  "score": {
    // Same score object as above
  }
}
```

---

## ✅ Result

The score now displays correctly:

**Before:**

```
Great! I've evaluated your answer. You scored NaN/10 overall.
```

**After:**

```
Great! I've evaluated your answer. You scored 8/10 overall.
```

---

## 📋 Testing Checklist

- [x] Score displays as number (e.g., 8/10)
- [x] Individual scores show correctly
- [x] Feedback text appears
- [x] Sample answer is available
- [x] Overall score calculated correctly
- [x] No NaN values
- [x] Console logs show correct data
- [x] ScoreCard component renders properly
- [x] Modal displays all scores

---

## 🚀 Verification Steps

1. **Start interview** and answer a question
2. **Check browser console** for logs:
   ```
   Score response: { message: "...", score: {...} }
   Scores payload: { structure: 8, metrics: 7, ... }
   ```
3. **Verify chat message** shows: "You scored 8/10"
4. **Open score modal** - all 5 scores should show with values
5. **Check feedback** - should display text
6. **Check sample answer** - should be expandable

---

**Status**: ✅ **Fixed** - Scores now display correctly!

**Last Updated**: October 6, 2025
