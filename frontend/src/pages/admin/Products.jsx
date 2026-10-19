import { useState, useEffect } from 'react';
import API from '../../api';

const Products = ({ products, fetchProducts }) => {
  const [localProducts, setLocalProducts] = useState(products || []);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', purchasePrice: '', salePrice: '', stockQuantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', category: '', purchasePrice: '', salePrice: '', stockQuantity: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Page load hotay hi ya component mount hotay hi products fetch karna
  const loadProducts = async () => {
    try {
      const res = await API.get('/products');
      setLocalProducts(res.data);
      if (fetchProducts) fetchProducts(); // Parent ko bhi sync rakhne ke liye
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
      loadProducts(); // List foran update karne ke liye
    } catch (err) {
      setError(err.response?.data?.message || 'Product add karne mein error aa gaya!');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Kya aap waqai is product ko delete karna chahte hain?')) return;
    try {
      await API.delete(`/products/${id}`);
      setMessage('Product successfully delete ho gaya!');
      loadProducts(); // List foran update karne ke liye
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
      loadProducts(); // List foran update karne ke liye
    } catch (err) {
      setError('Product update karne mein error aa gaya!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Products Management</h2>

      {message && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', marginBottom: '10px' }}>{message}</div>}
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleAddProduct} style={{ background: 'white', padding: '15px', marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Product Name" 
          value={newProduct.name} 
          onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
          required 
          style={{ padding: '8px' }} 
        />
        <input 
          type="text" 
          placeholder="Category" 
          value={newProduct.category} 
          onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
          required 
          style={{ padding: '8px' }} 
        />
        <input 
          type="number" 
          placeholder="Purchase Price" 
          value={newProduct.purchasePrice} 
          onChange={e => setNewProduct({...newProduct, purchasePrice: e.target.value})} 
          required 
          style={{ padding: '8px' }} 
        />
        <input 
          type="number" 
          placeholder="Sale Price" 
          value={newProduct.salePrice} 
          onChange={e => setNewProduct({...newProduct, salePrice: e.target.value})} 
          required 
          style={{ padding: '8px' }} 
        />
        <input 
          type="number" 
          placeholder="Stock Qty" 
          value={newProduct.stockQuantity} 
          onChange={e => setNewProduct({...newProduct, stockQuantity: e.target.value})} 
          required 
          style={{ padding: '8px' }} 
        />
        <button type="submit" style={{ background: '#007BFF', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>Add Product</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ background: '#007BFF', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Category</th>
            <th style={{ padding: '10px' }}>Purchase Price</th>
            <th style={{ padding: '10px' }}>Sale Price</th>
            <th style={{ padding: '10px' }}>Stock</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {localProducts.map(p => (
            <tr key={p._id} style={{ borderBottom: '1px solid #ddd' }}>
              {editingId === p._id ? (
                <>
                  <td style={{ padding: '10px' }}><input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                  <td style={{ padding: '10px' }}><input type="text" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} /></td>
                  <td style={{ padding: '10px' }}><input type="number" value={editForm.purchasePrice} onChange={e => setEditForm({...editForm, purchasePrice: e.target.value})} /></td>
                  <td style={{ padding: '10px' }}><input type="number" value={editForm.salePrice} onChange={e => setEditForm({...editForm, salePrice: e.target.value})} /></td>
                  <td style={{ padding: '10px' }}><input type="number" value={editForm.stockQuantity} onChange={e => setEditForm({...editForm, stockQuantity: e.target.value})} /></td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => handleUpdateProduct(p._id)} style={{ background: 'green', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ background: 'gray', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ padding: '10px' }}>{p.name}</td>
                  <td style={{ padding: '10px' }}>{p.category}</td>
                  <td style={{ padding: '10px' }}>{p.purchasePrice} PKR</td>
                  <td style={{ padding: '10px' }}>{p.salePrice} PKR</td>
                  <td style={{ padding: '10px' }}>{p.stockQuantity}</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => startEdit(p)} style={{ background: '#ffc107', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteProduct(p._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;