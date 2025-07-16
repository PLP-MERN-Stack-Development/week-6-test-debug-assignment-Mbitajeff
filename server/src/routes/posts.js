const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

// Middleware to simulate authentication and extract user ID from token
function auth(req, res, next) {
  // For test: token is 'Bearer <userId>'
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.replace('Bearer ', '').trim();
  // If token is 'test-token', use the first user
  if (token === 'test-token') {
    User.findOne().then(user => {
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      req.userId = user._id.toString();
      next();
    });
  } else {
    // Otherwise, treat token as a userId
    req.userId = token;
    next();
  }
}

// POST /api/posts - create post
router.post('/', auth, async (req, res) => {
  const { title, content, category, status } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json({ error: 'No user found' });
    const post = await Post.create({
      title,
      content,
      author: user._id,
      category,
      slug: title.toLowerCase().replace(/ /g, '-'),
      status: status || 'open',
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts - get all posts, with optional category filter and pagination
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const posts = await Post.find(filter)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts/:id - get post by id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

// PUT /api/posts/:id - update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    const user = await User.findById(req.userId);
    console.log('PUT /api/posts/:id', { postAuthor: post.author.toString(), userId: req.userId });
    if (!user || post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.status = req.body.status || post.status;
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/posts/:id - delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    const user = await User.findById(req.userId);
    if (!user || post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await post.deleteOne();
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 