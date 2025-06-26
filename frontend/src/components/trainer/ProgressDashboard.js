import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale,BarElement, Tooltip, Legend} from 'chart.js';
import '../../styles/TrainerProgress.css';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TrainerProgress = () => {
  const [filters, setFilters] = useState({
    date: '',
    month: '',
    year: '',
    city: '',
    country: '',
    traineeId:''
  });
  const [chartData, setChartData] = useState(null);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const generateColors = (count) => {
    const colors = [];
    const hueStep = 360 / count;
    for (let i = 0; i < count; i++) {
      const hue = Math.round(i * hueStep);
      const saturation = 65 
      const lightness = 50
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  };
  const fetchProgress = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:5000/api/progress/trainer/filter?${query}`);
      const data = res.data || [];

      const grouped = {};
      data.forEach(entry => {
        const type=entry.activityType.trim().toLowerCase();
        if (!grouped[type]) {
          grouped[type] = 0;
        }
        grouped[type] += entry.duration;
      });
      const label=Object.keys(grouped);
      const values=Object.values(grouped);
      const colors=generateColors(label.length)
      setChartData({
        labels:label ,
        datasets: [{
          label: 'Total Duration (mins)',
          data: values,
          backgroundColor:colors
        }]
      });
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  return (
    <div className="trainer-container">
      <h2 className="trainer-heading">Trainer Progress Filter</h2>
      <form className="trainer-form" onSubmit={(e) => {
          e.preventDefault();
          fetchProgress();
        }}>
        <input type="text" name="traineeId" placeholder="Trainee ID" onChange={handleChange} required/>
        <input type="date" name="date" onChange={handleChange} className="p-2 border" />
        <select name="month" onChange={handleChange} className="p-2 border">
          <option value="">Select Month</option>
          {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select name="year" onChange={handleChange} className="p-2 border">
          <option value="">Select Year</option>
          {['2024', '2025', '2026'].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <input name="city" placeholder="City" onChange={handleChange} className="p-2 border" />
        <input name="country" placeholder="Country" onChange={handleChange} className="p-2 border" />
        <button type="submit" className="col-span-2 md:col-span-3 bg-blue-500 text-white p-2 rounded">
          Filter Progress
        </button>
      </form>

      {chartData ? (
        <div className="chart-container">
          <div className='chart-wrapper'>
            <Bar data={chartData} />
          </div>
        </div>
      ) : (
        <p className="no-data">No chart data yet. Use filters and click on filter.</p>
      )}
    </div>
  );
};

export default TrainerProgress;
