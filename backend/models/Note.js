const mongoose = require('mongoose'); 

// Defining a Note Taking Scheme
const noteSchema = mongoose.Schema(
    {
        title: { type: String, required: true }, 
        content: { type: String, required: true }, 
        category: { type: String, default: 'General' }, 
        image: { type: String, default: null }, 
    },
    { timestamps: true } 
);

// Exporting the Note model for use in other modules
module.exports = mongoose.model('Note', noteSchema);
