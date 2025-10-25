import { useState, useRef, useEffect, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  startInterview,
  submitAnswer,
  scoreAnswer,
  scoreAnswerSummarised,
  askClarification,
  getCategories,
  getModelAnswer,
  textToSpeech,
  startPracticeSession,
  endPracticeSession,
  trackQuestionUsage,
} from "../../api/client";
import VoiceInput from "../../components/VoiceInput/VoiceInput";
import Timer from "../../components/Timer/Timer";
import { useTimer } from "../../hooks/useTimer";
import usageTracker from "../../services/usageTracker";
import { getErrorMessage } from "../../services/errorHandler";
import UpgradeModal from "../../components/UpgradeModal/UpgradeModal";
import styles from "./Interview.module.scss";

// Text-to-Speech Hook using OpenAI TTS
function useSpeech(text) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const toggleSpeak = useCallback(async () => {
    // If currently speaking, stop it
    if (isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsSpeaking(false);
      return;
    }

    try {
      setIsLoading(true);

      // Call backend API to get speech audio
      const response = await textToSpeech(text, "nova");

      // Create audio blob from response
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setIsLoading(false);
        console.error("Audio playback error");
      };

      await audio.play();
    } catch (error) {
      console.error("Text-to-speech error:", error);
      setIsSpeaking(false);
      setIsLoading(false);
    }
  }, [text, isSpeaking]);

  return { isSpeaking, isLoading, toggleSpeak };
}

// Memoized Message Component to prevent re-renders
const MessageWithSpeaker = memo(
  ({
    msg,
    index,
    renderScoreMarkdown,
    renderModelAnswerMarkdown,
    showDetailedFeedback,
    toggleDetailedFeedback,
    loadingDetailedScore,
    detailedScore,
    userStatus,
    handleFeatureLockClick,
  }) => {
    const { isSpeaking, isLoading, toggleSpeak } = useSpeech(msg.message);

    return (
      <div
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
                {renderScoreMarkdown(
                  msg.message,
                  msg.scoreData,
                  showDetailedFeedback,
                  toggleDetailedFeedback,
                  loadingDetailedScore,
                  detailedScore,
                  userStatus,
                  handleFeatureLockClick
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
              <>
                <div className={styles.clarificationDisplay}>
                  {renderModelAnswerMarkdown(msg.message)}
                </div>
                {msg.isQuestion &&
                  (msg.category || (msg.company && msg.company.length > 0)) && (
                    <div className={styles.chatQuestionMeta}>
                      {msg.category && (
                        <span className={styles.chatQuestionCategory}>
                          {msg.category}
                        </span>
                      )}
                      {msg.company && msg.company.length > 0 && (
                        <span className={styles.chatQuestionCompany}>
                          {msg.company.join(", ")}
                        </span>
                      )}
                    </div>
                  )}
              </>
            ) : (
              msg.message
            )}
          </div>
          {msg.sender === "ai" &&
            !msg.isScore &&
            !userStatus?.isLocked?.voice && (
              <button
                onClick={toggleSpeak}
                className={`${styles.speakerBtn} ${
                  isSpeaking ? styles.speaking : ""
                } ${isLoading ? styles.loading : ""}`}
                title={
                  isLoading
                    ? "Loading audio..."
                    : isSpeaking
                    ? "Stop speaking"
                    : "Read aloud"
                }
                aria-label={
                  isLoading
                    ? "Loading audio..."
                    : isSpeaking
                    ? "Stop speaking"
                    : "Read aloud"
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.spinner}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="31.4 31.4"
                      strokeDashoffset="0"
                    />
                  </svg>
                ) : isSpeaking ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 5L6 9H2V15H6L11 19V5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 5L6 9H2V15H6L11 19V5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            )}
        </div>
      </div>
    );
  }
);

MessageWithSpeaker.displayName = "MessageWithSpeaker";

