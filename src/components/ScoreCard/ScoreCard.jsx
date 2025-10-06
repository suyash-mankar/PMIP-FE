import { useState } from "react";
import styles from "./ScoreCard.module.scss";

function ScoreCard({ scores }) {
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);

  if (!scores) {
    return null;
  }

  const {
    structure = 0,
    metrics = 0,
    prioritization = 0,
    userEmpathy = 0,
    user_empathy = userEmpathy, // Fallback for old format
    communication = 0,
    feedback = "",
    sampleAnswer = "",
    sample_answer = sampleAnswer, // Fallback for old format
  } = scores;

  const empathyScore = userEmpathy || user_empathy;
  const sampleAnswerText = sampleAnswer || sample_answer;

  const averageScore = Math.round(
    (structure + metrics + prioritization + empathyScore + communication) / 5
  );

  const getScoreColor = (score) => {
    if (score >= 8) return styles.scoreExcellent;
    if (score >= 6) return styles.scoreGood;
    if (score >= 4) return styles.scoreFair;
    return styles.scorePoor;
  };

  const renderScoreBadge = (label, score) => (
    <div className={styles.scoreBadge}>
      <div className={styles.scoreLabel}>{label}</div>
      <div className={`${styles.scoreValue} ${getScoreColor(score)}`}>
        {score}/10
      </div>
    </div>
  );

  return (
    <div className={styles.scoreCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>Your Score</h3>
        <div
          className={`${styles.overallScore} ${getScoreColor(averageScore)}`}
        >
          {averageScore}/10
        </div>
      </div>

      <div className={styles.scoresGrid}>
        {renderScoreBadge("Structure", structure)}
        {renderScoreBadge("Metrics", metrics)}
        {renderScoreBadge("Prioritization", prioritization)}
        {renderScoreBadge("User Empathy", empathyScore)}
        {renderScoreBadge("Communication", communication)}
      </div>

      {feedback && (
        <div className={styles.feedback}>
          <h4 className={styles.feedbackTitle}>Feedback</h4>
          <div className={styles.feedbackContent}>
            {feedback
              .split("\n")
              .map((line, index) => line.trim() && <p key={index}>{line}</p>)}
          </div>
        </div>
      )}

      {sampleAnswerText && (
        <div className={styles.sampleAnswer}>
          <button
            className={styles.sampleAnswerToggle}
            onClick={() => setShowSampleAnswer(!showSampleAnswer)}
            aria-expanded={showSampleAnswer}
          >
            {showSampleAnswer ? "▼" : "▶"} Sample Answer
          </button>
          {showSampleAnswer && (
            <div className={styles.sampleAnswerContent}>{sampleAnswerText}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScoreCard;
