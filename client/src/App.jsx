import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

import Login from "./components/Login";
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UserList from './UserList';
import AddUserForm from './AddUserForm';
import AnalyticsChart from './components/AnalyticsChart';
import Billing from './components/Billing';
import ApiAndWebhooks from './components/ApiAndWebhooks';
import SessionAndSecurity from './components/SessionAndSecurity';
import CommandPalette from './components/CommandPalette';
import OnboardingTour from './components/OnboardingTour';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshKey, setRefreshKey] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTourOpen, setIsTourOpen] = useState(false);

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
      const hasSeenTour = localStorage.getItem('nexus_tour_completed');
      if (!hasSeenTour) {
        setIsTourOpen(true);
      }
    }
  }, [refreshKey, token]);

  if (!token) {
    return <Login />;
  }

  const handleUserAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleCloseTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('nexus_tour_completed', 'true');
  };

  return (
    <div 
      className="flex min-h-screen font-sans transition-colors duration-300" 
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      <OnboardingTour isOpen={isTourOpen} onClose={handleCloseTour} />
      <CommandPalette setActiveTab={setActiveTab} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 space-y-8">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {activeTab === 'dashboard' && (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                      <p className="text-sm opacity-70">Welcome back to NexusAdmin control center.</p>
                    </div>
                    <button
                      onClick={() => setIsTourOpen(true)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition flex items-center gap-1.5"
                    >
                      ✨ Take Tour
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div 
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 rounded-2xl shadow-sm relative overflow-hidden" 
                      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                      <div className="flex justify-between items-start">
                        <p className="opacity-70 text-sm font-medium">Total Revenue</p>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-0.5">
                          ▲ +12.5% <span className="opacity-60 text-[9px]">vs last month</span>
                        </span>
                      </div>
                      <p className="text-3xl font-extrabold text-indigo-500 mt-2">$24,500</p>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 rounded-2xl shadow-sm relative overflow-hidden" 
                      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                      <div className="flex justify-between items-start">
                        <p className="opacity-70 text-sm font-medium">Active Users</p>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-0.5">
                          ▲ +8.2% <span className="opacity-60 text-[9px]">vs last week</span>
                        </span>
                      </div>
                      <p className="text-3xl font-extrabold text-emerald-500 mt-2">{userCount}</p>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 rounded-2xl shadow-sm relative overflow-hidden" 
                      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                      <div className="flex justify-between items-start">
                        <p className="opacity-70 text-sm font-medium">Conversion Rate</p>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-0.5">
                          ▼ -0.4% <span className="opacity-60 text-[9px]">vs last month</span>
                        </span>
                      </div>
                      <p className="text-3xl font-extrabold text-amber-500 mt-2">3.42%</p>
                    </motion.div>
                  </div>

                  <AnalyticsChart />
                </>
              )}

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

              {activeTab === 'billing' && <Billing />}

              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <ApiAndWebhooks />
                  <SessionAndSecurity />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}