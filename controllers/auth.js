const co = require('co')
const parse = require('co-body')
const sleep = require('co-sleep')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.logout = ctx => {
  ctx.session = null
  ctx.redirect('/')
}

exports.login = co.wrap(function* (ctx, next) {
  var body = yield parse(ctx)
  var user = yield User.findOne({ username: body.username }).exec()

  if (!user) return ctx.body = { success: false }

  if(yield user.verifyPassword(body.password)) {
    ctx.session.user = user._id
    return ctx.body = { success: true }
  }

  ctx.body = { success: false }
})
