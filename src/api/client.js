import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_email");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (email, password) => {
  return apiClient.post("/api/auth/login", { email, password });
};

export const register = (email, password) => {
  return apiClient.post("/api/auth/register", { email, password });
};

export const getGoogleAuthUrl = () => {
  return `${API_BASE_URL}/api/auth/google`;
};

// Interview APIs
export const startInterview = (category = null) => {
  return apiClient.post("/api/start-interview", { category });
};

export const getCategories = () => {
  return apiClient.get("/api/categories");
};

export const submitAnswer = (
  questionId,
  answerText,
  practiceSessionId,
  answerId = null,
  timeTaken = null
) => {
  return apiClient.post("/api/submit-answer", {
    questionId,
    answerText,
    practiceSessionId,
    answerId,
    timeTaken,
  });
};

export const scoreAnswer = (answerId) => {
  return apiClient.post("/api/score", {
    answerId: answerId,
  });
};

export const scoreAnswerSummarised = (answerId) => {
  return apiClient.post("/api/score-summarised", {
    answerId: answerId,
  });
};

export const askClarification = (
  questionId,
  userMessage,
  conversationHistory
) => {
  return apiClient.post("/api/clarify", {
    questionId,
    userMessage,
    conversationHistory,
  });
};

export const getModelAnswer = (questionId) => {
  return apiClient.post("/api/model-answer", {
    questionId,
  });
};

// Session APIs
export const getSessions = () => {
  return apiClient.get("/api/sessions");
};

export const getSession = (sessionId) => {
  return apiClient.get(`/api/sessions/${sessionId}`);
};

// Payment APIs
export const createCheckoutSession = (currency = "usd") => {
  return apiClient.post("/api/payment/create-checkout-session", { currency });
};

export const cancelSubscription = () => {
  return apiClient.post("/api/payment/cancel-subscription");
};

export const getSubscriptionStatus = () => {
  return apiClient.get("/api/payment/subscription-status");
};

// Voice transcription
export const transcribeAudio = (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.webm");
  return apiClient.post("/api/voice/transcribe", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Text to speech
export const textToSpeech = (text, voice = "nova") => {
  return apiClient.post(
    "/api/voice/speak",
    { text, voice },
    {
      responseType: "arraybuffer", // Important: receive audio as binary data
    }
  );
};

// Progress/Stats APIs
export const getDashboardStats = () => {
  return apiClient.get("/api/progress/dashboard");
};

export const getParameterStats = () => {
  return apiClient.get("/api/progress/parameters");
};

export const getTimelineData = (period = "day", days = 30) => {
  return apiClient.get("/api/progress/timeline", {
    params: { period, days },
  });
};

export const getProgressHistory = (filters = {}, page = 1, limit = 20) => {
  return apiClient.get("/api/progress/history", {
    params: { ...filters, page, limit },
  });
};

export const getCategoryStats = () => {
  return apiClient.get("/api/progress/categories");
};

export const getUserSessions = () => {
  return apiClient.get("/api/progress/sessions");
};

// Practice Session Management APIs
export const startPracticeSession = () => {
  return apiClient.post("/api/session/start");
};

export const endPracticeSession = (sessionId) => {
  return apiClient.post("/api/session/end", { sessionId });
};

export const getCurrentPracticeSession = () => {
  return apiClient.get("/api/session/current");
};

export default apiClient;
