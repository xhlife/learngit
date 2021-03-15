const router = require('koa-router')()

router.get('/simulator', async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        await ctx.render('simulator', {
            title: "模拟场",
        })
    } else {
        await ctx.render('index', {
            title: '登录'
        })
    }
})


module.exports = router
