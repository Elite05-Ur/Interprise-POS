const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  let token;

  // Check karein ke headers mein Bearer token mojood hai ya nahi
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token extract karna (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Token verify karna
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // User ko database se find kar ke req.user mein attach karna (password nikal kar)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Agle step ya controller par jane dena
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };