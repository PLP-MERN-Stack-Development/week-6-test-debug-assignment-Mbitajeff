const express = require('express');
const app = express();
const postsRouter = require('./routes/posts');

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(express.json());

// Example route for testing
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// Example route to trigger an error
app.get('/error-demo', (req, res, next) => {
  next(new Error('This is a demo error!'));
});

app.use('/api/posts', postsRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app; 