function Interview() {
  console.log("🎯 Interview component mounted");

  // Helper function to render category icon
  const renderCategoryIcon = (categoryValue) => {
    const normalizedCategory = categoryValue.toLowerCase().replace(/\s+/g, "_");
    console.log(
      "Rendering icon for category:",
      categoryValue,
      "-> normalized:",
      normalizedCategory
    );

    const iconProps = {
      width: "28",
      height: "28",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    };

    // Search icon - RCA
    if (
      normalizedCategory.includes("root_cause") ||
      normalizedCategory.includes("rca")
    ) {
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      );
    }

    // Lightning - Improvement
    if (normalizedCategory.includes("improvement")) {
      return (
        <svg {...iconProps}>
          <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
        </svg>
      );
    }

    // Store - Design
    if (normalizedCategory.includes("design")) {
      return (
        <svg {...iconProps}>
          <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
          <path d="M2 7h20" />
          <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
        </svg>
      );
    }

    // Bar chart - Metrics
    if (normalizedCategory.includes("metric")) {
      return (
        <svg {...iconProps}>
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      );
    }

    // Target - Strategy
    if (normalizedCategory.includes("strategy")) {
      return (
        <svg {...iconProps}>
          <path d="M12 2v20M2 12h20" />
          <path d="m19 19-7-7 7-7M5 5l7 7-7 7" />
        </svg>
      );
    }

    // Pie chart - Guesstimates
    if (normalizedCategory.includes("guesstimate")) {
      return (
        <svg {...iconProps}>
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
      );
    }

    // Users - Behavioral
    if (normalizedCategory.includes("behav")) {
      return (
        <svg {...iconProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    }

    // Server - Tech
    if (normalizedCategory.includes("tech")) {
      return (
        <svg {...iconProps}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          <path d="M8 10h.01" />
          <path d="M12 10h.01" />
          <path d="M16 10h.01" />
        </svg>
      );
    }

    // Default - Document
    return (
      <svg {...iconProps}>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    );
  };

  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [questionId, setQuestionId] = useState(null);
  const [sessionId, setSessionId] = useState(null); // Individual answer ID (renamed from old usage)
  const [practiceSessionId, setPracticeSessionId] = useState(null); // Practice session ID
  const [sessionStartTime, setSessionStartTime] = useState(null); // Track session start time
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionSummary, setSessionSummary] = useState(null); // For session summary modal
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
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Timer states
  const [showTimer, setShowTimer] = useState(false);
  const [questionAppeared, setQuestionAppeared] = useState(false);

  // Usage tracking states
  const [userStatus, setUserStatus] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");
  const [usageLimitChecked, setUsageLimitChecked] = useState(false);
  const [loadingUserStatus, setLoadingUserStatus] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize timer (only active when question has appeared and showTimer is enabled)
  const {
    seconds,
    formatTime,
    reset: resetTimer,
  } = useTimer(questionAppeared && showTimer);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check usage limits on mount
  useEffect(() => {
    const checkUsageLimits = async () => {
      try {
        console.log("🔍 Checking usage limits...");
        const status = await usageTracker.checkLimit();
        console.log("✅ Usage status received:", status);
        setUserStatus(status);
        setUsageLimitChecked(true);
        setLoadingUserStatus(false);

        // Show upgrade modal if trial expired
        if (status.planType === "pro_trial" && status.trialExpired) {
          setUpgradeReason("trial_expired");
          setShowUpgradeModal(true);
        }
      } catch (error) {
        console.error("❌ Error checking usage limits:", error);
        console.error("Error details:", error.response?.data || error.message);
        console.warn("⚠️ Using fallback anonymous status due to API error");
        setUsageLimitChecked(true);
        setLoadingUserStatus(false);

        // Set a default anonymous status on error (allow the page to load)
        setUserStatus({
          isAuthenticated: false,
          planType: "anonymous",
          canPractice: true,
          questionsUsed: 0,
          questionsRemaining: 3,
          questionsLimit: 3,
          limitMessage: "3 of 3 free questions remaining",
          isLocked: {
            category: true,
            voice: true,
            timer: true,
            dashboard: true,
            history: true,
          },
        });
      }
    };
    checkUsageLimits();
  }, []);

  // Fetch available categories in the background on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await getCategories();
        console.log("Categories received:", response.data.categories);
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
    // Check usage limits before starting
    if (!usageLimitChecked || !userStatus) {
      try {
        const status = await usageTracker.checkLimit();
        setUserStatus(status);

        if (!status.canPractice) {
          setUpgradeReason("limit_reached");
          setShowUpgradeModal(true);
          return;
        }
      } catch (error) {
        console.error("Error checking usage limits:", error);
      }
    } else if (!userStatus.canPractice) {
      setUpgradeReason("limit_reached");
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError("");
    setScores(null);
    setAnswer("");
    setInterviewStarted(true);

    // Add welcome message
    const welcomeMessage = {
      sender: "ai",
      message: `Great! Let's begin your PM interview session. I'll ask you questions, and you can take your time to provide thoughtful answers. Ready?`,
      timestamp: new Date().toISOString(),
    };

    setMessages([welcomeMessage]);

    // Show loading indicator immediately after welcome message
    setLoadingFirstQuestion(true);

    try {
      // Start a practice session (only for authenticated users)
      const isAuthenticated = !!localStorage.getItem("jwt_token");
      if (isAuthenticated) {
        const sessionResponse = await startPracticeSession();
        const newSessionId = sessionResponse.data.sessionId;
        setPracticeSessionId(newSessionId);
        setSessionStartTime(Date.now()); // Track start time
        console.log("Practice session started:", newSessionId);
      } else {
        console.log("Anonymous user - skipping practice session creation");
      }

      // Then get the first question
      const response = await startInterview(category);
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

      // Reset timer for new question
      resetTimer();
      setQuestionAppeared(false); // Reset for new question

      // Add question after a brief delay for natural feel
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: interviewQuestion,
            timestamp: new Date().toISOString(),
            category: response.data.category || null,
            company: response.data.company || [],
            isQuestion: true,
          },
        ]);
        setLoadingFirstQuestion(false);
        setConversationMode(true); // Enable conversation mode
        setQuestionAppeared(true); // Start timer now that question is visible

        // Add to question history
        setQuestionHistory((prev) => [
          ...prev,
          {
            id: questionIdFromResponse,
            question: interviewQuestion,
            category: response.data.category || null,
            company: response.data.company || [],
            timestamp: new Date().toISOString(),
            status: "in_progress",
          },
        ]);
      }, 800);
    } catch (err) {
      console.error("Start interview error:", err);
      console.error("Error response:", err.response?.data);
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
    } finally {
      setAskingClarification(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      return;
    }

    // Stop timer immediately
    setQuestionAppeared(false);

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
      // Submit answer with time taken (if timer is enabled)
      const submitResponse = await submitAnswer(
        questionId,
        currentAnswer,
        practiceSessionId,
        sessionId, // answerId for updates
        showTimer ? seconds : null
      );
      console.log("Submit answer response:", submitResponse.data);

      const answerIdFromSubmit =
        submitResponse.data.answerId || submitResponse.data.id;
      if (answerIdFromSubmit) {
        setSessionId(answerIdFromSubmit); // Store answerId in sessionId state
      }

      // Track usage immediately after successful answer submission
      // This happens before scoring, so it always executes even if scoring fails
      console.log("🚀 STARTING USAGE TRACKING...");
      try {
        console.log("🔑 Getting fingerprint...");
        const fingerprint = await usageTracker.ensureFingerprint();
        console.log(
          "📊 Tracking question usage with fingerprint:",
          fingerprint
        );

        console.log("📡 Calling trackQuestionUsage API...");
        const trackResponse = await trackQuestionUsage(fingerprint);
        console.log("📥 Raw track response:", trackResponse);
        const updatedStatus = trackResponse.data.status;

        console.log("✅ Updated usage status after tracking:", updatedStatus);
        console.log("📝 Previous userStatus:", userStatus);
        console.log("📝 New userStatus being set:", updatedStatus);
        setUserStatus(updatedStatus);
        console.log("✅ setUserStatus called successfully");

        // Show upgrade modal if limit reached
        if (!updatedStatus.canPractice) {
          console.log("⚠️ Limit reached! Showing upgrade modal...");
          setUpgradeReason("limit_reached");
          setShowUpgradeModal(true);
        }
      } catch (trackingError) {
        console.error("❌ ERROR IN TRACKING BLOCK!");
        console.error("❌ Error tracking usage:", trackingError);
        console.error(
          "Error details:",
          trackingError.response?.data || trackingError.message
        );
        console.error("Full error object:", trackingError);
      }
      console.log("🏁 USAGE TRACKING BLOCK COMPLETED");

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
        setError(getErrorMessage(scoreError));
        setScoring(false);
      }
    } catch (err) {
      console.error("Submit answer error:", err);
      setError(getErrorMessage(err));
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
        setError(getErrorMessage(err));
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

    // Validate minimum length
    if (finalAnswerDraft.trim().length < 10) {
      setError("Answer length should be at least 10 characters long");
      return;
    }

    // Stop timer immediately
    setQuestionAppeared(false);

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
      const response = await submitAnswer(
        questionId,
        finalAnswerDraft,
        practiceSessionId,
        sessionId, // answerId for updates
        showTimer ? seconds : null
      );

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

      // Get answerId from submit response
      const newAnswerId = response.data.answerId || response.data.id;
      if (newAnswerId) {
        setSessionId(newAnswerId); // Store answerId in sessionId state

        // Track usage immediately after successful answer submission
        console.log("🚀 STARTING USAGE TRACKING (Final Answer)...");
        try {
          console.log("🔑 Getting fingerprint...");
          const fingerprint = await usageTracker.ensureFingerprint();
          console.log(
            "📊 Tracking question usage with fingerprint:",
            fingerprint
          );

          console.log("📡 Calling trackQuestionUsage API...");
          const trackResponse = await trackQuestionUsage(fingerprint);
          console.log("📥 Raw track response:", trackResponse);
          const updatedStatus = trackResponse.data.status;

          console.log("✅ Updated usage status after tracking:", updatedStatus);
          setUserStatus(updatedStatus);
          console.log("✅ setUserStatus called successfully");

          // Show upgrade modal if limit reached
          if (!updatedStatus.canPractice) {
            console.log("⚠️ Limit reached! Showing upgrade modal...");
            setUpgradeReason("limit_reached");
            setShowUpgradeModal(true);
          }
        } catch (trackingError) {
          console.error("❌ ERROR IN TRACKING BLOCK!");
          console.error("❌ Error tracking usage:", trackingError);
          console.error(
            "Error details:",
            trackingError.response?.data || trackingError.message
          );
        }
        console.log("🏁 USAGE TRACKING BLOCK COMPLETED");

        // Trigger scoring with the new answerId
        await handleScore(newAnswerId);
      } else {
        setError("No answer ID returned from submit answer");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
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
    // Check usage limit before allowing next question
    if (userStatus && !userStatus.canPractice) {
      console.log("⚠️ Cannot proceed to next question - limit reached");
      setUpgradeReason("limit_reached");
      setShowUpgradeModal(true);
      return;
    }

    console.log("🔄 Moving to next question. Current status:", userStatus);

    // Stop timer immediately
    setQuestionAppeared(false);

    setLoading(true);
    setError("");
    setScores(null);
    setAnswer("");
    setSessionId(null); // Clear session ID for new question
    setConversationMode(false);
    setModelAnswer(null);
    setAnswerMode(false);
    setFinalAnswerDraft("");
    setShowAnswerSidebar(true);
    setShowDetailedFeedback(false);
    setDetailedScore(null);
    setLoadingDetailedScore(false);
    setLoadingModelAnswer(false);

    // Clear messages for new question - start fresh conversation
    setMessages([]);

    try {
      // Refresh usage status before loading next question
      try {
        const fingerprint = await usageTracker.ensureFingerprint();
        const updatedStatus = await usageTracker.checkLimit();
        console.log(
          "✅ Refreshed usage status before next question:",
          updatedStatus
        );
        setUserStatus(updatedStatus);

        // Double-check if user can still practice
        if (!updatedStatus.canPractice) {
          console.log(
            "⚠️ Limit reached during refresh! Showing upgrade modal..."
          );
          setUpgradeReason("limit_reached");
          setShowUpgradeModal(true);
          setLoading(false);
          return;
        }
      } catch (statusError) {
        console.error("❌ Error refreshing usage status:", statusError);
      }

      const response = await startInterview(category);
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

      // Reset timer for new question
      resetTimer();
      setQuestionAppeared(false); // Reset for new question

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: interviewQuestion,
            timestamp: new Date().toISOString(),
            category: response.data.category || null,
            company: response.data.company || [],
            isQuestion: true,
          },
        ]);
        setConversationMode(true);
        setQuestionAppeared(true); // Start timer now that question is visible
        setLoading(false); // Stop loading indicator when question appears

        // Add to question history
        setQuestionHistory((prev) => [
          ...prev,
          {
            id: questionIdFromResponse,
            question: interviewQuestion,
            category: response.data.category || null,
            company: response.data.company || [],
            timestamp: new Date().toISOString(),
            status: "in_progress",
          },
        ]);
      }, 600);
    } catch (err) {
      console.error("Next question error:", err);
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!practiceSessionId) {
      setError("No active session to end");
      return;
    }

    // Stop timer immediately
    setQuestionAppeared(false);

    setLoading(true);
    setError("");

    try {
      let enhancedSummary = null;

      // End practice session (only for authenticated users)
      const isAuthenticated = !!localStorage.getItem("jwt_token");
      if (isAuthenticated && practiceSessionId) {
        const response = await endPracticeSession(practiceSessionId);
        const summary = response.data.summary;

        // Calculate actual session duration from our tracked time
        const actualDuration = sessionStartTime
          ? Math.floor((Date.now() - sessionStartTime) / 1000)
          : summary.duration;

        // Enhance summary with calculated duration
        enhancedSummary = {
          ...summary,
          duration: actualDuration,
        };

        console.log("Session ended:", enhancedSummary);
        setSessionSummary(enhancedSummary);
      } else {
        console.log("Anonymous user - skipping session end");
      }

      // Reset interview state
      setInterviewStarted(false);
      setPracticeSessionId(null);
      setSessionStartTime(null);
      setQuestionId(null);
      setSessionId(null);
      setQuestion("");
      setMessages([]);
      setAnswer("");
      setScores(null);
      setConversationMode(false);
      setQuestionHistory([]);
    } catch (err) {
      console.error("End session error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const closeSessionSummary = () => {
    setSessionSummary(null);
    navigate("/dashboard");
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleFeatureLockClick = () => {
    setUpgradeReason("feature_locked");
    setShowUpgradeModal(true);
  };

  const renderUsageStatus = () => {
    if (!userStatus) return null;

    let statusText = "";
    let statusClass = "";

    console.log("🎯 Rendering usage status with:", {
      planType: userStatus.planType,
      questionsUsed: userStatus.questionsUsed,
      questionsRemaining: userStatus.questionsRemaining,
      canPractice: userStatus.canPractice,
    });

    if (userStatus.planType === "pro_paid") {
      statusText = "Pro plan active";
      statusClass = styles.statusPro;
    } else if (userStatus.planType === "pro_trial") {
      const hoursRemaining = Math.ceil(userStatus.trialHoursRemaining || 0);
      statusText = `Pro trial: ${hoursRemaining}h remaining`;
      statusClass = styles.statusTrial;
    } else if (userStatus.planType === "free") {
      statusText = `${userStatus.questionsRemaining} questions left this month`;
      statusClass = styles.statusFree;
    } else if (userStatus.planType === "anonymous") {
      statusText = `${userStatus.questionsRemaining} of 3 free questions remaining`;
      statusClass = styles.statusAnonymous;
    }

    return (
      <div className={`${styles.usageStatus} ${statusClass}`}>{statusText}</div>
    );
  };

  // Show loading screen while checking user status
  if (loadingUserStatus) {
    console.log("🔄 Still loading user status...");
    return (
      <div className={styles.interviewPage}>
        <div className={styles.loaderContainer}>
          <div className={styles.loaderContent}>
            <div className={styles.loaderRings}>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
            </div>
            <div className={styles.loaderIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h3 className={styles.loaderTitle}>Initializing Interview</h3>
          <p className={styles.loaderSubtitle}>
            Preparing your interview experience...
          </p>
          <div className={styles.loaderDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  console.log(
    "✅ User status loaded, rendering interview page. UserStatus:",
    userStatus
  );

  return (
    <div className={styles.interviewPage}>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason={upgradeReason}
        userStatus={userStatus}
      />
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

              {/* Large Textarea with Voice Input */}
              <div className={styles.finalAnswerContainer}>
                <div className={styles.finalAnswerInputWrapper}>
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

                  {!userStatus?.isLocked?.voice && (
                    <div className={styles.finalAnswerActions}>
                      <VoiceInput
                        onTranscript={(text) => {
                          setFinalAnswerDraft((prev) => {
                            const newText = prev ? prev + " " + text : text;
                            return newText;
                          });
                        }}
                        disabled={!answerMode || submitting || scoring}
                      />
                    </div>
                  )}
                </div>
              </div>

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

              {/* Validation Message */}
              {finalAnswerDraft.trim() &&
                finalAnswerDraft.trim().length < 10 && (
                  <div className={styles.validationMessage}>
                    ⚠ Answer length should be at least 10 characters long
                  </div>
                )}

              {/* Action Buttons */}
              <div className={styles.actionButtonsContainer}>
                <button
                  className={styles.backToDiscussionBtnBottom}
                  onClick={handleExitAnswerMode}
                >
                  ← Back to clarifying questions
                </button>
                <button
                  className={styles.submitFinalAnswerBtnLarge}
                  onClick={handleSubmitFinalAnswer}
                  disabled={
                    submitting ||
                    scoring ||
                    !finalAnswerDraft.trim() ||
                    finalAnswerDraft.trim().length < 10
                  }
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
                          {q.category && (
                            <span className={styles.questionCategory}>
                              {q.category}
                            </span>
                          )}
                          {q.company && q.company.length > 0 && (
                            <span className={styles.questionCompany}>
                              {q.company.join(", ")}
                            </span>
                          )}
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
                        disabled={userStatus?.isLocked?.category}
                      >
                        <div className={styles.categoryIcon}>
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
                            <path d="m18 2 4 4-4 4" />
                            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
                            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8c-.7-1.1-2-1.8-3.3-1.8H2" />
                            <path d="m18 14 4 4-4 4" />
                          </svg>
                        </div>
                        <h4>Random Mix</h4>
                        <p>All categories</p>
                      </button>

                      {!showCategoryOptions ? (
                        <button
                          className={`${styles.categoryCard} ${
                            showCategoryOptions ? styles.selected : ""
                          } ${
                            userStatus?.isLocked?.category ? styles.locked : ""
                          }`}
                          onClick={
                            userStatus?.isLocked?.category
                              ? handleFeatureLockClick
                              : handleSelectCategoryClick
                          }
                          disabled={userStatus?.isLocked?.category}
                        >
                          {userStatus?.isLocked?.category && (
                            <div className={styles.lockBadge}>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <rect
                                  x="3"
                                  y="11"
                                  width="18"
                                  height="11"
                                  rx="2"
                                  ry="2"
                                />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                              <span className={styles.proBadgeText}>PRO</span>
                              <div className={styles.lockTooltip}>
                                Signup and unlock PRO features
                              </div>
                            </div>
                          )}
                          <div className={styles.categoryIcon}>
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="3" width="7" height="7" />
                              <rect x="14" y="3" width="7" height="7" />
                              <rect x="14" y="14" width="7" height="7" />
                              <rect x="3" y="14" width="7" height="7" />
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
                                  category === cat.value ? styles.selected : ""
                                }`}
                                onClick={() => setCategory(cat.value)}
                                disabled={userStatus?.isLocked?.category}
                              >
                                <div className={styles.categoryIcon}>
                                  {renderCategoryIcon(cat.value)}
                                </div>
                                <h4>{cat.label}</h4>
                              </button>
                            ))
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Timer Toggle */}
                  <div className={styles.timerToggleWrapper}>
                    <label
                      className={`${styles.timerToggle} ${
                        userStatus?.isLocked?.timer ? styles.disabled : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={showTimer}
                        onChange={(e) => setShowTimer(e.target.checked)}
                        className={styles.timerCheckbox}
                        disabled={userStatus?.isLocked?.timer}
                      />
                      <svg
                        className={styles.timerIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 6v6l4 2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className={styles.timerLabel}>
                        Record your answer timing
                      </span>
                    </label>
                  </div>

                  <button
                    className={`btn btn-primary btn-xl ${styles.startInterviewButton}`}
                    onClick={handleStartInterview}
                    disabled={loading}
                  >
                    {loading ? "Starting..." : "Start Session"}
                  </button>
                </div>
              </div>
            ) : (
              /* Chat Messages - ChatGPT Style */
              <div className={styles.mainContent}>
                {/* Pro Features Banner - Show for anonymous/free users */}
                {(userStatus?.planType === "anonymous" ||
                  userStatus?.planType === "free") && (
                  <div
                    className={styles.proFeaturesBanner}
                    key={`banner-${userStatus?.questionsUsed}-${userStatus?.questionsRemaining}`}
                  >
                    <div className={styles.bannerContent}>
                      <svg
                        className={styles.bannerIcon}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className={styles.bannerText}>
                        {renderUsageStatus()}
                        <strong>Unlock PRO features</strong>
                        <span style={{ opacity: 0.7 }}>
                          Category selection • Voice I/O • Model answers •
                          Detailed feedback
                        </span>
                      </span>
                      <button
                        className={styles.bannerCTA}
                        onClick={() => navigate("/auth/register")}
                      >
                        Start Free Trial →
                      </button>
                    </div>
                  </div>
                )}

                {/* Category Selector Header - Only show for Pro users */}
                {interviewStarted && !userStatus?.isLocked?.category && (
                  <div className={styles.categoryHeader}>
                    <div className={styles.categoryHeaderContent}>
                      {/* Left Section: Status Badge */}
                      <div className={styles.headerLeftSection}>
                        {(userStatus?.planType === "pro_paid" ||
                          userStatus?.planType === "pro_trial") && (
                          <div className={styles.statusBadgeWrapper}>
                            {renderUsageStatus()}
                          </div>
                        )}
                      </div>

                      {/* Center Section: Category & Timer */}
                      <div className={styles.headerCenterSection}>
                        <div className={styles.categorySelectWrapper}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={styles.categoryIcon}
                          >
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                          <select
                            className={styles.categoryDropdown}
                            value={category || ""}
                            onChange={(e) =>
                              setCategory(e.target.value || null)
                            }
                          >
                            <option value="">Random Mix</option>
                            {availableCategories.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Timer Display */}
                        {showTimer && <Timer formatTime={formatTime} />}
                      </div>

                      {/* Right Section: Action Buttons */}
                      <div className={styles.headerRightSection}>
                        <button
                          className={styles.nextQuestionHeaderBtn}
                          onClick={handleNextQuestion}
                          disabled={loading || submitting || scoring}
                          title="Skip to next question"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="13 17 18 12 13 7"></polyline>
                            <polyline points="6 17 11 12 6 7"></polyline>
                          </svg>
                          <span className={styles.buttonText}>
                            Next Question
                          </span>
                        </button>
                        <button
                          className={styles.endSessionBtn}
                          onClick={handleEndSession}
                          disabled={loading || submitting || scoring}
                          title="End practice session"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                          </svg>
                          <span className={styles.buttonText}>End Session</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className={styles.messagesContainer}>
                  <div className={styles.messagesInner}>
                    {messages.map((msg, index) => (
                      <MessageWithSpeaker
                        key={`msg-${index}-${msg.sender}`}
                        msg={msg}
                        index={index}
                        renderScoreMarkdown={renderScoreMarkdown}
                        renderModelAnswerMarkdown={renderModelAnswerMarkdown}
                        showDetailedFeedback={showDetailedFeedback}
                        toggleDetailedFeedback={toggleDetailedFeedback}
                        loadingDetailedScore={loadingDetailedScore}
                        detailedScore={detailedScore}
                        userStatus={userStatus}
                        handleFeatureLockClick={handleFeatureLockClick}
                      />
                    ))}

                    {(submitting ||
                      scoring ||
                      askingClarification ||
                      loadingFirstQuestion ||
                      loading) && (
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
                          className={`${styles.modelAnswerBtn} ${
                            userStatus?.isLocked?.category ||
                            !userStatus?.isAuthenticated
                              ? styles.lockedButton
                              : ""
                          }`}
                          onClick={
                            userStatus?.isLocked?.category ||
                            !userStatus?.isAuthenticated
                              ? handleFeatureLockClick
                              : handleShowModelAnswer
                          }
                          disabled={
                            loadingModelAnswer &&
                            userStatus?.isAuthenticated &&
                            !userStatus?.isLocked?.category
                          }
                        >
                          {userStatus?.isLocked?.category ||
                          !userStatus?.isAuthenticated ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginRight: "6px" }}
                              >
                                <rect
                                  x="3"
                                  y="11"
                                  width="18"
                                  height="11"
                                  rx="2"
                                  ry="2"
                                />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                              <span className={styles.proTag}>PRO</span>
                              Show Model Answer
                            </>
                          ) : loadingModelAnswer ? (
                            "Loading..."
                          ) : (
                            "💎 Show Model Answer"
                          )}
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
                      {!isRecordingVoice && (
                        <textarea
                          ref={inputRef}
                          className={styles.input}
                          value={answer}
                          onChange={(e) => {
                            setAnswer(e.target.value);
                            // Auto-resize only when user is typing and input is not disabled
                            if (
                              !submitting &&
                              !scoring &&
                              !askingClarification
                            ) {
                              e.target.style.height = "auto";
                              e.target.style.height =
                                Math.min(e.target.scrollHeight, 200) + "px";
                            }
                          }}
                          onKeyPress={handleKeyPress}
                          placeholder={
                            conversationMode
                              ? "Ask clarifying questions..."
                              : "Type your answer here..."
                          }
                          disabled={
                            submitting || scoring || askingClarification
                          }
                          rows={1}
                        />
                      )}
                      <div className={styles.inputActions}>
                        {!userStatus?.isLocked?.voice && (
                          <VoiceInput
                            onTranscript={(text) => {
                              setAnswer((prev) => {
                                const newText = prev ? prev + " " + text : text;
                                // Auto-resize after adding voice text
                                setTimeout(() => {
                                  if (inputRef.current) {
                                    inputRef.current.style.height = "auto";
                                    inputRef.current.style.height =
                                      Math.min(
                                        inputRef.current.scrollHeight,
                                        200
                                      ) + "px";
                                  }
                                }, 0);
                                return newText;
                              });
                            }}
                            onRecordingChange={(recording) => {
                              setIsRecordingVoice(recording);
                            }}
                            disabled={
                              !conversationMode ||
                              submitting ||
                              scoring ||
                              askingClarification
                            }
                          />
                        )}
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
                            isRecordingVoice ||
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
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Write your final answer
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

      {/* Session Summary Modal */}
      {sessionSummary && (
        <div className={styles.modalOverlay}>
          <div className={styles.summaryModal}>
            <div className={styles.summaryHeader}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <h2>Session Complete!</h2>
              <p>Great work! Here's your session summary</p>
            </div>

            <div className={styles.summaryStats}>
              <div className={styles.summaryStatCard}>
                <div className={styles.statIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Questions Solved</div>
                  <div className={styles.statValue}>
                    {sessionSummary.questionsCount}
                  </div>
                </div>
              </div>

              <div className={styles.summaryStatCard}>
                <div className={styles.statIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Time Spent</div>
                  <div className={styles.statValue}>
                    {formatDuration(sessionSummary.duration)}
                  </div>
                </div>
              </div>

              <div className={styles.summaryStatCard}>
                <div className={styles.statIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Overall Score</div>
                  <div className={styles.statValue}>
                    {sessionSummary.overallScore
                      ? `${sessionSummary.overallScore}/10`
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {sessionSummary.categoriesBreakdown && (
              <div className={styles.categoriesSection}>
                <h3>Categories Practiced</h3>
                <div className={styles.categoriesList}>
                  {Object.entries(sessionSummary.categoriesBreakdown).map(
                    ([category, count]) => (
                      <div key={category} className={styles.categoryBadge}>
                        <span className={styles.categoryName}>{category}</span>
                        <span className={styles.categoryCount}>×{count}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className={styles.summaryActions}>
              <button
                className={styles.viewDashboardBtn}
                onClick={closeSessionSummary}
              >
                View Dashboard
              </button>
              <button
                className={styles.startNewSessionBtn}
                onClick={() => {
                  setSessionSummary(null);
                  // Don't navigate away, allow user to start a new session
                }}
              >
                Start New Session
              </button>
            </div>
          </div>
        </div>
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
  detailedScore,
  userStatus,
  handleFeatureLockClick
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
              className={`${styles.seeDetailedBtn} ${
                userStatus?.isLocked?.category || !userStatus?.isAuthenticated
                  ? styles.lockedButton
                  : ""
              }`}
              onClick={
                userStatus?.isLocked?.category || !userStatus?.isAuthenticated
                  ? handleFeatureLockClick
                  : () => toggleDetailedFeedback()
              }
            >
              {userStatus?.isLocked?.category ||
              !userStatus?.isAuthenticated ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: "6px" }}
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className={styles.proTag}>PRO</span>
                  See Detailed Feedback
                </>
              ) : (
                "See Detailed Feedback"
              )}
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
