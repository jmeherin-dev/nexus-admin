import { useTheme } from './ThemeContext'; // ফাইল লোকেশন অনুযায়ী পাথ খেয়াল রাখবেন

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    // LocalStorage থেকে টোকেন রিমুভ করা
    localStorage.removeItem('token');
    // পেজ রিফ্রেশ হলে ProtectedRoute ইউজারকে রিডাইরেক্ট করে দেবে
    window.location.reload();
  };

  return (
    <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 transition-colors duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Overview</h2>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer text-xl"
          title="Toggle Theme"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin User</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">admin@nexus.com</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
            A
          </div>

          {/* Logout Button */}
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