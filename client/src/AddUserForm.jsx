import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function AddUserForm({ onUserAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/users`, formData);
      setFormData({ name: '', email: '', password: '', role: 'User' });
      if (onUserAdded) onUserAdded();
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="p-6 rounded-2xl shadow-sm transition-colors duration-300 mb-8"
      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
    >
      <h3 className="text-lg font-bold mb-4">Add New User</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-4 py-2 text-sm rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="px-4 py-2 text-sm rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="px-4 py-2 text-sm rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200"
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="px-4 py-2 text-sm rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200"
        >
          <option value="User">User</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
        >
          {loading ? 'Saving...' : '+ Save User'}
        </button>
      </form>
    </div>
  );
}