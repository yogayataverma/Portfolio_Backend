const express = require('express');
const app = express();
const skillsRouter = require('./routes/skills');
const chatRouter = require('./routes/chat');

// Add the skills routes
app.use('/api/skills', skillsRouter);

// Add the chat routes
app.use('/api/chat', chatRouter);

// ... rest of the file ... 