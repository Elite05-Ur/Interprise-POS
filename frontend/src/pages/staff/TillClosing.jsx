import { useState, useEffect } from 'react';
import API from '../../api';

const TillClosing = () => {
  const [sales, setSales] = useState([]);
  const [actualCash, setActualCash] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Aaj ki sales fetch karna taake live total sale screen par dikhe
  const fetchTillData = async () => {
    try {
      const res = await API.get('/sales');
      // Sirf active bills jo return nahi huwe
      const activeSales = res.data.filter(s => !s.isReturned);
      setSales(activeSales);
    } catch (err) {
      setError('Till data load karne mein error aa gaya!');
    }
  };

  useEffect(() => {
    fetchTillData();
  }, []);

  // Total Revenue & Profit Calculations from multi-item array bills (`totalAmount` & `totalProfit`)
  const totalRevenue = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const totalProfit = sales.reduce((acc, s) => acc + (s.totalProfit || 0), 0);
  const totalBillsCount = sales.length;

  // Live Remaining / Difference Calculation
  const cashEntered = parseFloat(actualCash) || 0;
  const remainingDifference = cashEntered - totalRevenue;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      setLoading(true);
      const res = await API.post('/till/close', {
        actualPhysicalCash: Number(actualCash),
        notes,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Till closing submit nahi ho saki!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: '"Inter", system-ui, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>End of Shift - Till Closing 💰</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Reconcile physical cash drawer with system sales records for shift settlement.</p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '14px 20px', marginBottom: '24px', borderRadius: '4px', border: '1px solid #fecaca', fontSize: '14px', fontWeight: '600' }}>
          {error}
        </div>
      )}

      {/* Direct Highlight Box showing total sales */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '20px 24px', borderRadius: '4px', marginBottom: '24px', maxWidth: '600px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
          🚀 Total Shift Revenue: <span style={{ color: '#0284c7', fontSize: '20px' }}>{totalRevenue.toLocaleString()} PKR</span>
        </div>
        <div style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>
          Total Bills Generated: <strong style={{ color: '#0f172a' }}>{totalBillsCount}</strong> | Estimated Profit: <strong style={{ color: '#059669' }}>{totalProfit.toLocaleString()} PKR</strong>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', background: '#ffffff', padding: '24px', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actual Cash in Drawer (PKR)</label>
          <input 
            type="number" 
            value={actualCash} 
            onChange={(e) => setActualCash(e.target.value)} 
            placeholder="Drawer mein mojood cash likhein..."
            style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', fontWeight: '600', background: '#f8fafc' }}
            required
          />
        </div>

        {/* Live Remaining / Difference Display */}
        {actualCash !== '' && (
          <div style={{ 
            padding: '14px 16px', 
            background: remainingDifference === 0 ? '#f0fdf4' : remainingDifference > 0 ? '#f0f9ff' : '#fef2f2', 
            borderRadius: '4px', 
            border: `1px solid ${remainingDifference === 0 ? '#bbf7d0' : remainingDifference > 0 ? '#bae6fd' : '#fecaca'}`,
            fontSize: '14px', 
            fontWeight: '700', 
            color: remainingDifference === 0 ? '#166534' : remainingDifference > 0 ? '#0369a1' : '#dc2626' 
          }}>
            Remaining / Difference: {remainingDifference.toLocaleString()} PKR 
            <span style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginTop: '4px' }}>
              {remainingDifference === 0 ? '✅ Cash bilkul pura hai!' : remainingDifference > 0 ? '⚠️ Cash extra hai system se!' : '❌ Cash kam (short) hai!'}
            </span>
          </div>
        )}

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notes / Reason (if any)</label>
          <input 
            type="text" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="e.g. Change ki kami thi" 
            style={{ width: '100%', padding: '10px 14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', background: '#f8fafc' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '14px', 
            background: loading ? '#94a3b8' : '#0f172a', 
            color: 'white', 
            border: 'none', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            fontWeight: '700', 
            borderRadius: '4px', 
            fontSize: '15px',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(15, 23, 42, 0.2)',
            transition: 'transform 0.1s'
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {loading ? 'Submitting...' : 'Submit Till Closing'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '24px', maxWidth: '600px', padding: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#166534' }}>Closing Summary</h4>
          <p style={{ margin: '6px 0', fontSize: '14px', color: '#334155' }}><strong>System Expected Cash:</strong> {result.summary.systemExpectedCash} PKR</p>
          <p style={{ margin: '6px 0', fontSize: '14px', color: '#334155' }}><strong>Actual Physical Cash:</strong> {result.summary.actualPhysicalCash} PKR</p>
          <p style={{ margin: '6px 0', fontSize: '14px', color: '#166534' }}><strong>Status:</strong> {result.summary.difference}</p>
        </div>
      )}
    </div>
  );
};

export default TillClosing;