import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import '../noteStyles.css'; 

function LoginPage() {
  const navigate = useNavigate(); // Initialize navigation
  const [email, setEmail] = useState(''); // State for storing user email
  const [password, setPassword] = useState(''); // State for storing user password
  const [error, setError] = useState(''); // state for displaying error messages
  const [loading, setLoading] = useState(false); // state to display the download status
  // Function for handling login
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password'); // If the fields are empty, set an error message
      return;
    }

    setError(''); // Clearing the previous error
    setLoading(true); // Set the download status

    try {
      // Sending a POST request for authentication
      const response = await fetch('http://localhost:5001/api/auth/login', { 
        method: 'POST', // Request Method
        headers: {
          'Content-Type': 'application/json', // Specify the data format in the request
        },
        body: JSON.stringify({ email, password }), // Pass the email and password in the request body
      });

      const data = await response.json(); // Parsing the response in JSON format

      if (response.ok) {
        // If login is successful
        localStorage.setItem('token', data.token); // Store the authentication token in localStorage
        navigate('/home'); // Redirect the user to the home page
      } else {
        // If the server returned an error
        setError(data.message || 'Invalid login credentials'); // Setting up an error message
      }
    } catch (err) {
      // If there is an error connecting to the server
      setError('Error connecting to the server'); // Setting up a connection error message
    } finally {
      setLoading(false); // Resetting the download status
    }
  };

  // Function to redirect to the registration page
  const handleRegister = () => {
    navigate('/register'); // Redirect the user to the registration page
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-heading">Login</h2>
        {/* Display an error message if there is one */}
        {error && <p className="auth-error">{error}</p>} 
        {/* Email input field */}
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email} // The value of email
          onChange={(e) => setEmail(e.target.value)} // Set email to state
        />
        {/* Password entry field */}
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password} // Password value
          onChange={(e) => setPassword(e.target.value)} // Set the password to the state
        />
        {/* Login button */}
        <button 
          className="auth-button primary" 
          onClick={handleLogin} 
          disabled={loading} // Disable the button during loading
        >
          {loading ? 'Logging in...' : 'Login'} {/* Change the button text depending on the loading status */}
        </button>
        {/* Button to go to the registration page */}
        <button className="auth-button secondary" onClick={handleRegister}>
          Back to Register
        </button>
      </div>
    </div>
  );
}

export default LoginPage; // Exporting the LoginPage component
