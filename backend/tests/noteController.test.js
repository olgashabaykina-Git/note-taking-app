require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' }); 
const request = require('supertest'); 
const app = require('../app'); 
const Note = require('../models/Note'); 
const mongoose = require('mongoose'); 
const path = require('path'); 

jest.setTimeout(30000); 

// Connecting to MongoDB before running tests
beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI; // Obtaining URI for connecting to the database from environment variables
  if (!mongoUri) {
    throw new Error('MONGO_URI not defined. Check .env.test file'); 
  }
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }); // Connecting to the database
  console.log('Connected to test database');
});

// Clearing the database and closing the connection after all tests
afterAll(async () => {
  try {
    await Note.deleteMany(); 
    await mongoose.connection.close(); 
    console.log('Connection to MongoDB closed.');
  } catch (err) {
    console.error('Error closing database:', err.message); 
  }
});

// Clearing the notes collection before each test
beforeEach(async () => {
  await Note.deleteMany();
});

// Clear all timers after each test
afterEach(() => {
  jest.clearAllTimers(); // Remove all active Jest timers
});

describe('Note Controller', () => {
  // Test getting all notes
  test('GET /api/notes - Getting all notes', async () => {
    // create test notes
    await Note.create({ title: 'Note 1', content: 'Content 1', category: 'Work' });
    await Note.create({ title: 'Note 2', content: 'Content 2', category: 'Personal' });

    const res = await request(app).get('/api/notes'); // Sending a GET request

    expect(res.statusCode).toBe(200); // Check that the response status is 200
    expect(res.body).toHaveLength(2); // Make sure two notes are returned.
    const titles = res.body.map(note => note.title).sort(); // Checking the names of notes
    expect(titles).toEqual(['Note 1', 'Note 2']); // Compare with the expected array
  });

  // Test of filtering notes by category
  test('GET /api/notes?category=Work - Filter notes by category', async () => {
    await Note.create({ title: 'Note 1', content: 'Content 1', category: 'Work' });
    await Note.create({ title: 'Note 2', content: 'Content 2', category: 'Personal' });

    const res = await request(app).get('/api/notes?category=Work'); // Sending a GET request with a filter

    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveLength(1); // Expecting only one note.
    expect(res.body[0].category).toBe('Work'); // Check that the category matches
  });

  // Test creating a note without an image
  test('POST /api/notes - Create a new note without an image', async () => {
    const newNote = { title: 'New Note', content: 'New Content', category: 'Work' };

    const res = await request(app).post('/api/notes').send(newNote); // Sending a POST request

    expect(res.statusCode).toBe(201); 
    expect(res.body.title).toBe('New Note'); // Checking the title of the note
    expect(res.body.content).toBe('New Content'); // Checking the contents of the note
    expect(res.body.image).toBeNull(); // Make sure that the image is missing
  });

  // Test of creating a note with an image
  test('POST /api/notes - Create a new note with an image', async () => {
    const res = await request(app)
      .post('/api/notes')
      .field('title', 'Note with Image') // title field
      .field('content', 'This note has an image') // Content field
      .field('category', 'Work') // Category field
      .attach('image', path.join(__dirname, 'testImage.jpg')); // Attaching an image file

    expect(res.statusCode).toBe(201); 
    expect(res.body.title).toBe('Note with Image'); // Checking the title
    expect(res.body.content).toBe('This note has an image'); // Checking the content
    expect(res.body.category).toBe('Work'); // Checking the category
    expect(res.body.image).toMatch(/uploads\/.+\.jpg$/); // Checking the path to the image
  });

  // Test creating a note with missing data
  test('POST /api/notes - Error when required data is missing', async () => {
    const res = await request(app).post('/api/notes').send({}); // Sending an empty request

    expect(res.statusCode).toBe(400); 
    expect(res.body.message).toBe('Error creating note'); // Checking the error message
  });

  
});
