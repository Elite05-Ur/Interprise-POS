import { useState, useEffect } from 'react';
import API from '../../api';

const ClosingReports = () => {
  const [closingReport, setClosingReport] = useState([]);
  const [error, setError] = useState('');

  const fetchClosingReport = async () => {
    try {
      const res = await API.get('/sales/closing-report');
      setClosingReport(res.data.report || []);
    } catch (err) {
      setError('Closing report load karne mein error aa gaya!');
    }
  };

  useEffect(() => {
    fetchClosingReport();
  }, []);

  // Calculate Grand Totals for the Summary Cards
  const grandTotalRevenue = closingReport.reduce((sum, rep) => sum + (rep.totalRevenue || 0), 0);
  const grandTotalProfit = closingReport.reduce((sum, rep) => sum + (rep.totalProfit || 0), 0);
  const grandTotalBills = closingReport.reduce((sum, rep) => sum + (rep.totalSalesCount || 0), 0);

  // Reusable card styling
  const summaryCardStyle = {
    background: '#ffffff',
    padding: '20px 24px',
    borderRadius: '4px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: '"Inter", system-ui, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Shift Closing Report 📊</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Analyze cashier-wise shift performance, revenue generation, and net profit contribution.</p>
      </div>
      
      {/* Error Message */}
      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '14px 20px', marginBottom: '24px', borderRadius: '4px', border: '1px solid #fecaca', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {error}
        </div>
      )}

      {/* Summary Metrics Cards (Added SaaS Feature) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Total Bills Card */}
        <div style={summaryCardStyle}>
          <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: '#f0f9ff', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Shift Bills</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{grandTotalBills}</div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div style={summaryCardStyle}>
          <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Gross Revenue</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>PKR {grandTotalRevenue.toLocaleString()}</div>
          </div>
        </div>

        {/* Total Profit Card */}
        <div style={summaryCardStyle}>
          <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Net Profit</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669' }}>PKR {grandTotalProfit.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Reports Table Container */}
      <div style={{ background: '#ffffff', borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Staff-wise Breakdown</h3>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', background: '#f8fafc', padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            Active Staff Records: {closingReport.length}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Staff Member</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Email Address</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Total Bills</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Revenue Generated</th>
                <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'right' }}>Profit Contribution</th>
              </tr>
            </thead>
            <tbody>
              {closingReport.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '50%' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>No Closing Data Available</span>
                      <span style={{ fontSize: '14px', color: '#94a3b8' }}>Shift data will appear here once sales transactions are recorded.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                closingReport.map((rep, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#475569' }}>
                          {(rep.staffName || '?').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{rep.staffName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#475569', fontWeight: '500' }}>{rep.email || 'N/A'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ background: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: '600' }}>
                        {rep.totalSalesCount} Bills
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#0f172a', fontWeight: '700' }}>PKR {rep.totalRevenue?.toLocaleString()}</td>
                    <td style={{ padding: '16px 24px', color: '#059669', fontWeight: '700', textAlign: 'right' }}>PKR {rep.totalProfit?.toLocaleString()}</td>
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

export default ClosingReports;