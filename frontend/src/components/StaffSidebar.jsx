import { useState } from 'react';

const StaffSidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: 'POS Billing', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
    ), id: 'pos' },
    { name: 'My Sales', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    ), id: 'mysales' },
    { name: 'Till Closing', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    ), id: 'till' },
  ];

  return (
    <div style={{ 
      width: isOpen ? '260px' : '80px', 
      background: '#f8fafc',
      borderRight: '1px solid #e2e8f0', 
      transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      position: 'sticky',
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
                background: isActive ? '#fef08a' : 'transparent',
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
          <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>
            ST
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>Staff User</div>
            <div style={{ fontSize: '12px', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden' }}>Cashier Panel</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffSidebar;