const express = require('express');
const cors = require('cors');
const app = express();
const skillsRouter = require('./routes/skills');
const chatRouter = require('./routes/chat');

const allowedOrigins = [
  'https://portfolio-frontend-nu-one.vercel.app',
  'https://yogayataverma.netlify.app'
];

app.use(cors({
  origin: '*',
  credentials: true
}));

// Add the skills routes
app.use('/api/skills', skillsRouter);

// Add the chat routes
app.use('/api/chat', chatRouter);

// ... rest of the file ... 