'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Link from 'next/link';
import '../styles/globals.css';
import '../styles/sidebar.css';

export default function Sidebar({ registrations = [] }) { // Default to empty array
  const [isOpen, setIsOpen] = useState(false);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(registrations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    XLSX.writeFile(workbook, 'registrations.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Email', 'Course', 'Branch', 'College', 'Contact', 'Event']],
      body: registrations.map(reg => [
        reg.name,
        reg.email,
        reg.course,
        reg.branch,
        reg.college,
        reg.contact,
        reg.event
      ]),
      styles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
      },
    });
    doc.save('registrations.pdf');
  };

  const exportToWord = () => {
    const content = registrations.map(reg => 
      `Name: ${reg.name}\nEmail: ${reg.email}\nCourse: ${reg.course}\nBranch: ${reg.branch}\nCollege: ${reg.college}\nContact: ${reg.contact}\nEvent: ${reg.event}\n\n`
    ).join('');
    const blob = new Blob([content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'registrations.doc';
    link.click();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>
        
        <ul className="nav-list">
          <li className="nav-item">
            <Link href="/" className="nav-link">
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Main Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/visualization" className="nav-link">
              <span className="nav-icon">📊</span>
              <span className="nav-text">Data Visualization</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/analytics" className="nav-link">
              <span className="nav-icon">📈</span>
              <span className="nav-text">Analytics</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="export-section">
        <h3 className="export-title">Exports</h3>
        <button className="export-btn" onClick={exportToExcel}>{isOpen ? "Export to Excel" : "xls"}</button>
        <button className="export-btn" onClick={exportToPDF}>{isOpen ? "Export to PDF" : "pdf"}</button>
        <button className="export-btn" onClick={exportToWord}>{isOpen ? "Export to Word": "doc"}</button>
      </div>
    </div>
  );
}