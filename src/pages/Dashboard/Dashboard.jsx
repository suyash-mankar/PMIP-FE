import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.scss";

function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [plan, setPlan] = useState("Free");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    setUserEmail(email || "user@example.com");

    // In a real app, you would fetch the user's plan from the backend
    setPlan("Free");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_email");
    navigate("/auth/login");
  };

  return (
    <div className={styles.dashboardPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.subtitle}>Manage your account and settings</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Account Information</h2>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{userEmail}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Current Plan:</span>
              <span className={`${styles.value} ${styles.planBadge}`}>
                {plan}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Member Since:</span>
              <span className={styles.value}>
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Quick Actions</h2>
            <div className={styles.actions}>
              <Link
                to="/interview"
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                Start New Interview
              </Link>
              <Link
                to="/history"
                className="btn btn-secondary"
                style={{ width: "100%" }}
              >
                View History
              </Link>
              <Link
                to="/pricing"
                className="btn btn-outline"
                style={{ width: "100%" }}
              >
                Upgrade Plan
              </Link>
              <button
                onClick={handleLogout}
                className={`btn btn-secondary ${styles.logoutBtn}`}
                style={{ width: "100%" }}
              >
                Logout
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Tips for Success</h2>
            <ul className={styles.tipsList}>
              <li>Practice regularly to improve your interview skills</li>
              <li>Review your feedback carefully after each session</li>
              <li>Try different difficulty levels to challenge yourself</li>
              <li>Focus on areas where you scored lower</li>
              <li>Study the sample answers to learn best practices</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Need Help?</h2>
            <p className={styles.helpText}>
              Have questions or need assistance? We&apos;re here to help!
            </p>
            <div className={styles.helpLinks}>
              <a
                href="mailto:support@pminterviewpractice.com"
                className={styles.helpLink}
              >
                📧 Email Support
              </a>
              <a href="#" className={styles.helpLink}>
                📚 Documentation
              </a>
              <a href="#" className={styles.helpLink}>
                💬 Community Forum
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
