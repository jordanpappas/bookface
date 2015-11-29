const mongoose = require('mongoose')

const Message = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  to: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    default: '<No subject>'
  },
  body: {
    type: String,
    required: true,
    default: '<Blank message>'
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  },
  replied: {
    type: Boolean,
    required: true,
    default: false
  }
})

mongoose.model('Message', Message)
