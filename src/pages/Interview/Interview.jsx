import { useState, useRef, useEffect } from "react";
import { startInterview, submitAnswer, scoreAnswer, askClarification } from "../../api/client";
import ChatBubble from "../../components/ChatBubble/ChatBubble";
import ScoreCard from "../../components/ScoreCard/ScoreCard";
import styles from "./Interview.module.scss";

function Interview() {
  const [difficulty, setDifficulty] = useState("mid");
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
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [loadingFirstQuestion, setLoadingFirstQuestion] = useState(false);
  const [conversationMode, setConversationMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [askingClarification, setAskingClarification] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input after AI responds
  useEffect(() => {
    if (!submitting && !scoring && interviewStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [submitting, scoring, interviewStarted]);

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
      const response = await startInterview(difficulty);
      console.log("Start interview response:", response.data);

      // Handle different possible response formats
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
      return; // Don't show error, just don't send
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
    setAnswer(""); // Clear input immediately

    try {
      // Get conversation history (excluding welcome message)
      const conversationHistory = messages
        .slice(1) // Skip welcome message
        .map((msg) => ({
          role: msg.sender === "ai" ? "assistant" : "user",
          content: msg.message,
        }));

      // Add current user message to history
      conversationHistory.push({
        role: "user",
        content: currentMessage,
      });

      // Ask for clarification
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
      return; // Don't show error, just don't submit
    }

    setSubmitting(true);
    setError("");
    setConversationMode(false); // Exit conversation mode

    // Add user message to chat
    const userMessage = {
      sender: "user",
      message: answer,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const currentAnswer = answer;
    setAnswer(""); // Clear input immediately

    try {
      // Submit answer
      const submitResponse = await submitAnswer(questionId, currentAnswer);
      console.log("Submit answer response:", submitResponse.data);

      // Get sessionId from submit response
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

        // Backend returns { message, score: {...} }
        const scoresPayload = scoreData.score || scoreData.scores || scoreData;

        console.log("Scores payload:", scoresPayload);
        setScores(scoresPayload);

        // Add feedback summary message
        const totalScore =
          scoresPayload.totalScore ||
          Math.round(
            (scoresPayload.structure +
              scoresPayload.metrics +
              scoresPayload.prioritization +
              scoresPayload.userEmpathy +
              scoresPayload.communication) /
              5
          );

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: `Great! I've evaluated your answer. You scored **${totalScore}/10** overall. Click "View Detailed Feedback" below to see your complete score breakdown and improvement suggestions.`,
            timestamp: new Date().toISOString(),
          },
        ]);

        // Show score modal
        setShowScoreModal(true);
      } catch (scoreErr) {
        console.error("Scoring error:", scoreErr);

        // Retry logic for JSON parse errors
        if (
          scoreErr.response?.status === 500 ||
          scoreErr.message?.includes("JSON")
        ) {
          setError("Scoring failed. Please try submitting again.");
        } else {
          setError("Failed to score your answer. Please try again.");
        }
      }
    } catch (err) {
      console.error("Submit answer error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit answer. Please try again."
      );
      // Remove the user message if submission failed
      setMessages((prev) => prev.slice(0, -1));
      setAnswer(currentAnswer); // Restore answer
    } finally {
      setSubmitting(false);
      setScoring(false);
    }
  };

  // Handle Enter key to submit
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

  // Handle Next Question
  const handleNextQuestion = async () => {
    setLoading(true);
    setError("");
    setQuestionId(null);
    setSessionId(null);
    setAnswer("");
    setScores(null);
    setShowScoreModal(false);

    // Add transition message
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

      // Add new question after delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: interviewQuestion,
            timestamp: new Date().toISOString(),
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
      {/* Chat Interface */}
      <div className={styles.chatInterface}>
        {/* Top Bar - Only show if interview hasn't started */}
        {!interviewStarted && (
          <div className={styles.topBar}>
            <h1 className={styles.appTitle}>PM Interview Coach</h1>
          </div>
        )}

        {/* Messages Container */}
        <div className={styles.messagesContainer} ref={chatContainerRef}>
          <div className={styles.messagesInner}>
            {!interviewStarted ? (
              /* Welcome Screen */
              <div className={styles.welcomeScreen}>
                <div className={styles.welcomeIcon}>🎯</div>
                <h2 className={styles.welcomeTitle}>
                  Welcome to PM Interview Practice
                </h2>
                <p className={styles.welcomeSubtitle}>
                  Practice product management interview questions with
                  AI-powered feedback. Choose your difficulty level to begin.
                </p>

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
                    <div className={styles.cardIcon}>⚡</div>
                    <h3>Mid Level</h3>
                    <p>For PMs with 2-5 years experience</p>
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

                <button
                  className="btn btn-primary btn-xl"
                  onClick={handleStartInterview}
                  disabled={loading}
                >
                  {loading ? "Starting..." : "Start Interview"}
                </button>
              </div>
            ) : (
              /* Chat Messages */
              <div className={styles.chatMessages}>
                {messages.map((msg, index) => (
                  <ChatBubble
                    key={index}
                    message={msg.message}
                    sender={msg.sender}
                    timestamp={msg.timestamp}
                  />
                ))}
                {(submitting || scoring || askingClarification) && (
                  <div className={styles.typingIndicatorWrapper}>
                    <div className={styles.typingIndicator}>
                      <span className={styles.aiAvatarSmall}>AI</span>
                      <div className={styles.typingDots}>
                        <div className={styles.typingDot}></div>
                        <div className={styles.typingDot}></div>
                        <div className={styles.typingDot}></div>
                      </div>
                    </div>
                  </div>
                )}
                {loadingFirstQuestion && (
                  <div className={styles.typingIndicatorWrapper}>
                    <div className={styles.typingIndicator}>
                      <span className={styles.aiAvatarSmall}>AI</span>
                      <div className={styles.typingDots}>
                        <div className={styles.typingDot}></div>
                        <div className={styles.typingDot}></div>
                        <div className={styles.typingDot}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Only show when interview is started */}
        {interviewStarted && (
          <div className={styles.inputContainer}>
            {error && <div className={styles.errorBanner}>{error}</div>}

            {scores && (
              <div className={styles.feedbackPrompt}>
                <button
                  className={styles.viewFeedbackBtn}
                  onClick={() => setShowScoreModal(true)}
                >
                  📊 View Detailed Feedback
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

            <div className={styles.inputWrapper}>
              <textarea
                ref={inputRef}
                className={styles.chatInput}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  conversationMode
                    ? "Ask clarifying questions or type your answer... (Shift+Enter for new line)"
                    : "Type your answer here... (Shift+Enter for new line)"
                }
                disabled={submitting || scoring || askingClarification}
                rows={1}
                style={{
                  minHeight: "24px",
                  maxHeight: "200px",
                  height: "auto",
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              <button
                className={styles.sendButton}
                onClick={conversationMode ? handleAskClarification : handleSubmitAnswer}
                disabled={submitting || scoring || askingClarification || !answer.trim()}
                aria-label="Send message"
              >
                {submitting || scoring || askingClarification ? (
                  <div
                    className="spinner"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderWidth: "2px",
                    }}
                  ></div>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                )}
              </button>
              {conversationMode && !scores && (
                <button
                  className={styles.submitFinalAnswerBtn}
                  onClick={handleSubmitFinalAnswerClick}
                  disabled={submitting || scoring || askingClarification || !answer.trim()}
                  title="Submit your final answer for evaluation"
                >
                  ✓ Submit Final Answer
                </button>
              )}
            </div>
            <p className={styles.inputHint}>
              {conversationMode
                ? "💡 Ask clarifying questions first, then submit your final answer for evaluation"
                : "Press Enter to send, Shift+Enter for new line"}
            </p>
          </div>
        )}
      </div>

      {/* Score Modal */}
      {showScoreModal && scores && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowScoreModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setShowScoreModal(false)}
            >
              ✕
            </button>
            <ScoreCard scores={scores} />
            <div className={styles.modalActions}>
              <button
                className="btn btn-primary"
                onClick={() => setShowScoreModal(false)}
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button
                className="btn btn-outline-dark"
                onClick={() => {
                  setShowScoreModal(false);
                  handleNextQuestion();
                }}
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? "Loading..." : "Next Question →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Final Answer Submission */}
      {showConfirmModal && (
        <div
          className={styles.modalOverlay}
          onClick={handleCancelSubmit}
        >
          <div
            className={styles.confirmModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.confirmTitle}>Submit Final Answer?</h3>
            <p className={styles.confirmMessage}>
              Are you ready to submit this as your final answer? Once submitted, it will be evaluated and you won't be able to ask more clarifying questions for this question.
            </p>
            <div className={styles.confirmActions}>
              <button
                className="btn btn-outline-dark"
                onClick={handleCancelSubmit}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmSubmit}
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interview;
