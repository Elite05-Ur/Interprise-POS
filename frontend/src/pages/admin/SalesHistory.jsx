import { useState, useEffect } from 'react';
import API from '../../api';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null); // Modal ke liye selected bill
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

  // Filter bills based on search query (Customer name, staff name, or total amount)
  const filteredSales = sales.filter(s => {
    const query = searchQuery.toLowerCase();
    const buyer = (s.buyerInfo || '').toLowerCase();
    const total = (s.totalAmount || 0).toString();
    const staffName = (s.staff?.name || '').toLowerCase();
    return buyer.includes(query) || total.includes(query) || staffName.includes(query);
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Sales History (Admin Panel)</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>Kisi bhi bill par click karke uske andar ke saare items aur profit ki details dekh sakte hain.</p>
      
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>{error}</div>}

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by customer name, staff name, or total amount..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{ padding: '10px', width: '380px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '15px' }}
        />
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ background: '#007BFF', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Bill ID / Date</th>
            <th style={{ padding: '12px' }}>Total Amount</th>
            <th style={{ padding: '12px' }}>Total Profit</th>
            <th style={{ padding: '12px' }}>Customer / Buyer</th>
            <th style={{ padding: '12px' }}>Cashier / Staff</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#777' }}>
                Koi bill nahi mila!
              </td>
            </tr>
          ) : (
            filteredSales.map(s => (
              <tr key={s._id} style={{ borderBottom: '1px solid #ddd', cursor: 'pointer' }} onClick={() => setSelectedBill(s)}>
                <td style={{ padding: '12px' }}>
                  <strong>#{s._id.slice(-6).toUpperCase()}</strong><br />
                  <small style={{ color: '#666' }}>{new Date(s.createdAt).toLocaleString()}</small>
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: 'green' }}>{s.totalAmount} PKR</td>
                <td style={{ padding: '12px', color: '#007BFF', fontWeight: 'bold' }}>{s.totalProfit} PKR</td>
                <td style={{ padding: '12px' }}>{s.buyerInfo || 'Walk-in Customer'}</td>
                <td style={{ padding: '12px' }}>{s.staff?.name || 'N/A'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: s.isReturned ? '#f8d7da' : '#d4edda', color: s.isReturned ? '#721c24' : '#155724', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    {s.isReturned ? 'Returned' : 'Completed'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedBill(s); }}
                    style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🔍 View Items
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal to view items array of a specific bill */}
      {selectedBill && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '650px', maxHeight: '80vh', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ margin: 0 }}>Bill Details (#{selectedBill._id.slice(-6).toUpperCase()})</h3>
                <small style={{ color: '#666' }}>Customer: {selectedBill.buyerInfo} | Cashier: {selectedBill.staff?.name || 'N/A'}</small>
              </div>
              <button onClick={() => setSelectedBill(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '8px' }}>Product Name</th>
                    <th style={{ padding: '8px' }}>Qty</th>
                    <th style={{ padding: '8px' }}>Sale Price</th>
                    <th style={{ padding: '8px' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}><strong>{item.name}</strong></td>
                      <td style={{ padding: '8px' }}>{item.quantity}</td>
                      <td style={{ padding: '8px' }}>{item.salePrice} PKR</td>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{item.salePrice * item.quantity} PKR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <div>
                <h4 style={{ margin: 0, color: 'green' }}>Total Amount: {selectedBill.totalAmount} PKR</h4>
                <small style={{ color: '#007BFF', fontWeight: 'bold' }}>Estimated Profit: {selectedBill.totalProfit} PKR</small>
              </div>
              <button onClick={() => setSelectedBill(null)} style={{ padding: '8px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;