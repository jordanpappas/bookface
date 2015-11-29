const co = require('co')
const views = require('co-views')

var render = views('views', {
  default: 'jade'
})

exports.home = co.wrap(function* (ctx, next) {
  console.log(JSON.stringify(ctx.session))
  ctx.body = yield render('index', {
    title: "Welcome to bookface",
    isAuthed: ctx.session.isAuthed,
    username: ctx.session.username,
    requests: ctx.state.requests,
    posts: ctx.state.posts
  })
})

exports.signup = co.wrap(function* (ctx, next) {
  ctx.body = yield render('signup')
})

exports.testPosts = co.wrap(function* (ctx, next) {
  ctx.body = yield render('test-posts', {
    posts: ctx.state.posts
  })
})
