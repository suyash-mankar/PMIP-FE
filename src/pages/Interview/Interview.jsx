import { useState, useRef, useEffect } from "react";
import {
  startInterview,
  submitAnswer,
  scoreAnswer,
  askClarification,
  getCategories,
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [askingClarification, setAskingClarification] = useState(false);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch available categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setAvailableCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
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

      setQuestionId(questionIdFromResponse);
      setQuestion(interviewQuestion);

      // Show loading indicator for first question
      setLoadingFirstQuestion(true);

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

  const handleSubmitFinalAnswerClick = () => {
    if (!answer.trim()) {
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    handleSubmitAnswer();
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
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

      // Start scoring
      setScoring(true);

      try {
        const scoreResponse = await scoreAnswer(
          sessionIdFromSubmit || sessionId
        );
        console.log("Score response:", scoreResponse.data);
        const scoreData = scoreResponse.data;

        const scoresPayload = scoreData.score || scoreData.scores || scoreData;

        console.log("Scores payload:", scoresPayload);
        setScores(scoresPayload);

        // Format feedback message with scores inline
        const feedbackMessage = formatScoreFeedback(scoresPayload);

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: feedbackMessage,
            timestamp: new Date().toISOString(),
            isScore: true,
            scoreData: scoresPayload,
          },
        ]);

        // Update question history
        setQuestionHistory((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  status: "completed",
                  score: scoresPayload.totalScore || 0,
                }
              : q
          )
        );
      } catch (scoreError) {
        console.error("Scoring error:", scoreError);
        setError(
          scoreError.response?.data?.message ||
            scoreError.message ||
            "Failed to score answer. Please try again."
        );
      } finally {
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

  const handleNextQuestion = async () => {
    setLoading(true);
    setError("");
    setScores(null);
    setAnswer("");
    setConversationMode(false);

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

      setQuestionId(questionIdFromResponse);
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
                  transform: sidebarOpen ? "rotate(180deg)" : "rotate(0deg)",
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
              <h1 className={styles.welcomeTitle}>PM Interview Practice</h1>
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
                    <div className={styles.cardIcon}>🌱</div>
                    <h3>Entry Level</h3>
                    <p>For aspiring PMs and career switchers</p>
                  </button>

                  <button
                    className={`${styles.difficultyCard} ${
                      difficulty === "mid" ? styles.selected : ""
                    }`}
                    onClick={() => setDifficulty("mid")}
                  >
                    <div className={styles.cardIcon}>💼</div>
                    <h3>Mid Level</h3>
                    <p>For PMs with 2-5 years of experience</p>
                  </button>

                  <button
                    className={`${styles.difficultyCard} ${
                      difficulty === "senior" ? styles.selected : ""
                    }`}
                    onClick={() => setDifficulty("senior")}
                  >
                    <div className={styles.cardIcon}>🚀</div>
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
                        !category ? styles.selected : ""
                      }`}
                      onClick={() => setCategory(null)}
                    >
                      <div className={styles.categoryIcon}>🎯</div>
                      <h4>Random Mix</h4>
                      <p>All categories</p>
                    </button>
                    {availableCategories.map((cat) => (
                      <button
                        key={cat.value}
                        className={`${styles.categoryCard} ${
                          category === cat.value ? styles.selected : ""
                        }`}
                        onClick={() => setCategory(cat.value)}
                      >
                        <div className={styles.categoryIcon}>
                          {cat.value === "root_cause_analysis" && "🔍"}
                          {cat.value === "product_improvement" && "⚡"}
                          {cat.value === "product_design" && "🎨"}
                          {cat.value === "metrics" && "📊"}
                          {cat.value === "product_strategy" && "🎯"}
                          {cat.value === "guesstimates" && "🧮"}
                        </div>
                        <h4>{cat.label}</h4>
                        <p>{cat.count} questions</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-xl"
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
          <>
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
                            {renderScoreMarkdown(msg.message, msg.scoreData)}
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

              {/* Conversation Mode Banner */}
              {conversationMode && !scores && (
                <div className={styles.conversationBanner}>
                  <div className={styles.conversationInfo}>
                    <div className={styles.conversationIcon}>💬</div>
                    <div className={styles.conversationText}>
                      <h4>Discussion Mode</h4>
                      <p>
                        Ask clarifying questions. When ready, submit your final
                        answer.
                      </p>
                    </div>
                  </div>
                  <button
                    className={styles.submitFinalAnswerBtn}
                    onClick={handleSubmitFinalAnswerClick}
                    disabled={
                      submitting ||
                      scoring ||
                      askingClarification ||
                      !answer.trim()
                    }
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Submit Final Answer
                  </button>
                </div>
              )}

              {scores && (
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={handleCancelSubmit}>
          <div
            className={styles.confirmModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Submit Final Answer?</h3>
            <p>
              Are you ready to submit this as your final answer? Once submitted,
              it will be evaluated and you won't be able to ask more clarifying
              questions for this question.
            </p>
            <div className={styles.confirmActions}>
              <button
                className="btn btn-outline-dark"
                onClick={handleCancelSubmit}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmSubmit}>
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderScoreMarkdown(text, scoreData) {
  // Parse and render the markdown-style feedback with ChatGPT formatting
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      return <br key={i} />;
    }

    // Section headers with emojis
    if (trimmedLine.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="score-heading"
          style={{ marginTop: "20px", marginBottom: "15px" }}
        >
          {line.substring(3)}
        </h2>
      );
    } else if (trimmedLine.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="score-subheading"
          style={{ marginTop: "15px", marginBottom: "10px" }}
        >
          {line.substring(4)}
        </h3>
      );
    }
    // ChatGPT-style section headers with emojis
    else if (trimmedLine.includes("✅ STRENGTHS")) {
      return (
        <h3
          key={i}
          style={{
            marginTop: "20px",
            marginBottom: "10px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          {trimmedLine}
        </h3>
      );
    } else if (trimmedLine.includes("⚠️ AREAS TO IMPROVE")) {
      return (
        <h3
          key={i}
          style={{
            marginTop: "20px",
            marginBottom: "10px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          {trimmedLine}
        </h3>
      );
    } else if (
      trimmedLine.includes("🔥 REFRAMED") ||
      trimmedLine.includes("🔥 REFRAMED")
    ) {
      return (
        <h3
          key={i}
          style={{
            marginTop: "20px",
            marginBottom: "10px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          {trimmedLine}
        </h3>
      );
    } else if (trimmedLine.includes("⚡ BRUTAL TRUTH")) {
      return (
        <h3
          key={i}
          style={{
            marginTop: "20px",
            marginBottom: "10px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          {trimmedLine}
        </h3>
      );
    }
    // Bold headers with arrows (like **User segment →**)
    else if (trimmedLine.match(/^\*\*.*→\*\*$/)) {
      const content = trimmedLine.replace(/^\*\*(.*?)\*\*$/, "$1");
      return (
        <p
          key={i}
          style={{
            marginTop: "15px",
            marginBottom: "8px",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          {content}
        </p>
      );
    }
    // Regular bold text
    else if (trimmedLine.match(/^\*\*.*\*\*$/)) {
      const content = trimmedLine.replace(/^\*\*(.*?)\*\*$/, "$1");
      return (
        <p
          key={i}
          style={{ marginTop: "10px", marginBottom: "5px", fontWeight: "600" }}
        >
          {content}
        </p>
      );
    }
    // Bullet points
    else if (trimmedLine.startsWith("• ")) {
      return (
        <p
          key={i}
          style={{ marginLeft: "20px", marginBottom: "5px", lineHeight: "1.5" }}
        >
          {line}
        </p>
      );
    }
    // Numbered lists
    else if (trimmedLine.match(/^\d+\./)) {
      return (
        <p
          key={i}
          style={{ marginLeft: "20px", marginBottom: "5px", lineHeight: "1.5" }}
        >
          {line}
        </p>
      );
    }
    // Regular text with bold formatting
    else {
      // Parse inline bold text
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} style={{ marginBottom: "8px", lineHeight: "1.5" }}>
          {parts.map((part, j) => {
            if (part.match(/^\*\*.*\*\*$/)) {
              return <strong key={j}>{part.replace(/\*\*/g, "")}</strong>;
            }
            return part;
          })}
        </p>
      );
    }
  });
}

export default Interview;
