# Conversational Interview Feature

## 🎯 **Overview**

This feature transforms the PM interview experience from a simple Q&A format into a **realistic, conversational interview** where candidates can ask clarifying questions before submitting their final answer—just like in a real PM interview.

---

## 🚀 **Key Features**

### 1. **Conversation Mode**
- After receiving a question, users enter "conversation mode"
- Can send multiple messages to ask clarifying questions
- AI interviewer responds helpfully without giving away the answer
- Full conversation history is maintained for context

### 2. **Submit Final Answer Button**
- Dedicated green button for submitting the final answer
- Separate from the regular send button (which sends clarifications)
- Only visible during conversation mode
- Clear visual distinction from clarification messages

### 3. **Confirmation Modal**
- Confirmation dialog before submitting final answer
- Warns that once submitted, no more clarifications can be asked
- Prevents accidental final submissions
- Professional dark-themed modal design

### 4. **Smart Input Handling**
- **Enter key**: Sends clarification (during conversation mode)
- **Shift+Enter**: Adds new line
- **Send button**: Sends clarification
- **Submit Final Answer button**: Triggers confirmation → submits for scoring
- Dynamic placeholder text based on mode

---

## 🎨 **User Experience Flow**

### Step-by-Step Journey

1. **User starts interview**
   - Selects difficulty level
   - AI welcomes them
   - First question appears
   - **Conversation mode activates**

2. **Asking clarifying questions**
   ```
   User: "What's the target market for this product?"
   
   AI: "Great question! Let's assume this product is targeting 
   young professionals aged 25-35 in urban areas who are tech-savvy 
   and value convenience."
   
   User: "What's the budget constraint?"
   
   AI: "For this exercise, assume you have a moderate budget—
   enough for MVP development but not for large-scale marketing yet. 
   Think lean startup approach."
   ```

3. **Submitting final answer**
   - User types their final answer
   - Clicks "✓ Submit Final Answer" button
   - **Confirmation modal appears**:
     > "Submit Final Answer?  
     > Are you ready to submit this as your final answer? Once submitted, 
     > it will be evaluated and you won't be able to ask more clarifying 
     > questions for this question."
   - User clicks "Yes, Submit"
   - Answer is submitted for AI scoring
   - Feedback is provided

---

## 💻 **Technical Implementation**

### Frontend Changes

#### **New State Variables**
```javascript
const [conversationMode, setConversationMode] = useState(false);
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [askingClarification, setAskingClarification] = useState(false);
```

#### **New Functions**

1. **`handleAskClarification()`**
   - Sends user message to clarification API
   - Maintains conversation history
   - Displays AI response in chat
   - Shows typing indicator during request

2. **`handleSubmitFinalAnswerClick()`**
   - Triggered by Submit Final Answer button
   - Shows confirmation modal
   - Does NOT submit immediately

3. **`handleConfirmSubmit()`**
   - Closes confirmation modal
   - Calls existing `handleSubmitAnswer()`
   - Exits conversation mode
   - Submits for scoring

4. **`handleCancelSubmit()`**
   - Closes confirmation modal
   - Returns to conversation mode

#### **Updated Functions**

1. **`handleStartInterview()`**
   - Enables `conversationMode` after first question appears

2. **`handleKeyPress()`**
   ```javascript
   if (e.key === "Enter" && !e.shiftKey) {
     e.preventDefault();
     if (conversationMode) {
       handleAskClarification();
     } else {
       handleSubmitAnswer();
     }
   }
   ```

3. **`handleSubmitAnswer()`**
   - Exits conversation mode when called
   - Proceeds with normal submission flow

#### **UI Components**

1. **Input Area**
   ```jsx
   <textarea
     placeholder={
       conversationMode
         ? "Ask clarifying questions or type your answer..."
         : "Type your answer here..."
     }
     disabled={submitting || scoring || askingClarification}
   />
   ```

2. **Send Button**
   ```jsx
   <button
     onClick={conversationMode ? handleAskClarification : handleSubmitAnswer}
     disabled={submitting || scoring || askingClarification || !answer.trim()}
   >
     {/* Send icon */}
   </button>
   ```

3. **Submit Final Answer Button**
   ```jsx
   {conversationMode && !scores && (
     <button
       className={styles.submitFinalAnswerBtn}
       onClick={handleSubmitFinalAnswerClick}
       disabled={submitting || scoring || askingClarification || !answer.trim()}
     >
       ✓ Submit Final Answer
     </button>
   )}
   ```

4. **Confirmation Modal**
   ```jsx
   {showConfirmModal && (
     <div className={styles.modalOverlay}>
       <div className={styles.confirmModal}>
         <h3>Submit Final Answer?</h3>
         <p>Are you ready to submit this as your final answer?...</p>
         <div className={styles.confirmActions}>
           <button onClick={handleCancelSubmit}>Cancel</button>
           <button onClick={handleConfirmSubmit}>Yes, Submit</button>
         </div>
       </div>
     </div>
   )}
   ```

