# API Alignment Fix - Frontend ↔ Backend

## Issue Found

The frontend and backend had mismatched field names and values for interview difficulty levels.

### Backend Expected (from Joi schema):

```javascript
{
  level: "junior" | "mid" | "senior"; // lowercase
}
```

### Frontend Was Sending:

```javascript
{
  difficulty: "Entry" | "Mid" | "Senior"; // capitalized
}
```

---

## Changes Made

### 1. API Client (`src/api/client.js`)

**Changed:**

```javascript
// Before
export const startInterview = (difficulty) => {
  return apiClient.post("/api/start-interview", { difficulty });
};

// After
export const startInterview = (level) => {
  return apiClient.post("/api/start-interview", { level });
};
```

### 2. Interview Page (`src/pages/Interview/Interview.jsx`)

**Default State:**

```javascript
// Before
const [difficulty, setDifficulty] = useState("Mid");

// After
const [difficulty, setDifficulty] = useState("mid");
```

**Select Options:**

```javascript
// Before
<option value="Entry">Entry Level</option>
<option value="Mid">Mid Level</option>
<option value="Senior">Senior Level</option>

// After
<option value="junior">Entry Level</option>
<option value="mid">Mid Level</option>
<option value="senior">Senior Level</option>
```

### 3. Session List Component (`src/components/SessionList/SessionList.jsx`)

**Added Formatter Function:**

```javascript
const formatDifficulty = (level) => {
  const difficultyMap = {
    junior: { label: "Entry", class: "Entry" },
    mid: { label: "Mid", class: "Mid" },
    senior: { label: "Senior", class: "Senior" },
  };
  return difficultyMap[level] || { label: "N/A", class: "" };
};
```

This ensures that lowercase values from the backend are displayed properly and styled correctly.

---

## Testing Checklist

- [x] API field name matches backend (`level` not `difficulty`)
- [x] Values are lowercase (`junior`, `mid`, `senior`)
- [x] Default selection is `mid` (Mid Level)
- [x] History page displays difficulty correctly
- [x] CSS styling for difficulty badges works

---

## Impact

✅ **Start Interview** now works correctly  
✅ **Session History** displays difficulty levels properly  
✅ **No breaking changes** to UI/UX (users still see "Entry", "Mid", "Senior")  
✅ **Backend validation** will now pass

---

## Date: 2025-01-05

## Fixed by: AI Assistant
