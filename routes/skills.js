const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new skill category (protected route)
router.post('/', async (req, res) => {
  try {
    const skill = new Skill({
      name: req.body.name,
      icon: req.body.icon,
      skills: req.body.skills
    });

    const newSkill = await skill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a skill category (protected route)
router.put('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill category not found' });
    }

    if (req.body.name) skill.name = req.body.name;
    if (req.body.icon) skill.icon = req.body.icon;
    if (req.body.skills) skill.skills = req.body.skills;

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a skill category (protected route)
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill category not found' });
    }

    await skill.remove();
    res.json({ message: 'Skill category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 