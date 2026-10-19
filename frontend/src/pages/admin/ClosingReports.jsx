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

  return (
    <div style={{ padding: '20px' }}>
      <h2>Staff-wise Closing Report (C1 vs C2 Breakdown)</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#007BFF', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Staff Name</th>
            <th style={{ padding: '10px' }}>Email</th>
            <th style={{ padding: '10px' }}>Total Bills</th>
            <th style={{ padding: '10px' }}>Total Revenue</th>
            <th style={{ padding: '10px' }}>Total Profit Generated</th>
          </tr>
        </thead>
        <tbody>
          {closingReport.map((rep, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{rep.staffName}</td>
              <td style={{ padding: '10px' }}>{rep.email}</td>
              <td style={{ padding: '10px' }}>{rep.totalSalesCount}</td>
              <td style={{ padding: '10px' }}>{rep.totalRevenue} PKR</td>
              <td style={{ padding: '10px', color: 'green', fontWeight: 'bold' }}>{rep.totalProfit} PKR</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClosingReports;