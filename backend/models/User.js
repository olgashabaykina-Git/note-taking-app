const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

// User scheme
const userSchema = new mongoose.Schema({
  email: {
    type: String, // Email field
    required: [true, 'Email is required'], 
    unique: true, 
    match: [
      /^\S+@\S+\.\S+$/, // Regular expression to check email validity
      'Please enter a valid email address', // Error message for invalid email
    ],
  },
  password: {
    type: String, // Password field
    required: [true, 'Password is required'], 
    minlength: [6, 'Password must be at least 6 characters long'], 
  },
}, { timestamps: true }); 

// Method to hash password before storing user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { // Checking if the password has been changed
    return next(); // If the password has not been changed, skip hashing
  }
  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next(); 
  } catch (err) {
    return next(err); 
  }
});

// Method for checking password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password); // Compare the entered password with the hash from the database
};

// Method for generating JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email }, // User data to include in the token
    process.env.JWT_SECRET, // Secret key for signing the token
    { expiresIn: '30d' } // Token validity: 30 days
  );
};

// Export user model
module.exports = mongoose.model('User', userSchema); 
