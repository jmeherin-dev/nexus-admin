import React from 'react';

export default function Billing() {
  const plans = [
    { name: 'Free', price: '$0', desc: 'Basic metrics for small projects', current: false },
    { name: 'Pro', price: '$29/mo', desc: 'Advanced analytics & team access', current: true },
    { name: 'Enterprise', price: '$99/mo', desc: 'Dedicated server & 24/7 SLA support', current: false }
  ];

  const invoices = [
    { id: 'INV-2026-001', date: 'Sep 01, 2026', amount: '$29.00', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Aug 01, 2026', amount: '$29.00', status: 'Paid' },
  ];

  return (
    <div className="p-6 text-slate-100 space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl font-bold">Subscription & Billing</h2>
        <p className="text-xs text-slate-400">Manage your active plans, pricing tier, and billing invoices.</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.name} className={`p-6 rounded-2xl border ${p.current ? 'border-indigo-500 bg-slate-800' : 'border-slate-700 bg-slate-900'} relative flex flex-col justify-between`}>
            <div>
              {p.current && (
                <span className="absolute top-4 right-4 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  Active Plan
                </span>
              )}
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-2xl font-extrabold text-white mt-2">{p.price}</p>
              <p className="text-xs text-slate-400 mt-1 mb-6">{p.desc}</p>
            </div>
            <button className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${p.current ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
              {p.current ? 'Current Plan' : 'Upgrade Plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Payment History Table */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h3 className="font-semibold text-sm mb-4">Payment History</h3>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-700 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="pb-3">Invoice ID</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="py-3 font-mono">{inv.id}</td>
                <td className="py-3">{inv.date}</td>
                <td className="py-3">{inv.amount}</td>
                <td className="py-3">
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20">
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}