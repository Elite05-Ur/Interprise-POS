import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import Products from './Products';
import AddStaff from './AddStaff';
import SalesHistory from './SalesHistory';
import ClosingReports from './ClosingReports';
import Backups from './Backups';
import API from '../../api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [closingReport, setClosingReport] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'closing') {
      fetchClosingReport();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'sales') {
      fetchSales();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const [salesRes, prodRes, closingRes] = await Promise.all([
        API.get('/sales'),
        API.get('/products'),
        API.get('/sales/closing-report'),
      ]);
      setSales(salesRes.data);
      setProducts(prodRes.data);
      setClosingReport(closingRes.data.report || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClosingReport = async () => {
    try {
      const res = await API.get('/sales/closing-report');
      setClosingReport(res.data.report);
    } catch (err) {
      console.error('Closing report error:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Products fetch error:', err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await API.get('/sales');
      setSales(res.data);
    } catch (err) {
      console.error('Sales fetch error:', err);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await API.get('/backup/generate');
      alert(res.data.message + ' (Path: ' + res.data.folderPath + ')');
    } catch (err) {
      alert('Backup generate karne mein error aa gaya!');
    }
  };

  // Updated Dashboard Metrics Calculations for Multi-Item Array Bills
  const activeSales = sales.filter(s => !s.isReturned);
  
  const totalRevenue = activeSales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const totalProfit = activeSales.reduce((acc, s) => acc + (s.totalProfit || 0), 0);
  
  // Total items sold across all items arrays inside bills
  const totalItemsSold = activeSales.reduce((acc, s) => {
    const billItemsQty = s.items ? s.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    return acc + billItemsQty;
  }, 0);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Admin Sidebar Integrated */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <div style={{ flex: 1, overflowY: 'auto', background: '#f4f7f6', padding: '20px' }}>
          {activeTab === 'dashboard' && (
            <div>
              <h2>Admin Dashboard - Business Overview</h2>
              <p>Yahan aapko dukan ki total sales, profit trends, aur staff performance ka mukammal overview milega.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h4>Total Revenue</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007BFF' }}>{totalRevenue} PKR</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h4>Total Net Profit</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'green' }}>{totalProfit} PKR</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h4>Total Products</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{products.length}</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h4>Total Items Sold</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#e83e8c' }}>{totalItemsSold}</p>
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <h3>Staff Performance Summary</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '10px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <thead>
                    <tr style={{ background: '#007BFF', color: 'white', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>Staff Name</th>
                      <th style={{ padding: '12px' }}>Total Bills</th>
                      <th style={{ padding: '12px' }}>Total Revenue</th>
                      <th style={{ padding: '12px' }}>Total Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closingReport.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>Koi report available nahi hai!</td>
                      </tr>
                    ) : (
                      closingReport.map((rep, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: '12px' }}>{rep.staffName}</td>
                          <td style={{ padding: '12px' }}>{rep.totalSalesCount}</td>
                          <td style={{ padding: '12px' }}>{rep.totalRevenue} PKR</td>
                          <td style={{ padding: '12px', color: 'green', fontWeight: 'bold' }}>{rep.totalProfit} PKR</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '30px' }}>
                <button onClick={handleDownloadBackup} style={{ padding: '12px 20px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '5px' }}>
                  📥 Download Local CSV Backup
                </button>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <Products products={products} fetchProducts={fetchDashboardData} />
          )}

          {activeTab === 'sales' && (
            <SalesHistory sales={sales} />
          )}

          {activeTab === 'staff' && (
            <AddStaff />
          )}

          {activeTab === 'closing' && (
            <ClosingReports closingReport={closingReport} />
          )}

          {activeTab === 'backup' && (
            <Backups onDownloadBackup={handleDownloadBackup} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;