5. **Input Hint**
   ```jsx
   <p className={styles.inputHint}>
     {conversationMode
       ? "💡 Ask clarifying questions first, then submit your final answer for evaluation"
       : "Press Enter to send, Shift+Enter for new line"}
   </p>
   ```

6. **Typing Indicator**
   ```jsx
   {(submitting || scoring || askingClarification) && (
     <div className={styles.typingIndicatorWrapper}>
       <div className={styles.typingIndicator}>
         <span className={styles.aiAvatarSmall}>AI</span>
         <div className={styles.typingDots}>...</div>
       </div>
     </div>
   )}
   ```

---

### Backend Changes

#### **New API Endpoint**

**POST `/api/clarify`**

**Request Body:**
```json
{
  "questionId": "question-id-here",
  "userMessage": "What's the target market?",
  "conversationHistory": [
    {
      "role": "assistant",
      "content": "Design a feature for Instagram..."
    },
    {
      "role": "user",
      "content": "What's the target market?"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Great question! Let's assume this feature is targeting young adults aged 18-30 who are active Instagram users and value creative expression.",
  "message": "Clarification provided"
}
```

#### **New Service Function**

**`callOpenAIForClarification(question, conversationHistory)`**

- Uses GPT-4 Turbo
- Temperature: 0.7 (more conversational)
- Max tokens: 300 (concise responses)
- System prompt configures AI as PM interviewer
- Maintains conversation context

**System Prompt:**
```javascript
const systemPrompt = `You are an experienced Product Management interviewer conducting a mock interview. 
The candidate has been asked the following question:

"${question}"

Your role is to:
1. Answer clarifying questions the candidate may have about the scope, constraints, or context
2. Provide helpful guidance without giving away the answer
3. Encourage the candidate to think through the problem
4. Be supportive and professional, like a real interviewer
5. If the candidate asks for specific details (target users, market, constraints), provide reasonable assumptions
6. Keep responses concise and conversational (2-4 sentences typically)

Remember: You're helping them understand the question better, not solving it for them.`;
```

#### **Controller Function**

**`clarify(req, res, next)`**

- Validates `questionId` and `userMessage`
- Fetches question from database
- Calls OpenAI for clarification
- Logs event with token usage
- Returns AI response

#### **Event Logging**
```javascript
await prisma.event.create({
  data: {
    userId: req.user.id,
    eventType: 'clarification_requested',
    metadata: JSON.stringify({
      questionId,
      userMessage: userMessage.substring(0, 100),
      tokensUsed,
    }),
  },
});
```

---

## 🎨 **Styling**

### Submit Final Answer Button
```scss
.submitFinalAnswerBtn {
  margin-left: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: linear-gradient(135deg, $success-color 0%, darken($success-color, 10%) 100%);
  color: white;
  border: none;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($success-color, 0.4);
  }
}
```

### Confirmation Modal
```scss
.confirmModal {
  background: $dark-bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
  border: 1px solid $dark-border;
}
```

---

## 🧪 **Testing Checklist**

### Manual Testing

#### Happy Path
- [ ] Start interview → question appears → conversation mode activates
- [ ] Send clarifying question → AI responds appropriately
- [ ] Send multiple clarifications → conversation history maintained
- [ ] Type final answer → click Submit Final Answer → confirmation appears
- [ ] Confirm submission → answer submitted → scoring begins → feedback shown

#### Edge Cases
- [ ] Try submitting empty final answer → button disabled
- [ ] Cancel confirmation modal → returns to conversation mode
- [ ] Press Enter in conversation mode → sends clarification (not final answer)
- [ ] AI clarification fails → error message shown → can retry
- [ ] Network timeout during clarification → error handled gracefully
- [ ] Submit final answer twice quickly → second click ignored

#### UI/UX
- [ ] Typing indicator appears during clarification
- [ ] Input disabled during clarification request
- [ ] Placeholder text changes based on mode
- [ ] Hint text appears correctly
- [ ] Submit button styling (green gradient)
- [ ] Confirmation modal styling (dark theme)
- [ ] Mobile responsiveness

---

## 📊 **Benefits**

### For Candidates
✅ **Realistic practice** - Mimics real PM interview dynamics  
✅ **Reduced anxiety** - Can clarify scope before answering  
✅ **Better answers** - Can ask about constraints, users, etc.  
✅ **Confidence building** - Learns to ask good clarifying questions  
✅ **Safe environment** - No penalty for asking questions  

### For PM Skill Development
✅ **Teaches clarification skills** - Key PM interview competency  
✅ **Encourages structured thinking** - Think before answering  
✅ **Promotes user-centric mindset** - Ask about users and context  
✅ **Builds communication skills** - Practice articulating questions  

### For Product Differentiation
✅ **Unique feature** - Not found in other PM prep tools  
✅ **Higher value** - More realistic than simple Q&A  
✅ **Better retention** - More engaging experience  
✅ **Competitive moat** - Requires AI integration expertise  

---

## 🔒 **Security & Cost Considerations**

### Rate Limiting
- Clarification endpoint uses same auth middleware
- No additional rate limiting (yet)
- Consider adding per-user clarification limits

### OpenAI Costs
- **Clarifications**: ~150-300 tokens per request
- **Temperature**: 0.7 (balanced)
- **Model**: GPT-4 Turbo (cost-effective for quality)
- **Cost**: ~$0.003-0.006 per clarification

### Monitoring
- Track clarification event types
- Monitor token usage per user
- Alert on high clarification rates (potential abuse)

---

## 🚀 **Future Enhancements**

### Phase 2
1. **Clarification limits** - Max 3-5 clarifications per question
2. **Smart suggestions** - "You might want to ask about..."
3. **Clarification quality** - Score quality of clarifying questions
4. **Time tracking** - Show time spent on clarifications
5. **Conversation summary** - Summarize key clarifications in feedback

### Phase 3
1. **Voice clarifications** - Ask questions via voice
2. **Real-time typing** - Show AI "typing..." indicator
3. **Clarification templates** - Common clarifying question templates
4. **Follow-up prompts** - AI proactively offers more context

---

## 📚 **API Documentation**

### Frontend API Client

```javascript
import { askClarification } from "../../api/client";

