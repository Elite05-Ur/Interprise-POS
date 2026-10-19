import { useState, useEffect } from 'react';
import API from '../../api';

const AddStaff = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
      setError(''); // Clear any previous errors if fetch succeeds
    } catch (err) {
      setError('Users load karne mein error aa gaya!');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingId) {
        // User Update karna
        await API.put(`/users/${editingId}`, formData);
        setMessage('User successfully update ho gaya!');
        setEditingId(null);
      } else {
        // Naya User Register karna
        await API.post('/auth/register', formData);
        setMessage('User successfully add ho gaya!');
      }

      setFormData({ name: '', email: '', password: '', role: 'staff' });
      fetchUsers(); // List ko foran refresh karna
    } catch (err) {
      setError(err.response?.data?.message || 'Operation fail ho gayi!');
    }
  };

  const handleEdit = (user) => {
    setMessage('');
    setError('');
    setEditingId(user._id);
    setFormData({
      name: user.name || user.username || '',
      email: user.email || '',
      password: '', // Security ke liye edit par password khali rakha hai
      role: user.role || 'staff',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Kya aap waqai is user ko delete karna chahte hain?')) return;
    setMessage('');
    setError('');
    try {
      await API.delete(`/users/${id}`);
      setMessage('User successfully delete ho gaya!');
      fetchUsers();
    } catch (err) {
      setError('User delete karne mein error aa gaya!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Staff & User Management</h2>

      {/* Messages / Alerts */}
      {message && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>{message}</div>}
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '15px', marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <input 
          type="text" 
          placeholder="Staff Name" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          required 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={e => setFormData({...formData, email: e.target.value})} 
          required 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
        />
        <input 
          type="text" 
          placeholder={editingId ? "New Password (optional)" : "Password"} 
          value={formData.password} 
          onChange={e => setFormData({...formData, password: e.target.value})} 
          required={!editingId} 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
        />
        <select 
          value={formData.role} 
          onChange={e => setFormData({...formData, role: e.target.value})} 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        
        <button type="submit" style={{ background: '#007BFF', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
          {editingId ? 'Update User' : 'Add Staff'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', email: '', password: '', role: 'staff' }); }} style={{ background: 'gray', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>
            Cancel
          </button>
        )}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ background: '#007BFF', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Name</th>
            <th style={{ padding: '12px' }}>Email</th>
            <th style={{ padding: '12px' }}>Role</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>Koi user nahi mila!</td>
            </tr>
          ) : (
            users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}><strong>{u.name || u.username}</strong></td>
                <td style={{ padding: '12px' }}>{u.email}</td>
                <td style={{ padding: '12px', textTransform: 'capitalize' }}>{u.role}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => handleEdit(u)} style={{ background: '#ffc107', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Edit</button>
                  <button onClick={() => handleDelete(u._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddStaff;