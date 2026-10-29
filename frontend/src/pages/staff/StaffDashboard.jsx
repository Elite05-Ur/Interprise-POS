import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StaffSidebar from '../../components/StaffSidebar';
import MySales from './MySales';
import TillClosing from './TillClosing';
import API from '../../api';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [buyerInfo, setBuyerInfo] = useState('');
  const [amountReceived, setAmountReceived] = useState('');
  const [discountType, setDiscountType] = useState('fixed'); 
  const [discountValue, setDiscountValue] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      const activeProducts = res.data.filter(p => p.isActive !== false);
      setProducts(activeProducts);
    } catch (err) {
      setError('Products load karne mein masla ho gaya!');
    }
  };

  useEffect(() => {
    fetchProducts();

    const handleGlobalKeyDown = (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setIsModalOpen(true);
        setSelectedIndex(0);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const filteredProducts = products.filter(p => {
    const query = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(query) || p.salePrice.toString().includes(query) || p.category.toLowerCase().includes(query);
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const addToCart = (product) => {
    if (!product) return;
    const existingIndex = cart.findIndex(item => item._id === product._id);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { 
        ...product, 
        quantity: 1, 
        customSalePrice: product.salePrice,
        purchasePrice: product.purchasePrice || 0 
      }]);
    }
    setIsModalOpen(false);
    setSearchQuery('');
  };

  const handleModalKeyDown = (e) => {
    if (filteredProducts.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredProducts.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredProducts.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      addToCart(filteredProducts[selectedIndex]);
    }
  };

  const handleQuantityChange = (index, qty) => {
    const val = parseInt(qty);
    if (isNaN(val)) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = val;
    setCart(updatedCart);
  };

  const handlePriceChange = (index, price) => {
    const val = parseFloat(price) || 0;
    const updatedCart = [...cart];
    updatedCart[index].customSalePrice = val;
    setCart(updatedCart);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const subTotal = cart.reduce((acc, item) => acc + (item.customSalePrice * item.quantity), 0);
  
  let calculatedDiscount = 0;
  if (discountType === 'percentage') {
    calculatedDiscount = (subTotal * Number(discountValue)) / 100;
  } else {
    calculatedDiscount = Number(discountValue);
  }
  const grandTotal = Math.max(0, subTotal - calculatedDiscount);
  const changeDue = amountReceived ? Math.max(0, Number(amountReceived) - grandTotal) : 0;
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async () => {
    setMessage('');
    setError('');

    if (cart.length === 0) {
      setError('Cart khali hai!');
      return;
    }

    // YAHAN HACK LAGAYA HAI: Discount ko har item ki price mein proportionally divide kar diya
    // Agar bill 1320 ka hai aur grandTotal 1300 hai, toh ratio = 1300/1320
    const discountRatio = subTotal > 0 ? (grandTotal / subTotal) : 1;

    try {
      const payload = {
        items: cart.map(item => ({
          productId: item._id,
          quantity: Number(item.quantity),
          // Original price ki jagah adjusted price bhej rahe hain taake backend jab total banaye toh grandTotal hi bane
          salePrice: Number((item.customSalePrice * discountRatio).toFixed(2)),
        })),
        buyerInfo: buyerInfo || 'Walk-in Customer',
        discount: calculatedDiscount,
        subTotal: grandTotal,       
        totalAmount: grandTotal,    
        grandTotal: grandTotal,     
        amountReceived: Number(amountReceived) || 0,
        changeDue: changeDue
      };

      await API.post('/sales', payload);

      setMessage('Bill saved successfully!');
      setCart([]);
      setBuyerInfo('');
      setAmountReceived('');
      setDiscountValue(0);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Sale record karne mein error aa gaya!');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#f8fafc', fontFamily: '"Inter", system-ui, sans-serif' }}>
      
      {/* CSS add ki hai inputs se arrows (spinners) gayab karne ke liye */}
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <StaffSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Navbar />

        <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: '24px', boxSizing: 'border-box' }}>
          {activeTab === 'pos' && (
            <div style={{ maxWidth: '1400px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button 
                    onClick={() => { setIsModalOpen(true); setSelectedIndex(0); }} 
                    style={{ padding: '12px 24px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    Search Product (F1)
                  </button>
                  <input 
                    type="text" 
                    placeholder="Customer Name / Walk-in" 
                    value={buyerInfo} 
                    onChange={(e) => setBuyerInfo(e.target.value)} 
                    style={{ padding: '12px 14px', width: '260px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', background: '#ffffff', fontWeight: '500' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>POS Counter v1.0.0 Enterprise</span>
                </div>
              </div>

              {message && <div style={{ background: '#ecfdf5', color: '#059669', padding: '14px 20px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #a7f3d0', fontSize: '14px', fontWeight: '600' }}>{message}</div>}
              {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '14px 20px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #fecaca', fontSize: '14px', fontWeight: '600' }}>{error}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', flex: 1, minHeight: 0 }}>
                
                <div style={{ background: '#ffffff', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Current Bill Items</h3>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', background: '#f8fafc', padding: '4px 10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                      Total Units: {totalItemsCount}
                    </span>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          <th style={{ padding: '14px 16px', width: '45px', fontWeight: '600' }}>#</th>
                          <th style={{ padding: '14px 16px', fontWeight: '600' }}>Product Name</th>
                          <th style={{ padding: '14px 16px', fontWeight: '600' }}>Prices (Sale / Pur.)</th>
                          <th style={{ padding: '14px 16px', fontWeight: '600' }}>Qty (- for Return)</th>
                          <th style={{ padding: '14px 16px', fontWeight: '600' }}>Subtotal</th>
                          <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '600' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.length === 0 ? (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '50%' }}>
                                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                </div>
                                <span style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>Cart is Empty</span>
                                <span style={{ fontSize: '14px', color: '#94a3b8' }}>Press <kbd style={{background:'#e2e8f0', padding:'2px 6px', borderRadius:'4px'}}>F1</kbd> to search and add items.</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          cart.map((item, index) => (
                            <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              <td style={{ padding: '14px 16px', fontWeight: '600', color: '#64748b' }}>{index + 1}</td>
                              <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0f172a', minWidth: '180px', wordBreak: 'break-word' }}>{item.name}</td>
                              <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <input 
                                    type="number" 
                                    value={item.customSalePrice} 
                                    onChange={(e) => handlePriceChange(index, e.target.value)} 
                                    style={{ width: '80px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: '700', color: '#0ea5e9' }}
                                    title="Sale Price (Editable)"
                                  />
                                  <span style={{ fontSize: '11px', color: '#94a3b8' }} title="Purchase Price (Fixed)">Pur: {item.purchasePrice}</span>
                                </div>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <input 
                                  type="number" 
                                  value={item.quantity} 
                                  onChange={(e) => handleQuantityChange(index, e.target.value)} 
                                  style={{ width: '65px', padding: '6px 8px', borderRadius: '4px', border: item.quantity < 0 ? '1px solid #dc2626' : '1px solid #cbd5e1', outline: 'none', fontWeight: '700', color: item.quantity < 0 ? '#dc2626' : '#0f172a' }}
                                  title="Type quantity (use negative for returns e.g. -1)"
                                />
                              </td>
                              <td style={{ padding: '14px 16px', fontWeight: '800', color: item.customSalePrice * item.quantity < 0 ? '#dc2626' : '#0f172a' }}>
                                {(item.customSalePrice * item.quantity).toLocaleString()} PKR
                              </td>
                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                <button 
                                  onClick={() => removeFromCart(index)} 
                                  style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', width: '32px', height: '32px', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                                  title="Remove Item"
                                  onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                                  onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                  <div>
                    <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Billing & Checkout</h3>
                    
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Apply Discount</div>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <button 
                          onClick={() => setDiscountType('fixed')} 
                          style={{ flex: 1, padding: '5px', background: discountType === 'fixed' ? '#0f172a' : '#ffffff', color: discountType === 'fixed' ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          Fixed (PKR)
                        </button>
                        <button 
                          onClick={() => setDiscountType('percentage')} 
                          style={{ flex: 1, padding: '5px', background: discountType === 'percentage' ? '#0f172a' : '#ffffff', color: discountType === 'percentage' ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          Percentage (%)
                        </button>
                      </div>
                      <input 
                        type="number" 
                        placeholder={discountType === 'fixed' ? "Amount in PKR" : "Percentage %"} 
                        value={discountValue} 
                        onChange={(e) => setDiscountValue(e.target.value)}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>Amount Received</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 5000" 
                        value={amountReceived} 
                        onChange={(e) => setAmountReceived(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', fontWeight: '700', color: '#0f172a', boxSizing: 'border-box', background: '#f8fafc' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '13px' }}>
                        <span>Subtotal</span>
                        <span style={{ fontWeight: '600', color: '#0f172a' }}>{subTotal.toLocaleString()} PKR</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626', fontSize: '13px' }}>
                        <span>Discount</span>
                        <span style={{ fontWeight: '600' }}>{calculatedDiscount.toLocaleString()} PKR</span>
                      </div>
                      {amountReceived !== '' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontSize: '13px', background: '#ecfdf5', padding: '6px 10px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                          <span style={{ fontWeight: '700' }}>Change Return:</span>
                          <span style={{ fontWeight: '800' }}>{changeDue.toLocaleString()} PKR</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Grand Total:</span>
                      <span style={{ fontSize: '22px', fontWeight: '800', color: '#059669' }}>{grandTotal.toLocaleString()} PKR</span>
                    </div>

                    <button 
                      onClick={handleCheckout} 
                      disabled={cart.length === 0}
                      style={{ 
                        width: '100%', padding: '12px', 
                        background: cart.length === 0 ? '#94a3b8' : '#0f172a', 
                        color: 'white', border: 'none', borderRadius: '4px', 
                        cursor: cart.length === 0 ? 'not-allowed' : 'pointer', 
                        fontSize: '14px', fontWeight: '700',
                        boxShadow: cart.length === 0 ? 'none' : '0 4px 12px rgba(15, 23, 42, 0.2)',
                        transition: 'transform 0.1s, opacity 0.2s'
                      }}
                      onMouseEnter={e => { if (cart.length > 0) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { if (cart.length > 0) e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      Complete Sale & Print Bill
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'mysales' && <MySales />}
          {activeTab === 'till' && <TillClosing />}
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#ffffff', width: '650px', maxHeight: '75vh', borderRadius: '4px', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0' }} onKeyDown={handleModalKeyDown}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Quick Product Search</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}>✕</button>
            </div>

            <input 
              type="text" 
              placeholder="Type product name, category, or price..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              autoFocus
              style={{ padding: '12px 16px', width: '100%', marginBottom: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', boxSizing: 'border-box', background: '#f8fafc' }}
            />

            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: '4px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#475569', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Category</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Sale Price</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Koi product nahi mila!</td>
                    </tr>
                  ) : (
                    filteredProducts.map((p, idx) => (
                      <tr 
                        key={p._id} 
                        onClick={() => addToCart(p)}
                        style={{ 
                          borderBottom: '1px solid #f1f5f9', 
                          background: idx === selectedIndex ? '#fef08a' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.1s'
                        }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f172a' }}>{p.name}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{p.category}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0ea5e9' }}>{p.salePrice} PKR</td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>{p.stockQuantity}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>Use <kbd style={{background:'#e2e8f0', padding:'2px 4px', borderRadius:'2px'}}>↑</kbd> <kbd style={{background:'#e2e8f0', padding:'2px 4px', borderRadius:'2px'}}>↓</kbd> arrows to navigate</span>
              <span>Press <kbd style={{background:'#e2e8f0', padding:'2px 4px', borderRadius:'2px'}}>Enter</kbd> to add item</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;