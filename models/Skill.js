const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true,
    enum: ['FaChartBar', 'FaRobot'] // Restrict to supported icons
  },
  skills: [{
    title: {
      type: String,
      required: true
    },
    technology: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    bulletPoints: [{
      type: String,
      required: true
    }]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema); 