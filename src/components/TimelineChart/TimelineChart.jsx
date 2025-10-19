import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getTimelineData } from "../../api/client";
import styles from "./TimelineChart.module.scss";

function TimelineChart() {
  const [timelineData, setTimelineData] = useState([]);
  const [period, setPeriod] = useState("day");
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimelineData();
  }, [period, days]);

  const fetchTimelineData = async () => {
    setLoading(true);
    try {
      const response = await getTimelineData(period, days);
      setTimelineData(response.data.timeline || []);
    } catch (error) {
      console.error("Error fetching timeline data:", error);
      setTimelineData([]);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.date}>{label}</p>
          <p className={styles.score}>
            Score: {payload[0].value.toFixed(1)}/10
          </p>
          <p className={styles.count}>Sessions: {payload[0].payload.count}</p>
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.string,
  };

  if (loading) {
    return (
      <div className={styles.timelineChart}>
        <div className={styles.loading}>Loading timeline...</div>
      </div>
    );
  }

  if (!timelineData || timelineData.length === 0) {
    return (
      <div className={styles.timelineChart}>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label>Period:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className={styles.select}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <div className={styles.controlGroup}>
            <label>Range:</label>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className={styles.select}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="60">Last 60 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
        <div className={styles.emptyState}>
          <p>No activity data for the selected period.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.timelineChart}>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>Period:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className={styles.select}
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
        <div className={styles.controlGroup}>
          <label>Range:</label>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className={styles.select}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="60">Last 60 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#666", fontSize: 12 }}
            stroke="#999"
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fill: "#666", fontSize: 12 }}
            stroke="#999"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="overall"
            stroke="#667eea"
            strokeWidth={3}
            dot={{ fill: "#667eea", r: 4 }}
            activeDot={{ r: 6 }}
            name="Overall Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TimelineChart;
