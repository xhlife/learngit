// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userinfo = wx.getStorageSync('userData').userinfo
    this.setData({
      userinfo
    })
  },
  handleLogout(){
    wx.removeStorageSync('userData')
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },
  handleSetting(){
    wx.redirectTo({
      url: '/pages/setting/setting'
    })
  }
})