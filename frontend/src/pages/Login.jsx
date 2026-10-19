import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage('Email aur password dono dena lazmi hain!');
      return;
    }

    try {
      setLoading(true);
      const response = await API.post('/auth/login', { email, password });
      
      console.log("Login Response Data:", response.data); // F12 console mein check karne ke liye

      // Backend response ke mutabiq token aur user data save karna
      const token = response.data.token;
      const user = response.data.user || response.data; // Agar user object ke andar ho ya direct ho

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Role check karna
      const userRole = user.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'staff') {
        navigate('/staff');
      } else {
        setErrorMessage('User ka role define nahi hai!');
      }

    } catch (error) {
      console.error("Login Error:", error);
      const msg = error.response?.data?.message || 'Login fail ho gaya, dobara koshish karein!';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      <h2>POS System Login</h2>
      
      {errorMessage && (
        <div style={{ background: '#ffdddd', color: '#d8000c', padding: '10px', marginBottom: '15px', border: '1px solid #d8000c' }}>
          <strong>Error: </strong> {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Email: </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>Password: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;