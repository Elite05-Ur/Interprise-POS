import { useState, useEffect } from 'react';
import API from '../../api';

const Products = ({ products, fetchProducts }) => {
  const [localProducts, setLocalProducts] = useState(products || []);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', purchasePrice: '', salePrice: '', stockQuantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', category: '', purchasePrice: '', salePrice: '', stockQuantity: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      const res = await API.get('/products');
      setLocalProducts(res.data);
      if (fetchProducts) fetchProducts();
    } catch (err) {
      setError('Products load karne mein error aa gaya!');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = {
        name: newProduct.name,
        category: newProduct.category,
        purchasePrice: Number(newProduct.purchasePrice),
        salePrice: Number(newProduct.salePrice),
        stockQuantity: Number(newProduct.stockQuantity),
      };

      await API.post('/products', payload);
      setMessage('Product successfully add ho gaya!');
      setNewProduct({ name: '', category: '', purchasePrice: '', salePrice: '', stockQuantity: '' });
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Product add karne mein error aa gaya!');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Kya aap waqai is product ko delete karna chahte hain?')) return;
    try {
      await API.delete(`/products/${id}`);
      setMessage('Product successfully delete ho gaya!');
      loadProducts();
    } catch (err) {
      setError('Product delete karne mein error aa gaya!');
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditForm({
      name: p.name || '',
      category: p.category || '',
      purchasePrice: p.purchasePrice !== undefined ? p.purchasePrice : '',
      salePrice: p.salePrice !== undefined ? p.salePrice : '',
      stockQuantity: p.stockQuantity !== undefined ? p.stockQuantity : '',
    });
  };

  const handleUpdateProduct = async (id) => {
    try {
      const payload = {
        name: editForm.name,
        category: editForm.category,
        purchasePrice: Number(editForm.purchasePrice),
        salePrice: Number(editForm.salePrice),
        stockQuantity: Number(editForm.stockQuantity),
      };

      await API.put(`/products/${id}`, payload);
      setEditingId(null);
      setMessage('Product successfully update ho gaya!');
      loadProducts();
    } catch (err) {
      setError('Product update karne mein error aa gaya!');
    }
  };

  // Reusable input style for consistency
  const inputStyle = {
    padding: '10px 14px',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    background: '#f8fafc',
    color: '#0f172a',
    transition: 'border-color 0.2s, background 0.2s',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: '"Inter", system-ui, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Inventory Management 📦</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Add new stock items, update pricing, and monitor active store inventory.</p>
      </div>

      {/* Notifications / Messages */}
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

      {/* Add Product Form Card */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Add New Product</h3>
        <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 140px', gap: '16px', alignItems: 'end' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Product Name</label>
            <input type="text" placeholder="e.g. Wireless Mouse" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required style={inputStyle} onFocus={e => {e.target.style.borderColor = '#0ea5e9'; e.target.style.background = '#ffffff'}} onBlur={e => {e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'}} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Category</label>
            <input type="text" placeholder="e.g. Electronics" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required style={inputStyle} onFocus={e => {e.target.style.borderColor = '#0ea5e9'; e.target.style.background = '#ffffff'}} onBlur={e => {e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'}} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Purchase Price</label>
            <input type="number" placeholder="0.00" value={newProduct.purchasePrice} onChange={e => setNewProduct({...newProduct, purchasePrice: e.target.value})} required style={inputStyle} onFocus={e => {e.target.style.borderColor = '#0ea5e9'; e.target.style.background = '#ffffff'}} onBlur={e => {e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'}} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Sale Price</label>
            <input type="number" placeholder="0.00" value={newProduct.salePrice} onChange={e => setNewProduct({...newProduct, salePrice: e.target.value})} required style={inputStyle} onFocus={e => {e.target.style.borderColor = '#0ea5e9'; e.target.style.background = '#ffffff'}} onBlur={e => {e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'}} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Stock</label>
            <input type="number" placeholder="Qty" value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity: e.target.value})} required style={inputStyle} onFocus={e => {e.target.style.borderColor = '#0ea5e9'; e.target.style.background = '#ffffff'}} onBlur={e => {e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'}} />
          </div>

          <button 
            type="submit" 
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
              background: '#0f172a', color: 'white', border: 'none', padding: '10px 16px', height: '42px',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600', borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)', transition: 'transform 0.1s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Item
          </button>
        </form>
      </div>

      {/* Products Table Container */}
      <div style={{ background: '#ffffff', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Active Inventory List</h3>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', background: '#f8fafc', padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            Total Items: {localProducts.length}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Product Details</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Category</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Purchase</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Sale Price</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Stock Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {localProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '50%' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>No Products Found</span>
                      <span style={{ fontSize: '14px', color: '#94a3b8' }}>Use the form above to add your first product.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                localProducts.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {editingId === p._id ? (
                      <>
                        <td style={{ padding: '12px 24px' }}><input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{...inputStyle, padding: '8px 12px'}} /></td>
                        <td style={{ padding: '12px 24px' }}><input type="text" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} style={{...inputStyle, padding: '8px 12px'}} /></td>
                        <td style={{ padding: '12px 24px' }}><input type="number" value={editForm.purchasePrice} onChange={e => setEditForm({...editForm, purchasePrice: e.target.value})} style={{...inputStyle, padding: '8px 12px'}} /></td>
                        <td style={{ padding: '12px 24px' }}><input type="number" value={editForm.salePrice} onChange={e => setEditForm({...editForm, salePrice: e.target.value})} style={{...inputStyle, padding: '8px 12px'}} /></td>
                        <td style={{ padding: '12px 24px' }}><input type="number" value={editForm.stockQuantity} onChange={e => setEditForm({...editForm, stockQuantity: e.target.value})} style={{...inputStyle, padding: '8px 12px', width: '80px'}} /></td>
                        <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button onClick={() => handleUpdateProduct(p._id)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Save</button>
                            <button onClick={() => setEditingId(null)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '16px 24px', fontWeight: '600', color: '#0f172a' }}>{p.name}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{p.category}</span>
                        </td>
                        <td style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500' }}>PKR {p.purchasePrice?.toLocaleString()}</td>
                        <td style={{ padding: '16px 24px', color: '#0ea5e9', fontWeight: '700' }}>PKR {p.salePrice?.toLocaleString()}</td>
                        <td style={{ padding: '16px 24px' }}>
                          {p.stockQuantity < 5 ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef2f2', color: '#dc2626', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626' }}></div> Low: {p.stockQuantity}
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }}></div> Instock: {p.stockQuantity}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button 
                              onClick={() => startEdit(p)} 
                              style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                              onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p._id)} 
                              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Products;