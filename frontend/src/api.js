import axios from 'axios';

// The main URL backend server
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api'; // Using environment variables

/**
 * Function to get all notes (filtered by category)
 * @param {string} category - category for filtering
 * @returns {Promise<Array>} - array of notes
 */
export const getNotes = async (category = '') => {
  try {
    const response = await axios.get(`${API_URL}/notes`, {
      params: { category },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting notes:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Function for creating a new note
 * @param {FormData} noteData - new note data
 * @returns {Promise<Object>} - created note
 */
export const createNote = async (noteData) => {
  try {
    const response = await axios.post(`${API_URL}/notes`, noteData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Correct header for FormData
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Function to update a note
 * @param {string} id - ID notes
 * @param {FormData} noteData - Note ID
 * @returns {Promise<Object>} - updated note
 */
export const updateNote = async (id, noteData) => {
  try {
    const response = await axios.put(`${API_URL}/notes/${id}`, noteData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Support header for FormData
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Function to delete a note
 * @param {string} id - Note ID
 * @returns {Promise<void>}
 */
export const deleteNote = async (id) => {
  try {
    await axios.delete(`${API_URL}/notes/${id}`);
  } catch (error) {
    console.error('Error deleting note:', error.response?.data || error.message);
    throw error;
  }
};

// Export functions and default object
export default {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};

