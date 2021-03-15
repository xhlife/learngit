const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    await ctx.render('home',{
      title: "home",
    })
  }else{
    await ctx.render('index', {
      title: '登录'
    })
  }
})


module.exports = router
