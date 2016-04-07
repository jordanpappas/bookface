var mongoose = require('mongoose')
var User = mongoose.model('User')
var parse = require('co-body')
var co = require('co')

exports.getAll = co.wrap(function* (ctx, next) {
  var users = yield User.find()
  ctx.body = users
  console.log(JSON.stringify(users, null, '\t'))
})

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
    ctx.redirect('/')
  } catch(err) {
    console.log(err)
    ctx.body = 'Something went wrong.'
  }
})

exports.requestFriend = co.wrap(function* (ctx, next) {
  var _this = yield User.findOne({ _id: ctx.session.user }).exec()
  var _that = yield User.findOne({ _id: ctx.params.id }).exec()

  yield User.update(
    {_id: _this._id},
    {$push: {requested: _that._id}}
  )

  yield User.update(
    {_id: _that._id},
    {$push: {requests: _this._id}}
  )
  ctx.type = 'html'
  ctx.body = 'Sent request! <a href="/">home</a>'
})

exports.acceptFriend = co.wrap(function* (ctx, next) {
  var _this = yield User.findOne({ _id: ctx.session.user }).exec()
  var _that = yield User.findOne({ _id: ctx.params.id }).exec()

  if (_that.requested.indexOf(_this._id) === -1)
    return ctx.body = 'NO HACKERS!'

  yield User.update(
    {_id: _this._id},
    {$push: {friends: _that._id}, $pull: {requests: _that._id}}
  )

  yield User.update(
    {_id: _that.id},
    {$push: {friends: _this._id}, $pull: {requested: _this._id}}
  )
  ctx.type = 'html'
  ctx.body = 'Friend added! <a href="/">home</a>'
})

exports.gatherRequests = co.wrap(function* (ctx, next) {
  if (ctx.session.isAuthed) {
    var user = yield User.findOne({_id: ctx.session.user})
    ctx.state.requests = user.requests
  }
  yield next()
})
