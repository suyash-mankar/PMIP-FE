import { Link } from "react-router-dom";
import styles from "./SessionList.module.scss";

function SessionList({ sessions }) {
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
    const {
      structure = 0,
      metrics = 0,
      prioritization = 0,
      userEmpathy = 0,
      user_empathy = userEmpathy, // Fallback for old format
      communication = 0,
    } = scores;
    const empathyScore = userEmpathy || user_empathy;
    return Math.round(
      (structure + metrics + prioritization + empathyScore + communication) / 5
    );
  };

  const getScoreColor = (score) => {
    if (score >= 8) return styles.scoreExcellent;
    if (score >= 6) return styles.scoreGood;
    if (score >= 4) return styles.scoreFair;
    return styles.scorePoor;
  };

  const formatDifficulty = (level) => {
    const difficultyMap = {
      junior: { label: "Entry", class: "Entry" },
      mid: { label: "Mid", class: "Mid" },
      senior: { label: "Senior", class: "Senior" },
    };
    return difficultyMap[level] || { label: "N/A", class: "" };
  };

  return (
    <div className={styles.sessionList}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Question</th>
              <th>Difficulty</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const overallScore = calculateOverallScore(session.scores);
              return (
                <tr key={session.id}>
                  <td className={styles.date}>
                    {new Date(
                      session.created_at || session.date
                    ).toLocaleDateString()}
                  </td>
                  <td className={styles.question}>
                    {session.question
                      ? session.question.length > 80
                        ? session.question.substring(0, 80) + "..."
                        : session.question
                      : "N/A"}
                  </td>
                  <td className={styles.difficulty}>
                    <span
                      className={`${styles.badge} ${
                        session.difficulty
                          ? styles[
                              `badge${
                                formatDifficulty(session.difficulty).class
                              }`
                            ]
                          : ""
                      }`}
                    >
                      {session.difficulty
                        ? formatDifficulty(session.difficulty).label
                        : "N/A"}
                    </span>
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
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => {
                        // This could open a modal or navigate to a detail page
                        alert(
                          `Session ID: ${session.id}\nScore: ${overallScore}/10`
                        );
                      }}
                    >
                      View
                    </button>
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
