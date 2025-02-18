const mongoose = require('mongoose');

// Define the schema for the Contact collection
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

// Create the Contact model
const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
