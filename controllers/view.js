const co = require('co')
const views = require('co-views')

var render = views('views', {
  default: 'jade'
})

exports.home = co.wrap(function* (ctx,next) {
  ctx.body = yield render('index', {
    title: "Welcome to bookface",
    loggedIn: ctx.session.user
  })
})
