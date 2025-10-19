import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getParameterStats,
  getCategoryStats,
} from "../../api/client";
import ProgressStats from "../../components/ProgressStats/ProgressStats";
import CategoryProgress from "../../components/CategoryProgress/CategoryProgress";
import ParameterChart from "../../components/ParameterChart/ParameterChart";
import TimelineChart from "../../components/TimelineChart/TimelineChart";
import styles from "./Dashboard.module.scss";

function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [parameterStats, setParameterStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    setUserEmail(email || "user@example.com");
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashboardResponse, parameterResponse, categoryResponse] =
        await Promise.all([
          getDashboardStats(),
          getParameterStats(),
          getCategoryStats(),
        ]);

      setDashboardStats(dashboardResponse.data);
      setParameterStats(parameterResponse.data);
      setCategoryStats(categoryResponse.data.categories || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_email");
    navigate("/auth/login");
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
          <div>
            <h1 className={styles.pageTitle}>Your Progress Dashboard</h1>
            <p className={styles.subtitle}>
              Track your performance and improve your PM interview skills
            </p>
          </div>
          <div className={styles.actions}>
            <Link to="/interview" className="btn btn-primary">
              Start Interview
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
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
                  <div className={styles.linkIcon}>📜</div>
                  <h3>View Full History</h3>
                  <p>See all your past interviews and scores</p>
                </Link>
                <Link to="/interview" className={styles.linkCard}>
                  <div className={styles.linkIcon}>🎯</div>
                  <h3>Practice More</h3>
                  <p>Continue improving your skills</p>
                </Link>
                <Link to="/pricing" className={styles.linkCard}>
                  <div className={styles.linkIcon}>⭐</div>
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
