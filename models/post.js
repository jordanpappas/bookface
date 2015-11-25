const mongoose = require('mongoose')

const Post = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true,
    default: 0
  },
  likers: [String]
})
