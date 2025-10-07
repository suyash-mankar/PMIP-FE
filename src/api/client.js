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

// Interview APIs
export const startInterview = (level) => {
  return apiClient.post("/api/start-interview", { level });
};

export const submitAnswer = (sessionId, answer) => {
  return apiClient.post("/api/submit-answer", {
    questionId: sessionId,
    answerText: answer,
  });
};

export const scoreAnswer = (sessionId) => {
  return apiClient.post("/api/score", {
    sessionId: sessionId,
  });
};

export const askClarification = (questionId, userMessage, conversationHistory) => {
  return apiClient.post("/api/clarify", {
    questionId,
    userMessage,
    conversationHistory,
  });
};

// Session APIs
export const getSessions = () => {
  return apiClient.get("/api/sessions");
};

export const getSession = (sessionId) => {
  return apiClient.get(`/api/sessions/${sessionId}`);
};

// Pricing APIs
export const createCheckoutSession = (priceId) => {
  return apiClient.post("/api/create-checkout-session", { price_id: priceId });
};

export default apiClient;
