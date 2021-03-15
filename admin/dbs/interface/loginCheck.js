const Redis = require('koa-redis')
let redisClient = new Redis().client
loginCheck = async (ctx, next) => {
    // 查询数据库，判断_3rd_session是否存在且有效
    const res = await redisClient.get(ctx.request.body._3rd_session)
    if (res) {
        ctx.body = {
            code: 1,
            msg: "会话在线"
        }
        await next()
    } else {
        ctx.body = {
            code: -1,
            msg: "会话过期，清登录！"
        }
    }
}

module.exports = loginCheck

