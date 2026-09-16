import { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import ConfirmModal from './components/ConfirmModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const UserList = () => {
  // Current User Role Check
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser?.role === 'Admin';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Inline Editing State
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', role: 'User' });
  
  // Delete Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Drag to Reorder State
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Keyboard Shortcuts Modal State
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users?page=${page}&limit=10`);
      if (response.data.users) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } else {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        const addInput = document.querySelector('input[placeholder="Name"]');
        if (addInput) addInput.focus();
      }
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsShortcutsOpen(false);
        setEditingId(null);
      }
      if (e.key === '?' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sorting Handler
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Drag-and-Drop Handlers
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

  // Inline Edit Handlers
  const handleEditClick = (user) => {
    setEditingId(user._id);
    setEditFormData({ name: user.name, role: user.role });
  };

  const handleSaveUpdate = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/api/users/${id}`, editFormData);
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  // Delete Handlers
  const promptDelete = (id) => {
    setUserToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${userToDelete}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
    } finally {
      setUserToDelete(null);
    }
  };

  // Filtered & Sorted Data
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
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
    switch (role) {
      case 'Admin':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Manager':
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
                  Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
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
                  key={user._id}
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

                  <td className="py-3.5 px-4 font-medium">
                    {editingId === user._id ? (
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    ) : (
                      user.name
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
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  
                  {/* Admin শুধুমাত্র Edit এবং Delete অ্যাকশন দেখতে পাবেন */}
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
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 disabled:opacity-50 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-sm font-medium rounded-lg"
        >
          Previous
        </button>
        <span className="text-sm opacity-80">
          Page <span className="font-bold">{page}</span> of {totalPages}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 disabled:opacity-50 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-sm font-medium rounded-lg"
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

      {/* Keyboard Shortcuts Help Modal */}
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
                <span>Add New User Form</span>
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