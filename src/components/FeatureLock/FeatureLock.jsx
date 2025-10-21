import styles from "./FeatureLock.module.scss";

function FeatureLock({
  isLocked,
  children,
  onLockClick,
  featureName = "Pro Feature",
}) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className={styles.lockedFeature} onClick={onLockClick}>
      <div className={styles.lockOverlay}>
        <svg
          className={styles.lockIcon}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className={styles.lockText}>{featureName}</span>
      </div>
      <div className={styles.disabledContent}>{children}</div>
    </div>
  );
}

export default FeatureLock;
