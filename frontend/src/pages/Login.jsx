import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      
      const token = response.data.token;
      const user = response.data.user || response.data; 

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

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

  const fillAdmin = () => {
    setEmail('omaan@gmail.com');
    setPassword('omaan');
  };

  const fillStaff = () => {
    setEmail('adan@gmail.com');
    setPassword('adan');
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={{ ...styles.heroSection, opacity: isVisible ? 1 : 0 }}>
        
        {/* Header Titles */}
        <h3 style={styles.subHeading}>Code Crafte POS</h3>
        <h1 style={styles.mainHeading}>Welcome Back</h1>

        {/* Error Message */}
        {errorMessage && (
          <div style={styles.errorBox}>
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={styles.formContainer}>
          
          <div style={styles.inputWrapper}>
            <span style={styles.icon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
            <input 
              type="email" 
              placeholder="Email address"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input}
            />
          </div>

          <div style={styles.inputWrapper}>
            <span style={styles.icon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? '...' : 'Login'}
          </button>
          
        </form>

        {/* Demo Auto-fill Buttons */}
        <div style={styles.demoButtonsContainer}>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#e0e0e0' }}>Demo Logins:</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button type="button" onClick={fillAdmin} style={styles.demoBtn}>
              Fill Admin
            </button>
            <button type="button" onClick={fillStaff} style={styles.demoBtn}>
              Fill Staff
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- CSS Styles (Compact & Balanced) ---
const styles = {
  pageWrapper: {
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    overflowX: 'hidden',
  },
  heroSection: {
    background: `
      linear-gradient(135deg, rgba(14, 82, 218, 0.88) 0%, rgba(106, 43, 226, 0.88) 100%),
      url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '420px', // Thoda kam kiya height taake lamba na lage
    padding: '60px 20px', // Extra padding reduce ki
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    clipPath: 'ellipse(150% 100% at 50% 0%)',
    color: '#ffffff',
    transition: 'opacity 1.5s ease-in-out',
  },
  subHeading: {
    fontSize: '1.25rem',
    fontWeight: '500',
    margin: '0 0 4px 0',
    letterSpacing: '0.5px',
    opacity: 0.9,
  },
  mainHeading: {
    fontSize: '3rem', // Font size chota kiya balanced look ke liye
    fontWeight: '700',
    margin: '0 0 25px 0', // Spacing reduce ki
    letterSpacing: '-0.02em',
    textAlign: 'center',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: '12px', // Gap kam kiya
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '800px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '14px',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    padding: '10px 16px 10px 42px', // Padding thodi compact ki
    borderRadius: '4px', // Strict 4px border-radius
    border: 'none',
    outline: 'none',
    width: '220px', // Width thodi choti ki
    fontSize: '0.95rem',
    color: '#333',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  submitBtn: {
    padding: '10px 32px',
    borderRadius: '4px', // Strict 4px border-radius
    border: 'none',
    backgroundColor: '#10b981', // Modern SaaS green
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'background-color 0.2s',
  },
  errorBox: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '0.9rem',
    fontWeight: '500',
    textAlign: 'center',
  },
  demoButtonsContainer: {
    marginTop: '25px', // Top margin kam ki
    textAlign: 'center',
  },
  demoBtn: {
    padding: '6px 16px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.6)',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  }
};

export default Login;