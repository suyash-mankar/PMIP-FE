import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./ProgressStats.module.scss";

function ProgressStats({ stats }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const statCards = [
    {
      label: "Questions Solved",
      value: stats.totalScored || 0,
      icon: "✓",
      color: "primary",
    },
    {
      label: "Overall Score",
      value: stats.overallAverageScore
        ? `${stats.overallAverageScore.toFixed(1)}/10`
        : "N/A",
      icon: "⭐",
      color: "success",
    },
    {
      label: "Questions Remaining",
      value: stats.questionsRemaining || 0,
      icon: "📝",
      color: "info",
    },
    {
      label: "Recent (7 days)",
      value: stats.recentActivity?.last7Days || 0,
      icon: "🔥",
      color: "warning",
    },
  ];

  return (
    <div className={styles.progressStats}>
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${styles.statCard} ${styles[stat.color]} ${
            animated ? styles.animated : ""
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={styles.icon}>{stat.icon}</div>
          <div className={styles.content}>
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

ProgressStats.propTypes = {
  stats: PropTypes.shape({
    totalScored: PropTypes.number,
    overallAverageScore: PropTypes.number,
    questionsRemaining: PropTypes.number,
    recentActivity: PropTypes.shape({
      last7Days: PropTypes.number,
    }),
  }).isRequired,
};

export default ProgressStats;
