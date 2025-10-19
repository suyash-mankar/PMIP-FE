import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDashboardStats,
  getParameterStats,
  getCategoryStats,
  getUserSessions,
} from "../../api/client";
import ProgressStats from "../../components/ProgressStats/ProgressStats";
import CategoryProgress from "../../components/CategoryProgress/CategoryProgress";
import ParameterChart from "../../components/ParameterChart/ParameterChart";
import TimelineChart from "../../components/TimelineChart/TimelineChart";
import styles from "./Dashboard.module.scss";

function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [parameterStats, setParameterStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [
        dashboardResponse,
        parameterResponse,
        categoryResponse,
        sessionsResponse,
      ] = await Promise.all([
        getDashboardStats(),
        getParameterStats(),
        getCategoryStats(),
        getUserSessions(),
      ]);

      setDashboardStats(dashboardResponse.data);
      setParameterStats(parameterResponse.data);
      setCategoryStats(categoryResponse.data.categories || []);
      setSessions(sessionsResponse.data.sessions || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboardPage}>
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <span>Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Your Progress Dashboard</h1>
          <p className={styles.subtitle}>
            Track your performance and improve your PM interview skills
          </p>
        </div>

        {error && (
          <div className={styles.errorBox}>
            {error}
            <button onClick={fetchAllData} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        )}

        {!error && dashboardStats && (
          <>
            {/* Overall Statistics */}
            <section className={styles.section}>
              <ProgressStats stats={dashboardStats} />
            </section>

            {/* Practice Sessions */}
            {sessions && sessions.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  Recent Practice Sessions
                </h2>
                <p className={styles.sectionSubtitle}>
                  Review your completed practice sessions
                </p>
                <div className={styles.sessionsList}>
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.sessionId} className={styles.sessionCard}>
                      <div className={styles.sessionHeader}>
                        <div className={styles.sessionDate}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          {formatDate(session.startedAt)}
                        </div>
                        <div className={styles.sessionScore}>
                          {session.overallScore
                            ? `${session.overallScore}/10`
                            : "N/A"}
                        </div>
                      </div>
                      <div className={styles.sessionStats}>
                        <div className={styles.sessionStat}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                          {session.questionsCount} questions
                        </div>
                        <div className={styles.sessionStat}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                            <path d="M22 12A10 10 0 0 0 12 2v10z" />
                          </svg>
                          {
                            Object.keys(session.categoriesBreakdown || {})
                              .length
                          }{" "}
                          categories
                        </div>
                        {session.duration && (
                          <div className={styles.sessionStat}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            {formatDuration(session.duration)}
                          </div>
                        )}
                      </div>
                      {session.categoriesBreakdown && (
                        <div className={styles.sessionCategories}>
                          {Object.entries(session.categoriesBreakdown)
                            .slice(0, 3)
                            .map(([category, count]) => (
                              <span
                                key={category}
                                className={styles.categoryBadge}
                              >
                                {category} ×{count}
                              </span>
                            ))}
                          {Object.keys(session.categoriesBreakdown).length >
                            3 && (
                            <span className={styles.categoryBadge}>
                              +
                              {Object.keys(session.categoriesBreakdown).length -
                                3}{" "}
                              more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {sessions.length > 5 && (
                  <div className={styles.showMore}>
                    <p>Showing 5 of {sessions.length} sessions</p>
                  </div>
                )}
              </section>
            )}

            {/* Parameter Breakdown */}
            {parameterStats && parameterStats.parameters && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  Performance by Parameter
                </h2>
                <p className={styles.sectionSubtitle}>
                  Weighted overall score:{" "}
                  <strong>
                    {parameterStats.weightedOverall
                      ? parameterStats.weightedOverall.toFixed(1)
                      : "N/A"}
                    /10
                  </strong>
                </p>
                <ParameterChart parameters={parameterStats.parameters} />
              </section>
            )}

            {/* Timeline Chart */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Progress Over Time</h2>
              <TimelineChart />
            </section>

            {/* Category Progress */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Progress by Category</h2>
              <p className={styles.sectionSubtitle}>
                Click on a category to view detailed history
              </p>
              <CategoryProgress categories={categoryStats} />
            </section>

            {/* Quick Links */}
            <section className={styles.section}>
              <div className={styles.quickLinks}>
                <Link to="/history" className={styles.linkCard}>
                  <div className={styles.linkIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13 2V9H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3>View Full History</h3>
                  <p>See all your past interviews and scores</p>
                </Link>
                <Link to="/interview" className={styles.linkCard}>
                  <div className={styles.linkIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 12L16 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3>Practice More</h3>
                  <p>Continue improving your skills</p>
                </Link>
                <Link to="/pricing" className={styles.linkCard}>
                  <div className={styles.linkIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <h3>Upgrade Plan</h3>
                  <p>Unlock premium features</p>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
