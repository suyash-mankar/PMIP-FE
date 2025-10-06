import { useState, useEffect } from "react";
import { getSessions } from "../../api/client";
import SessionList from "../../components/SessionList/SessionList";
import styles from "./History.module.scss";

function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSessions();
      setSessions(response.data.sessions || response.data || []);
    } catch (err) {
      console.error("Fetch sessions error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load session history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (!sessions || sessions.length === 0) {
      return { totalSessions: 0, averageScore: 0 };
    }

    let totalScore = 0;
    sessions.forEach((session) => {
      if (session.scores) {
        const {
          structure = 0,
          metrics = 0,
          prioritization = 0,
          user_empathy = 0,
          communication = 0,
        } = session.scores;
        const avgScore =
          (structure +
            metrics +
            prioritization +
            user_empathy +
            communication) /
          5;
        totalScore += avgScore;
      }
    });

    return {
      totalSessions: sessions.length,
      averageScore:
        sessions.length > 0 ? Math.round(totalScore / sessions.length) : 0,
    };
  };

  const stats = calculateStats();

  return (
    <div className={styles.historyPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Interview History</h1>
          <p className={styles.subtitle}>
            Review your past interviews and track your progress
          </p>
        </div>

        {error && (
          <div className={styles.errorBox}>
            {error}
            <button onClick={fetchSessions} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.totalSessions}</div>
              <div className={styles.statLabel}>Total Sessions</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.averageScore}/10</div>
              <div className={styles.statLabel}>Average Score</div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <span>Loading your interview history...</span>
          </div>
        ) : (
          <SessionList sessions={sessions} />
        )}
      </div>
    </div>
  );
}

export default History;
