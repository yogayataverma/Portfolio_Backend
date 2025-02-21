// server.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const updatesRouter = require('./routes/updates');
const skillsRouter = require('./routes/skills');
const chatRouter = require('./routes/chat');

// Load environment variables
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // React app's URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

require('dotenv').config();

app.use(express.json());

// Add these headers to prevent HTML responses
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
    console.log('Connected to database:', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    console.log('Please check:');
    console.log('1. Your MongoDB Atlas cluster is running');
    console.log('2. The connection string is correct');
    console.log('3. Your IP address is whitelisted in MongoDB Atlas');
    process.exit(1);
  });

// Define Schemas and Models

// Project Schema
const projectSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrl: String,
  link: String,
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  isLiked: { type: Boolean, default: false },
  githubLink: { type: String },
  demoLink: { type: String }
});
const Project = mongoose.model('Project', projectSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  email: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// Comment Schema
const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Comment = mongoose.model('Comment', commentSchema);

app.use('/api/skills', skillsRouter);
app.use('/api/chat', chatRouter);

// Authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Simplified login endpoint without bcrypt
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// Protect the project creation endpoint
app.post('/api/projects', authMiddleware, async (req, res) => {
  try {
    const { title, content, imageUrl, githubLink, demoLink } = req.body;
    
    const newProject = new Project({
      title,
      content,
      imageUrl,
      githubLink,
      demoLink,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isLiked: false
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
});

// Routes

// Add the skills routes
app.use('/api/skills', skillsRouter);

// Add the chat routes
app.use('/api/chat', chatRouter);

// --- Project Routes ---
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ timestamp: -1 });
    console.log('Sending projects:', projects);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

app.post('/api/projects/like/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    project.likes = project.isLiked ? project.likes - 1 : project.likes + 1;
    project.isLiked = !project.isLiked;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating likes', error });
  }
});

// --- Contact Routes ---
app.post('/api/contact', async (req, res) => {
  try {
    const { email, message } = req.body;

    // Validate input
    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }

    // Create and save new contact document
    const newContact = new Contact({
      email,
      message,
      timestamp: new Date()
    });
    
    await newContact.save();
    
    // Log for debugging
    console.log('Contact form submission saved:', { email, message });
    
    res.status(200).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to process contact form' });
  }
});

// --- Additional Routes ---
// Ensure that the routes in './routes/data' do not conflict with your above routes
const dataRoutes = require('./routes/data');
app.use('/api', dataRoutes);

// Add this near your other routes
app.post('/api/posts/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        
        // Here you would typically save the comment to your database
        // For now, we'll just send back a success response
        
        res.status(201).json({
            message: 'Comment added successfully',
            comment: {
                id: Date.now(),
                content,
                postId,
                createdAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        
        // Here you would typically fetch comments from your database
        // For now, we'll just send back an empty array
        
        res.json([]);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Add this route near your other routes
app.post('/api/projects/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Validate the project exists
    const project = await Project.findById(postId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create new comment
    const comment = new Comment({
      postId,
      content,
      createdAt: new Date()
    });

    await comment.save();

    // Increment the project's comment count
    await Project.findByIdAndUpdate(
      postId,
      { $inc: { comments: 1 } }
    );

    res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        id: comment._id,
        content: comment.content,
        createdAt: comment.createdAt
      }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Add this route to fetch comments for a post
app.get('/api/projects/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add this line with your other routes
app.use('/api/updates', updatesRouter);

// Ensure error responses are also JSON
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Verify environment variables are loaded
console.log('Environment check:', {
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  port: process.env.PORT
});

// Start the server only after a successful MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
  console.log('Connected to database:', mongoose.connection.db.databaseName);
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Add this route handler
app.get('/api/projects', async (req, res) => {
  try {
    const posts = await Project.find().sort({ timestamp: -1 });
    console.log('Sending projects:', posts);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
