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
    <div style={{ padding: '20px' }}>
      <h2>End of Shift - Till Closing</h2>

      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>{error}</div>}

      {/* Direct Highlight Box showing total sales */}
      <div style={{ background: '#e2f0d9', border: '1px solid #c3e6cb', color: '#155724', padding: '20px', borderRadius: '8px', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        🚀 Bhai, aapne aaj total <span style={{ color: '#007BFF', fontSize: '22px' }}>{totalRevenue.toLocaleString()} PKR</span> ki sale kar di hai! 
        <div style={{ fontSize: '14px', marginTop: '5px', fontWeight: 'normal', color: '#333' }}>
          Total Bills Generated: {totalBillsCount} | Estimated Profit: {totalProfit.toLocaleString()} PKR
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '15px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Actual Cash in Drawer (PKR): </label>
          <input 
            type="number" 
            value={actualCash} 
            onChange={(e) => setActualCash(e.target.value)} 
            placeholder="Drawer mein mojood cash likhein..."
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
            required
          />
        </div>

        {/* Live Remaining / Difference Display */}
        {actualCash !== '' && (
          <div style={{ padding: '10px', background: remainingDifference === 0 ? '#d4edda' : remainingDifference > 0 ? '#cce5ff' : '#f8d7da', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold', color: remainingDifference === 0 ? '#155724' : remainingDifference > 0 ? '#004085' : '#721c24' }}>
            Remaining / Difference: {remainingDifference.toLocaleString()} PKR 
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 'normal', marginTop: '3px' }}>
              {remainingDifference === 0 ? '✅ Cash bilkul pura hai!' : remainingDifference > 0 ? '⚠️ Cash extra hai system se!' : '❌ Cash kam (short) hai!'}
            </span>
          </div>
        )}

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Notes / Reason (if any): </label>
          <input 
            type="text" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="e.g. Change ki kami thi" 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', borderRadius: '5px', fontSize: '16px' }}
        >
          {loading ? 'Submitting...' : 'Submit Till Closing'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '20px', maxWidth: '450px', padding: '15px', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>Closing Summary:</h4>
          <p style={{ margin: '5px 0' }}><strong>System Expected Cash:</strong> {result.summary.systemExpectedCash} PKR</p>
          <p style={{ margin: '5px 0' }}><strong>Actual Physical Cash:</strong> {result.summary.actualPhysicalCash} PKR</p>
          <p style={{ margin: '5px 0' }}><strong>Status:</strong> {result.summary.difference}</p>
        </div>
      )}
    </div>
  );
};

export default TillClosing; 