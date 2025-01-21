const express = require('express'); 
const bcrypt = require('bcryptjs'); 
const validator = require('validator'); 
const User = require('../models/User'); 
const router = express.Router(); 

// User registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body

  // Checking required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' }); 
  }

  // Email validation
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' }); 
  }

  // Checking password length
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' }); 
  }

  try {
    // Check if a user with such email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' }); 
    }

    // Create a user
    const user = await User.create({ email, password }); // Create a new user in the database
    console.log('User created:', user); 

    // Return a successful response
    res.status(201).json({
      message: 'User registered successfully', 
      id: user._id, // User ID
      email: user.email, // User email
    });
  } catch (err) {
    console.error('Error during registration:', err.message); 
    res.status(500).json({ message: 'Server error during registration' }); 
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body

  // Checking required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' }); 
  }

  try {
    // Find a user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' }); // If the user is not found, return an error
    }

    console.log('User found:', user.email); // Log the email of the found user
    console.log('Stored hash:', user.password); // Logging the password hash

    // Check if the entered password matches the hash in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', user.email); // Logging email when password does not match
      return res.status(400).json({ message: 'Invalid email or password' }); 
    }

    console.log('Password matched successfully for user:', user.email); 

    // Generate JWT token
    if (!user.generateToken) {
      console.error('generateToken method not implemented in User model'); 
      return res.status(500).json({ message: 'Token generation failed' }); 
    }

    const token = user.generateToken(); // Generate JWT token

    // Return a successful response
    res.status(200).json({
      message: 'Login successful', 
      token, 
      user: { id: user._id, email: user.email }, 
    });
  } catch (err) {
    console.error('Error during login:', err.message); 
    res.status(500).json({ message: 'Server error during login' }); 
  }
});

module.exports = router; // Exporting the router for use in other modules
