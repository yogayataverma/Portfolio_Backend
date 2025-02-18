// routes/data.js

const express = require('express');
const router = express.Router();
const Contact = require('./models/Contact');

// Fetch all contacts
router.get('/data', async (req, res) => {
  try {
    const contacts = await Contact.find({});
    console.log(Contact)
    console.log(contacts)
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ message: 'No contacts found' });
    }
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch a single contact by ID
router.get('/data/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
