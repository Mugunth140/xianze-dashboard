import { Geist, Geist_Mono } from "next/font/google";
import '../styles/globals.css';
import '../styles/sidebar.css'; // Include sidebar styles
import Sidebar from '../components/Sidebar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Xianze Intercollege Event Dashboard',
  description: 'Dashboard for managing event registrations',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}

