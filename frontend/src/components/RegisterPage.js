import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../noteStyles.css';

function RegisterPage() {
  const navigate = useNavigate(); // Hook for navigation between pages
  const [email, setEmail] = useState(''); // State for storing email
  const [password, setPassword] = useState(''); // State for storing password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for password confirmation
  const [error, setError] = useState(''); // State for displaying errors
  const [loading, setLoading] = useState(false); // State to display the loading process

  // Registration processing function
  const handleRegister = async () => {
    // Checking if all fields are filled
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Check for password matches
    if (password !== confirmPassword) {
      setError('The passwords do not match');
      return;
    }

    // Email validity check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setError(''); // Cleaning up errors
    setLoading(true); // Enable loading indicator

    try {
      // Sending data to the server
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type of the request
        },
        body: JSON.stringify({ email, password }), // Convert data to JSON format
      });

      const data = await response.json(); // Receiving a response from the server

      if (response.ok) {
        navigate('/login'); // Redirect to login page
      } else {
        setError(data.message || 'Error during registration'); // Display an error if there is one
      }
    } catch (err) {
      setError('Error connecting to server'); // Network Error Handling
    } finally {
      setLoading(false); // Disabling the loading indicator
    }
  };

  // Function to go to the login page
  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-heading">Registration</h2>
        {error && <p className="auth-error">{error}</p>} {/* Outputting an error message */}
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Email update in state
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password in state
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="auth-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} // Update password confirmation
        />
        <button
          className="auth-button primary"
          onClick={handleRegister} // Calling the registration function
          disabled={loading} // Lock button during loading
        >
          {loading ? 'Registration...' : 'Register'} {/* Change button text depending on loading state */}
        </button>
        <button className="auth-button secondary" onClick={handleBackToLogin}>
        Back to the entrance {/* Button to return to the login page */}
        </button>
      </div>
    </div>
  );
}

export default RegisterPage; // Exporting a component for use in other parts of the application
