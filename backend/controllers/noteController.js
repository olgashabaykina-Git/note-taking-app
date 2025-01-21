const Note = require('../models/Note');

// Get all notes
const getNotes = async (req, res) => {
    const { category } = req.query;
    try {
        const filter = category ? { category } : {};
        const notes = await Note.find(filter);
        res.json(notes);
    } catch (err) {
        console.error('Error fetching notes:', err.message);
        res.status(500).json({ message: 'Error retrieving notes' });
    }
};

// Create a note
const createNote = async (req, res) => {
    const { title, content, category } = req.body;
    const image = req.file ? `http://localhost:5001/uploads/${req.file.filename}` : null;

    try {
        const newNote = new Note({ title, content, category, image });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        console.error('Error creating note:', err.message);
        res.status(400).json({ message: 'Error creating note' });
    }
};

// Update note
const updateNote = async (req, res) => {
    const { title, content, category } = req.body;
    const image = req.file ? `http://localhost:5001/uploads/${req.file.filename}` : null;
   

    try {
        const updateFields = { title, content, category };
        if (image) updateFields.image = image;

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(updatedNote);
    } catch (err) {
        console.error('Error updating note:', err.message);
        res.status(500).json({ message: 'Error updating note' });
    }
};

// Delete note
const deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ message: 'Note removed' });
    } catch (err) {
        console.error('Error deleting note:', err.message);
        res.status(500).json({ message: 'Error deleting note' });
    }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
