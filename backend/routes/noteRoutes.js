const express = require('express');
const multer = require('multer'); 
const path = require('path');
const fs = require('fs'); 
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController'); 

const router = express.Router(); 

// Create an uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads'); // Specify the path to the uploads folder
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir); // If the folder does not exist, create it
}

// Setting up Multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => { // Specify the folder to save the files
        cb(null, uploadsDir); // Save files in the uploads folder
    },
    filename: (req, file, cb) => { // Setting up the file name
        cb(null, `${Date.now()}-${file.originalname}`); // File name: current date + original file name
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed file types
    if (allowedTypes.includes(file.mimetype)) { // If the file type is allowed
        cb(null, true); // Skipping the file
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false); // Rejecting the file
    }
};

const upload = multer({
    storage, // Specify storage settings
    fileFilter, // Specify the file type filter
    limits: { fileSize: 5 * 1024 * 1024 }, // Maximum file size: 5MB
});

// Routes
router.get('/', getNotes); // GET request to get all notes
router.post('/', upload.single('image'), createNote); // POST request to create a note (with the ability to upload an image)
router.put('/:id', upload.single('image'), updateNote); // PUT request to update a note (with the ability to upload an image)
router.delete('/:id', deleteNote); // DELETE request to delete a note by its ID

module.exports = router; // Exporting the router for use in other modules