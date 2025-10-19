import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProgressHistory, getCategories } from "../../api/client";
import SessionList from "../../components/SessionList/SessionList";
import styles from "./History.module.scss";

function History() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessions, setSessions] = useState([]);
  const [categories, setCategories] = useState([]);
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
    sortBy: "createdAt",
    sortOrder: "desc",
    minScore: "",
    maxScore: "",
    search: "",
  });

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
      setSessions(response.data.sessions || []);
      setPagination(response.data.pagination);
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
      sortBy: "createdAt",
      sortOrder: "desc",
      minScore: "",
      maxScore: "",
      search: "",
    });
    setSearchParams({});
  };

  const calculateStats = () => {
    if (!sessions || sessions.length === 0) {
      return { averageScore: 0 };
    }

    let totalScore = 0;
    sessions.forEach((session) => {
      if (session.scores && session.scores.overall) {
        totalScore += session.scores.overall;
      }
    });

    return {
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
              <div className={styles.statValue}>{pagination.total}</div>
              <div className={styles.statLabel}>Total Sessions</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.averageScore}/10</div>
              <div className={styles.statLabel}>Average Score (This Page)</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Category:</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Sort By:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="createdAt">Date</option>
                <option value="category">Category</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Order:</label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Min Score:</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="0"
                value={filters.minScore}
                onChange={(e) => handleFilterChange("minScore", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Max Score:</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="10"
                value={filters.maxScore}
                onChange={(e) => handleFilterChange("maxScore", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.searchRow}>
            <input
              type="text"
              placeholder="Search questions..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className={styles.searchInput}
            />
            <button onClick={clearFilters} className={styles.clearBtn}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <span>Loading your interview history...</span>
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
