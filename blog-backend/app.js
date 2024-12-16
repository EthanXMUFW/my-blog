const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the file for storing blogs
const blogsFilePath = path.join(__dirname, 'blogs.json');

// Helper function to read blogs from file
const readBlogs = () => {
  if (!fs.existsSync(blogsFilePath)) {
    return []; // Return an empty array if the file doesn't exist
  }
  const data = fs.readFileSync(blogsFilePath, 'utf-8');
  return JSON.parse(data || '[]'); // Parse the file content or return an empty array
};

// Helper function to write blogs to file
const writeBlogs = (blogs) => {
  fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), 'utf-8');
};

// Route to add a new blog
app.post('/api/blogs', (req, res) => {
  try {
    const blogs = readBlogs();
    const newBlog = {
      id: blogs.length + 1,
      title: req.body.title,
      content: req.body.content,
      createdAt: new Date().toISOString(),
    };
    blogs.push(newBlog);
    writeBlogs(blogs);
    res.status(201).json({ message: 'Blog saved successfully!', blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save blog' });
  }
});

// Route to fetch all blogs
app.get('/api/blogs', (req, res) => {
  try {
    const blogs = readBlogs();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

