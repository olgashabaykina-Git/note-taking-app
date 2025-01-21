require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' }); 
const mongoose = require('mongoose'); 
const Note = require('../models/Note'); 

console.log('process.env.MONGO_URI', process.env.MONGO_URI); 

// Connect to the database before running all tests
beforeAll(async () => {
  const uri = process.env.MONGO_URI; // Getting the Database URI from Environment Variables
  if (!uri) {
    throw new Error('MONGO_URI is not defined. Check  .env.test file.'); // If URI is not specified, throw an error
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // Connecting to the database
  console.log('Connected to test database'); 
});

// closing the database connection after all tests are completed
afterAll(async () => {
  try {
    await mongoose.connection.close(); // Closing the connection
    console.log('Connection to MongoDB closed'); 
  } catch (err) {
    console.error('Error closing database:', err.message); 
  }
});

// Clearing the notes collection before each test
beforeEach(async () => {
  await Note.deleteMany(); // Delete all documents from the Note collection
});

// Tests of the Note model
describe('Note Model Tests', () => {
  // Test: Creating a note with correct data
  test('Creating a note with correct data', async () => {
    const noteData = {
      title: 'Test Note', 
      content: 'This is a test note', 
      category: 'Work', 
      image: 'testImage.jpg',
    };

    const note = new Note(noteData); 
    const savedNote = await note.save(); // Save the note in the database

    expect(savedNote._id).toBeDefined(); // Check that the note has a unique ID
    expect(savedNote.title).toBe(noteData.title); // Checking the title of the note
    expect(savedNote.content).toBe(noteData.content); // Checking the contents of the note
    expect(savedNote.category).toBe(noteData.category); // Checking the category of the note
    expect(savedNote.image).toBe(noteData.image); // Checking the note image
  });

  // Test: Creating a note without optional data (image)
  test('Creating a note without optional data (image)', async () => {
    const noteData = {
      title: 'Test Note',
      content: 'This is a test note', 
    };

    const note = new Note(noteData); // Create a note instance
    const savedNote = await note.save(); // Save the note in the database
    
    expect(savedNote._id).toBeDefined(); // Check that the note has a unique ID
    expect(savedNote.title).toBe(noteData.title); // Checking the title of the note
    expect(savedNote.content).toBe(noteData.content); // Checking the contents of the note
    expect(savedNote.category).toBe('General'); // Checking the default category
    expect(savedNote.image).toBeNull(); // Check that the image is missing
  });

  // Test: Error when required field is missing (title)
  test('Error when required data is missing (title)', async () => {
    const noteData = {
      content: 'This is a test note', // Indicate only the contents of the note
    };

    await expect(async () => {
      const note = new Note(noteData); 
      await note.save(); // Trying to save a note
    }).rejects.toThrow(mongoose.Error.ValidationError); // Expecting validation error
  });

  // Test: Error when required field is missing (content)
  test('Error when required data is missing (content)', async () => {
    const noteData = {
      title: 'Test Note', // Indicate only the title of the note
    };

    await expect(async () => {
      const note = new Note(noteData); 
      await note.save(); // Trying to save a note
    }).rejects.toThrow(mongoose.Error.ValidationError); // Expecting validation error
  });

  // Test: Checking Automatic Timestamps Installation
  test('Create a note with automatic timestamps', async () => {
    const noteData = {
      title: 'Test Note', 
      content: 'This is a test note', 
    };

    const note = new Note(noteData); 
    const savedNote = await note.save(); // Save the note in the database

    expect(savedNote.createdAt).toBeDefined(); // Check that the createdAt field is set
    expect(savedNote.updatedAt).toBeDefined(); // Check that the updatedAt field is set
    expect(savedNote.createdAt).toBeInstanceOf(Date); // Check that createdAt is of type Date
    expect(savedNote.updatedAt).toBeInstanceOf(Date); // Check that updatedAt is of type Date
  });
});
