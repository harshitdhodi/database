const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the blog
const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    details: { type: String, required: true },
    photo: [{ type: String}],
   
    status: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  BlogSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

// Create the model
const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
