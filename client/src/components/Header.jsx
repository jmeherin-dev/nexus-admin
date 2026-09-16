import { useTheme } from './ThemeContext'; // ফাইল লোকেশন অনুযায়ী পাথ খেয়াল রাখবেন

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex justify-between items-center p-4 border-b border-slate-700/50">
      <div>
        <h2 className="text-xl font-bold">Overview</h2>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer text-xl"
          title="Toggle Theme"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold">Admin User</p>
            <p className="text-xs text-slate-400">admin@nexus.com</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}