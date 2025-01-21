const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 
// User registration
const registerUser = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body

  // Checking required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' }); 
  }

  // Checking password length
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' }); 
  }

  try {
    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' }); 
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); 

    // Create a new user with email and hashed password
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save(); // Save the user in the database
    res.status(201).json({ message: 'User registered successfully' }); 
  } catch (err) {
    console.error('Error during registration:', err.message); 
    res.status(500).json({ message: 'Server error during registration' }); 
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body

  // Checking required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' }); // If email or password is not passed, return an error
  }

  try {
    // Check if a user with such email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password 3' }); // If the user is not found, return an error
    }

    // Check the correctness of the entered password
    const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the entered password with the password hash in the database
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password 4' }); // If the passwords do not match, return an error
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Token payload (user data)
      process.env.JWT_SECRET, // Secret key for signing the token
      { expiresIn: '1h' } // 
    );

    // Successful authorization
    res.status(200).json({
      message: 'Login successful', // Return a message about successful authorization
      token, // Token for authorization
      user: { id: user._id, email: user.email }, // User data
    });
  } catch (err) {
    console.error('Error during login:', err.message); 
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { registerUser, loginUser }; 
