import axios from 'axios';

const API = axios.create({
  baseURL: 'https://interprise-pos.onrender.com/api', // Apne backend ka port check kar lena (misal ke tor par 5000)
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