import React, { useState } from 'react';

export default function ApiAndWebhooks() {
  const [apiKey, setApiKey] = useState('nx_live_99a8b7c6d5e4f3a2b1');
  const [copied, setCopied] = useState(false);

  const [webhooks] = useState([
    { id: 1, name: 'Slack Alerts', url: 'https://hooks.slack.com/services/123/456', status: 'Active' },
    { id: 2, name: 'Zapier Automation', url: 'https://hooks.zapier.com/hooks/catch/789', status: 'Active' }
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateNewKey = () => {
    const newKey = 'nx_live_' + Math.random().toString(36).substring(2, 18);
    setApiKey(newKey);
  };

  return (
    <div className="space-y-6">
      {/* API Key Management */}
      <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100">
        <h3 className="font-bold text-lg mb-1">API Key Management</h3>
        <p className="text-xs text-slate-400 mb-4">Use this secret key to authenticate API requests from your client applications.</p>
        
        <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-700 max-w-xl">
          <input 
            type="text" 
            readOnly 
            value={apiKey} 
            className="bg-transparent font-mono text-xs w-full text-indigo-400 focus:outline-none"
          />
          <button 
            onClick={handleCopy}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            {copied ? 'Copied! ✓' : 'Copy Key'}
          </button>
        </div>

        <button 
          onClick={generateNewKey}
          className="mt-4 text-xs text-rose-400 hover:underline cursor-pointer"
        >
          Revoke & Regenerate Key
        </button>
      </div>

      {/* Webhook Settings */}
      <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100">
        <h3 className="font-bold text-lg mb-1">Webhooks & Integrations</h3>
        <p className="text-xs text-slate-400 mb-4">Send real-time event notifications to external web services.</p>

        <div className="space-y-3 max-w-xl">
          {webhooks.map((wh) => (
            <div key={wh.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-700">
              <div>
                <p className="text-xs font-semibold text-white">{wh.name}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{wh.url}</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20">
                {wh.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}