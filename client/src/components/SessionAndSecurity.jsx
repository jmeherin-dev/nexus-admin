import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function SessionAndSecurity() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [activeSessions, setActiveSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // ব্যাকএন্ড থেকে সেশন ও ইতিহাস লোড
  const fetchSecurityData = async () => {
    try {
      const [sessionsRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/security/sessions`, authHeader),
        axios.get(`${API_BASE_URL}/api/security/login-history`, authHeader)
      ]);
      setActiveSessions(sessionsRes.data);
      setLoginHistory(historyRes.data);
    } catch (err) {
      console.error('Error fetching security details:', err);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  // পাসওয়ার্ড পরিবর্তন
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/security/change-password`, { newPassword: password }, authHeader);
      setMessage('Password updated successfully!');
      setPassword('');
    } catch (err) {
      setMessage('Error updating password.');
    }
  };

  // সেশন লগআউট
  const handleRevokeSession = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/security/sessions/${id}`, authHeader);
      setActiveSessions((prev) => prev.filter((session) => session._id !== id));
    } catch (err) {
      console.error('Error revoking session:', err);
    }
  };

  // Password Strength Logic
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700', textColors: 'text-slate-400' };
    
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500', textColors: 'text-rose-500' };
    if (score === 2 || score === 3) return { score: 65, label: 'Medium', color: 'bg-amber-500', textColors: 'text-amber-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500', textColors: 'text-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="space-y-8">
      
      {/* 1. Password Strength Meter & Change Password */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/70 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Change Password</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Ensure your account uses a strong password.</p>

        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Real-time Strength Bar */}
          {password && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
                <span className={`font-bold ${strength.textColors}`}>{strength.label}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                ></div>
              </div>
            </div>
          )}

          {message && <p className="text-xs font-medium text-emerald-500">{message}</p>}

          <button type="submit" className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition">
            Update Password
          </button>
        </form>
      </div>

      {/* 2. Active Sessions Management */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/70 shadow-sm transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Sessions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Devices currently logged into your account.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {activeSessions.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">No active sessions found.</p>
          ) : (
            activeSessions.map((session) => (
              <div key={session._id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-base">
                    {session.device?.includes('iPhone') ? '📱' : '💻'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{session.device}</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {session.location} • <span className="font-mono text-[11px]">{session.ip}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRevokeSession(session._id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition"
                >
                  Log out
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Login History Log */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/70 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Login History</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Recent authentication logs for security tracking.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Device</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40 text-xs text-slate-700 dark:text-slate-300">
              {loginHistory.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition">
                  <td className="py-3 px-3 font-mono">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-3 font-medium">{log.device}</td>
                  <td className="py-3 px-3">{log.location}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{log.ip}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        log.status === 'Success'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}