import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // Local Docker backend ke liye
});

// Request mein token automatically bhejne ke liye interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;