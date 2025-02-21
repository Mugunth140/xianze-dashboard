'use client';

import { useState, useEffect } from 'react';
import '../styles/globals.css';
import '../styles/sidebar.css';
import Sidebar from '../components/Sidebar';

// export const metadata = {
//   title: 'Xianze Intercollege Event Dashboard',
//   description: 'Dashboard for managing event registrations',
// };

export default function RootLayout({ children }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // Manage sidebar toggle state

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
      if (!res.ok) throw new Error('Failed to fetch registrations');
      const data = await res.json();
      if (data.success) {
        console.log('Fetched registrations in layout:', data.data); // Debug log
        setRegistrations(data.data);
        localStorage.setItem('registrations', JSON.stringify(data.data));
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <html lang="en">
        <body>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="loader"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <div className="dashboard">
          <Sidebar registrations={registrations} isOpen={isOpen} setIsOpen={setIsOpen} />
          <div 
            className="main-content"
            style={{
              marginLeft: isOpen ? '250px' : '60px',
              transition: 'margin-left 0.3s ease',
              width: '100%',
            }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}