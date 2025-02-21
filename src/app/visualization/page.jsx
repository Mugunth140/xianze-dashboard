'use client';

import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../../styles/globals.css';
import '../../styles/visualization.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Visualization() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedData = localStorage.getItem('registrations');
    if (cachedData) {
      setRegistrations(JSON.parse(cachedData));
      setLoading(false);
    }
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data);
        localStorage.setItem('registrations', JSON.stringify(data.data));
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for Event Bar Chart
  const eventCounts = registrations.reduce((acc, reg) => {
    acc[reg.event] = (acc[reg.event] || 0) + 1;
    return acc;
  }, {});

  const eventData = {
    labels: Object.keys(eventCounts),
    datasets: [{
      label: 'Registrations by Event',
      data: Object.values(eventCounts),
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
    }],
  };

  // Prepare data for College Pie Chart
  const collegeCounts = registrations.reduce((acc, reg) => {
    acc[reg.college] = (acc[reg.college] || 0) + 1;
    return acc;
  }, {});

  const collegeData = {
    labels: Object.keys(collegeCounts),
    datasets: [{
      label: 'Registrations by College',
      data: Object.values(collegeCounts),
      backgroundColor: ['#fff', '#ccc', '#999', '#666', '#333', '#222'], // Shades for multiple colleges
      borderColor: '#000',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: { color: '#fff' },
      },
      title: {
        display: true,
        color: '#fff',
        font: { size: 16 },
      },
    },
    scales: {
      x: { ticks: { color: '#fff' }, grid: { color: '#333' } },
      y: { ticks: { color: '#fff' }, grid: { color: '#333' } },
    },
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="main-content">
        <div className="header">
          <h1>Data Visualization</h1>
        </div>

        <div className="visualization-container">
          <div className="chart-wrapper">
            <h2 className="chart-title">Registrations by Event</h2>
            <Bar 
              data={eventData} 
              options={{
                ...chartOptions,
                plugins: { 
                  ...chartOptions.plugins, 
                  title: { ...chartOptions.plugins.title, text: 'Event Distribution' } 
                },
              }} 
            />
          </div>

          <div className="chart-wrapper">
            <h2 className="chart-title">Registrations by College</h2>
            <Pie 
              data={collegeData} 
              options={{
                ...chartOptions,
                plugins: { 
                  ...chartOptions.plugins, 
                  title: { ...chartOptions.plugins.title, text: 'College Distribution' } 
                },
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

