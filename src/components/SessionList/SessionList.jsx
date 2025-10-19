import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./SessionList.module.scss";

function SessionList({ sessions }) {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left,
      y: rect.bottom + 8,
    });
  };
  if (!sessions || sessions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No interview sessions yet. Start your first interview!</p>
        <Link to="/interview" className="btn btn-primary">
          Start Interview
        </Link>
      </div>
    );
  }

  const calculateOverallScore = (scores) => {
    if (!scores) return 0;

    // If there's a totalScore or overall score, use that
    if (scores.totalScore !== undefined) return scores.totalScore;
    if (scores.overall !== undefined) return scores.overall;

    // Otherwise calculate weighted average
    const {
      structure = 0,
      metrics = 0,
      prioritization = 0,
      userEmpathy = 0,
      user_empathy = userEmpathy,
      communication = 0,
    } = scores;
    const empathyScore = userEmpathy || user_empathy;

    // Weighted average: prioritization 25%, others 20%, communication 15%
    return (
      structure * 0.2 +
      metrics * 0.2 +
      prioritization * 0.25 +
      empathyScore * 0.2 +
      communication * 0.15
    ).toFixed(1);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return styles.scoreExcellent;
    if (score >= 6) return styles.scoreGood;
    if (score >= 4) return styles.scoreFair;
    return styles.scorePoor;
  };

  const formatCategory = (category) => {
    if (!category) return "N/A";
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatCompanies = (companies) => {
    if (!companies || companies.length === 0) return "—";
    if (typeof companies === "string") {
      try {
        companies = JSON.parse(companies);
      } catch {
        return companies;
      }
    }
    if (Array.isArray(companies)) {
      return companies.slice(0, 3).join(", ");
    }
    return "—";
  };

  return (
    <div className={styles.sessionList}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Question</th>
              <th>Category</th>
              <th>Company</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const overallScore = calculateOverallScore(session.scores);
              return (
                <tr key={session.id}>
                  <td className={styles.date}>
                    {new Date(session.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className={styles.question}>
                    <span
                      className={styles.questionText}
                      onMouseEnter={handleMouseEnter}
                    >
                      {session.questionText || "N/A"}
                      <span
                        className={styles.questionTooltip}
                        style={{
                          left: `${tooltipPosition.x}px`,
                          top: `${tooltipPosition.y}px`,
                        }}
                      >
                        {session.questionText || "N/A"}
                      </span>
                    </span>
                  </td>
                  <td className={styles.category}>
                    <span className={styles.categoryBadge}>
                      {formatCategory(session.category)}
                    </span>
                  </td>
                  <td className={styles.company}>
                    {formatCompanies(session.company)}
                  </td>
                  <td>
                    <span
                      className={`${styles.score} ${getScoreColor(
                        overallScore
                      )}`}
                    >
                      {overallScore}/10
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SessionList;
