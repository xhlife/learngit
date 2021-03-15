// pages/connect/connect.js
var app = getApp()
var wsUrl = app.globalData.wsUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    input_msg: '',
    Message:{
      userId: '',
      userName: '', 
    },
    // socket对象
    wsConcat: null 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 清除本地缓存
    // wx.removeStorageSync('Message')
    // 获取用户信息
    let userInfo = wx.getStorageSync('userData').userinfo
    var that = this
    // 缓存中的信息对象
    let Message = wx.getStorageSync('Message') || {}
    // 信息列表为空
    if (userInfo._id != Message.userId) {
      // 构造数据结构
      Message.userId = userInfo._id
      Message.userName = userInfo.username
      Message.message = [
        // {
        //   belong: 'admin',
        //   to:'super',
        //   msgId: '1',
        //   content: '你好呀！',
        //   isRead: false
        // },
        // {
        //   belong: 'server',
        //   to:'admin',
        //   msgId: '1',
        //   content: '你好呀！',
        //   isRead: false
        // }
      ]
      wx.setStorageSync('Message',Message)
    }
    // 将缓存中的信息，赋值给当前页面的data
    this.setData({
      Message
    })
    /* wx.onSocketOpen(function(){
      console.log('打开成功')
    }) */
    // 打开webSocket 192.168.2.108
    this.data.wsConcat = wx.connectSocket({
      url: `${wsUrl}/concat?${userInfo.username}:super`,
      success(res){
        console.log(res)
      },
      fail(err){
        console.log(err)
      }
    }) 
    // 处理接收信息
    this.data.wsConcat.onMessage(function (res) {
      console.log(JSON.parse(res.data))
      let content = JSON.parse(res.data)
      
      if (content.code == 200 || content.code == -1) {
        return
      }
      Array.prototype.push.call(Message.message, content)
      wx.setStorageSync('Message', Message)
      that.setData({
        Message
      })

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 用户输入
  userInput(e){
    if (e.detail.value.length > 0) {
      this.setData({
        show: true,
        input_msg: e.detail.value
      })
    }
    else{
      this.setData({
        show: false,
        input_msg:''
      })
    }
    
  },
  // 用户发送
  handleSend(e){
    let data
    let Message = this.data.Message
    let msgId = new Date().getTime().toString()
    if (this.data.input_msg) {
      data = {
        belong: this.data.Message.userName,
        to:'super',
        msgId,
        content: this.data.input_msg,
        isRead: false
      }
      Array.prototype.push.call(Message.message,data)
    }
    //处理信息的发送
    this.data.wsConcat.send({
      // data: [],
      data: JSON.stringify(data)
    })
    
    this.data.wsConcat.onError(function (err) {
      console.log(err)
    })


    this.setData({
      Message,
      input_msg: ''
    })
    wx.setStorageSync('Message', Message)
  }
})