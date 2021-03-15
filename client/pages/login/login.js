// pages/login/login.js
var app = getApp()
var Md5 = require("../../utils/md5.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
 // 监听用户名输入
  usernameInput:function(e){
    this.data.username = e.detail.value;
  },
  // 监听用户密码输入
  passwordInput: function (e) {
    this.data.password = e.detail.value;
  },
  // 监听用户点击登录事件
  onMyLogin: function() {
    var username = this.data.username;
    var password = this.data.password;
    var _this = this;

    if (username === "") {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (password === "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var urlStr = app.globalData.baseUrl + "/users/singin"
    wx.login({//获取登录凭证
      success: res => {
        wx.request({
          url: urlStr, // 登录路由
          method: 'POST',
          data: {// 发送appid,appsecret和code到开发者服务器
            username: username,
            password: Md5.hexMD5(password),
            "APPID": "wx5cd1eacxxxxxxxxxx",
            "SECRET": "36193xxxxxxxxxxxxxxxxxxxxxxx",
            "JSCODE": res.code
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            //  console.log(res)
            //将登录凭证_3rd_session存入缓存
            if(res && res.data.code == '1'){
              wx.setStorageSync("userData", res.data)
              wx.switchTab({
                url: '/pages/index/index',
              })
            }else{
              wx.showToast({
                title: '用户不存在',
                icon: 'none'
              })
            }
            
          },
          fail(error){
            console.log(error)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})