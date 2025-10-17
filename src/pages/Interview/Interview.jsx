import { useState, useRef, useEffect } from "react";
import {
  startInterview,
  submitAnswer,
  scoreAnswer,
  scoreAnswerSummarised,
  askClarification,
  getCategories,
  getModelAnswer,
} from "../../api/client";
import styles from "./Interview.module.scss";

function Interview() {
  const [difficulty, setDifficulty] = useState("mid");
  const [category, setCategory] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [questionId, setQuestionId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [loadingFirstQuestion, setLoadingFirstQuestion] = useState(false);
  const [conversationMode, setConversationMode] = useState(false);
  const [askingClarification, setAskingClarification] = useState(false);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loadingModelAnswer, setLoadingModelAnswer] = useState(false);
  const [modelAnswer, setModelAnswer] = useState(null);
  const [answerMode, setAnswerMode] = useState(false);
  const [finalAnswerDraft, setFinalAnswerDraft] = useState("");
  const [showAnswerSidebar, setShowAnswerSidebar] = useState(true);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const [detailedScore, setDetailedScore] = useState(null);
  const [loadingDetailedScore, setLoadingDetailedScore] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch available categories in the background on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await getCategories();
        setAvailableCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Focus input after AI responds and reset height when disabled
  useEffect(() => {
    if (!submitting && !scoring && interviewStarted && inputRef.current) {
      inputRef.current.focus();
    }

    // Reset input height when disabled (during AI responses)
    if (inputRef.current && (submitting || scoring || askingClarification)) {
      inputRef.current.style.height = "52px";
    }
  }, [submitting, scoring, askingClarification, interviewStarted]);

  const handleStartInterview = async () => {
    setLoading(true);
    setError("");
    setScores(null);
    setAnswer("");
    setInterviewStarted(true);

    // Add welcome message
    const welcomeMessage = {
      sender: "ai",
      message: `Great! Let's begin your ${
        difficulty === "junior"
          ? "Entry"
          : difficulty === "mid"
          ? "Mid"
          : "Senior"
      } level PM interview. I'll ask you a question, and you can take your time to provide a thoughtful answer. Ready?`,
      timestamp: new Date().toISOString(),
    };

    setMessages([welcomeMessage]);

    // Show loading indicator immediately after welcome message
    setLoadingFirstQuestion(true);

    try {
      const response = await startInterview(difficulty, category);
      console.log("Start interview response:", response.data);

      const questionIdFromResponse =
        response.data.id || response.data.questionId;
      const interviewQuestion =
        response.data.text ||
        response.data.question ||
        response.data.questionText ||
        response.data.prompt;

      if (!questionIdFromResponse) {
        throw new Error("No question ID received from server");
      }

      if (!interviewQuestion) {
        console.error("Response data:", response.data);
        throw new Error("No question received from server");
      }

      setQuestionId(Number(questionIdFromResponse));
      setQuestion(interviewQuestion);

      // Add question after a brief delay for natural feel
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: interviewQuestion,
            timestamp: new Date().toISOString(),
          },
        ]);
        setLoadingFirstQuestion(false);
        setConversationMode(true); // Enable conversation mode

        // Add to question history
        setQuestionHistory((prev) => [
          ...prev,
          {
            id: questionIdFromResponse,
            question: interviewQuestion,
            difficulty,
            timestamp: new Date().toISOString(),
            status: "in_progress",
          },
        ]);
      }, 800);
    } catch (err) {
      console.error("Start interview error:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to start interview. Please try again."
      );
      setInterviewStarted(false);
      setLoadingFirstQuestion(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategoryClick = () => {
    setShowCategoryOptions(true);
    setCategory(null); // Reset category selection when showing options
  };

  const handleRandomMixClick = () => {
    setCategory(null);
    setShowCategoryOptions(false);
  };

  const handleAskClarification = async () => {
    if (!answer.trim()) {
      return;
    }

    setAskingClarification(true);
    setError("");

    // Add user message to chat
    const userMessage = {
      sender: "user",
      message: answer,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = answer;
    setAnswer("");

    try {
      // Get conversation history (excluding welcome message)
      const conversationHistory = messages.slice(1).map((msg) => ({
        role: msg.sender === "ai" ? "assistant" : "user",
        content: msg.message,
      }));

      conversationHistory.push({
        role: "user",
        content: currentMessage,
      });

      const response = await askClarification(
        questionId,
        currentMessage,
        conversationHistory
      );
      console.log("Clarification response:", response.data);

      const aiResponse = response.data.response || response.data.message;

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message: aiResponse,
          timestamp: new Date().toISOString(),
          isClarification: true, // Flag for markdown formatting
        },
      ]);
    } catch (err) {
      console.error("Clarification error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to get clarification. Please try again."
      );
    } finally {
      setAskingClarification(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      return;
    }

    setSubmitting(true);
    setError("");
    setConversationMode(false);

    // Add user message to chat
    const userMessage = {
      sender: "user",
      message: answer,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const currentAnswer = answer;
    setAnswer("");

    try {
      // Submit answer
      const submitResponse = await submitAnswer(questionId, currentAnswer);
      console.log("Submit answer response:", submitResponse.data);

      const sessionIdFromSubmit =
        submitResponse.data.sessionId || submitResponse.data.id;
      if (sessionIdFromSubmit) {
        setSessionId(sessionIdFromSubmit);
      }

      // Add acknowledgment message
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message: "Thanks for your answer! Let me evaluate your response...",
          timestamp: new Date().toISOString(),
        },
      ]);

      // Start scoring - first get summarised score
      setScoring(true);

      try {
        // Step 1: Get summarised score (fast)
        const summaryScoreResponse = await scoreAnswerSummarised(
          sessionIdFromSubmit || sessionId
        );
        console.log("Summary score response:", summaryScoreResponse.data);
        const summaryScoreData = summaryScoreResponse.data;

        const summaryScoresPayload =
          summaryScoreData.score || summaryScoreData.scores || summaryScoreData;

        console.log("Summary scores payload:", summaryScoresPayload);
        setScores(summaryScoresPayload);

        // Format feedback message with scores inline
        const feedbackMessage = formatScoreFeedback(summaryScoresPayload);

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: feedbackMessage,
            timestamp: new Date().toISOString(),
            isScore: true,
            scoreData: summaryScoresPayload,
          },
        ]);

        // Update question history
        setQuestionHistory((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  status: "completed",
                  score: summaryScoresPayload.totalScore || 0,
                }
              : q
          )
        );

        setScoring(false);

        // Step 2: Get detailed score in background (slower)
        setLoadingDetailedScore(true);

        try {
          const detailedScoreResponse = await scoreAnswer(
            sessionIdFromSubmit || sessionId
          );
          console.log("Detailed score response:", detailedScoreResponse.data);
          const detailedScoreData = detailedScoreResponse.data;

          const detailedScoresPayload =
            detailedScoreData.score ||
            detailedScoreData.scores ||
            detailedScoreData;

          console.log("Detailed scores payload:", detailedScoresPayload);
          setDetailedScore(detailedScoresPayload);
        } catch (detailedScoreError) {
          console.error("Detailed scoring error:", detailedScoreError);
          // Don't show error to user - they already have summary
        } finally {
          setLoadingDetailedScore(false);
        }
      } catch (scoreError) {
        console.error("Scoring error:", scoreError);
        setError(
          scoreError.response?.data?.message ||
            scoreError.message ||
            "Failed to score answer. Please try again."
        );
        setScoring(false);
      }
    } catch (err) {
      console.error("Submit answer error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit answer. Please try again."
      );
    } finally {
      setSubmitting(false);
      setScoring(false);
    }
  };

  const formatScoreFeedback = (scores) => {
    const totalScore =
      scores.totalScore ||
      Math.round(
        (scores.structure +
          scores.metrics +
          scores.prioritization +
          scores.userEmpathy +
          scores.communication) /
          5
      );

    // If we have ChatGPT format feedback, use it directly
    if (
      scores.feedback &&
      scores.feedback.includes("✅ STRENGTHS") &&
      scores.feedback.includes("⚠️ AREAS TO IMPROVE")
    ) {
      return scores.feedback;
    }

    // Fallback to old format
    let feedback = `## Your Score: ${totalScore}/10\n\n`;
    feedback += `### Dimension Scores:\n`;
    feedback += `- **Structure:** ${scores.structure}/10\n`;
    feedback += `- **Metrics:** ${scores.metrics}/10`;
    feedback += `- **Prioritization:** ${scores.prioritization}/10\n`;
    feedback += `- **User Empathy:** ${scores.userEmpathy}/10\n`;
    feedback += `- **Communication:** ${scores.communication}/10\n\n`;

    feedback += `### Feedback:\n${scores.feedback}\n\n`;

    if (scores.sampleAnswer) {
      feedback += `### Model Answer:\n${scores.sampleAnswer}`;
    }

    return feedback;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (conversationMode) {
        handleAskClarification();
      } else {
        handleSubmitAnswer();
      }
    }
  };

  const handleEnterAnswerMode = () => {
    setAnswerMode(true);
    // Pre-fill with any text from the small input box if exists
    if (answer.trim()) {
      setFinalAnswerDraft(answer);
      setAnswer("");
    }
  };

  const handleExitAnswerMode = () => {
    // Save draft back to small input if needed
    if (finalAnswerDraft.trim() && !answer.trim()) {
      setAnswer(finalAnswerDraft);
    }
    setAnswerMode(false);
  };

  const handleScore = async (sessionIdToUse = null) => {
    const currentSessionId = sessionIdToUse || sessionId;

    if (!currentSessionId) {
      setError("No session ID available for scoring");
      return;
    }

    setScoring(true);
    setError("");
    setLoadingDetailedScore(true);
    setLoadingModelAnswer(true);

    // Call summary score API first and show immediately
    scoreAnswerSummarised(currentSessionId)
      .then((summaryScoreResponse) => {
        console.log("Summary score response:", summaryScoreResponse.data);
        const summaryScoreData = summaryScoreResponse.data;

        const summaryScoresPayload =
          summaryScoreData.score || summaryScoreData.scores || summaryScoreData;

        console.log("Summary scores payload:", summaryScoresPayload);
        setScores(summaryScoresPayload);

        // Format feedback message with scores inline
        const feedbackMessage = formatScoreFeedback(summaryScoresPayload);

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: feedbackMessage,
            timestamp: new Date().toISOString(),
            isScore: true,
            scoreData: summaryScoresPayload,
          },
        ]);

        // Update question history
        setQuestionHistory((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  status: "completed",
                  score: summaryScoresPayload.totalScore || 0,
                }
              : q
          )
        );

        setScoring(false);
      })
      .catch((err) => {
        console.error("Summary scoring error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to score answer. Please try again."
        );
        setScoring(false);
      });

    // Load detailed score in background
    scoreAnswer(currentSessionId)
      .then((detailedScoreResponse) => {
        console.log("Detailed score response:", detailedScoreResponse.data);
        const detailedScoreData = detailedScoreResponse.data;

        const detailedScoresPayload =
          detailedScoreData.score ||
          detailedScoreData.scores ||
          detailedScoreData;

        console.log("Detailed scores payload:", detailedScoresPayload);
        setDetailedScore(detailedScoresPayload);
        setLoadingDetailedScore(false);
      })
      .catch((err) => {
        console.error("Detailed scoring error:", err);
        setLoadingDetailedScore(false);
        // Don't show error - user already has summary
      });

    // Load model answer in background
    getModelAnswer(questionId)
      .then((modelAnswerResponse) => {
        console.log("Model answer loaded in background");
        setModelAnswer(modelAnswerResponse.data.modelAnswer);
        setLoadingModelAnswer(false);
      })
      .catch((err) => {
        console.error("Model answer error:", err);
        setLoadingModelAnswer(false);
        // Don't show error - not critical
      });
  };

  const handleSubmitFinalAnswer = async () => {
    if (!finalAnswerDraft.trim()) {
      setError("Please write your answer before submitting");
      return;
    }

    // Exit answer mode
    setAnswerMode(false);

    // Add user's answer to messages
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message: finalAnswerDraft,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Clear answer state and set for submission
    setAnswer("");
    setConversationMode(false);
    setSubmitting(true);
    setScoring(false);

    try {
      const response = await submitAnswer(questionId, finalAnswerDraft);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message:
            "Great! I've received your answer. Now let me evaluate it...",
          timestamp: new Date().toISOString(),
        },
      ]);

      // Clear the draft
      setFinalAnswerDraft("");

      // Get sessionId from submit response
      const newSessionId = response.data.sessionId;
      if (newSessionId) {
        setSessionId(newSessionId);

        // Trigger scoring with the new sessionId
        await handleScore(newSessionId);
      } else {
        setError("No session ID returned from submit answer");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit answer. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAnswerSidebar = () => {
    setShowAnswerSidebar(!showAnswerSidebar);
  };

  const handleShowModelAnswer = async () => {
    // If model answer is already loaded (from background), just show it
    if (modelAnswer) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message: modelAnswer,
          timestamp: new Date().toISOString(),
          isModelAnswer: true,
          questionId: questionId, // Track which question this belongs to
        },
      ]);
      return;
    }

    // Otherwise, fetch it
    setLoadingModelAnswer(true);
    setError("");

    try {
      const response = await getModelAnswer(questionId);
      setModelAnswer(response.data.modelAnswer);

      // Add model answer to messages
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message: response.data.modelAnswer,
          timestamp: new Date().toISOString(),
          isModelAnswer: true,
          questionId: questionId, // Track which question this belongs to
        },
      ]);
    } catch (err) {
      console.error("Get model answer error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load model answer. Please try again."
      );
    } finally {
      setLoadingModelAnswer(false);
    }
  };

  const handleExitAnswerModeOld = () => {
    // Save draft back to small input if needed
    if (finalAnswerDraft.trim() && !answer.trim()) {
      setAnswer(finalAnswerDraft);
    }
    setAnswerMode(false);
  };

  const toggleDetailedFeedback = () => {
    setShowDetailedFeedback(!showDetailedFeedback);
  };

  const handleNextQuestion = async () => {
    setLoading(true);
    setError("");
    setScores(null);
    setAnswer("");
    setConversationMode(false);
    setModelAnswer(null);
    setAnswerMode(false);
    setFinalAnswerDraft("");
    setShowAnswerSidebar(true);
    setShowDetailedFeedback(false);
    setDetailedScore(null);
    setLoadingDetailedScore(false);
    setLoadingModelAnswer(false);

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        message: "Great! Let's move on to your next question...",
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      const response = await startInterview(difficulty);
      console.log("Next question response:", response.data);

      const questionIdFromResponse =
        response.data.id || response.data.questionId;
      const interviewQuestion =
        response.data.text ||
        response.data.question ||
        response.data.questionText ||
        response.data.prompt;

      if (!questionIdFromResponse) {
        throw new Error("No question ID received from server");
      }

      if (!interviewQuestion) {
        console.error("Response data:", response.data);
        throw new Error("No question received from server");
      }

      setQuestionId(Number(questionIdFromResponse));
      setQuestion(interviewQuestion);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: interviewQuestion,
            timestamp: new Date().toISOString(),
          },
        ]);
        setConversationMode(true);

        // Add to question history
        setQuestionHistory((prev) => [
          ...prev,
          {
            id: questionIdFromResponse,
            question: interviewQuestion,
            difficulty,
            timestamp: new Date().toISOString(),
            status: "in_progress",
          },
        ]);
      }, 600);
    } catch (err) {
      console.error("Next question error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load next question. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.interviewPage}>
      {answerMode ? (
        // Full-Screen Answer Writing Mode
        <div className={styles.answerWritingMode}>
          {/* Header */}
          <div className={styles.answerModeHeader}>
            <div className={styles.answerModeTitle}>Write Final Answer</div>
            <button
              className={styles.toggleSidebarBtn}
              onClick={toggleAnswerSidebar}
            >
              {showAnswerSidebar ? "Hide Chat" : "Show Chat"}
            </button>
          </div>

          <div className={styles.answerModeContent}>
            {/* Chat History Sidebar */}
            {showAnswerSidebar && (
              <div className={styles.answerModeSidebar}>
                <div className={styles.sidebarTitle}>
                  Question & Chat History
                </div>
                <div className={styles.sidebarMessages}>
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`${styles.sidebarMessage} ${
                        msg.sender === "ai"
                          ? styles.sidebarAI
                          : styles.sidebarUser
                      }`}
                    >
                      <div className={styles.sidebarMessageSender}>
                        {msg.sender === "ai" ? "AI" : "You"}
                      </div>
                      <div className={styles.sidebarMessageText}>
                        {msg.message.length > 200
                          ? msg.message.substring(0, 200) + "..."
                          : msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Answer Editor */}
            <div className={styles.answerModeMain}>
              {/* Question Display */}
              <div className={styles.questionDisplay}>
                <div className={styles.questionLabel}>Question:</div>
                <div className={styles.questionText}>{question}</div>
              </div>

              {/* Large Textarea */}
              <textarea
                className={styles.answerTextarea}
                value={finalAnswerDraft}
                onChange={(e) => setFinalAnswerDraft(e.target.value)}
                placeholder={`Write your comprehensive answer here... 

Use this space to structure your response like you would in a real interview:
• Clarify the problem
• Define your approach
• Break down your solution
• Discuss metrics and success criteria
• Address risks and trade-offs

Take your time and be thorough!`}
                disabled={submitting || scoring}
              />

              {/* Character/Word Count */}
              <div className={styles.answerStats}>
                <span>{finalAnswerDraft.length} characters</span>
                <span>
                  {finalAnswerDraft.trim()
                    ? finalAnswerDraft.trim().split(/\s+/).length
                    : 0}{" "}
                  words
                </span>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtonsContainer}>
                <button
                  className={styles.backToDiscussionBtnBottom}
                  onClick={handleExitAnswerMode}
                >
                  ← Back to Discussion
                </button>
                <button
                  className={styles.submitFinalAnswerBtnLarge}
                  onClick={handleSubmitFinalAnswer}
                  disabled={submitting || scoring || !finalAnswerDraft.trim()}
                >
                  {submitting || scoring
                    ? "Submitting..."
                    : "✓ Submit Final Answer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Existing Chat Interface
        <>
          {/* Left Sidebar - Only show during interview */}
          {interviewStarted && (
            <div
              className={`${styles.sidebar} ${
                sidebarOpen ? styles.sidebarOpen : styles.sidebarCollapsed
              }`}
            >
              <div className={styles.sidebarHeader}>
                <div className={styles.sidebarHeaderContent}>
                  <h3>Questions Solved</h3>
                  <span className={styles.questionCount}>
                    {questionHistory.length}
                  </span>
                </div>
                <button
                  className={styles.sidebarToggle}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                      transform: sidebarOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className={styles.questionList}>
                {questionHistory.length === 0 ? (
                  <p className={styles.emptyState}>
                    No questions yet. Start an interview!
                  </p>
                ) : (
                  questionHistory.map((q, index) => (
                    <div
                      key={q.id}
                      className={`${styles.questionItem} ${
                        q.id === questionId ? styles.questionItemActive : ""
                      }`}
                    >
                      <div className={styles.questionNumber}>Q{index + 1}</div>
                      <div className={styles.questionDetails}>
                        <p className={styles.questionText}>
                          {q.question.substring(0, 60)}...
                        </p>
                        <div className={styles.questionMeta}>
                          <span className={styles.questionDifficulty}>
                            {q.difficulty}
                          </span>
                          {q.score !== undefined && (
                            <span className={styles.questionScore}>
                              {q.score}/10
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div className={styles.chatArea}>
            {!interviewStarted ? (
              /* Welcome Screen */
              <div className={styles.welcomeScreen}>
                <div className={styles.welcomeContent}>
                  {/* <h1 className={styles.welcomeTitle}>PM Interview Practice</h1> */}
                  <p className={styles.welcomeSubtitle}>
                    Practice PM interviews with AI. Get harsh, honest feedback
                    instantly.
                  </p>

                  <div className={styles.difficultySelector}>
                    <p className={styles.selectorLabel}>Select Difficulty:</p>
                    <div className={styles.difficultyCards}>
                      <button
                        className={`${styles.difficultyCard} ${
                          difficulty === "junior" ? styles.selected : ""
                        }`}
                        onClick={() => setDifficulty("junior")}
                      >
                        <div className={styles.cardIcon}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                          </svg>
                        </div>
                        <h3>Entry Level</h3>
                        <p>For aspiring PMs and career switchers</p>
                      </button>

                      <button
                        className={`${styles.difficultyCard} ${
                          difficulty === "mid" ? styles.selected : ""
                        }`}
                        onClick={() => setDifficulty("mid")}
                      >
                        <div className={styles.cardIcon}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="2"
                              y="3"
                              width="20"
                              height="14"
                              rx="2"
                              ry="2"
                            />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                        </div>
                        <h3>Mid Level</h3>
                        <p>For PMs with 2-5 years of experience</p>
                      </button>

                      <button
                        className={`${styles.difficultyCard} ${
                          difficulty === "senior" ? styles.selected : ""
                        }`}
                        onClick={() => setDifficulty("senior")}
                      >
                        <div className={styles.cardIcon}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                            <path d="M4 22h16" />
                            <path d="M10 14.66V17c0 .55.47.98.97 1.21l1.03.5c.5.23 1.03.23 1.53 0l1.03-.5c.5-.23.97-.66.97-1.21v-2.34" />
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                          </svg>
                        </div>
                        <h3>Senior Level</h3>
                        <p>For experienced PMs and leadership roles</p>
                      </button>
                    </div>

                    {/* Category Selector */}
                    <div className={styles.categorySelector}>
                      <p className={styles.selectorLabel}>
                        Select Category (Optional):
                      </p>
                      <div className={styles.categoryGrid}>
                        <button
                          className={`${styles.categoryCard} ${
                            !category && !showCategoryOptions
                              ? styles.selected
                              : ""
                          }`}
                          onClick={handleRandomMixClick}
                        >
                          <div className={styles.categoryIcon}>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="6" />
                              <circle cx="12" cy="12" r="2" />
                            </svg>
                          </div>
                          <h4>Random Mix</h4>
                          <p>All categories</p>
                        </button>

                        {!showCategoryOptions ? (
                          <button
                            className={`${styles.categoryCard} ${
                              showCategoryOptions ? styles.selected : ""
                            }`}
                            onClick={handleSelectCategoryClick}
                          >
                            <div className={styles.categoryIcon}>
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" />
                                <path d="M9 11V9a3 3 0 0 1 6 0v2" />
                                <path d="M12 16v-2" />
                              </svg>
                            </div>
                            <h4>Select Category</h4>
                            <p>Choose specific category</p>
                          </button>
                        ) : (
                          <>
                            {loadingCategories ? (
                              <div className={styles.loadingCard}>
                                <div className={styles.loadingSpinner}></div>
                                <h4>Loading Categories...</h4>
                              </div>
                            ) : (
                              availableCategories.map((cat) => (
                                <button
                                  key={cat.value}
                                  className={`${styles.categoryCard} ${
                                    category === cat.value
                                      ? styles.selected
                                      : ""
                                  }`}
                                  onClick={() => setCategory(cat.value)}
                                >
                                  <div className={styles.categoryIcon}>
                                    {cat.value === "root_cause_analysis" && (
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.35-4.35" />
                                      </svg>
                                    )}
                                    {cat.value === "product_improvement" && (
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
                                      </svg>
                                    )}
                                    {cat.value === "product_design" && (
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <rect
                                          x="3"
                                          y="3"
                                          width="18"
                                          height="18"
                                          rx="2"
                                          ry="2"
                                        />
                                        <circle cx="9" cy="9" r="2" />
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                      </svg>
                                    )}
                                    {cat.value === "metrics" && (
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <line x1="18" y1="20" x2="18" y2="10" />
                                        <line x1="12" y1="20" x2="12" y2="4" />
                                        <line x1="6" y1="20" x2="6" y2="14" />
                                      </svg>
                                    )}
                                    {cat.value === "product_strategy" && (
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="m9 12 2 2 4-4" />
                                      </svg>
                                    )}
                                    {cat.value === "guesstimates" && (
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v6l4 2" />
                                      </svg>
                                    )}
                                    {cat.value === "behavioral" && (
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                      </svg>
                                    )}
                                  </div>
                                  <h4>{cat.label}</h4>
                                </button>
                              ))
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      className={`btn btn-primary btn-xl ${styles.startInterviewButton}`}
                      onClick={handleStartInterview}
                      disabled={loading}
                    >
                      {loading ? "Starting..." : "Start Interview"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Chat Messages - ChatGPT Style */
              <div className={styles.mainContent}>
                <div className={styles.messagesContainer}>
                  <div className={styles.messagesInner}>
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`${styles.message} ${
                          msg.sender === "user"
                            ? styles.messageUser
                            : styles.messageAI
                        }`}
                      >
                        <div className={styles.messageContent}>
                          {msg.sender === "ai" && (
                            <div className={styles.messageAvatar}>AI</div>
                          )}
                          {msg.sender === "user" && (
                            <div className={styles.messageAvatarUser}>You</div>
                          )}
                          <div className={styles.messageText}>
                            {msg.isScore ? (
                              <div className={styles.scoreDisplay}>
                                {renderScoreMarkdown(
                                  msg.message,
                                  msg.scoreData,
                                  showDetailedFeedback,
                                  toggleDetailedFeedback,
                                  loadingDetailedScore,
                                  detailedScore
                                )}
                              </div>
                            ) : msg.isModelAnswer ? (
                              <div className={styles.modelAnswerDisplay}>
                                <div className={styles.modelAnswerHeader}>
                                  💎 <strong>Perfect 10/10 Model Answer</strong>
                                </div>
                                <div className={styles.modelAnswerContent}>
                                  {renderModelAnswerMarkdown(msg.message)}
                                </div>
                              </div>
                            ) : msg.sender === "ai" ? (
                              <div className={styles.clarificationDisplay}>
                                {renderModelAnswerMarkdown(msg.message)}
                              </div>
                            ) : (
                              msg.message
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {(submitting ||
                      scoring ||
                      askingClarification ||
                      loadingFirstQuestion) && (
                      <div className={`${styles.message} ${styles.messageAI}`}>
                        <div className={styles.messageContent}>
                          <div className={styles.messageAvatar}>AI</div>
                          <div className={styles.typingIndicator}>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Area */}
                <div className={styles.inputArea}>
                  {error && <div className={styles.errorBanner}>{error}</div>}

                  {scores &&
                    !messages.some(
                      (m) => m.isModelAnswer && m.questionId === questionId
                    ) && (
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.modelAnswerBtn}
                          onClick={handleShowModelAnswer}
                          disabled={loadingModelAnswer}
                        >
                          {loadingModelAnswer
                            ? "Loading..."
                            : "💎 Show Model Answer"}
                        </button>
                        <button
                          className={styles.nextQuestionBtn}
                          onClick={handleNextQuestion}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "➡️ Next Question"}
                        </button>
                      </div>
                    )}

                  {scores &&
                    messages.some(
                      (m) => m.isModelAnswer && m.questionId === questionId
                    ) && (
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.nextQuestionBtn}
                          onClick={handleNextQuestion}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "➡️ Next Question"}
                        </button>
                      </div>
                    )}

                  {/* Clean Write Final Answer Button - Integrated in input area */}
                  <div className={styles.inputAreaWithButton}>
                    <div className={styles.inputContainer}>
                      <textarea
                        ref={inputRef}
                        className={styles.input}
                        value={answer}
                        onChange={(e) => {
                          setAnswer(e.target.value);
                          // Auto-resize only when user is typing and input is not disabled
                          if (!submitting && !scoring && !askingClarification) {
                            e.target.style.height = "auto";
                            e.target.style.height =
                              Math.min(e.target.scrollHeight, 200) + "px";
                          }
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder={
                          conversationMode
                            ? "Ask clarifying questions or type your answer..."
                            : "Type your answer here..."
                        }
                        disabled={submitting || scoring || askingClarification}
                        rows={1}
                      />
                      <button
                        className={styles.sendBtn}
                        onClick={
                          conversationMode
                            ? handleAskClarification
                            : handleSubmitAnswer
                        }
                        disabled={
                          submitting ||
                          scoring ||
                          askingClarification ||
                          !answer.trim()
                        }
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M7 11L12 6L17 11M12 18V7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Write Final Answer Button - Now positioned to the right */}
                    {interviewStarted &&
                      question &&
                      !scores &&
                      !answerMode &&
                      conversationMode && (
                        <div className={styles.writeAnswerContainer}>
                          <button
                            className={styles.writeAnswerBtn}
                            onClick={handleEnterAnswerMode}
                            disabled={
                              submitting || scoring || askingClarification
                            }
                          >
                            Write Final Answer
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function renderScoreMarkdown(
  text,
  scoreData,
  showDetailedFeedback,
  toggleDetailedFeedback,
  loadingDetailedScore,
  detailedScore
) {
  // Extract overall score from scoreData or text
  // Try multiple possible field names
  const overallScore =
    scoreData?.overall_score ||
    scoreData?.totalScore ||
    extractScoreFromText(text);

  // Extract summary and detailed feedback
  const { summaryFeedback, detailedFeedback } = extractFeedbackSections(text);

  // Extract dimension scores
  const dimensionScores = {
    structure: scoreData?.structure || 0,
    metrics: scoreData?.metrics || 0,
    prioritization: scoreData?.prioritization || 0,
    userEmpathy: scoreData?.userEmpathy || 0,
    communication: scoreData?.communication || 0,
  };

  return (
    <div>
      {/* Large prominent score display */}
      <div className={styles.scoreHeader}>
        <div className={styles.scoreLabel}>Overall Score</div>
        <div className={`${styles.scoreValue} ${getScoreClass(overallScore)}`}>
          {overallScore}/10
        </div>
        <div className={styles.scoreBar}>
          <div
            className={`${styles.scoreBarFill} ${getScoreClass(overallScore)}`}
            style={{ width: `${(overallScore / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Dimension Score Bars */}
      <div className={styles.dimensionScores}>
        <div className={styles.dimensionRow}>
          <div className={styles.dimensionLabel}>Structure</div>
          <div className={styles.dimensionBar}>
            <div
              className={`${styles.dimensionBarFill} ${getScoreClass(
                dimensionScores.structure
              )}`}
              style={{ width: `${(dimensionScores.structure / 10) * 100}%` }}
            />
          </div>
          <div className={styles.dimensionScore}>
            {dimensionScores.structure}/10
          </div>
        </div>
        <div className={styles.dimensionRow}>
          <div className={styles.dimensionLabel}>Metrics</div>
          <div className={styles.dimensionBar}>
            <div
              className={`${styles.dimensionBarFill} ${getScoreClass(
                dimensionScores.metrics
              )}`}
              style={{ width: `${(dimensionScores.metrics / 10) * 100}%` }}
            />
          </div>
          <div className={styles.dimensionScore}>
            {dimensionScores.metrics}/10
          </div>
        </div>
        <div className={styles.dimensionRow}>
          <div className={styles.dimensionLabel}>Prioritization</div>
          <div className={styles.dimensionBar}>
            <div
              className={`${styles.dimensionBarFill} ${getScoreClass(
                dimensionScores.prioritization
              )}`}
              style={{
                width: `${(dimensionScores.prioritization / 10) * 100}%`,
              }}
            />
          </div>
          <div className={styles.dimensionScore}>
            {dimensionScores.prioritization}/10
          </div>
        </div>
        <div className={styles.dimensionRow}>
          <div className={styles.dimensionLabel}>User Empathy</div>
          <div className={styles.dimensionBar}>
            <div
              className={`${styles.dimensionBarFill} ${getScoreClass(
                dimensionScores.userEmpathy
              )}`}
              style={{ width: `${(dimensionScores.userEmpathy / 10) * 100}%` }}
            />
          </div>
          <div className={styles.dimensionScore}>
            {dimensionScores.userEmpathy}/10
          </div>
        </div>
        <div className={styles.dimensionRow}>
          <div className={styles.dimensionLabel}>Communication</div>
          <div className={styles.dimensionBar}>
            <div
              className={`${styles.dimensionBarFill} ${getScoreClass(
                dimensionScores.communication
              )}`}
              style={{
                width: `${(dimensionScores.communication / 10) * 100}%`,
              }}
            />
          </div>
          <div className={styles.dimensionScore}>
            {dimensionScores.communication}/10
          </div>
        </div>
      </div>

      {/* Summary Feedback or Loading Indicator */}
      {!showDetailedFeedback && (
        <div className={styles.summaryFeedback}>
          {summaryFeedback && (
            <div className={styles.summaryText}>{summaryFeedback}</div>
          )}

          {!summaryFeedback && (
            <div className={styles.feedbackContainer}>
              {renderModelAnswerMarkdown(text)}
            </div>
          )}

          {loadingDetailedScore && (
            <div className={styles.loadingDetailedIndicator}>
              <span className={styles.loadingDot}></span>
              Loading detailed feedback...
            </div>
          )}

          {detailedScore && !loadingDetailedScore && (
            <button
              className={styles.seeDetailedBtn}
              onClick={() => toggleDetailedFeedback()}
            >
              See Detailed Feedback
            </button>
          )}
        </div>
      )}

      {/* Detailed feedback with markdown */}
      {showDetailedFeedback && detailedScore && (
        <div className={styles.feedbackContainer}>
          <button
            className={styles.hideDetailedBtn}
            onClick={() => toggleDetailedFeedback()}
          >
            Hide Detailed Feedback
          </button>
          {renderModelAnswerMarkdown(detailedScore.feedback || text)}
        </div>
      )}
    </div>
  );
}

// Helper function to extract score from text if not in scoreData
function extractScoreFromText(text) {
  if (!text) return "N/A";

  // Look for patterns like "# Overall Score: X/10" or "Overall Score: X/10"
  const scorePattern = /(?:#\s*)?Overall Score:\s*(\d+(?:\.\d+)?)\/10/i;
  const match = text.match(scorePattern);

  if (match) {
    return parseFloat(match[1]);
  }

  // Fallback: look for any "X/10" pattern
  const fallbackPattern = /(\d+(?:\.\d+)?)\/10/;
  const fallbackMatch = text.match(fallbackPattern);

  return fallbackMatch ? parseFloat(fallbackMatch[1]) : "N/A";
}

// Helper function to get CSS class based on score
function getScoreClass(score) {
  if (score === "N/A") return styles.scoreNa;
  if (score >= 0 && score < 5) return styles.scorePoor;
  if (score >= 5 && score < 7) return styles.scoreBelowAverage;
  if (score >= 7 && score < 9) return styles.scoreGood;
  if (score >= 9 && score <= 10) return styles.scoreExcellent;
  return styles.scoreNa;
}

// Helper function to extract summary and detailed feedback from text
function extractFeedbackSections(text) {
  if (!text) return { summaryFeedback: "", detailedFeedback: "" };

  // Check if text contains the new format with SUMMARY and DETAILED sections
  if (text.includes("SUMMARY:") && text.includes("DETAILED:")) {
    const summaryMatch = text.match(
      /SUMMARY:\s*(.*?)(?=\n\n---|\n\nDETAILED:|$)/s
    );
    const detailedMatch = text.match(/DETAILED:\s*(.*?)$/s);

    return {
      summaryFeedback: summaryMatch ? summaryMatch[1].trim() : "",
      detailedFeedback: detailedMatch ? detailedMatch[1].trim() : text,
    };
  }

  // Fallback to original text
  return { summaryFeedback: "", detailedFeedback: text };
}

function renderScoreMarkdownOld(text, scoreData) {
  // Old rendering logic kept for reference
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      return <br key={i} />;
    }

    // Section headers with emojis - Make them more prominent
    if (trimmedLine.includes("✅ STRENGTHS")) {
      return (
        <div key={i} style={{ marginTop: "32px", marginBottom: "16px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#ffffff",
              margin: "0 0 8px 0",
              padding: "12px 0",
              borderBottom: "2px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            {trimmedLine}
          </h3>
        </div>
      );
    } else if (trimmedLine.includes("⚠️ AREAS TO IMPROVE")) {
      return (
        <div key={i} style={{ marginTop: "32px", marginBottom: "16px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#ffffff",
              margin: "0 0 8px 0",
              padding: "12px 0",
              borderBottom: "2px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            {trimmedLine}
          </h3>
        </div>
      );
    } else if (trimmedLine.includes("🔥 REFRAMED")) {
      return (
        <div key={i} style={{ marginTop: "32px", marginBottom: "16px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#ffffff",
              margin: "0 0 8px 0",
              padding: "12px 0",
              borderBottom: "2px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            {trimmedLine}
          </h3>
        </div>
      );
    } else if (trimmedLine.includes("⚡ BRUTAL TRUTH")) {
      return (
        <div key={i} style={{ marginTop: "32px", marginBottom: "16px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#ffffff",
              margin: "0 0 8px 0",
              padding: "12px 0",
              borderBottom: "2px solid rgba(168, 85, 247, 0.3)",
            }}
          >
            {trimmedLine}
          </h3>
        </div>
      );
    }
    // Bold headers with arrows (like **User segment →**)
    else if (trimmedLine.match(/^\*\*.*→\*\*$/)) {
      const content = trimmedLine.replace(/^\*\*(.*?)\*\*$/, "$1");
      return (
        <div
          key={i}
          style={{
            marginTop: "20px",
            marginBottom: "12px",
            padding: "8px 12px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderRadius: "8px",
            borderLeft: "4px solid #6366f1",
          }}
        >
          <p
            style={{
              margin: "0",
              fontWeight: "600",
              fontSize: "15px",
              color: "#ffffff",
            }}
          >
            {content}
          </p>
        </div>
      );
    }
    // Regular bold text headers
    else if (trimmedLine.match(/^\*\*.*\*\*$/)) {
      const content = trimmedLine.replace(/^\*\*(.*?)\*\*$/, "$1");
      return (
        <div
          key={i}
          style={{
            marginTop: "16px",
            marginBottom: "8px",
            padding: "6px 0",
          }}
        >
          <p
            style={{
              margin: "0",
              fontWeight: "600",
              fontSize: "14px",
              color: "#ffffff",
            }}
          >
            {content}
          </p>
        </div>
      );
    }
    // Bullet points with better styling
    else if (trimmedLine.startsWith("• ")) {
      const content = trimmedLine.substring(2);
      return (
        <div
          key={i}
          style={{
            marginLeft: "20px",
            marginBottom: "8px",
            paddingLeft: "8px",
          }}
        >
          <p
            style={{
              margin: "0",
              lineHeight: "1.6",
              color: "#e5e7eb",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#6366f1", marginRight: "8px" }}>•</span>
            {content}
          </p>
        </div>
      );
    }
    // Numbered lists with better styling
    else if (trimmedLine.match(/^\d+\./)) {
      const match = trimmedLine.match(/^(\d+)\.\s*(.*)/);
      const number = match[1];
      const content = match[2];
      return (
        <div
          key={i}
          style={{
            marginLeft: "20px",
            marginBottom: "12px",
            paddingLeft: "8px",
          }}
        >
          <p
            style={{
              margin: "0",
              lineHeight: "1.6",
              color: "#e5e7eb",
              fontSize: "14px",
            }}
          >
            <span
              style={{
                color: "#6366f1",
                fontWeight: "600",
                marginRight: "8px",
              }}
            >
              {number}.
            </span>
            {content}
          </p>
        </div>
      );
    }
    // Regular paragraphs with better spacing and formatting
    else {
      // Parse inline bold text and improve readability
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div
          key={i}
          style={{
            marginBottom: "12px",
            lineHeight: "1.7",
            fontSize: "14px",
          }}
        >
          <p
            style={{
              margin: "0",
              color: "#e5e7eb",
            }}
          >
            {parts.map((part, j) => {
              if (part.match(/^\*\*.*\*\*$/)) {
                return (
                  <strong
                    key={j}
                    style={{ color: "#ffffff", fontWeight: "600" }}
                  >
                    {part.replace(/\*\*/g, "")}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        </div>
      );
    }
  });
}

// Helper function to process bold and italic text
function processBoldAndItalic(text) {
  const parts = [];
  let currentIndex = 0;
  let key = 0;

  // Match **bold**, *italic*, and regular text
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index));
    }

    const matched = match[0];
    // Bold text
    if (matched.startsWith("**") && matched.endsWith("**")) {
      parts.push(
        <strong key={key++} style={{ fontWeight: "600", color: "#e5e7eb" }}>
          {matched.slice(2, -2)}
        </strong>
      );
    }
    // Italic text
    else if (matched.startsWith("*") && matched.endsWith("*")) {
      parts.push(
        <em key={key++} style={{ fontStyle: "italic", color: "#9ca3af" }}>
          {matched.slice(1, -1)}
        </em>
      );
    }

    currentIndex = match.index + matched.length;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? parts : text;
}

function renderModelAnswerMarkdown(text) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Main headings (##)
    if (line.startsWith("## ")) {
      const headingText = line.substring(3).trim();
      elements.push(
        <div
          key={i}
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#e5e7eb",
            marginTop: i > 0 ? "32px" : "0",
            marginBottom: "16px",
            paddingBottom: "8px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {headingText}
        </div>
      );
    }
    // Subheadings (###)
    else if (line.startsWith("### ")) {
      const subheadingText = line.substring(4).trim();
      elements.push(
        <div
          key={i}
          style={{
            fontSize: "17px",
            fontWeight: "600",
            color: "#f3f4f6",
            marginTop: "24px",
            marginBottom: "12px",
          }}
        >
          {processBoldAndItalic(subheadingText)}
        </div>
      );
    }
    // Bullet points (- or •)
    else if (line.match(/^[\-•]\s+/)) {
      const bulletText = line.substring(2).trim();
      const processedText = processBoldAndItalic(bulletText);
      elements.push(
        <div
          key={i}
          style={{
            marginLeft: "24px",
            marginBottom: "8px",
            lineHeight: "1.6",
            color: "#d1d5db",
            fontSize: "15px",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{ marginRight: "12px", color: "#9ca3af", flexShrink: 0 }}
          >
            •
          </span>
          <span>{processedText}</span>
        </div>
      );
    }
    // Numbered lists
    else if (line.match(/^\d+\.\s+/)) {
      const match = line.match(/^(\d+)\.\s+(.+)$/);
      if (match) {
        const number = match[1];
        const listText = match[2];
        const processedText = processBoldAndItalic(listText);
        elements.push(
          <div
            key={i}
            style={{
              marginLeft: "24px",
              marginBottom: "8px",
              lineHeight: "1.6",
              color: "#d1d5db",
              fontSize: "15px",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                marginRight: "12px",
                color: "#9ca3af",
                fontWeight: "600",
                flexShrink: 0,
              }}
            >
              {number}.
            </span>
            <span>{processedText}</span>
          </div>
        );
      }
    }
    // Block quotes (>)
    else if (line.startsWith("> ")) {
      const quoteText = line.substring(2).trim();
      const processedText = processBoldAndItalic(quoteText);
      elements.push(
        <div
          key={i}
          style={{
            borderLeft: "3px solid #6b7280",
            paddingLeft: "16px",
            marginBottom: "12px",
            fontStyle: "italic",
            color: "#9ca3af",
            fontSize: "15px",
          }}
        >
          {processedText}
        </div>
      );
    }
    // Regular paragraphs
    else if (line.trim()) {
      const processedText = processBoldAndItalic(line);
      elements.push(
        <div
          key={i}
          style={{
            marginBottom: "12px",
            lineHeight: "1.7",
            color: "#d1d5db",
            fontSize: "15px",
          }}
        >
          {processedText}
        </div>
      );
    }
    // Empty lines
    else {
      elements.push(<div key={i} style={{ height: "8px" }} />);
    }

    i++;
  }

  return <div>{elements}</div>;
}

export default Interview;
