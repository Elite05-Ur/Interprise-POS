import { useState, useEffect } from 'react';
import API from '../../api';

const MySales = () => {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [error, setError] = useState('');

  // Logged-in user data from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  const fetchMySales = async () => {
    try {
      const res = await API.get('/sales');
      // Sirf active bills jo return nahi huwe
      const activeSales = res.data.filter(s => !s.isReturned);
      setSales(activeSales);
    } catch (err) {
      setError('Sales history load karne mein error aa gaya!');
    }
  };

  useEffect(() => {
    fetchMySales();
  }, []);

  // Filter bills based on search query (Buyer Info or Total Amount)
  const filteredSales = sales.filter(s => {
    const query = searchQuery.toLowerCase();
    const buyer = (s.buyerInfo || '').toLowerCase();
    const total = (s.totalAmount || 0).toString();
    const staffName = (s.staff?.name || '').toLowerCase();
    return buyer.includes(query) || total.includes(query) || staffName.includes(query);
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: '"Inter", system-ui, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Sales History 📜</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>View past bills, customer transactions, and inspect item-level details.</p>
      </div>
      
      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '14px 20px', marginBottom: '24px', borderRadius: '4px', border: '1px solid #fecaca', fontSize: '14px', fontWeight: '600' }}>
          {error}
        </div>
      )}

      {/* Search Bar & Stats Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search by customer name, staff name, or total amount..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{ padding: '10px 16px', width: '380px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', background: '#ffffff', fontWeight: '500' }}
        />
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', background: '#ffffff', padding: '8px 14px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
          Total Active Bills: {filteredSales.length}
        </span>
      </div>

      {/* Sales Table Container */}
      <div style={{ background: '#ffffff', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 20px', fontWeight: '600' }}>Bill ID / Date</th>
                <th style={{ padding: '16px 20px', fontWeight: '600' }}>Items Count</th>
                <th style={{ padding: '16px 20px', fontWeight: '600' }}>Total Amount</th>
                <th style={{ padding: '16px 20px', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '16px 20px', fontWeight: '600' }}>Cashier</th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '600' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: '#334155' }}>Koi bill nahi mila!</span>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>Completed sales transactions will appear here.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSales.map(s => (
                  <tr 
                    key={s._id} 
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} 
                    onClick={() => setSelectedBill(s)}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <strong style={{ color: '#0f172a' }}>#{s._id.slice(-6).toUpperCase()}</strong><br />
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{new Date(s.createdAt).toLocaleString()}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#475569' }}>{s.items?.length || 0} Products</td>
                    <td style={{ padding: '16px 20px', fontWeight: '800', color: '#059669' }}>{s.totalAmount?.toLocaleString()} PKR</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0f172a' }}>{s.buyerInfo || 'Walk-in Customer'}</td>
                    <td style={{ padding: '16px 20px', color: '#475569' }}>{s.staff?.name || currentUser.name || 'Staff'}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedBill(s); }}
                        style={{ background: '#f0f9ff', color: '#0ea5e9', border: '1px solid #bae6fd', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e0f2fe'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f0f9ff'}
                      >
                        🔍 View Items
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Details Modal */}
      {selectedBill && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#ffffff', width: '650px', maxHeight: '80vh', borderRadius: '4px', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Bill Details (#{selectedBill._id.slice(-6).toUpperCase()})</h3>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Customer: <strong style={{ color: '#0f172a' }}>{selectedBill.buyerInfo}</strong> | Date: {new Date(selectedBill.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setSelectedBill(null)} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', border: '1px solid #f1f5f9', borderRadius: '4px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#475569', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Product Name</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Quantity</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Sale Price</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f172a' }}>{item.name}</td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{item.quantity}</td>
                      <td style={{ padding: '12px 16px', color: '#0ea5e9', fontWeight: '600' }}>{item.salePrice?.toLocaleString()} PKR</td>
                      <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0f172a' }}>{(item.salePrice * item.quantity)?.toLocaleString()} PKR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#059669', fontWeight: '800' }}>Grand Total: {selectedBill.totalAmount?.toLocaleString()} PKR</h3>
              <button 
                onClick={() => setSelectedBill(null)} 
                style={{ padding: '10px 20px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySales;