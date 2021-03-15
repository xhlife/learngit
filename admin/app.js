const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

//------------
const mongoose = require('mongoose')
const session = require('koa-generic-session')
const Redis = require('koa-redis')
const dbConfig = require('./dbs/config')
const passport = require('./routes/utils/passport')

//------------

const index = require('./routes/index')
const users = require('./routes/users')
const superUser = require('./routes/superUser')
const home = require('./routes/home')
const connect = require('./routes/connect')
const arch = require('./routes/arch')
const simulator = require('./routes/simulator')
// error handler
onerror(app)

// 与session相关的配置
app.keys = ['bs','keyskeys']
app.proxy = true
// 把session在redis中存放
app.use(session({ key: 'bs', prefix: 'bs:uid', store: new Redis() }))
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))


// 连接数据库
mongoose.set('useCreateIndex', true) 
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// 使用passport 初始化以及使用session
app.use(passport.initialize())
app.use(passport.session())



app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(superUser.routes(), superUser.allowedMethods())
app.use(home.routes(), home.allowedMethods())
app.use(connect.routes(), connect.allowedMethods())
app.use(arch.routes(), arch.allowedMethods())
app.use(simulator.routes(), simulator.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
