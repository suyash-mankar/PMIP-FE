import { useNavigate } from "react-router-dom";
import styles from "./UpgradeModal.module.scss";

function UpgradeModal({ isOpen, onClose, reason, userStatus }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignup = () => {
    navigate("/auth/register");
  };

  const handleUpgrade = () => {
    navigate("/pricing");
  };

  const getContent = () => {
    switch (reason) {
      case "limit_reached":
        if (userStatus?.isAuthenticated) {
          return {
            title: "Monthly Limit Reached",
            message:
              "You've used all 3 free questions this month. Upgrade to Pro to continue practicing with unlimited questions!",
            primaryAction: "Upgrade to Pro",
            primaryHandler: handleUpgrade,
            showSecondary: false,
          };
        }
        return {
          title: "Free Trial Complete",
          message:
            "You've practiced 3 questions without signup. Sign up now to get 48 hours of unlimited Pro access - completely free!",
          primaryAction: "Sign up for Free Pro Trial",
          primaryHandler: handleSignup,
          showSecondary: true,
          secondaryAction: "Maybe Later",
        };

      case "trial_expired":
        return {
          title: "Pro Trial Ended",
          message:
            "Your 48-hour Pro trial has ended. You can continue with 3 free questions per month or upgrade to Pro for unlimited access!",
          primaryAction: "Upgrade to Pro",
          primaryHandler: handleUpgrade,
          showSecondary: true,
          secondaryAction: "Continue with Free Plan",
        };

      case "feature_locked":
        if (userStatus?.isAuthenticated) {
          return {
            title: "Pro Feature",
            message:
              "This feature is only available to Pro users. Upgrade now to unlock all premium features!",
            primaryAction: "Upgrade to Pro",
            primaryHandler: handleUpgrade,
            showSecondary: true,
            secondaryAction: "Cancel",
          };
        }
        return {
          title: "Pro Feature",
          message:
            "This feature requires an account. Sign up now for a 48-hour free Pro trial with full access to all features!",
          primaryAction: "Sign up for Free Pro Trial",
          primaryHandler: handleSignup,
          showSecondary: true,
          secondaryAction: "Cancel",
        };

      default:
        return {
          title: "Upgrade to Pro",
          message:
            "Get unlimited access to all features with PM Interview Pro!",
          primaryAction: "Learn More",
          primaryHandler: handleUpgrade,
          showSecondary: true,
          secondaryAction: "Cancel",
        };
    }
  };

  const content = getContent();

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.iconWrapper}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <h2 className={styles.modalTitle}>{content.title}</h2>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalMessage}>{content.message}</p>

          {reason === "limit_reached" && !userStatus?.isAuthenticated && (
            <div className={styles.benefitsBox}>
              <h4>What you get with Pro Trial:</h4>
              <ul>
                <li>48 hours of unlimited practice</li>
                <li>Detailed feedback on every answer</li>
                <li>Model "10/10" answers</li>
                <li>Category selection</li>
                <li>Voice input/output</li>
                <li>Progress tracking</li>
              </ul>
              <div className={styles.noCreditCard}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                No credit card required
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button
            className={`btn btn-primary ${styles.primaryButton}`}
            onClick={content.primaryHandler}
          >
            {content.primaryAction}
          </button>
          {content.showSecondary && (
            <button
              className={`btn btn-secondary ${styles.secondaryButton}`}
              onClick={onClose}
            >
              {content.secondaryAction}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;
