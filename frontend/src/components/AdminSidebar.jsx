import { useState } from 'react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', id: 'dashboard' },
    { name: 'Products', icon: '📦', id: 'products' },
    { name: 'Staff Management', icon: '👥', id: 'staff' },
    { name: 'Sales History', icon: '📊', id: 'sales' },
    { name: 'Closing Reports', icon: '📑', id: 'closing' },
    { name: 'Backups', icon: '💾', id: 'backup' },
  ];

  return (
    <div style={{ width: isOpen ? '220px' : '70px', background: '#ffffff', borderRight: '1px solid #ddd', transition: 'width 0.3s', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '15px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer', background: '#007BFF', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px' }}>
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      <div style={{ padding: '10px 20px', fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        {isOpen ? 'CodeCrafte POS' : 'CC'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', padding: '0 10px' }}>
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px', 
              padding: '12px', 
              cursor: 'pointer',
              background: activeTab === item.id ? '#007BFF' : 'transparent',
              color: activeTab === item.id ? 'white' : '#333',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {isOpen && <span>{item.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;