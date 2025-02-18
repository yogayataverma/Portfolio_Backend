const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  isLiked: { type: Boolean, default: false },
  githubLink: { type: String },
  demoLink: { type: String },
}); 