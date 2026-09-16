import { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import toast from 'react-hot-toast';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', role: 'User' });

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      toast.error("Error fetching users data!");
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        toast.success("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user!");
        console.error("Error deleting user: ", error);
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setEditFormData({ name: user.name, role: user.role });
  };

  const handleSaveUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, editFormData);
      toast.success("User updated successfully!");
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user!");
      console.error("Error updating user: ", error);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="bg-slate-800 rounded-2xl border border-slate-700/70 p-6 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">User Management</h2>
          <p className="text-xs text-slate-400 mt-1">Total Active Accounts: {filteredUsers.length}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* CSV Export Button */}
          <CSVLink
            data={filteredUsers}
            filename={"nexus-users-report.csv"}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20 text-center inline-flex items-center justify-center gap-2"
          >
            📥 Export CSV
          </CSVLink>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2 text-sm rounded-xl focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-3.5 px-4 font-medium text-white">
                  {editingId === user._id ? (
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="bg-slate-900 border border-slate-600 px-3 py-1 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="py-3.5 px-4 text-slate-400">{user.email}</td>
                <td className="py-3.5 px-4">
                  {editingId === user._id ? (
                    <select
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      className="bg-slate-900 border border-slate-600 px-3 py-1 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
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
                <td className="py-3.5 px-4 text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  {editingId === user._id ? (
                    <button 
                      onClick={() => handleSaveUpdate(user._id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm"
                    >
                      Save
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEditClick(user)}
                      className="bg-slate-700 hover:bg-slate-600 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    >
                      Edit
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(user._id)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;