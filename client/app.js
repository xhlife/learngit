//app.js
App({
  onLaunch: function () {
    var _this = this
    wx.checkSession({
      success() {
        var {_3rd_session,userInfo} = wx.getStorageSync("userData")
        
        if (_3rd_session) {
          wx.request({
            url: _this.baseUrl + "/users/checkLogin",
            method: 'post',
            data: {
              _3rd_session
            },
            success:function(res){
              if(res.data.code == "1"){
                // 跳转到首页
                wx.switchTab({
                  url: '/pages/index/index',
                });
              }else{
                wx.redirectTo({
                  url: '/pages/login/login',
                })
              }
            }
          })
        } else {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      },
      fail(){
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    });
  },
  
  globalData: {
    baseUrl: "http://192.168.56.1:3000",
    wsUrl: "ws://192.168.56.1:3000"
    }
})