import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="flex justify-between items-center p-6 border-b border-slate-700/50 bg-slate-900/50">
      <h2 className="text-lg font-semibold text-white">Overview</h2>
      
      <div className="flex items-center gap-6">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          className="text-2xl p-2 rounded-full hover:bg-slate-700/50 transition-all"
          title="Toggle Theme"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">Admin User</p>
            <p className="text-xs text-slate-400">admin@nexus.com</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;