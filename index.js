const co = require('co')
const koa = require('koa')
const parse = require('co-body')
const Router = require('koa-router')
const static = require('koa-static')
const mongoose = require('mongoose')
const session = require('koa-session')
const convert = require('koa-convert')

var app = new koa()
const router = Router()

// static
app.use( convert(static('./assets')) )

// sessions
app.use(convert(session(app)))
app.keys = ['secret', 'keys']

// db
mongoose.connect('localhost/devbookface')
mongoose.connection.on('error', e=>console.error(e))
require('./models')

// mw
var mw = require('./middleware')
app.use(mw.sessionHandler)
app.use(mw.logger)

// controllers
var controllers = require('./controllers')

router.get('/',
  controllers.user.gatherRequests,
  controllers.post.gatherPosts,
  controllers.view.home
)

// auth
router
  .get  ( '/signup'       , controllers.view.signup         )
  .get  ( '/logout'       , controllers.auth.logout         )
  .post ( '/signup'       , controllers.user.createUser     )
  .post ( '/login'        , controllers.auth.login          )

// friend requests
  .get  ( '/request/:id'  , controllers.user.requestFriend  )
  .get  ( '/accept/:id'   , controllers.user.acceptFriend   )

// posts
  .post   ('/posts'         ,        controllers.post.newPost       )
  .delete ('/posts/:id'     ,        controllers.post.removePost    )
  .get    ('/posts/:id'     ,        controllers.post.getPost       )
  .get    ('/like/:id'      ,        controllers.post.likePost      )
  .get    ('/unlike/:id'    ,        controllers.post.unlikePost    )

  .get('/posts/pages/:page', controllers.post.getPosts, controllers.view.testPosts)


// helpers
  .get  ( '/allUsers'  , controllers.user.getAll)
  .get  ( '/allPosts'  , controllers.post.getAll)

// router
app.use(router.routes())
app.use(router.allowedMethods())

// socket.io
require('./socket')(app).listen(3000)
