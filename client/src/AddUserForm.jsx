import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function AddUserForm({ onUserAdded }) {
  // 1. Admin Check
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser?.role === 'Admin';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User'
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Admin না হলে ফর্ম রেন্ডার হবে না
  if (!isAdmin) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Image পাঠানোর জন্য FormData অবজেক্ট তৈরি
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', formData.role);
    if (avatar) {
      data.append('avatar', avatar);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/users`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData({ name: '', email: '', password: '', role: 'User' });
      setAvatar(null);
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

        {/* Profile Image Input */}
        <div className="md:col-span-4">
          <label className="block text-xs text-slate-500 mb-1">Profile Image (Avatar)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 dark:file:bg-indigo-900/40 file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-100 cursor-pointer"
          />
        </div>

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