const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '7d',
  });
};

// 1. Register Controller (Naya User banane ke liye)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check karein ke user pehle se mojood toh nahi
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Password ko secure hash karna (bcrypt ke sath)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Naya user create karna
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'staff', // Default role staff hoga
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// 2. Login Controller (Login kar ke token lene ke liye)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email check karna
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Password match karna (bcrypt compare)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Response mein user details aur JWT token bhejna
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// 3. Get User Profile (Yeh route protect middleware ke baad chalega taake req.user mil sakay)
const getUserProfile = async (req, res) => {
  try {
    // req.user humein auth middleware se milta hai
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};