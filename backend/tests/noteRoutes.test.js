require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' }); 
const request = require('supertest'); 
const express = require('express'); 
const mongoose = require('mongoose'); 
const path = require('path'); 
const Note = require('../models/Note'); 
const noteRoutes = require('../routes/noteRoutes'); 
console.log('process.env.MONGO_URI', process.env.MONGO_URI); 

// Setting up the Express application
const app = express();
app.use(express.json()); // Adding middleware for JSON processing
app.use('/api/notes', noteRoutes); //Connecting routes for notes

jest.setTimeout(30000); 

// Connect to MongoDB before running all tests
beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI; // Getting the Database URI from Environment Variables
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined. Check .env file.'); 
  }
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }); // Connecting to the database
  console.log('Connected to test database'); 
});

// Clearing the database and closing the connection after all tests are completed
afterAll(async () => {
  try {
    await Note.deleteMany(); // Delete all notes from the database
    await mongoose.connection.close(); // Close the connection to MongoDB
    console.log('Connection to MongoDB closed.'); 
  } catch (err) {
    console.error('Error closing database:', err.message); 
  }
});

// Clearing the notes collection before each test
beforeEach(async () => {
  await Note.deleteMany(); // Delete all documents from the notes collection
});

// Route Tests for Notes
describe('Note Routes Tests', () => {
  // Test getting all notes
  test('GET /api/notes - Getting all notes', async () => {
    await Note.create({ title: 'Note 1', content: 'Content 1', category: 'Work' }); // Create a first note
    await Note.create({ title: 'Note 2', content: 'Content 2', category: 'Personal' }); // Create a second note

    const res = await request(app).get('/api/notes'); // Sending a GET request

    expect(res.statusCode).toBe(200); // Сheck that the response status is 200
    expect(res.body).toHaveLength(2); // Making sure two notes are returned.
    const titles = res.body.map(note => note.title).sort(); // Sorting note titles
    expect(titles).toEqual(['Note 1', 'Note 2']); // Check that the titles match
  });

  // Test creating a new note with an image
  test('POST /api/notes - Create a new note with an image', async () => {
    const res = await request(app)
      .post('/api/notes') // Sending a POST request
      .field('title', 'Note with Image') // Title field
      .field('content', 'This note has an image') // Content field
      .field('category', 'Work') // Category field
      .attach('image', path.join(__dirname, 'testImage.jpg')); // Attaching an image

    expect(res.statusCode).toBe(201); // Checking the response status
    expect(res.body.title).toBe('Note with Image'); // Checking the title
    expect(res.body.content).toBe('This note has an image'); // Checking the content
    expect(res.body.category).toBe('Work'); // Checking the category
    expect(res.body.image).toMatch(/uploads\/.+\.jpg$/); // Checking the path to the image

    const noteInDb = await Note.findOne({ title: 'Note with Image' }); // Checking saving to the database
    expect(noteInDb).not.toBeNull(); // Make sure the note exists.
    expect(noteInDb.image).toMatch(/uploads\/.+\.jpg/); // Checking the path to the image in the databaseе
  });

  // Test creating a note without mandatory data
  test('POST /api/notes - Error when required data is missing', async () => {
    const res = await request(app).post('/api/notes').send({}); // Sending an empty request

    expect(res.statusCode).toBe(400); // Checking the error status
    expect(res.body.message).toBe('Error creating note'); // Checking the error message
  });

  // Note update test
  test('PUT /api/notes/:id - Update note', async () => {
    const note = await Note.create({ title: 'Old Title', content: 'Old Content', category: 'Work' }); // Create a note

    const updatedData = { title: 'Updated Title', content: 'Updated Content', category: 'Personal' }; // Updated data

    const res = await request(app).put(`/api/notes/${note._id}`).send(updatedData); // Sending a PUT request

    expect(res.statusCode).toBe(200); // Checking the response status
    expect(res.body.title).toBe('Updated Title'); // Checking the updated title
    expect(res.body.content).toBe('Updated Content'); // Checking the updated content
    expect(res.body.category).toBe('Personal'); // Checking the updated category
  });

  // Note deletion test
  test('DELETE /api/notes/:id - Deleting a note', async () => {
    const note = await Note.create({ title: 'Note to Delete', content: 'Delete Content', category: 'Work' }); // Create a note

    const res = await request(app).delete(`/api/notes/${note._id}`); // Sending a DELETE request

    expect(res.statusCode).toBe(200); // Checking the response status
    expect(res.body.message).toBe('Note removed'); // Checking the message about successful deletion

    const deletedNote = await Note.findById(note._id); // Checking that the note has been deleted
    expect(deletedNote).toBeNull(); // Making sure that the note is not in the database.
  });
});
