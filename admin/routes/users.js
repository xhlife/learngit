const router = require('koa-router')()
const User = require('../dbs/models/users')
const Redis =require('koa-redis')
const axios = require('./utils/axios')

router.prefix('/users')
let Store = new Redis().client

router.post('/singin', async (ctx, next) => {
  // 接收appid,appsecret,code
  const {username, password, APPID, SECRET, JSCODE } = ctx.request.body
  // 组合url
  let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + APPID + '&secret=' + SECRET + '&js_code=' + JSCODE + '&grant_type=authorization_code'
  console.log(url);
  let user = await User.findOne({username})
  // console.log(user);
  if (!user.username) {
    ctx.body = {
      code: -1,
      msg: "用户不存在"
    }
    return
  }
  if (user.username === username && user.password === password) {
    // 向微信服务器发送请求
    let res = await axios.post(url)

    // 获取session_key和openid
    const { session_key, openid } = res.data

    // 生成_3rd_session
    const _3rd_session = `${Date.now()}+${Math.random()}`

    // 存入Redis并设置过期时间
    let result = await Store.set(_3rd_session, JSON.stringify({ session_key: session_key, openid: openid }))
    await Store.expire(_3rd_session, 86400000)  // 过期时间一天

    // let re = await Store.get(_3rd_session)
    // console.log(re)  // {"session_key":"XB1TV1TxcFEvNS3J6q+LdQ==","openid":"ojMNO5bpN0-c1yXjLluEAF-S8WDs"}


    // 返回_3rd_session
    if (result) {
      ctx.body = {
        code: 1,
        _3rd_session: _3rd_session,
        userinfo : user 
      }
    }
  }
})

router.post('/checkLogin', async (ctx, next) => {
  const res = await Store.get(ctx.request.body._3rd_session)
  if (res) {
    ctx.body = {
      code: 1,
      msg: '会话有效'
    }
  }else{
    ctx.body = {
      code: -1,
      msg: '会话过期'
    }
  }
})

router.post('/addUser', async (ctx, next) => {
  const {username, password, email,telNo} = ctx.request.body
  let user = await User.findOne({ username });
  console.log(user)
  if (user) {
    ctx.body = {
      code: '-1',
      msg: '用户已存在'
    }
    return
  }
  let nUser = await User.create({
    username, password, email, telNo
  })
  if (nUser) {
    ctx.body = {
      code: '200',
      msg: '添加成功'
    }
  }
})

router.post('/deleteUser', async (ctx, next) => {
  const {username} = ctx.request.body
  let user = await User.findOne({ username });
  console.log(user)
  
  if (user) {
    let deleteRes = await User.deleteOne({username})
    if (deleteRes) {
      ctx.body = {
        code: '200',
        msg: '用户已删除'
      }
    }
  }else{
    ctx.body = {
      code: '-1',
      msg: '用户不存在'
    }
  }
})

module.exports = router


/*  router.post('/singin', async (ctx, next) => {
  return Passport.authenticate('local',function(err, user, info, status){
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    }else{
      if (user) {
        ctx.body = {
          code: 1,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      }else{
        ctx.body = {
          code: -2,
          msg:info
        }
      }
    }
  })(ctx, next)
}) */


// 获取用户信息接口
/* router.get('/getUser', async (ctx) => {
  console.log(ctx.session)
  console.log(ctx.isAuthenticated());
  console.log(ctx.sessionId)
  // 如果时登录状态
  if (ctx.isAuthenticated()) {
    // passport 会把用户信息放到session对象中,
    // 通过解构赋值,取出session中用户信息
    const { username, email } = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
}) */

