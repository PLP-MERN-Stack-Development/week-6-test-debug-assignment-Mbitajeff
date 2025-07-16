const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: mongoose.Schema.Types.ObjectId,
  category: mongoose.Schema.Types.ObjectId,
  slug: String,
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open',
  },
});

module.exports = mongoose.model('Post', PostSchema); 