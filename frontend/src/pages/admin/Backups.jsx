import { useState } from 'react';
import API from '../../api';

const Backups = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDownloadBackup = async () => {
    setMessage('');
    setError('');
    try {
      const res = await API.get('/backup/generate');
      setMessage(res.data.message + ' (Path: ' + res.data.folderPath + ')');
    } catch (err) {
      setError('Backup generate karne mein error aa gaya!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Database Local Backup Management</h2>
      <p>Yahan se aap ek click par apne saare products, sales, aur purchases ka CSV backup apne local computer par download kar sakte hain.</p>
      
      {message && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', marginBottom: '15px' }}>{message}</div>}
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '15px' }}>{error}</div>}

      <button onClick={handleDownloadBackup} style={{ padding: '12px 20px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px' }}>
        Generate & Save CSV Backup
      </button>
    </div>
  );
};

export default Backups;