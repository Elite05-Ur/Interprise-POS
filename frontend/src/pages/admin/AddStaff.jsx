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
      setError('');
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
        await API.put(`/users/${editingId}`, formData);
        setMessage('User successfully update ho gaya!');
        setEditingId(null);
      } else {
        await API.post('/auth/register', formData);
        setMessage('User successfully add ho gaya!');
      }

      setFormData({ name: '', email: '', password: '', role: 'staff' });
      fetchUsers();
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
      password: '',
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

  // Reusable input style
  const inputStyle = {
    padding: '10px 14px',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    background: '#f8fafc',
    color: '#0f172a',
    transition: 'border-color 0.2s, background 0.2s',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: '"Inter", system-ui, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Staff & Role Management 👥</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Register new cashiers, manage system access roles, and monitor user accounts.</p>
      </div>

      {/* Notifications / Messages */}
      {message && (
        <div style={{ background: '#ecfdf5', color: '#059669', padding: '14px 20px', marginBottom: '24px', borderRadius: '4px', border: '1px solid #a7f3d0', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          {message}
        </div>
      )}
      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '14px 20px', marginBottom: '24px', borderRadius: '4px', border: '1px solid #fecaca', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {error}
        </div>
      )}

      {/* Add / Edit Staff Form Card */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
          {editingId ? 'Edit System User' : 'Register New Account'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Full Name</label>
            <input type="text" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={inputStyle} onFocus={e => {e.target.style.borderColor = '#0ea5e9'; e.target.style.background = '#ffffff'}} onBlur={e => {e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'}} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Email Address</label>
            <input type="email" placeholder="john@store.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={inputStyle} onFocus={e => {e.target.style.borderColor = '#0ea5e9'; e.target.style.background = '#ffffff'}} onBlur={e => {e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'}} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Password</label>
            <input type="password" placeholder={editingId ? "Leave blank to keep same" : "Set secure password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingId} style={inputStyle} onFocus={e => {e.target.style.borderColor = '#0ea5e9'; e.target.style.background = '#ffffff'}} onBlur={e => {e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'}} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>System Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{...inputStyle, cursor: 'pointer', appearance: 'none'}}>
              <option value="staff">Staff / Cashier</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="submit" 
              style={{ 
                flex: 1, height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                background: editingId ? '#10b981' : '#0f172a', color: 'white', border: 'none', 
                cursor: 'pointer', fontSize: '14px', fontWeight: '600', borderRadius: '4px',
                boxShadow: editingId ? 'none' : '0 4px 12px rgba(15, 23, 42, 0.2)', transition: 'transform 0.1s, opacity 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              {editingId ? 'Update User' : 'Register User'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setFormData({ name: '', email: '', password: '', role: 'staff' }); }} 
                style={{ 
                  height: '42px', background: '#f1f5f9', color: '#475569', border: 'none', 
                  padding: '0 16px', cursor: 'pointer', borderRadius: '4px', fontWeight: '600', fontSize: '14px'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Users Table Container */}
      <div style={{ background: '#ffffff', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Active Accounts Directory</h3>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', background: '#f8fafc', padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            Total Users: {users.length}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Staff Profile</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Email Address</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>System Role</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '50%' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>No Users Found</span>
                      <span style={{ fontSize: '14px', color: '#94a3b8' }}>Register staff members using the form above.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#475569' }}>
                          {(u.name || u.username || '?').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '600', color: '#0f172a' }}>{u.name || u.username}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#475569', fontWeight: '500' }}>{u.email}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        background: u.role === 'admin' ? '#e0f2fe' : '#f1f5f9', 
                        color: u.role === 'admin' ? '#0284c7' : '#475569', 
                        padding: '4px 10px', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        border: '1px solid',
                        borderColor: u.role === 'admin' ? '#bae6fd' : '#e2e8f0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button 
                          onClick={() => handleEdit(u)} 
                          style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(u._id)} 
                          style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AddStaff;