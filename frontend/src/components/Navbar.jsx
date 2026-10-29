import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const navigate = useNavigate();
  
  // Local storage se logged-in user ka data uthana
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', role: 'Staff' };

  // Live time (12-hour format with AM/PM) aur date update karne ke liye
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const optionsDate = { month: 'short', day: 'numeric', year: 'numeric' };
      const dateStr = now.toLocaleDateString('en-US', optionsDate);
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      setCurrentDateTime(`${dateStr} | ${timeStr}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0 24px', 
      background: '#ffffff', 
      borderBottom: '1px solid #f1f5f9',
      fontFamily: '"Inter", system-ui, sans-serif',
      boxSizing: 'border-box',
      height: '80px',
      userSelect: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 99,
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    }}>
      {/* Title & Role */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.01em' }}>
          POS Dashboard <span style={{ fontWeight: '600', color: '#0ea5e9', fontSize: '12px', background: '#f0f9ff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #bae6fd', marginLeft: '6px', textTransform: 'uppercase' }}>{user.role}</span>
        </h3>
      </div>

      {/* Right Actions & Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Date & Time (12-Hour Format) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#475569', background: '#f8fafc', padding: '8px 14px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>{currentDateTime}</span>
        </div>

        {/* User Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#0f172a', background: '#f8fafc', padding: '8px 14px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>{user.name}</span>
        </div>

        {/* Refresh Button */}
        <button 
          onClick={handleRefresh} 
          title="Refresh Page" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '8px 14px', 
            cursor: 'pointer', 
            background: '#ffffff', 
            color: '#475569', 
            border: '1px solid #e2e8f0', 
            borderRadius: '4px', 
            fontSize: '13px', 
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#475569'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          Refresh
        </button>

        {/* Notifications Button */}
        <button 
          title="Updates / Notifications" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '8px 12px', 
            cursor: 'pointer', 
            background: '#ffffff', 
            color: '#475569', 
            border: '1px solid #e2e8f0', 
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#475569'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </button>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '8px 16px', 
            background: '#fef2f2', 
            color: '#dc2626', 
            border: '1px solid #fecaca', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontSize: '13px', 
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;