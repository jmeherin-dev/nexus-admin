import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UserList from './UserList';
import AddUserForm from './AddUserForm';
import AnalyticsChart from './components/AnalyticsChart';

// Environment variable অথবা fallback হিসেবে localhost ব্যবহার করবে
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [userCount, setUserCount] = useState(0);

  // ডাটাবেজ থেকে ইউজারের মোট সংখ্যা নিয়ে আসা
  const fetchUserCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      // ব্যাকএন্ড থেকে আসা totalUsers বা users.length হ্যান্ডেল করবে
      const count = response.data.totalUsers !== undefined 
        ? response.data.totalUsers 
        : response.data.length;
      
      setUserCount(count || 0);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  useEffect(() => {
    fetchUserCount();
  }, [refreshKey]);

  const handleUserAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div 
      className="flex min-h-screen font-sans transition-colors duration-300" 
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold transition-colors duration-300">
              Dashboard Overview
            </h1>
            <p className="text-sm opacity-70 transition-colors duration-300">
              Welcome back to NexusAdmin control center.
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              className="p-6 rounded-2xl shadow-sm transition-colors duration-300" 
              style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <p className="opacity-70 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-extrabold text-indigo-500 mt-2">$24,500</p>
            </div>
            
            <div 
              className="p-6 rounded-2xl shadow-sm transition-colors duration-300" 
              style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <p className="opacity-70 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-extrabold text-emerald-500 mt-2">{userCount}</p>
            </div>
            
            <div 
              className="p-6 rounded-2xl shadow-sm transition-colors duration-300" 
              style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <p className="opacity-70 text-sm font-medium">Conversion Rate</p>
              <p className="text-3xl font-extrabold text-amber-500 mt-2">3.42%</p>
            </div>
          </div>

          {/* Analytics Chart */}
          <AnalyticsChart />

          {/* Add User Form */}
          <AddUserForm onUserAdded={handleUserAdded} />

          {/* User Table List */}
          <UserList key={refreshKey} />

        </main>
      </div>
    </div>
  );
}