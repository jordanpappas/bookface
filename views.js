var co = require('co')

exports.loginForm = co.wrap(function* (ctx) {
  ctx.body = `
    <form action="/login" method="post">
      <input type="text" name="username" value="username">
      <input type="password" name="password">
      <input type="submit" name="submit" value="Log In">
    </form>
  `
})

exports.signupForm = co.wrap(function* (ctx) {
  ctx.body = `
    <form action="/signup" method="post">
      username: <input type="text" name="username" value="username"><BR>
      email: <input type="text" name="email"><BR>
      password: <input type="password" name="password"><BR>
      <input type="submit" name="submit" value="Sign Up">
    </form>
  `
})

exports.homePage = ctx => {
  ctx.session = null
  ctx.body = `
    <h1>Welcome!</h1>
    <p><a href="/signup">Sign up</a><br>
    <p><a href="/login">Log in</a><br>
    <p><a href="/logout">Log Out</a><br>
  `
}

exports.hiddenPage = ctx => {
  ctx.body = 'SUPER SECRET!'
}
