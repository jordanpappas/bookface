var mongoose = require('mongoose')
var Post = mongoose.model('Post')
var User = mongoose.model('User')
var parse = require('co-body')
var co = require('co')

exports.getAll = co.wrap(function* (ctx, next) {
  var posts = yield Post.find()
  ctx.body = posts
  console.log(JSON.stringify(posts, null, '\t'))
})

exports.newPost = co.wrap(function* (ctx, next) {
  var body = yield parse(ctx)
  var post = new Post({
    author: {id: ctx.session.user, username: ctx.session.username},
    body: body.body
  })

  try {
    yield post.save()
    ctx.redirect('/')
  } catch(err) {
    console.log(err)
    ctx.body = 'Something went wrong.'
  }
})

exports.removePost = co.wrap(function* (ctx, next) {
  var post = yield Post.findOne({_id:ctx.params.id})
  if (post.author.id !== ctx.session.user) return yield next()
  yield Post.remove({_id:post._id})
  ctx.body = 'post removed.'
})

exports.getPost = co.wrap(function* (ctx, next) {
  var post = yield Post.findOne({_id:ctx.params.id})
  var user = yield User.findOne({_id:ctx.session.user})
  if (!post) return ctx.body = 'Not a post.'

  if (post.author.id !== ctx.session.user)
    if (user.friends.indexOf(post.author.id) === -1)
      return ctx.body = 'No Hackers.'

  ctx.body = post
})

exports.likePost = co.wrap(function* (ctx, next) {
  var post = yield Post.findOne({_id:ctx.params.id})
  var user = yield User.findOne({_id:ctx.session.user})
  if (!post) return ctx.body = 'Not a post.'

  if (post.author.id !== ctx.session.user)
    if (user.friends.indexOf(post.author.id) === -1)
      return ctx.body = {success: false}

  if (post.likers.indexOf(user._id) !== -1)
    return ctx.body = {success:true}

  yield Post.update(
    {_id: post._id},
    {$inc: { likes: 1 }, $push: { likers: ctx.session.user }}
  )
  ctx.body = {success: true}
})

exports.unlikePost = co.wrap(function* (ctx, next) {
  var post = yield Post.findOne({_id:ctx.params.id})
  var user = yield User.findOne({_id:ctx.session.user})
  if (!post) return ctx.body = 'Not a post.'

  if (post.author.id !== ctx.session.user)
    if (user.friends.indexOf(post.author.id) === -1)
      return ctx.body = {success: false}

  if (post.likers.indexOf(user._id) === -1)
    return ctx.body = {success:true}

  yield Post.update(
    {_id: post._id},
    {$inc: { likes: -1 }, $pull: { likers: ctx.session.user }}
  )
  ctx.body = {success: true}
})

exports.gatherPosts = co.wrap(function* (ctx, next) {
  if (!ctx.session.isAuthed) return yield next()

  var user = yield User.findOne({_id:ctx.session.user})
  var group = user.friends
  group.push(user._id)

  var posts = yield Post
              .find({ "author.id": {$in: group}})
              .sort({date:-1}).limit(20).exec()
  ctx.state.posts = posts
  yield next()
})

exports.getPosts = co.wrap(function* (ctx, next) {
  if (!ctx.session.isAuthed) return yield next()

  var user = yield User.findOne({_id:ctx.session.user})
  var group = user.friends
  group.push(user._id)

  // 10 per page...
  var page = ctx.params.page
  var skip = page*10 - 10
  var posts = yield Post
              .find({ "author.id": {$in: group}})
              .sort({date:-1}).skip(skip).limit(10).exec()
  ctx.state.posts = posts
  yield next()
})
