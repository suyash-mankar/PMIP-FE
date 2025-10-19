import PropTypes from "prop-types";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import styles from "./ParameterChart.module.scss";

function ParameterChart({ parameters }) {
  if (!parameters) {
    return (
      <div className={styles.emptyState}>
        <p>No parameter data available yet.</p>
      </div>
    );
  }

  const chartData = [
    {
      parameter: "Structure",
      score: parameters.structure || 0,
      fullMark: 10,
    },
    {
      parameter: "Metrics",
      score: parameters.metrics || 0,
      fullMark: 10,
    },
    {
      parameter: "Prioritization",
      score: parameters.prioritization || 0,
      fullMark: 10,
    },
    {
      parameter: "User Empathy",
      score: parameters.userEmpathy || 0,
      fullMark: 10,
    },
    {
      parameter: "Communication",
      score: parameters.communication || 0,
      fullMark: 10,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.label}>{payload[0].payload.parameter}</p>
          <p className={styles.value}>
            Score: {payload[0].value.toFixed(1)}/10
          </p>
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
  };

  return (
    <div className={styles.parameterChart}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis
            dataKey="parameter"
            tick={{ fill: "#666", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fill: "#666", fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#667eea"
            fill="#667eea"
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        {chartData.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <span className={styles.legendLabel}>{item.parameter}:</span>
            <span className={styles.legendValue}>
              {item.score.toFixed(1)}/10
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

ParameterChart.propTypes = {
  parameters: PropTypes.shape({
    structure: PropTypes.number,
    metrics: PropTypes.number,
    prioritization: PropTypes.number,
    userEmpathy: PropTypes.number,
    communication: PropTypes.number,
  }),
};

export default ParameterChart;
