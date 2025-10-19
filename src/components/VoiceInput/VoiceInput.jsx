import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { transcribeAudio } from "../../api/client";
import styles from "./VoiceInput.module.scss";

const VoiceInput = ({
  onTranscript,
  disabled = false,
  compact = false,
  onRecordingChange,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const animationFrameRef = useRef(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const [audioLevels, setAudioLevels] = useState(Array(50).fill(0));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Visualize audio levels
  const visualizeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = dataArrayRef.current;
    analyserRef.current.getByteFrequencyData(dataArray);

    // Sample 50 frequency bands for full-width visualization
    const samples = 50;
    const step = Math.floor(bufferLength / samples);
    const levels = [];

    for (let i = 0; i < samples; i++) {
      const index = i * step;
      const value = dataArray[index] / 255; // Normalize to 0-1
      levels.push(value);
    }

    setAudioLevels(levels);
    animationFrameRef.current = requestAnimationFrame(visualizeAudio);
  };

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio visualization
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // Start visualization
      visualizeAudio();

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop visualization
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());

        // Close audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await handleTranscription(audioBlob);

        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRecordingTime(0);
        setAudioLevels(Array(50).fill(0));
      };

      mediaRecorder.start();
      setIsRecording(true);
      if (onRecordingChange) onRecordingChange(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (onRecordingChange) onRecordingChange(false);
    }
  };

  const handleTranscription = async (audioBlob) => {
    setIsTranscribing(true);
    try {
      const response = await transcribeAudio(audioBlob);
      if (response.data && response.data.text) {
        onTranscript(response.data.text);
      } else {
        setError("No transcription received");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to transcribe audio. Please try again."
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (disabled) return;

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      {isRecording && (
        <div className={styles.recordingTimer}>
          <span className={styles.recordingDot}></span>
          <span>{formatTime(recordingTime)}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isTranscribing}
        className={`${styles.voiceButton} ${
          isRecording ? styles.recording : ""
        } ${isTranscribing ? styles.transcribing : ""}`}
        title={
          isRecording
            ? "Stop recording"
            : isTranscribing
            ? "Transcribing..."
            : "Start voice input"
        }
      >
        {isTranscribing ? (
          <div className={styles.spinner}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
                strokeDashoffset="0"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        ) : (
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
            {isRecording ? (
              <rect x="6" y="6" width="12" height="12" fill="currentColor" />
            ) : (
              <>
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </>
            )}
          </svg>
        )}
      </button>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </>
  );
};

VoiceInput.propTypes = {
  onTranscript: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  compact: PropTypes.bool,
  onRecordingChange: PropTypes.func,
};

export default VoiceInput;
