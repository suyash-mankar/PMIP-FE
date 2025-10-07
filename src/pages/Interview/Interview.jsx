import { useState, useRef, useEffect } from "react";
import {
  startInterview,
  submitAnswer,
  scoreAnswer,
  askClarification,
} from "../../api/client";
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
      const conversationHistory = messages
        .slice(1)
        .map((msg) => ({
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
      {/* Left Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h3>Questions Solved</h3>
          <button
            className={styles.sidebarToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <div className={styles.questionList}>
          {questionHistory.length === 0 ? (
            <p className={styles.emptyState}>No questions yet. Start an interview!</p>
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
                    <span className={styles.questionDifficulty}>{q.difficulty}</span>
                    {q.score !== undefined && (
                      <span className={styles.questionScore}>{q.score}/10</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={styles.chatArea}>
        {!interviewStarted ? (
          /* Welcome Screen */
          <div className={styles.welcomeScreen}>
            <div className={styles.welcomeContent}>
              <h1 className={styles.welcomeTitle}>PM Interview Practice</h1>
              <p className={styles.welcomeSubtitle}>
                Practice PM interviews with AI. Get harsh, honest feedback instantly.
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
                      msg.sender === "user" ? styles.messageUser : styles.messageAI
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

                {(submitting || scoring || askingClarification || loadingFirstQuestion) && (
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
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    conversationMode
                      ? "Ask clarifying questions or type your answer..."
                      : "Type your answer here..."
                  }
                  disabled={submitting || scoring || askingClarification}
                  rows={1}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
                  }}
                />
                <div className={styles.inputActions}>
                  {conversationMode && !scores && (
                    <button
                      className={styles.submitFinalBtn}
                      onClick={handleSubmitFinalAnswerClick}
                      disabled={
                        submitting ||
                        scoring ||
                        askingClarification ||
                        !answer.trim()
                      }
                    >
                      Submit Final Answer
                    </button>
                  )}
                  <button
                    className={styles.sendBtn}
                    onClick={
                      conversationMode ? handleAskClarification : handleSubmitAnswer
                    }
                    disabled={
                      submitting ||
                      scoring ||
                      askingClarification ||
                      !answer.trim()
                    }
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              <button className="btn btn-outline-dark" onClick={handleCancelSubmit}>
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
  // Parse and render the markdown-style feedback
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) {
      return <h2 key={i} className="score-heading">{line.substring(3)}</h2>;
    } else if (line.startsWith("### ")) {
      return <h3 key={i} className="score-subheading">{line.substring(4)}</h3>;
    } else if (line.startsWith("- **")) {
      return <p key={i} className="score-bullet">{line}</p>;
    } else if (line.trim()) {
      return <p key={i}>{line}</p>;
    }
    return <br key={i} />;
  });
}

export default Interview;
