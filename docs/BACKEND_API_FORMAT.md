# Backend API Response Format

Based on the actual backend responses, here's the correct format:

## `/api/start-interview` Response

### Actual Backend Response:

```json
{
  "id": 5,
  "text": "Design a ride-sharing app for pets.",
  "category": "product_design",
  "level": "mid"
}
```

### Frontend Now Expects:

- `id` → Used as `sessionId` (the question/session identifier)
- `text` → The actual question text
- `category` → Question category (optional)
- `level` → Difficulty level (optional)

---

## Fixed Code

### 1. Interview Page (`src/pages/Interview/Interview.jsx`)

```javascript
// Prioritize the actual backend format
const sessionId =
  response.data.id || response.data.session_id || response.data.sessionId;
const interviewQuestion =
  response.data.text || response.data.question || response.data.questionText;
```

### 2. API Client (`src/api/client.js`)

Updated to match backend Joi schema (camelCase):

```javascript
export const submitAnswer = (sessionId, answer) => {
  return apiClient.post("/api/submit-answer", {
    questionId: sessionId, // camelCase, not question_id
    answerText: answer, // answerText, not answer
  });
};

export const scoreAnswer = (sessionId) => {
  return apiClient.post("/api/score", {
    questionId: sessionId, // camelCase, not question_id
  });
};
```

---

## Backend Schema (Confirmed)

Based on your backend Joi validation:

```javascript
const submitAnswerSchema = Joi.object({
  sessionId: Joi.number().integer().positive().optional(),
  questionId: Joi.number().integer().positive().required(),
  answerText: Joi.string().min(10).required(),
});
```

### Field Requirements:

- ✅ `questionId` - Question/session identifier (required)
- ✅ `answerText` - User's answer, min 10 characters (required)
- ✅ `sessionId` - Optional session identifier

All field names use **camelCase** format.

---

## Date: 2025-01-05
