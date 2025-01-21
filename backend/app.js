require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' }); 
const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const path = require('path'); 
const fs = require('fs'); 
const bodyParser = require('body-parser'); 
const bcrypt = require('bcryptjs'); 
const User = require('./models/User'); 
const noteRoutes = require('./routes/noteRoutes'); 
const authRoutes = require('./routes/authRoutes'); 

const app = express(); 

// Middleware for request processing
app.use(cors()); // Enable CORS for cross-domain requests
app.use(bodyParser.json()); // Using Body-Parser to process JSON requests
app.use(express.urlencoded({ extended: true })); // Processing form data (URL-encoded)

// Add a handler for the root route
app.get('/', (req, res) => {
    res.send('Welcome to the Note-Taking App API'); // Welcome message
});

// Check and create the uploads folder if it does not exist
const uploadsDir = path.join(__dirname, 'uploads'); // Path to uploads folder
if (!fs.existsSync(uploadsDir)) { // Check if the folder exists
    fs.mkdirSync(uploadsDir); // Create a folder if it does not exist
}

// Static access to files in the uploads folder
app.use('/uploads', express.static(uploadsDir)); // Allow access to files via /uploads

// Connecting routes for authorization and notes
app.use('/api/auth', authRoutes); // Adding routes for working with registration and authorization
app.use('/api/notes', noteRoutes); // Adding routes for working with notes

// Connecting to MongoDB
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // Using the  URL parser
            useUnifiedTopology: true, // Using a connection management mechanism
        });
        if (process.env.NODE_ENV !== 'test') { 
            console.log('MongoDB is connected');
        }
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message); 
        process.exit(1); 
    }
};

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).json({ message: 'Internal server error' }); 
});

// Starting the server
const startServer = () => {
    const PORT = process.env.PORT || 5001; // Specify the port to start the server 
    if (process.env.NODE_ENV !== 'test') { // Start the server if it is not a test environment
        app.listen(PORT, () => console.log(`The server is running on port${PORT}`));
    }
};

// Asynchronous initialization of connection to the database and server startup
(async () => {
    await connectToDatabase(); // Connecting to the database
    startServer(); // Launching the server
})();

module.exports = app; // Exporting the application for use in tests
