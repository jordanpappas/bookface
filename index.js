const co = require('co')
const koa = require('koa')
const parse = require('co-body')
const Router = require('koa-router')
const static = require('koa-static')
const mongoose = require('mongoose')
const session = require('koa-session')
const convert = require('koa-convert')

module.exports = app = new koa()
const router = Router()

// static
app.use( convert(static('./assets')) )

// db
mongoose.connect('localhost/devbookface')
mongoose.connection.on('error', e=>console.error(e))
require('./models')

// sesh
app.use(convert(session(app)))
app.keys = ['secret', 'keys']

// controllers
var controllers = require('./controllers')
var views = require('./views')

router.get  ( '/'         , controllers.view.home       )
router.get  ( '/signup'   , views.signupForm            )
router.post ( '/signup'   , controllers.user.createUser )
router.get  ( '/logout'   , controllers.auth.logout     )
router.post ( '/login'    , controllers.auth.login      )

app.use(router.routes())
app.use(router.allowedMethods())

require('./sock')(app).listen(3000)
