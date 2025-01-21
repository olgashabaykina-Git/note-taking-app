import React, { useState, useEffect, useCallback } from 'react'; 
import { getNotes, updateNote } from '../api'; 
import { useNavigate, useParams } from 'react-router-dom'; 
import '../noteStyles.css'; 

function EditNote() {
  const { id } = useParams(); // Get note ID from route parameters
  const navigate = useNavigate(); // Initialize navigation
  const [note, setNote] = useState({ title: '', content: '', category: '' }); // State for storing note data
  const [image, setImage] = useState(null); // State for the selected image
  const [message, setMessage] = useState(''); // State for error or success messages

  // Function to get the current note
  const fetchNote = useCallback(async () => {
    const notes = (await getNotes()) || []; // Geting a list of all notes
    const currentNote = notes.find((n) => n._id === id); // Search for a note by ID
    if (currentNote) setNote(currentNote); // Set these notes to state
  }, [id]);

  // Loading note data when mounting the component
  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  // File change handler
  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Save the selected file in the state
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Preventing page reloading

    // Forming data for sending
    const formData = new FormData();
    formData.append('title', note.title); // Adding a title
    formData.append('content', note.content); // Adding content
    formData.append('category', note.category); // Adding a category
    if (image) {
      formData.append('image', image); // If the image is selected, adding it
    }

    try {
      await updateNote(id, formData); // Updating a note via API
      setMessage('Note updated successfully'); // Setting a message about a successful update
      // Navigation after update
      if (process.env.NODE_ENV === 'test') {
        navigate('/home'); // For the test environment, go straight to it
      } else {
        setTimeout(() => navigate('/home'), 3000); // In other environments, waiting 3 seconds before moving.
      }
    } catch (err) {
      console.error('Error updating note:', err.message); 
      setMessage('Error updating note'); 
    }
  };

  // Home Page Return Handler
  const handleBackToHome = () => {
    navigate('/home'); // Going to the main page
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-heading">Edit Note</h2>
        {/* Display a success or error message */}
        {message && (
          <p className={`auth-message ${message.includes('Error') ? 'error' : ''}`}>
            {message}
          </p>
        )}
        {/* Title input field */}
        <input
          type="text"
          className="auth-input"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })} // Update the title in the state
          placeholder="Title"
        />
        {/* Update the title of the article */}
        <textarea
          className="auth-input"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })} // Updating the content in the state
          placeholder="Content"
        />
        {/* Category input field */}
        <input
          type="text"
          className="auth-input"
          value={note.category}
          onChange={(e) => setNote({ ...note, category: e.target.value })} // Updating the category in the state
          placeholder="Category"
        />
        {/* File upload field */}
        <input
          type="file"
          className="auth-input"
          data-testid="file-input"
          onChange={handleFileChange} // Update the file in the state
        />
        {/* Button to save changes */}
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

export { EditNote };
