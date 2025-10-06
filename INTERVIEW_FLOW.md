# Complete Interview Flow - Frontend ↔ Backend

## Understanding the Flow

Your backend uses **TWO separate IDs**:

1. **`questionId`** - Identifies the interview question
2. **`sessionId`** - Identifies the user's answer submission session

---

## Step-by-Step Flow

### Step 1: Start Interview

**Request:**

```javascript
POST /api/start-interview
{
  "level": "mid"  // "junior" | "mid" | "senior"
}
```

**Response:**

```json
{
  "id": 5,                                    ← This is the questionId
  "text": "Design a ride-sharing app for pets.",
  "category": "product_design",
  "level": "mid"
}
```

**Frontend State:**

- ✅ Stores `questionId = 5`
- ✅ Displays question text
- ⏳ `sessionId` is null (not yet created)

---

### Step 2: Submit Answer

**Request:**

```javascript
POST /api/submit-answer
{
  "questionId": 5,              ← From step 1
  "answerText": "My answer...", ← User's answer (min 10 chars)
  "sessionId": null             ← Optional, will be created
}
```

**Response:**

```json
{
  "sessionId": 123,  ← NEW session ID created for this submission
  "id": 123,         ← Same as sessionId
  // ... other fields
}
```

**Frontend State:**

- ✅ Stores `sessionId = 123` from response
- ✅ Now has both `questionId` and `sessionId`

---

### Step 3: Score Answer

**Request:**

```javascript
POST /api/score
{
  "sessionId": 123    ← From step 2 (identifies the answer submission)
}
```

**Note:** Only `sessionId` is required! The backend already knows which question from the session.

**Response:**

```json
{
  "scores": {
    "structure": 8,
    "metrics": 7,
    "prioritization": 9,
    "user_empathy": 6,
    "communication": 8,
    "feedback": "Great answer!",
    "sample_answer": "..."
  }
}
```

**Frontend State:**

- ✅ Displays ScoreCard with all rubric scores
- ✅ Shows feedback and sample answer

---

## Code Implementation

### State Management

```javascript
const [questionId, setQuestionId] = useState(null); // From start-interview
const [sessionId, setSessionId] = useState(null); // From submit-answer
```

### API Calls

```javascript
// 1. Start Interview
const response = await startInterview("mid");
setQuestionId(response.data.id); // Save questionId

// 2. Submit Answer
const submitResponse = await submitAnswer(questionId, answer);
setSessionId(submitResponse.data.sessionId); // Save sessionId

// 3. Score Answer
const scoreResponse = await scoreAnswer(sessionId);
// Only sessionId required!
```

---

## Why Two IDs?

| ID           | Purpose                           | When Created    | Used For                 |
| ------------ | --------------------------------- | --------------- | ------------------------ |
| `questionId` | Identifies the interview question | Start interview | Submit answer only       |
| `sessionId`  | Identifies the answer submission  | Submit answer   | Get score, Track answers |

This design allows:

- ✅ Same question to be answered multiple times
- ✅ Track different submission sessions
- ✅ Retrieve specific answers for scoring
- ✅ Maintain answer history

**Note:** The `sessionId` already contains the relationship to the `questionId` in the backend database, so you only need to send `sessionId` for scoring!

---

## Error Prevention

### Common Issues Fixed:

1. ❌ **Sending questionId to score endpoint**

   - Error: "questionId is not allowed"
   - ✅ Fix: Send ONLY `sessionId`, not questionId

2. ❌ **Using wrong field names**

   - Error: Validation failed
   - ✅ Fix: Use `questionId` and `sessionId` (camelCase)

3. ❌ **Calling score before getting sessionId**
   - Error: sessionId is null/undefined
   - ✅ Fix: Wait for submit response, extract sessionId first

---

## Testing Checklist

- [ ] Start interview shows question
- [ ] Submit answer saves sessionId
- [ ] Console logs show both IDs
- [ ] Score endpoint receives both IDs
- [ ] ScoreCard displays all rubric scores
- [ ] No validation errors

---

## Date: 2025-01-05
