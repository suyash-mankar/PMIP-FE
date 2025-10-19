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
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"
            fill="currentColor"
          />
        </svg>
      ),
      color: "primary",
    },
    {
      label: "Overall Score",
      value: stats.overallAverageScore
        ? `${stats.overallAverageScore.toFixed(1)}/10`
        : "N/A",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
            fill="currentColor"
          />
        </svg>
      ),
      color: "success",
    },
    {
      label: "Questions Viewed",
      value: stats.totalViewed || 0,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
            fill="currentColor"
          />
        </svg>
      ),
      color: "info",
    },
    {
      label: "Recent (7 days)",
      value: stats.recentActivity?.last7Days || 0,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.5 0.67C13.5 0.3 13.17 0 12.75 0C12.33 0 12 0.3 12 0.67V2C12 2.37 12.33 2.67 12.75 2.67C13.17 2.67 13.5 2.37 13.5 2V0.67ZM19.43 3.63L20.54 2.52C20.78 2.28 20.78 1.89 20.54 1.65C20.3 1.41 19.91 1.41 19.67 1.65L18.56 2.76C18.32 3 18.32 3.39 18.56 3.63C18.8 3.87 19.19 3.87 19.43 3.63ZM20.5 11.25H22C22.41 11.25 22.75 11.58 22.75 12C22.75 12.42 22.41 12.75 22 12.75H20.5C20.08 12.75 19.75 12.42 19.75 12C19.75 11.58 20.08 11.25 20.5 11.25ZM4.5 12C4.5 11.58 4.17 11.25 3.75 11.25H2.25C1.83 11.25 1.5 11.58 1.5 12C1.5 12.42 1.83 12.75 2.25 12.75H3.75C4.17 12.75 4.5 12.42 4.5 12ZM6.69 3.63C6.93 3.39 6.93 3 6.69 2.76L5.58 1.65C5.34 1.41 4.95 1.41 4.71 1.65C4.47 1.89 4.47 2.28 4.71 2.52L5.82 3.63C6.06 3.87 6.45 3.87 6.69 3.63ZM13.5 22C13.5 22.37 13.17 22.67 12.75 22.67C12.33 22.67 12 22.37 12 22V20.33C12 19.96 12.33 19.67 12.75 19.67C13.17 19.67 13.5 19.96 13.5 20.33V22ZM19.43 20.37L20.54 21.48C20.78 21.72 20.78 22.11 20.54 22.35C20.3 22.59 19.91 22.59 19.67 22.35L18.56 21.24C18.32 21 18.32 20.61 18.56 20.37C18.8 20.13 19.19 20.13 19.43 20.37ZM6.69 20.37C6.93 20.61 6.93 21 6.69 21.24L5.58 22.35C5.34 22.59 4.95 22.59 4.71 22.35C4.47 22.11 4.47 21.72 4.71 21.48L5.82 20.37C6.06 20.13 6.45 20.13 6.69 20.37ZM12.75 5.5C8.58 5.5 5.25 8.83 5.25 13C5.25 14.73 5.91 16.31 6.99 17.5L8.29 16.2C7.48 15.31 7 14.2 7 13C7 9.83 9.58 7.25 12.75 7.25C15.92 7.25 18.5 9.83 18.5 13C18.5 16.17 15.92 18.75 12.75 18.75C11.55 18.75 10.44 18.27 9.55 17.46L8.25 18.76C9.44 19.84 11.02 20.5 12.75 20.5C16.92 20.5 20.25 17.17 20.25 13C20.25 8.83 16.92 5.5 12.75 5.5Z"
            fill="currentColor"
          />
        </svg>
      ),
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
    totalViewed: PropTypes.number,
    overallAverageScore: PropTypes.number,
    recentActivity: PropTypes.shape({
      last7Days: PropTypes.number,
    }),
  }).isRequired,
};

export default ProgressStats;
