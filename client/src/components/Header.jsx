import { useState } from 'react';
import { useTheme } from './ThemeContext'; // ফাইল লোকেশন অনুযায়ী পাথ খেয়াল রাখবেন

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  
  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New User Registered', time: '5m ago', unread: true },
    { id: 2, title: 'Server Memory Usage 85%', time: '1h ago', unread: true },
    { id: 3, title: 'Database Backup Completed', time: '3h ago', unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 transition-colors duration-300 relative z-40">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Overview</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer relative text-lg"
            title="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 text-slate-800 dark:text-slate-200 z-50">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs flex justify-between items-start gap-2 ${
                      n.unread
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20'
                        : 'bg-slate-50 dark:bg-slate-900/40'
                    }`}
                  >
                    <div>
                      <p className={`font-medium ${n.unread ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{n.time}</span>
                    </div>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer text-xl"
          title="Toggle Theme"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin User</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">admin@nexus.com</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
            A
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800/50 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}