import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'billing', label: 'Billing & Plans', icon: '💳' },
    { id: 'settings', label: 'Settings & API', icon: '⚡' },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    setIsMobileOpen(false); // মোবাইলে সিলেক্ট করলে সাইডবার বন্ধ হয়ে যাবে
  };

  return (
    <>
      {/* Mobile Overlay (কালো ব্যাকগ্রাউন্ড, সাইডবার খোলা থাকলে) */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-slate-800 text-slate-200 flex flex-col border-r border-slate-700 min-h-screen z-50 transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-5 font-bold text-xl text-indigo-400 border-b border-slate-700 flex items-center justify-between gap-2">
          <span>⚡ NexusAdmin</span>
          {/* Close button, শুধু মোবাইলে দেখা যাবে */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
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
    </>
  );
}