import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Filter অনুযায়ী Dynamic Chart Data
const dataSets = {
  '7d': [
    { label: 'Mon', sales: 1200, users: 40 },
    { label: 'Tue', sales: 1900, users: 65 },
    { label: 'Wed', sales: 1500, users: 50 },
    { label: 'Thu', sales: 2200, users: 80 },
    { label: 'Fri', sales: 3000, users: 110 },
    { label: 'Sat', sales: 2500, users: 95 },
    { label: 'Sun', sales: 3400, users: 130 },
  ],
  '30d': [
    { label: 'Jan', sales: 4000, users: 240 },
    { label: 'Feb', sales: 3000, users: 139 },
    { label: 'Mar', sales: 5000, users: 980 },
    { label: 'Apr', sales: 4780, users: 390 },
    { label: 'May', sales: 5890, users: 480 },
    { label: 'Jun', sales: 6390, users: 380 },
    { label: 'Jul', sales: 8490, users: 430 },
  ],
  '90d': [
    { label: 'Month 1', sales: 12000, users: 1350 },
    { label: 'Month 2', sales: 17060, users: 1250 },
    { label: 'Month 3', sales: 24500, users: 1890 },
  ],
  'custom': [
    { label: 'Period 1', sales: 2100, users: 110 },
    { label: 'Period 2', sales: 4800, users: 290 },
    { label: 'Period 3', sales: 6200, users: 410 },
  ]
};

export default function AnalyticsChart() {
  const [range, setRange] = useState('30d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  const currentData = dataSets[range] || dataSets['30d'];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/70 shadow-xl transition-colors duration-300">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue & Growth Analytics</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Performance overview over time</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Date Range Filter Dropdown */}
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="custom">Custom Range</option>
          </select>

          {/* Custom Date Pickers */}
          {range === 'custom' && (
            <div className="flex items-center gap-1.5 text-xs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
              />
              <span className="text-slate-400">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
              />
            </div>
          )}

          {/* Scheduled Report Modal Button */}
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>📥</span> Export / Schedule
          </button>
        </div>
      </div>

      {/* Dynamic Recharts Area Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '0.75rem', color: '#fff' }}
            />
            <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Scheduled Report Modal UI */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Export & Schedule Reports</h4>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download current analytics report or schedule automated weekly email updates.
            </p>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl space-y-3 border border-slate-200/60 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Email Scheduled Reports</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Send weekly report every Monday</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {isScheduled && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1">
                  <span>✓</span> Weekly email schedule activated.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  alert("Report downloaded successfully!");
                  setShowReportModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}