const co = require('co')
const parse = require('co-body')
const mongoose = require('mongoose')

const User = mongoose.model('User')

exports.logger = (ctx, next) => {
  const start = new Date
  return next().then(() => {
    const ms = new Date - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  })
}
