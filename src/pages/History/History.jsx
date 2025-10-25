import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getProgressHistory, getCategories } from "../../api/client";
import SessionList from "../../components/SessionList/SessionList";
import styles from "./History.module.scss";

function History() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessions, setSessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    company: "",
    minScore: "",
    maxScore: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  // Auth guard - redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/auth/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getProgressHistory(filters, pagination.page, 20);
      const sessionData = response.data.sessions || [];
      setSessions(sessionData);
      setPagination(response.data.pagination);

      // Extract unique companies from all sessions
      const uniqueCompanies = new Set();
      sessionData.forEach((session) => {
        if (session.company && Array.isArray(session.company)) {
          session.company.forEach((comp) => uniqueCompanies.add(comp));
        }
      });
      setCompanies(Array.from(uniqueCompanies).sort());
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      company: "",
      minScore: "",
      maxScore: "",
      startDate: "",
      endDate: "",
      search: "",
    });
    setSearchParams({});
  };

  const calculateStats = () => {
    if (!sessions || sessions.length === 0) {
      return { totalScored: 0, averageScore: 0 };
    }

    let totalScore = 0;
    sessions.forEach((session) => {
      if (session.scores && session.scores.overall !== undefined) {
        totalScore += session.scores.overall;
      }
    });

    return {
      totalScored: sessions.length,
      averageScore:
        sessions.length > 0 ? (totalScore / sessions.length).toFixed(1) : 0,
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

        {/* Statistics */}
        {!loading && !error && (
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 11H7V17H9V11Z" fill="currentColor" />
                  <path d="M13 7H11V17H13V7Z" fill="currentColor" />
                  <path d="M17 14H15V17H17V14Z" fill="currentColor" />
                </svg>
              </div>
              <div className={styles.statValue}>{pagination.total}</div>
              <div className={styles.statLabel}>Total Attempts</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className={styles.statValue}>{stats.totalScored}</div>
              <div className={styles.statLabel}>Scored Sessions</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className={styles.statValue}>{stats.averageScore}/10</div>
              <div className={styles.statLabel}>Average Score</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={styles.filtersContainer}>
          <div className={styles.filtersGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className={styles.filterInput}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Company</label>
              <select
                value={filters.company}
                onChange={(e) => handleFilterChange("company", e.target.value)}
                className={styles.filterInput}
              >
                <option value="">All Companies</option>
                {companies.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Min Score</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="0.0"
                value={filters.minScore}
                onChange={(e) => handleFilterChange("minScore", e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Max Score</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="10.0"
                value={filters.maxScore}
                onChange={(e) => handleFilterChange("maxScore", e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup + " " + styles.searchGroup}>
              <label className={styles.filterLabel}>Search Questions</label>
              <input
                type="text"
                placeholder="Type to search..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className={styles.filterInput}
              />
            </div>

            {Object.values(filters).some((val) => val !== "") && (
              <div className={styles.filterGroup + " " + styles.clearBtnGroup}>
                <label className={styles.filterLabel}>&nbsp;</label>
                <button onClick={clearFilters} className={styles.clearBtn}>
                  🗑️ Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.loaderContent}>
              <div className={styles.loaderRings}>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
              </div>
              <div className={styles.loaderIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            <h3 className={styles.loaderTitle}>Loading Your History</h3>
            <p className={styles.loaderSubtitle}>
              Retrieving your interview sessions...
            </p>
            <div className={styles.loaderDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <>
            <SessionList sessions={sessions} />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={styles.pageBtn}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasMore}
                  className={styles.pageBtn}
                >
                  Next
                </button>
              </div>
            )}

            {sessions.length === 0 && !loading && (
              <div className={styles.emptyState}>
                <p>No sessions found matching your filters.</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default History;
