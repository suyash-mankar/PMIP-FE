import styles from "./Timer.module.scss";

function Timer({ formatTime }) {
  return (
    <div className={styles.timer}>
      <svg className={styles.icon} viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M12 6v6l4 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.time}>{formatTime()}</span>
    </div>
  );
}

export default Timer;
