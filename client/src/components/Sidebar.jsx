import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'billing', label: 'Billing & Plans', icon: '💳' },
    { id: 'settings', label: 'Settings & API', icon: '⚡' },
  ];

  return (
    <aside className="w-64 bg-slate-800 text-slate-200 flex flex-col border-r border-slate-700 min-h-screen">
      <div className="p-5 font-bold text-xl text-indigo-400 border-b border-slate-700 flex items-center gap-2">
        <span>⚡ NexusAdmin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}