// Usage
const response = await askClarification(
  questionId,
  userMessage,
  conversationHistory
);

console.log(response.data.response); // AI response
```

### Backend Endpoint

**POST `/api/clarify`**

**Authentication**: Required (JWT token)

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request**:
```json
{
  "questionId": "string (required)",
  "userMessage": "string (required, non-empty)",
  "conversationHistory": [
    {
      "role": "assistant | user",
      "content": "string"
    }
  ]
}
```

**Success Response (200)**:
```json
{
  "response": "AI clarification response",
  "message": "Clarification provided"
}
```

**Error Responses**:
- `400`: Missing/invalid questionId or userMessage
- `401`: Unauthorized (invalid/missing JWT)
- `404`: Question not found
- `500`: OpenAI error or server error

---

## 📝 **Example Conversation**

### Real PM Interview Scenario

**Question:**
> "Design a feature to help Instagram users discover new content creators."

**Candidate:**
> "Before I start, can I clarify the target audience for this feature?"

**AI:**
> "Great question! Let's focus on Instagram users aged 18-30 who are active 
> content consumers but haven't found their niche yet. They follow 50-100 
> accounts but feel their feed is getting stale."

**Candidate:**
> "What about the business goal? Are we optimizing for engagement or 
> creator growth?"

**AI:**
> "Excellent clarification! The primary goal is to increase time spent on 
> the platform (engagement) while also supporting creator discovery as a 
> secondary goal. Think win-win for users and creators."

**Candidate:**
> "One more thing - are there any technical constraints I should consider?"

**AI:**
> "For this exercise, assume you have access to Instagram's existing ML 
> recommendation engine and user behavior data. No major technical 
> constraints, but keep scalability in mind."

**Candidate:**
> [Types comprehensive answer using CIRCLES framework with all the context]

**Candidate:**
> [Clicks "✓ Submit Final Answer"]

**Modal:**
> "Submit Final Answer? Are you ready to submit..."

**Candidate:**
> [Clicks "Yes, Submit"]

**Result:**
> Answer is scored on 5 dimensions with detailed feedback!

---

## 🎉 **Summary**

### What We Built
✅ **Conversational interview flow** with realistic interviewer interaction  
✅ **Clarification handling** via OpenAI GPT-4  
✅ **Submit Final Answer button** with confirmation  
✅ **Smart input handling** based on conversation mode  
✅ **Professional UI/UX** with dark theme consistency  
✅ **Complete backend support** with event logging  

### Impact
- **More realistic** PM interview practice
- **Teaches key skills** (asking clarifying questions)
- **Reduces anxiety** (can clarify scope)
- **Better answers** (more context before answering)
- **Competitive advantage** (unique feature)

---

**This feature brings PM Interview Practice closer to a real interview experience!** 🚀🎯

**Deployed**:
- Frontend: https://github.com/suyash-mankar/PMIP-FE (commit `bd1e40a`)
- Backend: https://github.com/suyash-mankar/PMIP-BE (commit `0651cd1`)

**Last Updated**: October 6, 2025  
**Status**: ✅ Completed & Deployed

