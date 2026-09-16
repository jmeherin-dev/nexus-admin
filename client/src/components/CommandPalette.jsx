import { useState, useEffect } from 'react';

export default function CommandPalette({ setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const navigationItems = [
    { title: 'Dashboard Overview', tab: 'dashboard', category: 'Navigation', icon: '📊' },
    { title: 'User Management', tab: 'users', category: 'Management', icon: '👥' },
    { title: 'Billing & Subscriptions', tab: 'billing', category: 'Billing', icon: '💳' },
    { title: 'API Keys & Webhooks', tab: 'settings', category: 'Settings', icon: '🔑' },
    { title: 'Session & Security', tab: 'settings', category: 'Security', icon: '🛡️' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredItems = navigationItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (tab) => {
    if (setActiveTab) setActiveTab(tab);
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-700/80">
          <span className="text-slate-400 text-lg mr-3">🔍</span>
          <input
            type="text"
            autoFocus
            placeholder="Search tabs, settings, actions... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <p className="p-4 text-center text-xs text-slate-400">No results found for "{query}"</p>
          ) : (
            filteredItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelect(item.tab)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-700/50 text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400">{item.category}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition">Go to tab ↵</span>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press <kbd className="font-mono bg-white dark:bg-slate-700 px-1 rounded">Ctrl</kbd> + <kbd className="font-mono bg-white dark:bg-slate-700 px-1 rounded">K</kbd> anywhere</span>
          <span>NexusAdmin Quick Nav</span>
        </div>
      </div>
    </div>
  );
}