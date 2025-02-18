const express = require('express');
const router = express.Router();
const Update = require('./models/Update');

// Get all updates
router.get('/', async (req, res) => {
  try {
    const updates = await Update.find().sort({ date: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new update (protected route)
router.post('/', async (req, res) => {
  const update = new Update({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
  });

  try {
    const newUpdate = await update.save();
    res.status(201).json(newUpdate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 