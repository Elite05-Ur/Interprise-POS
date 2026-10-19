const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// 1. Saare users fetch karne ka function
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Password hide karke baki data bhejna
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// 2. User Update karne ka function
const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User nahi mila!' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    // Agar naya password diya hai toh usay hash karke update karna
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User successfully update ho gaya!',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// 3. User delete karne ka function
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User successfully delete ho gaya!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};