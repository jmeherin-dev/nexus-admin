import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from "./components/Login";
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UserList from './UserList';
import AddUserForm from './AddUserForm';
import AnalyticsChart from './components/AnalyticsChart';
import Billing from './components/Billing';
import ApiAndWebhooks from './components/ApiAndWebhooks';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshKey, setRefreshKey] = useState(0);
  const [userCount, setUserCount] = useState(0);

  // Tab Switch করার জন্য স্টেট
  const [activeTab, setActiveTab] = useState('dashboard');

  // ডাটাবেজ থেকে ইউজারের মোট সংখ্যা নিয়ে আসা
  const fetchUserCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      const count = response.data.totalUsers !== undefined 
        ? response.data.totalUsers 
        : response.data.length;
      
      setUserCount(count || 0);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserCount();
    }
  }, [refreshKey, token]);

  // টোকেন না থাকলে সরাসরি Login পেজ দেখাবে
  if (!token) {
    return <Login />;
  }

  const handleUserAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div 
      className="flex min-h-screen font-sans transition-colors duration-300" 
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* Sidebar এ প্রপস পাস করা হলো */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 space-y-8">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <div>
                <h1 className="text-2xl font-bold transition-colors duration-300">
                  Dashboard Overview
                </h1>
                <p className="text-sm opacity-70 transition-colors duration-300">
                  Welcome back to NexusAdmin control center.
                </p>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </>
          )}

          {/* TAB 2: USERS */}
          {activeTab === 'users' && (
            <>
              <div>
                <h1 className="text-2xl font-bold">User Management</h1>
                <p className="text-sm opacity-70">Manage registered accounts and control access.</p>
              </div>
              <AddUserForm onUserAdded={handleUserAdded} />
              <UserList key={refreshKey} />
            </>
          )}

          {/* TAB 3: BILLING */}
          {activeTab === 'billing' && (
            <Billing />
          )}

          {/* TAB 4: SETTINGS & API */}
          {activeTab === 'settings' && (
            <ApiAndWebhooks />
          )}

        </main>
      </div>
    </div>
  );
}