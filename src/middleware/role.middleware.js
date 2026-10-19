// Admin-only access check karne ke liye middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Agar admin hai toh aage jane do
  } else {
    res.status(403).json({ message: 'Access denied: Admin only route' });
  }
};

module.exports = { adminOnly };