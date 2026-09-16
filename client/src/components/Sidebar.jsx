export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 text-slate-200 flex flex-col border-r border-slate-700 min-h-screen">
      <div className="p-5 font-bold text-xl text-indigo-400 border-b border-slate-700 flex items-center gap-2">
        <span>⚡ NexusAdmin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1.5">
        <a href="#" className="block px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium">Dashboard</a>
        <a href="#" className="block px-4 py-2.5 rounded-xl hover:bg-slate-700/60 text-slate-400 hover:text-white transition">Analytics</a>
        <a href="#" className="block px-4 py-2.5 rounded-xl hover:bg-slate-700/60 text-slate-400 hover:text-white transition">Users</a>
        <a href="#" className="block px-4 py-2.5 rounded-xl hover:bg-slate-700/60 text-slate-400 hover:text-white transition">Settings</a>
      </nav>
    </aside>
  );
}