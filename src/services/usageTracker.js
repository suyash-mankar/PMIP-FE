import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { checkUsageLimit as checkUsageLimitAPI } from "../api/client";

class UsageTracker {
  constructor() {
    this.fingerprint = null;
    this.fpPromise = null;
    this.initFingerprint();
  }

  async initFingerprint() {
    try {
      // Check if fingerprint already exists in localStorage
      const storedFingerprint = localStorage.getItem("device_fp");
      if (storedFingerprint) {
        this.fingerprint = storedFingerprint;
      }

      // Initialize FingerprintJS
      this.fpPromise = FingerprintJS.load();
      const fp = await this.fpPromise;
      const result = await fp.get();
      this.fingerprint = result.visitorId;

      // Store in localStorage
      localStorage.setItem("device_fp", this.fingerprint);
    } catch (error) {
      console.error("Error initializing fingerprint:", error);
      // Fallback to a random ID if fingerprinting fails
      if (!this.fingerprint) {
        this.fingerprint =
          "fallback_" + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("device_fp", this.fingerprint);
      }
    }
  }

  getFingerprint() {
    return this.fingerprint || localStorage.getItem("device_fp");
  }

  async ensureFingerprint() {
    if (!this.fingerprint) {
      await this.initFingerprint();
    }
    return this.getFingerprint();
  }

  async checkLimit() {
    try {
      const fingerprint = await this.ensureFingerprint();
      console.log("📍 Checking limit with fingerprint:", fingerprint);

      const response = await checkUsageLimitAPI(fingerprint);
      console.log("📊 API response:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Error checking usage limit:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem("jwt_token");
  }

  clearFingerprint() {
    localStorage.removeItem("device_fp");
    this.fingerprint = null;
  }
}

export default new UsageTracker();
