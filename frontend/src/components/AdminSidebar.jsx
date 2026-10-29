import { useState } from 'react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    ), id: 'dashboard' },
    { name: 'Products', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
    ), id: 'products' },
    { name: 'Sales History', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
    ), id: 'sales' },
    { name: 'Closing Reports', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    ), id: 'closing' },
    { name: 'Staff Management', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    ), id: 'staff' }, 
    { name: 'System Backups', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
    ), id: 'backup' },
  ];

  return (
    <div style={{ 
      width: isOpen ? '260px' : '80px', 
      background: '#f8fafc', // Light modern grey
      borderRight: '1px solid #e2e8f0', 
      transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      position: 'sticky', // This fixes it to the left while scrolling
      top: 0,
      left: 0,
      fontFamily: '"Inter", system-ui, sans-serif',
      boxSizing: 'border-box',
      userSelect: 'none',
      overflowX: 'hidden',
      flexShrink: 0
    }}>
      
      {/* Top Header Logo Area */}
      <div style={{ 
        padding: '24px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isOpen ? 'space-between' : 'center',
        minHeight: '80px',
        boxSizing: 'border-box',
        marginBottom: '12px'
      }}>
        {isOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#0f172a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
            </div>
            <div style={{ fontWeight: '800', fontSize: '18px', color: '#0f172a', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              CodeCrafte
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          title="Toggle Sidebar"
          style={{ 
            cursor: 'pointer', 
            background: 'transparent', 
            color: '#64748b', 
            border: 'none',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
            outline: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Navigation Menu Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <div 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '14px', 
                padding: '12px 14px', 
                cursor: 'pointer',
                background: isActive ? '#fef08a' : 'transparent', // Yellow neon active background (from ref image)
                color: isActive ? '#0f172a' : '#475569',
                borderRadius: '4px',
                fontWeight: isActive ? '700' : '500',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                justifyContent: isOpen ? 'flex-start' : 'center'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#0f172a';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#475569';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.icon}
              </span>
              
              {isOpen && <span>{item.name}</span>}
            </div>
          );
        })}
      </div>

      {/* User Footer Profile */}
      {isOpen && (
        <div style={{ padding: '24px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>
            AD
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>Admin User</div>
            <div style={{ fontSize: '12px', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden' }}>Store Administrator</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;