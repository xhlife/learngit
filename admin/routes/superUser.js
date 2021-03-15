const router = require('koa-router')()
const User = require('../dbs/models/superUser')
const Redis = require('koa-redis')
const axios = require('./utils/axios')
const Passport = require('./utils/passport')

router.prefix('/superUser')

// 登录接口
router.post('/signin', async (ctx, next) => {
    // passport固定写法
    // 访问登录接口返回一个passport的函数
    return Passport.authenticate('local', function (err, user, info, status) {
        if (err) {
            ctx.body = {
                code: -1,
                msg: err
            }
        } else {
            if (user) {
                ctx.body = {
                    code: 0,
                    msg: '登录成功',
                    user
                }
                // 登录动作
                return ctx.login(user)
            } else {
                ctx.body = {
                    code: 1,
                    msg: info
                }
            }
        }
    })(ctx, next)
})

// 退出接口
router.get('/exit', async (ctx, next) => {
    // 执行退出动作
    await ctx.logout()
    // 检测是否成功注销
    if (!ctx.isAuthenticated()) {
        ctx.body = "退出成功"
    } else {
        ctx.body = {
            code: -1
        }
    }
})

// 获取用户名的接口
router.get('/getUser', async (ctx) => {
    console.log(ctx.session);
    console.log(ctx.isAuthenticated());


    // 如果时登录状态
    if (ctx.isAuthenticated()) {
        // passport 会把用户信息放到session对象中,
        // 通过解构赋值,取出session中用户信息
        const { username} = ctx.session.passport.user
        ctx.body = {
            user: username
        }
    } else {
        ctx.body = {
            user: ''
        }
    }
})


module.exports = router