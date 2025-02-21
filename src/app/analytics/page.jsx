'use client';

import { useEffect, useState } from 'react';
import '../../styles/globals.css';
import '../../styles/analytics.css'; // New CSS file for analytics

export default function Analytics() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState('');
  const [sortField, setSortField] = useState('count');
  const [sortOrder, setSortOrder] = useState('desc');

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

  // Aggregate data by event
  const eventAnalytics = registrations.reduce((acc, reg) => {
    acc[reg.event] = (acc[reg.event] || 0) + 1;
    return acc;
  }, {});

  // Convert to array for table display
  let analyticsData = Object.entries(eventAnalytics).map(([event, count]) => ({
    event,
    count,
  }));

  // Apply filter
  if (filterEvent) {
    analyticsData = analyticsData.filter(data => data.event === filterEvent);
  }

  // Apply sort
  if (sortField) {
    analyticsData.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortField === 'event') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }

  // Total registrations count
  const totalCount = registrations.length;

  // Unique events for filter dropdown
  const uniqueEvents = [...new Set(registrations.map(reg => reg.event))];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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
          <h1>Analytics</h1>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h2>Total Registrations</h2>
            <p className="stat-value">{totalCount}</p>
          </div>
        </div>

        <div className="controls">
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="filter-select"
          >
            <option value="">All Events</option>
            {uniqueEvents.map(event => (
              <option key={event} value={event}>{event}</option>
            ))}
          </select>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('event')}>
                  Event {sortField === 'event' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th onClick={() => handleSort('count')}>
                  Count {sortField === 'count' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map(data => (
                <tr key={data.event}>
                  <td>{data.event}</td>
                  <td>{data.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}