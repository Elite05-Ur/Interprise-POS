import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();
  
  // Local storage se logged-in user ka data uthana
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', role: 'Staff' };

  // Live time update karne ke liye
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
      <div>
        <h3>POS System ({user.role.toUpperCase()})</h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span>🕒 {currentTime}</span>
        <span>👤 {user.name}</span>
        
        <button onClick={handleRefresh} title="Refresh Page" style={{ padding: '5px 10px', cursor: 'pointer' }}>
          🔄 Refresh
        </button>

        <button title="Updates / Notifications" style={{ padding: '5px 10px', cursor: 'pointer' }}>
          🔔
        </button>

        <button onClick={handleLogout} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;