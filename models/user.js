const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('co-bcrypt')
const co = require('co')

const User = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, 'invalid email']
  },
  level: {
    type: String,
    required: true
  },
  friends: [String],
  requests: [String],
  requested: [String]
})

User.pre('save', function(done) {
  if (!this.isModified('password')) return done()

  co.wrap(function* () {
    try {
      var salt = yield bcrypt.genSalt(5)
      var hash = yield bcrypt.hash(this.password, salt)
      this.password = hash
      done()
    } catch(e) {
      done(e)
    }
  }).call(this).then(done)
})

User.methods.verifyPassword = function(password) {
  return co.wrap(function*() {
    try {
      return yield bcrypt.compare(password, this.password)
    } catch(err) {
      console.log(`ERROR: ${err}`)
      return false
    }
  }).call(this).then(b=>b)
}

mongoose.model('User', User)