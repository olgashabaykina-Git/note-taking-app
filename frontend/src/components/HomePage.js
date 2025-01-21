import React, { useState, useEffect } from 'react';
import { getNotes, deleteNote } from '../api'; 
import { useNavigate } from 'react-router-dom'; 
import { 
  Button, Card, CardContent, CardActions, Typography, IconButton, 
  FormControl, InputLabel, Select, MenuItem, Modal, Box 
} from '@mui/material'; 
import { Edit, Delete, PhotoCamera } from '@mui/icons-material'; 
import '../App.css'; 

function HomePage() {
  const [notes, setNotes] = useState([]); // State for storing all notes
  const [filteredNotes, setFilteredNotes] = useState([]); // State for filtered notes
  const [category, setCategory] = useState(''); // State for the selected category
  const [open, setOpen] = useState(false); // State for opening/closing a modal window
  const [currentImage, setCurrentImage] = useState(''); // The state for the current image that is shown in the modal window.
  const navigate = useNavigate(); // Hook for redirecting user to other pages

  // Load all notes when mounting a component
  useEffect(() => {
    fetchNotes(); // Call the function to get the data
  }, []);

  // Function for getting notes
  const fetchNotes = async () => {
    const data = await getNotes(); // Getting data from API
    setNotes(data); // Set all notes to state
    setFilteredNotes(data); // Set up filtered notes (show all by default)
  };

  // Deleting a note
  const handleDelete = async (id) => {
    await deleteNote(id); // Calling the API to delete a note
    fetchNotes(); // Refreshing the list of notes after deletion
  };

  // Filter notes by category
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value; // Receive the selected category
    setCategory(selectedCategory); // Set the category to state

    if (selectedCategory) {
      // Filter notes by the selected category
      const filtered = notes.filter(note => note.category === selectedCategory);
      setFilteredNotes(filtered); // Updating filtered notes
    } else {
      setFilteredNotes(notes); // If no category is selected, show all notes
    }
  };

  // Opening a modal window with an image
  const handleOpenImage = (image) => {
    setCurrentImage(image); // Set the current picture
    setOpen(true); // Open a modal window
  };

  // Closing the modal window
  const handleCloseImage = () => setOpen(false);

  // Logging out a user
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  // Get unique categories for filtering
  const categories = [...new Set(notes.map(note => note.category))];

  return (
    <div className="page-container">
      <h2 className="heading">Notes</h2>

      {/* Dropdown list for filtering by categories */}
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          value={category} // Selected category
          onChange={handleCategoryChange} // Category change handler
          label="Category"
        >
          <MenuItem value="">
            <em>All</em> {/* Show "All" if no category is selected */}
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category} {/* Displaying unique categories */}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Button to add a new note */}
      <Button
        variant="contained"
        color="primary"
        className="add-note-button"
        onClick={() => navigate('/add')} // Go to the page for adding a note
      >
        Add Note
      </Button>

      {/* Logout button */}
      <Button
        variant="contained"
        color="secondary"
        className="logout-button"
        onClick={handleLogout} // Calling the logout handler
      >
        Log out
      </Button>

      {/* Displaying a list of notes */}
      <div className="notes-container">
        {filteredNotes.map((note) => (
          <Card key={note._id} sx={{ width: 300, marginBottom: '20px', borderRadius: '8px', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {note.title} {/* Displaying the note title */}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '8px' }}>
                {note.content} {/* Displaying the contents of the note */}
              </Typography>
              {note.image && (
                <div style={{ cursor: 'pointer' }}>
                  <img
                    src={note.image} // Path to image
                    alt="Note"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      marginBottom: '8px',
                    }}
                    onClick={() => handleOpenImage(note.image)} // Opening an image in a modal window
                  />
                  <IconButton color="primary" onClick={() => handleOpenImage(note.image)}>
                    <PhotoCamera /> {/* Icon for viewing image */}
                  </IconButton>
                </div>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <IconButton
                color="primary"
                onClick={() => navigate(`/edit/${note._id}`)} // Go to the note editing page
                title="Edit Note"
              >
                <Edit /> {/* Edit icon */}
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(note._id)} // Deleting a note
                title="Delete Note"
              >
                <Delete /> {/* Delete icon */}
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </div>

      {/* Modal window for viewing an image */}
      <Modal
        open={open} // Modal window state (open/closed)
        onClose={handleCloseImage} // Close the modal window
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 600, 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          padding: 2 
        }}>
          <img
            src={currentImage} // Path to current image
            alt="Full-Size Note"
            style={{ width: '100%', borderRadius: '8px' }} // Image styles
          />
        </Box>
      </Modal>
    </div>
  );
}

export default HomePage;
