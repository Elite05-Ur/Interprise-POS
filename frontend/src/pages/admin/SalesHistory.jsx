import { useState, useEffect } from 'react';
import API from '../../api';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const fetchSales = async () => {
    try {
      const res = await API.get('/sales');
      setSales(res.data);
    } catch (err) {
      setError('Sales history load karne mein error aa gaya!');
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Filter bills based on search query
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
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Transaction History 📑</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Monitor all completed bills, inspect item-wise breakdowns, and track cashier performance.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '14px 20px', marginBottom: '24px', borderRadius: '4px', border: '1px solid #fecaca', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {error}
        </div>
      )}

      {/* Search Bar Filter Card */}
      <div style={{ background: '#ffffff', padding: '16px 24px', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'border-color 0.2s' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          type="text" 
          placeholder="Search by customer name, staff name, or total amount..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{ flex: 1, padding: '4px 0', border: 'none', outline: 'none', fontSize: '15px', color: '#0f172a', background: 'transparent' }}
        />
        {searchQuery && (
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#0ea5e9', background: '#f0f9ff', padding: '4px 10px', borderRadius: '4px' }}>Filter Active</span>
        )}
      </div>
      
      {/* Sales Table Container */}
      <div style={{ background: '#ffffff', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Transactions Record</h3>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', background: '#f8fafc', padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            Showing: {filteredSales.length} Bills
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Bill ID / Date</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Total Amount</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Total Profit</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Cashier</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '50%' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>No Sales Records Found</span>
                      <span style={{ fontSize: '14px', color: '#94a3b8' }}>No bills match your current search criteria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSales.map(s => (
                  <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => setSelectedBill(s)} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px', letterSpacing: '0.5px' }}>#{s._id.slice(-6).toUpperCase()}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>{new Date(s.createdAt).toLocaleString()}</div>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: '700', color: '#0f172a' }}>PKR {s.totalAmount?.toLocaleString()}</td>
                    <td style={{ padding: '16px 24px', color: '#059669', fontWeight: '700' }}>PKR {s.totalProfit?.toLocaleString()}</td>
                    <td style={{ padding: '16px 24px', color: '#475569', fontWeight: '500' }}>{s.buyerInfo || 'Walk-in Customer'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                        {s.staff?.name || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: s.isReturned ? '#fef2f2' : '#ecfdf5', 
                        color: s.isReturned ? '#dc2626' : '#059669', 
                        padding: '4px 10px', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.isReturned ? '#dc2626' : '#059669' }}></div>
                        {s.isReturned ? 'Returned' : 'Completed'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedBill(s); }}
                        style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '6px', 
                          background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', 
                          padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', 
                          fontSize: '13px', fontWeight: '600', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path><path d="M21.9 12c-1.7-4.6-6-8-10.9-8S1.8 7.4.1 12c1.7 4.6 6 8 10.9 8s9.2-3.4 10.9-8Z"></path></svg>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Bill Details Modal */}
      {selectedBill && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#ffffff', width: '750px', maxHeight: '85vh', borderRadius: '4px', padding: '32px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Receipt #{selectedBill._id.slice(-6).toUpperCase()}</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                  <span>Customer: <strong style={{color: '#0f172a'}}>{selectedBill.buyerInfo || 'Walk-in'}</strong></span>
                  <span>Cashier: <strong style={{color: '#0f172a'}}>{selectedBill.staff?.name || 'N/A'}</strong></span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedBill(null)} 
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Modal Items Table */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Product Item</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Qty</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Unit Price</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{item.name}</td>
                      <td style={{ padding: '16px', color: '#475569', fontWeight: '500' }}>{item.quantity}</td>
                      <td style={{ padding: '16px', color: '#475569' }}>PKR {item.salePrice?.toLocaleString()}</td>
                      <td style={{ padding: '16px', fontWeight: '700', color: '#0f172a', textAlign: 'right' }}>PKR {(item.salePrice * item.quantity)?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '20px', borderRadius: '4px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Total Billed</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>PKR {selectedBill.totalAmount?.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Net Profit</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#059669' }}>PKR {selectedBill.totalProfit?.toLocaleString()}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedBill(null)} 
                style={{ padding: '10px 24px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'transform 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;