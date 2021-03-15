// 引入koa的passport模块
const passport = require('koa-passport') 
// 引入passport的本地策略
const LocalStrategy = require('passport-local')
// 引入用户的数据模型
const UserModel = require('../../dbs/models/superUser') 

// 固定用法
  // （1）passport 本地celue
  passport.use(new LocalStrategy(async function(username,password,done){
    // 查询条件
    console.log(username,password);
    
    let where = {
        username
    }
    // 查询数据库
    let result = await UserModel.findOne(where)
    console.log(result);
    let re = await UserModel.findOne({ username })
    console.log(re);
    
    if (result != null) {
        if (result.password === password) {
            return done(null,result)
        }else{
            return done(null,false, '密码错误')
        }
    }else{
        return done(null,false, '用户不存在')
    }
  }))
  // （2），passport序列化 由ctx.login()触发
  passport.serializeUser(function(user, done){
      // 用户登录成功之后，把数据存在session中
      done(null,user)
  })
  // 反序列化， 请求时，session中存在passport触发
  passport.deserializeUser(function(user,done){
      return done(null, user)
  })
  module.exports = passport