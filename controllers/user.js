var mongoose = require('mongoose')
var User = mongoose.model('User')
var parse = require('co-body')
var co = require('co')

exports.createUser = co.wrap(function* (ctx, next) {
  var body = yield parse(ctx)
  var user = new User({
    username: body.username,
    password: body.password,
    email: body.email,
    level: 'basic'
  })

  try {
    yield user.save()
    ctx.body = 'New user added'
  } catch(err) {
    console.log(err)
    ctx.body = 'Something went wrong.'
  }
})
