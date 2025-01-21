import React from 'react'; // 
import { Card, CardContent, CardActions, Typography, IconButton } from '@mui/material'; 
import { Edit, Delete } from '@mui/icons-material'; 

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <Card
      // Card style settings using Material-UI sx
      sx={{
        backgroundColor: '#bbdefb', // Light blue card background
        borderRadius: '8px', // Rounded corners
        marginBottom: '16px', // Spaces between cards
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
        transition: 'transform 0.2s ease-in-out', 
        '&:hover': {
          transform: 'scale(1.02)', // Slightly enlarged card when hovered over
        },
      }}
    >
      <CardContent>
        {/* Displaying the note title */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
          {note.title}
        </Typography>
        {/* Displaying the contents of the note */}
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '8px' }}>
          {note.content}
        </Typography>
        {/* If the note has an image, display it */}
        {note.image && (
          <img
            src={note.image} // Link to image
            alt="Note" // Alternative text
            style={{
              width: '100%', // The image width is equal to the card width
              borderRadius: '8px', // Rounded corners
              maxHeight: '200px', // Maximum image height
              objectFit: 'cover', // The image is scaled while maintaining proportions.
              marginBottom: '8px', // Bottom indent
            }}
          />
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {/* Button to edit a note */}
        <IconButton
          color="primary" // Button color
          onClick={() => onEdit(note._id)} // Edit handler, called with note ID
          title="Edit Note" // Hover tooltip text
        >
          <Edit /> {/* Edit icon */}
        </IconButton>
        {/* Button to delete a note */}
        <IconButton
          color="error" // Button color
          onClick={() => onDelete(note._id)} // Delete handler, called with note ID
          title="Delete Note" // Hover tooltip text
        >
          <Delete /> {/* Delete icon */}
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default NoteCard; // Exporting the NoteCard component
