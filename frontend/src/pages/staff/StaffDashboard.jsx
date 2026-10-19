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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Products fetch karna
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

  // Filter products based on search query
  const filteredProducts = products.filter(p => {
    const query = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(query) || p.salePrice.toString().includes(query) || p.category.toLowerCase().includes(query);
  });

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Add product to cart
  const addToCart = (product) => {
    if (!product) return;
    const existingIndex = cart.findIndex(item => item._id === product._id);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1, customSalePrice: product.salePrice }]);
    }
    setIsModalOpen(false);
    setSearchQuery('');
  };

  // Keyboard navigation inside search modal
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
    const val = parseInt(qty) || 1;
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

  const grandTotal = cart.reduce((acc, item) => acc + (item.customSalePrice * item.quantity), 0);

  // Updated Checkout sending cart as an items array
  const handleCheckout = async () => {
    setMessage('');
    setError('');

    if (cart.length === 0) {
      setError('Cart khali hai!');
      return;
    }

    try {
      const payload = {
        items: cart.map(item => ({
          productId: item._id,
          quantity: Number(item.quantity),
          salePrice: Number(item.customSalePrice),
        })),
        buyerInfo: buyerInfo || 'Walk-in Customer',
      };

      await API.post('/sales', payload);

      setMessage('Bill successfully generate aur save ho gaya!');
      setCart([]);
      setBuyerInfo('');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Sale record karne mein error aa gaya!');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <StaffSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <div style={{ flex: 1, overflowY: 'auto', background: '#f4f7f6', padding: '20px' }}>
          {activeTab === 'pos' && (
            <div style={{ display: 'flex', gap: '20px', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ flex: 2, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                <h2>POS Billing Counter</h2>

                {message && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>{message}</div>}
                {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>{error}</div>}

                <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    onClick={() => { setIsModalOpen(true); setSelectedIndex(0); }} 
                    style={{ padding: '10px 20px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}
                  >
                    🔍 Search Product (Press F1)
                  </button>

                  <input 
                    type="text" 
                    placeholder="Buyer Info / Customer Name" 
                    value={buyerInfo} 
                    onChange={(e) => setBuyerInfo(e.target.value)} 
                    style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Product</th>
                        <th style={{ padding: '10px' }}>Sale Price (PKR)</th>
                        <th style={{ padding: '10px' }}>Quantity</th>
                        <th style={{ padding: '10px' }}>Subtotal</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                            Cart khali hai. F1 dabakar product search karein.
                          </td>
                        </tr>
                      ) : (
                        cart.map((item, index) => (
                          <tr key={item._id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}><strong>{item.name}</strong></td>
                            <td style={{ padding: '10px' }}>
                              <input 
                                type="number" 
                                value={item.customSalePrice} 
                                onChange={(e) => handlePriceChange(index, e.target.value)} 
                                style={{ width: '80px', padding: '5px' }}
                              />
                            </td>
                            <td style={{ padding: '10px' }}>
                              <input 
                                type="number" 
                                min="1" 
                                value={item.quantity} 
                                onChange={(e) => handleQuantityChange(index, e.target.value)} 
                                style={{ width: '60px', padding: '5px' }}
                              />
                            </td>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.customSalePrice * item.quantity} PKR</td>
                            <td style={{ padding: '10px' }}>
                              <button onClick={() => removeFromCart(index)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>❌</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
                  <h3>Grand Total: <span style={{ color: 'green' }}>{grandTotal} PKR</span></h3>
                  <button 
                    onClick={handleCheckout} 
                    disabled={cart.length === 0}
                    style={{ padding: '12px 25px', background: cart.length === 0 ? '#6c757d' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: cart.length === 0 ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                  >
                    Complete Sale & Print Bill
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mysales' && <MySales />}
          {activeTab === 'till' && <TillClosing />}
        </div>
      </div>

      {/* Search Modal with Arrow Keys Navigation */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '600px', maxHeight: '80vh', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} onKeyDown={handleModalKeyDown}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Select Product (Use Up/Down Arrow & Enter)</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✖</button>
            </div>

            <input 
              type="text" 
              placeholder="Type product name or price..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              autoFocus
              style={{ padding: '10px', width: '100%', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' }}
            />

            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f1f1f1', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Name</th>
                    <th style={{ padding: '8px' }}>Category</th>
                    <th style={{ padding: '8px' }}>Sale Price</th>
                    <th style={{ padding: '8px' }}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>Koi product nahi mila!</td>
                    </tr>
                  ) : (
                    filteredProducts.map((p, idx) => (
                      <tr 
                        key={p._id} 
                        onClick={() => addToCart(p)}
                        style={{ 
                          borderBottom: '1px solid #eee', 
                          background: idx === selectedIndex ? '#e2f0d9' : 'transparent',
                          cursor: 'pointer' 
                        }}
                      >
                        <td style={{ padding: '8px' }}>{p.name}</td>
                        <td style={{ padding: '8px' }}>{p.category}</td>
                        <td style={{ padding: '8px', fontWeight: 'bold', color: '#007BFF' }}>{p.salePrice} PKR</td>
                        <td style={{ padding: '8px' }}>{p.stockQuantity}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;