import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import ConfirmModal from './components/ConfirmModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const UserList = () => {
  // Safe LocalStorage Admin Checking with State
  const [isAdmin, setIsAdmin] = useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', role: 'User' });

  // Modals & User creation state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'User' });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Check Admin Role on Component Mount
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const directRole = localStorage.getItem('role');
      const role = storedUser?.role || directRole || '';

      if (role.toLowerCase() === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Failed to parse user role", err);
      setIsAdmin(false);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/users?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages || 1);
      } else if (Array.isArray(response.data)) {
        const allUsers = response.data;
        const limit = 5;
        const calculatedTotalPages = Math.ceil(allUsers.length / limit) || 1;

        const startIndex = (page - 1) * limit;
        const paginatedUsers = allUsers.slice(startIndex, startIndex + limit);

        setUsers(paginatedUsers);
        setTotalPages(calculatedTotalPages);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching data: ", error.response?.data || error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (isAdmin) setIsAddUserOpen(true);
      }
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsShortcutsOpen(false);
        setIsAddUserOpen(false);
        setEditingId(null);
      }
      if (e.key === '?' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  // Create User
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewUser({ name: '', email: '', password: '', role: 'User' });
      setIsAddUserOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error adding user: ", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  // Table Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Drag and Drop
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const updated = [...users];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);
    setUsers(updated);
    setDraggedIndex(null);
  };

  // Edit User
  const handleEditClick = (user) => {
    setEditingId(user._id);
    setEditFormData({ name: user.name, role: user.role });
  };

  const handleSaveUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/users/${id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user: ", error);
      alert("Failed to update user.");
    }
  };

  // Delete User
  const promptDelete = (id) => {
    setUserToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/users/${userToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert("Failed to delete user.");
    } finally {
      setUserToDelete(null);
      setIsModalOpen(false);
    }
  };

  // Search & Sorting logic
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    if (sortConfig.key === 'createdAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else {
      aVal = String(aVal || '').toLowerCase();
      bVal = String(bVal || '').toLowerCase();
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'manager':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div 
      className="p-6 rounded-2xl shadow-sm transition-colors duration-300 relative"
      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">User Management</h2>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              title="Keyboard Shortcuts (?)"
              className="px-2 py-0.5 text-xs font-mono rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
            >
              ⌨️ Shortcuts
            </button>
          </div>
          <p className="text-xs opacity-70 mt-1">Total Active Accounts: {filteredUsers.length}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Add User Button - Only visible for Admins */}
          {isAdmin && (
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-md text-center inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              ➕ Add User
            </button>
          )}

          <CSVLink
            data={filteredUsers}
            filename={"nexus-users-report.csv"}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-md text-center inline-flex items-center justify-center gap-2"
          >
            📥 Export CSV
          </CSVLink>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="animate-pulse space-y-4 py-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-full" />
            ))}
          </div>
        ) : sortedUsers.length === 0 ? (
          <div className="py-12 text-center opacity-70">No user records found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 opacity-70">
              <tr>
                <th className="py-3 px-2 w-8 text-center">⋮⋮</th>
                <th 
                  onClick={() => handleSort('name')} 
                  className="py-3 px-4 cursor-pointer select-none hover:text-indigo-400 transition"
                >
                  User {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th 
                  onClick={() => handleSort('email')} 
                  className="py-3 px-4 cursor-pointer select-none hover:text-indigo-400 transition"
                >
                  Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th 
                  onClick={() => handleSort('role')} 
                  className="py-3 px-4 cursor-pointer select-none hover:text-indigo-400 transition"
                >
                  Role {sortConfig.key === 'role' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th 
                  onClick={() => handleSort('createdAt')} 
                  className="py-3 px-4 cursor-pointer select-none hover:text-indigo-400 transition"
                >
                  Joined Date {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {sortedUsers.map((user, index) => (
                <tr 
                  key={user._id || index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                    draggedIndex === index ? 'opacity-30 border-2 border-dashed border-indigo-500' : ''
                  }`}
                >
                  <td className="py-3.5 px-2 text-center cursor-grab active:cursor-grabbing opacity-40 hover:opacity-100">
                    ⋮⋮
                  </td>

                  <td className="py-3.5 px-4 font-medium flex items-center gap-3">
                    {user.avatar ? (
                      <img 
                        src={`${API_BASE_URL}/${user.avatar}`} 
                        alt={user.name} 
                        className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-sm border border-indigo-500/20 shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}

                    {editingId === user._id ? (
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    ) : (
                      <span>{user.name}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 opacity-80">{user.email}</td>

                  <td className="py-3.5 px-4">
                    {editingId === user._id ? (
                      <select
                        value={editFormData.role}
                        onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        <option value="User">User</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 opacity-80">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>

                  {/* Actions Column - Restricted to Admins */}
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {editingId === user._id ? (
                        <>
                          <button 
                            onClick={() => handleSaveUpdate(user._id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="bg-slate-400 hover:bg-slate-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        >
                          Edit
                        </button>
                      )}
                      <button 
                        onClick={() => promptDelete(user._id)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6 px-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-sm font-medium rounded-lg"
        >
          Previous
        </button>
        <span className="text-sm opacity-80">
          Page <span className="font-bold">{page}</span> of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-sm font-medium rounded-lg"
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteUser}
        title="Delete Account"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="p-6 rounded-2xl max-w-md w-full shadow-2xl relative border"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold">➕ Create New Account</h3>
              <button 
                onClick={() => setIsAddUserOpen(false)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:opacity-80 transition"
              >
                ✕ Esc
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-2 border-t dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {isShortcutsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="p-6 rounded-2xl max-w-sm w-full shadow-2xl relative border"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">⌨️ Keyboard Shortcuts</h3>
              <button 
                onClick={() => setIsShortcutsOpen(false)}
                className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:opacity-80"
              >
                Esc
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b pb-2 dark:border-slate-700">
                <span>Add New User Modal</span>
                <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded border">Ctrl + N</kbd>
              </div>
              <div className="flex justify-between items-center border-b pb-2 dark:border-slate-700">
                <span>Close Modals / Cancel Edit</span>
                <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded border">Esc</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Show Shortcuts Help</span>
                <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded border">Shift + ?</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;