const router = require('koa-router')()
const User = require('../dbs/models/users')
// router.prefix('/home')
router.get('/home', async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        await ctx.render('home', {
            title: 'home',
        })
    }
   else{
        ctx.response.redirect('/');
   }
})

// 获取用户信息
router.post('/userList', async (ctx,next) => {
    if (ctx.isAuthenticated()) {
        let userMap = {}
         await User.find({}, (err, users) => {
            users.forEach((user) => {
                userMap[user._id] = {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                }
            })
            ctx.body = {
                userMap
            }
        }) 
    }
    else {
        ctx.response.redirect('/');
    }
})

module.exports = router
