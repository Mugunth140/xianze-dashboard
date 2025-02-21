'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, PageOrientation } from 'docx';
import Link from 'next/link';
import '../styles/globals.css';
import '../styles/sidebar.css';

export default function Sidebar({ registrations = [], isOpen, setIsOpen }) {
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState(null);

  useEffect(() => {
    console.log('Sidebar received registrations:', registrations);
  }, [registrations]);

  const exportToExcel = () => {
    setExportLoading(true);
    setExportError(null);
    try {
      if (!registrations.length) throw new Error('No registrations data available to export');
      const worksheet = XLSX.utils.json_to_sheet(registrations);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
      XLSX.writeFile(workbook, 'registrations.xlsx');
    } catch (error) {
      console.error('Excel export failed:', error);
      setExportError('Failed to export to Excel: ' + error.message);
    } finally {
      setExportLoading(false);
    }
  };

  const exportToPDF = () => {
    setExportLoading(true);
    setExportError(null);
    try {
      if (!registrations.length) throw new Error('No registrations data available to export');
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.autoTable({
        head: [['Name', 'Email', 'Course', 'Branch', 'College', 'Contact', 'Event']],
        body: registrations.map(reg => [
          reg.name || 'N/A',
          reg.email || 'N/A',
          reg.course || 'N/A',
          reg.branch || 'N/A',
          reg.college || 'N/A',
          reg.contact || 'N/A',
          reg.event || 'N/A'
        ]),
        styles: {
          fontSize: 8,
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          cellPadding: 2,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: [0, 0, 0],
          fontSize: 8,
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 50 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 40 },
          5: { cellWidth: 30 },
          6: { cellWidth: 40 },
        },
        margin: { top: 10, left: 10, right: 10 },
      });
      doc.save('registrations.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      setExportError('Failed to export to PDF: ' + error.message);
    } finally {
      setExportLoading(false);
    }
  };

  const exportToWord = () => {
    setExportLoading(true);
    setExportError(null);
    try {
      if (!registrations.length) throw new Error('No registrations data available to export');

      // Create a new Document with landscape orientation
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE,
              },
              margin: {
                top: 720, // 0.5 inch = 720 twips
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children: [
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                // Header Row
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Name')], shading: { fill: 'D3D3D3' } }),
                    new TableCell({ children: [new Paragraph('Email')], shading: { fill: 'D3D3D3' } }),
                    new TableCell({ children: [new Paragraph('Course')], shading: { fill: 'D3D3D3' } }),
                    new TableCell({ children: [new Paragraph('Branch')], shading: { fill: 'D3D3D3' } }),
                    new TableCell({ children: [new Paragraph('College')], shading: { fill: 'D3D3D3' } }),
                    new TableCell({ children: [new Paragraph('Contact')], shading: { fill: 'D3D3D3' } }),
                    new TableCell({ children: [new Paragraph('Event')], shading: { fill: 'D3D3D3' } }),
                  ],
                }),
                // Data Rows
                ...registrations.map(reg => new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(reg.name || 'N/A')] }),
                    new TableCell({ children: [new Paragraph(reg.email || 'N/A')] }),
                    new TableCell({ children: [new Paragraph(reg.course || 'N/A')] }),
                    new TableCell({ children: [new Paragraph(reg.branch || 'N/A')] }),
                    new TableCell({ children: [new Paragraph(reg.college || 'N/A')] }),
                    new TableCell({ children: [new Paragraph(reg.contact || 'N/A')] }),
                    new TableCell({ children: [new Paragraph(reg.event || 'N/A')] }),
                  ],
                })),
              ],
            }),
          ],
        }],
      });

      // Generate and download the .docx file
      Packer.toBlob(doc).then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'registrations.docx'; // Use .docx extension for compatibility
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } catch (error) {
      console.error('Word export failed:', error);
      setExportError('Failed to export to Word: ' + error.message);
    } finally {
      setExportLoading(false);
    }
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
        {exportError && <p className="export-error">{exportError}</p>}
        <h3 className="export-title">Exports</h3>
        <button 
          className="export-btn" 
          onClick={exportToExcel} 
          disabled={exportLoading}
        >
          {isOpen ? (exportLoading ? 'Exporting...' : 'Export to Excel') : 'xls'}
        </button>
        <button 
          className="export-btn" 
          onClick={exportToPDF} 
          disabled={exportLoading}
        >
          {isOpen ? (exportLoading ? 'Exporting...' : 'Export to PDF') : 'pdf'}
        </button>
        <button 
          className="export-btn" 
          onClick={exportToWord} 
          disabled={exportLoading}
        >
          {isOpen ? (exportLoading ? 'Exporting...' : 'Export to Word') : 'doc'}
        </button>
      </div>
    </div>
  );
}