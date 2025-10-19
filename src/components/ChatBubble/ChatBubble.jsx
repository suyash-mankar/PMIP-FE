import { useState, useEffect, useRef } from "react";
import { textToSpeech } from "../../api/client";
import styles from "./ChatBubble.module.scss";

function ChatBubble({ message, sender, timestamp }) {
  const isAI = sender === "ai";
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSpeak = async () => {
    if (!isAI) return; // Only speak AI messages

    // If already speaking, stop it
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
      const response = await textToSpeech(message, "nova");

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
  };

  return (
    <div
      className={`${styles.bubble} ${
        isAI ? styles.bubbleAI : styles.bubbleUser
      }`}
    >
      <div className={styles.bubbleHeader}>
        <span className={styles.sender}>
          {isAI ? (
            <>
              <span className={styles.aiAvatar}>AI</span> PM Interview Coach
            </>
          ) : (
            "You"
          )}
        </span>
        <div className={styles.headerActions}>
          {timestamp && (
            <span className={styles.timestamp}>
              {new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {isAI && (
            <button
              onClick={handleSpeak}
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
      <div className={styles.bubbleContent}>{message}</div>
    </div>
  );
}

export default ChatBubble;
