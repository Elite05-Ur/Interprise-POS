import { useState, useEffect } from 'react';
import API from '../../api';

const MySales = () => {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState(null); // Modal ke liye selected bill
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
    <div style={{ padding: '20px' }}>
      <h2>My Sales History (Bills List)</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>Kisi bhi bill par click karke uske andar ke saare items dekh sakte hain.</p>
      
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>{error}</div>}

      {/* Search Bar for Bills */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by customer name, staff name, or total bill amount..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{ padding: '10px', width: '380px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '15px' }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ background: '#007BFF', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Bill ID / Date</th>
            <th style={{ padding: '12px' }}>Total Items Count</th>
            <th style={{ padding: '12px' }}>Total Bill Amount</th>
            <th style={{ padding: '12px' }}>Customer / Buyer</th>
            <th style={{ padding: '12px' }}>Cashier / Staff</th>
            <th style={{ padding: '12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#777' }}>
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
                <td style={{ padding: '12px' }}>{s.items?.length || 0} Products</td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: 'green' }}>{s.totalAmount} PKR</td>
                <td style={{ padding: '12px' }}>{s.buyerInfo || 'Walk-in Customer'}</td>
                <td style={{ padding: '12px' }}>{s.staff?.name || currentUser.name || 'Staff'}</td>
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
                <small style={{ color: '#666' }}>Customer: {selectedBill.buyerInfo} | Date: {new Date(selectedBill.createdAt).toLocaleString()}</small>
              </div>
              <button onClick={() => setSelectedBill(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '8px' }}>Product Name</th>
                    <th style={{ padding: '8px' }}>Quantity</th>
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
              <h3 style={{ margin: 0, color: 'green' }}>Grand Total: {selectedBill.totalAmount} PKR</h3>
              <button onClick={() => setSelectedBill(null)} style={{ padding: '8px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySales;