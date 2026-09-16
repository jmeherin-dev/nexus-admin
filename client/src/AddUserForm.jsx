import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AddUserForm({ onUserAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', formData);
      toast.success('User created successfully!');
      setFormData({ name: '', email: '', password: '', role: 'User' });
      onUserAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/70 shadow-xl mb-8">
      <h3 className="text-lg font-bold text-white mb-4">Add New User</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2 text-sm rounded-xl focus:outline-none focus:border-indigo-500"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2 text-sm rounded-xl focus:outline-none focus:border-indigo-500"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2 text-sm rounded-xl focus:outline-none focus:border-indigo-500"
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2 text-sm rounded-xl focus:outline-none focus:border-indigo-500"
        >
          <option value="User">User</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          type="submit"
          className="md:col-span-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20"
        >
          + Save User
        </button>
      </form>
    </div>
  );
}