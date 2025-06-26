// components/progress/progress.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import '../../styles/progress.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const ProgressCharts = () => {
  const [activityData, setActivityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const traineeId = localStorage.getItem('userId');

  useEffect(() => {
    if (!traineeId) {
      setError('User ID not found.');
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/progress/${traineeId}/progress`);
        setActivityData(res.data.activitiesByType || {});
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError('Failed to load progress data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [traineeId]);
const chartTypes=[Bar,Line,Pie]
  const getChartComponent = (index) => {
    return chartTypes[index % chartTypes.length];
  };

  if (loading) return <p className="p-4">Loading charts...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="progress-container">
      <div className="chart-grid">
        {Object.entries(activityData).map(([type, records],index) => {
          const ChartComponent = getChartComponent(index);
          const chartData = {
            labels: records.map((r) => r.date),
            datasets: [
              {
                label: `${type.charAt(0).toUpperCase() + type.slice(1)} Progress`,
                data: records.map((r) => r.duration),
                backgroundColor: ['#f67019', '#f53794', '#537bc4', '#4dc9f6'],
                borderColor: 'hotpink',
                fill: false,
                tension: 0.1,
              }
            ]
          };

          return (
            <div className="chart-card" key={type}>
              <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
              {records.length > 0 ? <ChartComponent data={chartData} /> : <p>No data</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressCharts;
