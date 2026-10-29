import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
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

  // Metrics Calculations
  const activeSales = sales.filter(s => !s.isReturned);
  const totalRevenue = activeSales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const totalProfit = activeSales.reduce((acc, s) => acc + (s.totalProfit || 0), 0);
  const totalItemsSold = activeSales.reduce((acc, s) => {
    const billItemsQty = s.items ? s.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    return acc + billItemsQty;
  }, 0);

  const completedSalesCount = activeSales.length;
  const returnedSalesCount = sales.filter(s => s.isReturned).length;
  const totalTransactions = sales.length || 1;
  const completedPercentage = Math.round((completedSalesCount / totalTransactions) * 100);

  // Dynamic Chart Data Generation
  const chartData = sales.slice(-15).map((sale, index) => ({
    name: `T-${index + 1}`,
    Revenue: sale.totalAmount || 0,
    Profit: sale.totalProfit || 0,
  }));

  const pieChartData = [
    { name: 'Completed', value: completedSalesCount, color: '#06b6d4' }, // Modern Cyan
    { name: 'Returned', value: returnedSalesCount, color: '#8b5cf6' }, // Modern Purple
    { name: 'Pending', value: 0, color: '#f59e0b' } // Orange filler
  ];

  // Reusable card styling base
  const getCardStyle = (bgColor, borderColor) => ({
    background: bgColor,
    padding: '24px',
    borderRadius: '4px',
    border: `1px solid ${borderColor}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  });

  return (
    // Outer Container (Fixes Double Scrollbar by preventing body scroll)
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: '"Inter", system-ui, sans-serif', background: '#ffffff', margin: 0 }}>
      
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#ffffff' }}>
        <Navbar />

        {/* Scrollable Main Area */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '32px', boxSizing: 'border-box' }}>
          {activeTab === 'dashboard' && (
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              
              {/* Header */}
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Sales Overview 🚀</h1>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Here's what happening in your store today.</p>
                </div>
                <button 
                  onClick={handleDownloadBackup} 
                  style={{ 
                    padding: '10px 20px', background: '#0f172a', color: '#ffffff', border: 'none', 
                    borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)', display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Backup Data
                </button>
              </div>

              {/* Grid Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
                
                {/* Left Column: Modern Tinted Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Revenue Card - Soft Orange Tint */}
                  <div style={getCardStyle('#fffbeb', '#fef3c7')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ padding: '10px', background: '#fef3c7', color: '#d97706', borderRadius: '4px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>${totalRevenue.toLocaleString()}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>Total Revenue</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px', fontSize: '13px', color: '#10b981', fontWeight: '600' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                      +10.5% <span style={{ color: '#94a3b8', fontWeight: '500' }}>From Last Day</span>
                    </div>
                  </div>

                  {/* Profit Card - Soft Purple Tint */}
                  <div style={getCardStyle('#faf5ff', '#f3e8ff')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ padding: '10px', background: '#f3e8ff', color: '#9333ea', borderRadius: '4px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>${totalProfit.toLocaleString()}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>Net Profit</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px', fontSize: '13px', color: '#10b981', fontWeight: '600' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                      +8.2% <span style={{ color: '#94a3b8', fontWeight: '500' }}>From Last Day</span>
                    </div>
                  </div>

                  {/* Items Card - Soft Cyan Tint */}
                  <div style={getCardStyle('#ecfeff', '#cffafe')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ padding: '10px', background: '#cffafe', color: '#0891b2', borderRadius: '4px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>{totalItemsSold}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>Items Sold</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px', fontSize: '13px', color: '#10b981', fontWeight: '600' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                      +12.4% <span style={{ color: '#94a3b8', fontWeight: '500' }}>From Last Day</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Modern Charts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Modern Area Chart */}
                  <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '4px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '360px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>Orders Overview</h3>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: '600' }}>
                        <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{width: 8, height: 8, borderRadius: '50%', background: '#f59e0b'}}></div> Revenue</span>
                        <span style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6'}}></div> Profit</span>
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPro" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: '#ffffff' }}
                          itemStyle={{ fontWeight: '600' }}
                        />
                        <Area type="monotone" dataKey="Revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="Profit" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPro)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Bottom Stats Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    
                    {/* Donut Chart Widget */}
                    <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '4px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '280px', display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>Transaction Ratio</h3>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                              {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>{completedPercentage}%</div>
                          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Completed</div>
                        </div>
                      </div>
                    </div>

                    {/* Catalog Summary Widget */}
                    <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '4px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                      <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>Quick Inventory Stats</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                            </div>
                            <span style={{ color: '#475569', fontSize: '14px', fontWeight: '600' }}>Total Products</span>
                          </div>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{products.length}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#ecfeff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <span style={{ color: '#475569', fontSize: '14px', fontWeight: '600' }}>Successful Bills</span>
                          </div>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{completedSalesCount}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#fef2f2', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3zM15 9l-6 6M9 9l6 6"/></svg>
                            </div>
                            <span style={{ color: '#475569', fontSize: '14px', fontWeight: '600' }}>Returned Bills</span>
                          </div>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{returnedSalesCount}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rendering Other Tabs */}
          {activeTab === 'products' && <Products products={products} fetchProducts={fetchDashboardData} />}
          {activeTab === 'sales' && <SalesHistory sales={sales} />}
          {activeTab === 'staff' && <AddStaff />}
          {activeTab === 'closing' && <ClosingReports closingReport={closingReport} />}
          {activeTab === 'backup' && <Backups onDownloadBackup={handleDownloadBackup} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;