import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./CategoryProgress.module.scss";

function CategoryProgress({ categories }) {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/history?category=${category}`);
  };

  const formatCategoryName = (category) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (!categories || categories.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No category data available yet. Start solving questions!</p>
      </div>
    );
  }

  return (
    <div className={styles.categoryProgress}>
      {categories.map((cat, index) => {
        const scoreColor =
          cat.averageScore >= 7
            ? "excellent"
            : cat.averageScore >= 5
            ? "good"
            : cat.averageScore > 0
            ? "needs-improvement"
            : "not-started";

        return (
          <div
            key={index}
            className={styles.categoryCard}
            onClick={() => handleCategoryClick(cat.category)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleCategoryClick(cat.category);
            }}
          >
            <div className={styles.header}>
              <h3 className={styles.categoryName}>
                {formatCategoryName(cat.category)}
              </h3>
              {cat.averageScore > 0 && (
                <div className={`${styles.score} ${styles[scoreColor]}`}>
                  {cat.averageScore.toFixed(1)}/10
                </div>
              )}
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Questions Solved:</span>
                <span className={styles.statValue}>{cat.solved}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Questions Viewed:</span>
                <span className={styles.statValue}>{cat.viewed}</span>
              </div>
            </div>

            {cat.solved > 0 && (
              <div className={styles.activityIndicator}>
                ✓ {cat.solved} question{cat.solved !== 1 ? "s" : ""} completed
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

CategoryProgress.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      solved: PropTypes.number.isRequired,
      viewed: PropTypes.number.isRequired,
      averageScore: PropTypes.number,
    })
  ).isRequired,
};

export default CategoryProgress;
