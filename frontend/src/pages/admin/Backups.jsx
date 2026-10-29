import { useState } from 'react';
import API from '../../api';

const Backups = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleDownloadBackup = async () => {
    setMessage('');
    setError('');
    setIsBackingUp(true);
    try {
      const res = await API.get('/backup/generate');
      setMessage(res.data.message + ' (Path: ' + res.data.folderPath + ')');
    } catch (err) {
      setError('Backup generate karne mein error aa gaya!');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: '"Inter", system-ui, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Data Security & Backups 🛡️</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Secure your store data by generating and saving local CSV backups of products, sales, and inventory records.</p>
      </div>
      
      {/* Messages / Alerts */}
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

      {/* Modern Backup Action Card */}
      <div style={{ background: '#ffffff', padding: '32px', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decorative Top Line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #0ea5e9, #3b82f6)' }}></div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', background: '#f0f9ff', color: '#0ea5e9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Instant System Snapshot</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              Create a secure CSV export of your entire POS database. This includes all products, historical sales, staff accounts, and closing reports. Files are saved directly to your local server.
            </p>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            End-to-End Local Backup
          </div>
          
          <button 
            onClick={handleDownloadBackup} 
            disabled={isBackingUp}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 20px', 
              background: isBackingUp ? '#94a3b8' : '#0f172a', 
              color: 'white', 
              border: 'none', 
              cursor: isBackingUp ? 'not-allowed' : 'pointer', 
              borderRadius: '4px', 
              fontSize: '14px', 
              fontWeight: '600',
              boxShadow: isBackingUp ? 'none' : '0 4px 12px rgba(15, 23, 42, 0.2)',
              transition: 'transform 0.1s, opacity 0.2s'
            }}
            onMouseEnter={e => { if(!isBackingUp) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { if(!isBackingUp) e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {isBackingUp ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                Processing...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Generate Backup
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Global Animation Style for Spinner */}
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
};

export default Backups;