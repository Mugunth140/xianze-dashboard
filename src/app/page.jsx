'use client';

import { useEffect, useState } from 'react';
import '../styles/globals.css';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', course: '', branch: '', college: '', contact: '', event: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [filterCollege, setFilterCollege] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const cachedData = localStorage.getItem('registrations');
    if (cachedData) {
      setRegistrations(JSON.parse(cachedData));
      setFilteredRegistrations(JSON.parse(cachedData));
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
        setFilteredRegistrations(data.data);
        localStorage.setItem('registrations', JSON.stringify(data.data));
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search, Filter, and Sort
  useEffect(() => {
    let result = [...registrations];

    // Search
    if (searchTerm) {
      result = result.filter(reg => 
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter
    if (filterEvent) {
      result = result.filter(reg => reg.event === filterEvent);
    }
    if (filterCollege) {
      result = result.filter(reg => reg.college === filterCollege);
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (typeof aValue === 'string') {
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    setFilteredRegistrations(result);
  }, [searchTerm, filterEvent, filterCollege, sortField, sortOrder, registrations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/registrations/${editingId}` : '/api/registrations';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchRegistrations();
        setFormData({ name: '', email: '', course: '', branch: '', college: '', contact: '', event: '' });
        setShowForm(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (registration) => {
    setEditingId(registration._id);
    setFormData(registration);
    setShowForm(true);
  };

  const deleteRegistration = async (id) => {
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchRegistrations();
    } catch (error) {
      console.error('Error deleting registration:', error);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Get unique events and colleges for filter dropdowns
  const uniqueEvents = [...new Set(registrations.map(reg => reg.event))];
  const uniqueColleges = [...new Set(registrations.map(reg => reg.college))];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="main-content">
        <div className="header">
          <h1>Event Registrations</h1>
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Registration
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="controls">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
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
          <select
            value={filterCollege}
            onChange={(e) => setFilterCollege(e.target.value)}
            className="filter-select"
          >
            <option value="">All Colleges</option>
            {uniqueColleges.map(college => (
              <option key={college} value={college}>{college}</option>
            ))}
          </select>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                {['name', 'email', 'course', 'branch', 'college', 'contact', 'event', 'actions'].map(field => (
                  <th key={field} onClick={() => field !== 'actions' && handleSort(field)}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map(reg => (
                <tr key={reg._id}>
                  <td>{reg.name}</td>
                  <td>{reg.email}</td>
                  <td>{reg.course}</td>
                  <td>{reg.branch}</td>
                  <td>{reg.college}</td>
                  <td>{reg.contact}</td>
                  <td>{reg.event}</td>
                  <td>
                    <button className="action-btn edit-btn" onClick={() => handleEdit(reg)}>Edit</button>
                    <button className="action-btn delete-btn" onClick={() => deleteRegistration(reg._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{editingId ? 'Edit Registration' : 'Add New Registration'}</h2>
              <form onSubmit={handleSubmit}>
                {Object.keys(formData).map(field => (
                  <div className="form-group" key={field}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      required
                    />
                  </div>
                ))}
                <div className="form-buttons">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ name: '', email: '', course: '', branch: '', college: '', contact: '', event: '' });
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}