import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', sales: 4000, users: 240 },
  { month: 'Feb', sales: 3000, users: 139 },
  { month: 'Mar', sales: 5000, users: 980 },
  { month: 'Apr', sales: 4780, users: 390 },
  { month: 'May', sales: 5890, users: 480 },
  { month: 'Jun', sales: 6390, users: 380 },
  { month: 'Jul', sales: 8490, users: 430 },
];

export default function AnalyticsChart() {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/70 shadow-xl mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Revenue & Growth Analytics</h3>
          <p className="text-xs text-slate-400 mt-1">Monthly performance overview</p>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '0.75rem', color: '#fff' }}
            />
            <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
