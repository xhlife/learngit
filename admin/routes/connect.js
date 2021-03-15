const router = require('koa-router')()

router.get('/concat', async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        await ctx.render('concat', {
            title: '咨询',
        })
    }
    else {
        ctx.response.redirect('/');
    }
})


module.exports = router