const multer = require('multer'); 
const path = require('path'); 
const fs = require('fs'); 

// Check and create a folder for downloading files
const uploadDir = path.join(__dirname, '../uploads'); // Specify the path to the folder for storing downloaded files
if (!fs.existsSync(uploadDir)) { // Check if the folder exists
  fs.mkdirSync(uploadDir, { recursive: true }); // Create a folder if it does not exist
}

// Setting up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => { // specify the directory to save the files
    console.log('Uploading to directory:', uploadDir); // Logging the directory for downloading
    cb(null, uploadDir); // Pass the path to the folder to the callback
  },
  filename: (req, file, cb) => { // Setting up the file name
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // Create a unique suffix for the file
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Set the file name: unique suffix + original name
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed file types
  if (allowedTypes.includes(file.mimetype)) { // Checking the file type
    cb(null, true); // If the file type is allowed, skip the file
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false); // If the file type is prohibited, reject
  }
};

// Setting up Multer
const upload = multer({
  storage, // Specify storage for files
  limits: { fileSize: 5 * 1024 * 1024 }, // Set the maximum file size (5MB)
  fileFilter, // Specify a filter to check the file type
});

// Middleware for file uploads
const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => { // Using Multer to process a single file named "image"
    if (err instanceof multer.MulterError) { 
      console.error('Multer error:', err.message);
      return res.status(400).json({ message: `Multer error: ${err.message}` }); 
    } else if (err) { 
      console.error('Other error:', err.message); 
      return res.status(400).json({ message: `Error: ${err.message}` }); 
    }
    console.log('File uploaded successfully:', req.file); 
    next(); 
  });
};

module.exports = uploadMiddleware; // export middleware for use in other modules
