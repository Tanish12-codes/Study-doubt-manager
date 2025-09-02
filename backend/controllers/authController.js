const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  // Debug: Log the entire request body
  console.log('Login request body:', req.body);

  const { username, password } = req.body;

  // Debug: Log the extracted values
  console.log('Extracted username:', username);
  console.log('Extracted password:', password);

  try {
    const user = await User.findOne({ username });
    // Debug: Log user search result
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    // Debug: Log password match result
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) return res.status(401).json({ message: 'Authentication failed' });

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser };
