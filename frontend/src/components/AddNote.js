import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { createNote } from '../api'; 
import '../noteStyles.css'; 

function AddNote() {
  const navigate = useNavigate(); // Initialize navigation
  const [title, setTitle] = useState(''); // State for note title
  const [content, setContent] = useState(''); // State for note content
  const [category, setCategory] = useState(''); // State for category notes
  const [image, setImage] = useState(null); // State for image
  const [message, setMessage] = useState(''); // State for messages (success/error)

  // File change handler
  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Save the selected file to the state
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Preventing page reloading

    // Checking if required fields are filled in
    if (!title || !content) {
      setMessage('Title is required'); // Note that the title is required.
      return;
    }

    // Create a FormData object to send data
    const formData = new FormData();
    formData.append('title', title); // Adding a title
    formData.append('content', content); // Adding content
    formData.append('category', category); // Adding a category
    if (image) {
      formData.append('image', image); // If the image is selected, adding it
    }

    try {
      // Sending data to the server
      await createNote(formData);
      setMessage('Note added successfully'); // Reporting that the note has been successfully added.

      // Depending on the environment, go to the "Home" page
      if (process.env.NODE_ENV === 'test') {
        navigate('/home'); // In the test environment go straight away
      } else {
        setTimeout(() => navigate('/home'), 3000); // In other cases, waiting 3 seconds
      }
    } catch (err) {
      console.error('Error adding note:', err.message); 
      setMessage('Error adding note'); 
    }
  };

  // Home Page Return Handler
  const handleBackToHome = () => {
    navigate('/home'); // Going to the "Home" page
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-heading">Add Note</h2>
        {/* Output message (success or error) */}
        {message && (
          <p className={`auth-message ${message.includes('Error') ? 'error' : ''}`}>
            {message}
          </p>
        )}
        {/* Title input field */}
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Updating the title state
        />
        {/* Content input field */}
        <textarea
          placeholder="Content"
          className="auth-input"
          value={content}
          onChange={(e) => setContent(e.target.value)} // Updating the content state
        />
        {/* Category input field */}
        <input
          type="text"
          placeholder="Category"
          className="auth-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)} // Update category state
        />
        {/* File upload field */}
        <input
          type="file"
          className="auth-input"
          data-testid="file-input"
          onChange={handleFileChange} // Updating the image state
        />
        {/* Button to save a note */}
        <button className="auth-button primary" onClick={handleSubmit}>
          Save
        </button>
        {/* Button to return to the main page */}
        <button className="auth-button secondary" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export { AddNote };
