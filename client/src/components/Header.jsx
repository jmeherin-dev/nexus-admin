export default function Header() {
  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 text-white">
      <h2 className="text-lg font-semibold text-slate-300">Overview</h2>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-none">Admin User</p>
          <p className="text-xs text-slate-400 mt-1">admin@nexus.com</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm shadow">A</div>
      </div>
    </header>
  );
}