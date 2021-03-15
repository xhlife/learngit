// pages/index/index.js
const app = getApp()
var baseUrl = app.globalData.baseUrl
var wsUrl = app.globalData.wsUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    archHouse: [],
    show: false,
    error: false,
    menuShow: false,
    deleteShow: false,
    changeShow: false,
    deleteHouseId:'',
    changeHouseId: '',
    houseId: '',
    crops: '',
    temperatureT: '',
    temperatureL: '',
    temperatureS: '',
    humidityT: '',
    humidityL: '',
    humidityS: '',
    lightT: '',
    lightL: '',
    lightS: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const House = wx.getStorageSync('archHouse') || {}
    const userData = wx.getStorageSync('userData') || {}
    if (JSON.stringify(House) === '{}' && JSON.stringify(userData) != '{}') {
      var _this = this
      // 如果本地数据为空。 那么请求数据库的数据
      wx.request({
        url: `${baseUrl}/arch/getArch`,
        success(res) {
          let archHouse = res.data.archHouse
          wx.setStorageSync('archHouse', archHouse)
          _this.setData({
            archHouse
          })
        },
        fail(err) {
          console.log(err)
        }
      })
      return
    }
    this.setData({
      archHouse: House
    })

    // 开启连接webSocket, 获取监听是否正常

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 点击进行页面跳转
  showData: function (e) {
    wx.navigateTo({
      url: '/pages/showData/showData?id=' + e.target.dataset.id,
    })
  },
  // 点击新增大棚
  addArch() {
    let show = !this.data.show
    let menuShow = false
    this.setData({
      show,
      menuShow
    })
  },
  // 点击取消添加
  cancelAdd() {
    this.setData({
      show: false
    })
  },
  // 点击确认按钮
  confirmAdd() {
    var _this = this
    // 判断需要的数据是否为空
    const { houseId, crops, temperatureT, temperatureL, temperatureS, humidityT, humidityL, humidityS, lightT, lightL, lightS } = this.data
    
    if (houseId&&crops&&temperatureT&&temperatureL&& temperatureS&&humidityT&&humidityL&&humidityS&& lightT&&lightL&&lightS) {
      wx.request({
        url: baseUrl + '/arch/addArch',
        data: {
          houseId, crops, temperatureT, temperatureL, temperatureS, humidityT, humidityL, humidityS, lightT, lightL, lightS
        },
        success(res){
          console.log(res.data)
          if (res.data.code == '200') {
            _this.setData({
              show: false
            })
            wx.showToast({
              title: '添加成功',
              icon: 'success'
            })
          }else if (res.data.code == '-1') {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        },
        fail(err){
          console.log(err)
        }
      })
    }else{
      wx.showToast({
        title: '数据不完整',icon: 'none'
      })
    }
  },
  // 添加大棚的输入框事件，输入框失去焦点事件
  inputBlur(e) {
    // console.log(e.currentTarget.dataset)
    if (e.detail.value === '') {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none'
      })
      return
    }
    // 大棚id
    if (e.currentTarget.dataset.name == 'houseId') {
      this.setData({
        houseId: e.detail.value
      })
    }
    // 作物
    if (e.currentTarget.dataset.name == 'crops') {
      this.setData({
        crops: e.detail.value
      })
    }
    // 最高温
    if (e.currentTarget.dataset.name == 'temperatureT') {
      this.setData({
        temperatureT: e.detail.value
      })
    }
    // 最低温
    if (e.currentTarget.dataset.name == 'temperatureL') {
      this.setData({
        temperatureL: e.detail.value
      })
    }
    // 最适温
    if (e.currentTarget.dataset.name == 'temperatureS') {
      this.setData({
        temperatureS: e.detail.value
      })
    }
    // 最高湿度
    if (e.currentTarget.dataset.name == 'humidityT') {
      this.setData({
        humidityT: e.detail.value
      })
    }
    // 最低湿度
    if (e.currentTarget.dataset.name == 'humidityL') {
      this.setData({
        humidityL: e.detail.value
      })
    }
    // 最佳湿度
    if (e.currentTarget.dataset.name == 'humidityS') {
      this.setData({
        humidityS: e.detail.value
      })
    }
    // 最高光照
    if (e.currentTarget.dataset.name == 'lightT') {
      this.setData({
        lightT: e.detail.value
      })
    }
    // 最低光照
    if (e.currentTarget.dataset.name == 'lightL') {
      this.setData({
        lightL: e.detail.value
      })
    }
    // 最适光照
    if (e.currentTarget.dataset.name == 'lightS') {
      this.setData({
        lightS: e.detail.value
      })
    }
  },
  //单击菜单
  menuClick() {
    let menuShow = !this.data.menuShow
    let show = false;
    this.setData({
      menuShow,
      show
    })
  },
  // 菜单中的个人中心点击事件
  myCenter(){
    wx.switchTab({
      url: '/pages/my/my'
    })
  },
  // 菜单中删除按钮的点击
  deleteArch(){
    let deleteShow = !this.data.deleteShow
    this.setData({
      deleteShow
    })
  },
    // 取消删除大棚
  deleteCancel(){
    let deleteShow = !this.data.deleteShow
    this.setData({
      deleteShow
    })
  },
    // 删除大棚模态框中的输入事件
  deleteInput(e){
    this.setData({
      deleteHouseId: e.detail.value
    })
  },
  // 确认删除大棚
  deleteConfirm(){
    // console.log(this.data.deleteHouseId)
    var _this = this
    let houseId = this.data.deleteHouseId
    if (houseId) {
      wx.request({
        url: baseUrl + '/arch/deleteArch',
        data: {houseId},
        success(res){
          if (res.data.code == '200') {
            wx.showToast({
              title: '删除成功',
              icon: 'none'
            })
            _this.setData({
              deleteShow: false,
            })
          }else if (res.data.code == '-1') {
            wx.showToast({
              title: '该大棚不存在',
              icon: 'none'
            })
          }
        },
        fail(err){
          console.log(err)
        }
      })
    }else{
      wx.showToast({
        title: '输入不能为空',
        icon: 'none'
      })
    }
  },

  // 菜单中大棚信息修改按钮
  changeInfo(){
    let changeShow = !this.data.changeShow
    this.setData({
      changeShow
    })
  },
  // 修改输入
  changeIdInput(e){
    let _this = this
    let id = e.detail.value;
    if (id) {
      let house = wx.getStorageSync('archHouse')
      if (house.length) {
        let res = house.filter( (item) => {
          return item.houseId == id
        })
        if (res.length) {
          console.log(res)
          _this.setData({
            changeHouseId: res[0].houseId,
            crops: res[0].crops,
            temperatureT: res[0].temperature.top,
            temperatureL: res[0].temperature.low,
            temperatureS: res[0].temperature.suitable,
            humidityT: res[0].humidity.top,
            humidityL: res[0].humidity.low,
            humidityS: res[0].humidity.suitable,
            lightT: res[0].light.top,
            lightL: res[0].light.low,
            lightS: res[0].light.suitable
          })
        }
      }
    }else{
      _this.setData({
        changeHouseId: '',
        crops: '',
        temperatureT: '',
        temperatureL: '',
        temperatureS: '',
        humidityT: '',
        humidityL: '',
        humidityS: '',
        lightT: '',
        lightL: '',
        lightS: ''
      })
    }
   
  },
  // 取消修改信息
  changeCancel(){
    let changeShow = !this.data.changeShow
    this.setData({
      changeShow
    })
  },
  // 确认修改
  changeConfirm(){
    var _this = this
    // 判断需要的数据是否为空
    const { changeHouseId, crops, temperatureT, temperatureL, temperatureS, humidityT, humidityL, humidityS, lightT, lightL, lightS } = this.data

    if (changeHouseId && crops && temperatureT && temperatureL && temperatureS && humidityT && humidityL && humidityS && lightT && lightL && lightS) {
      wx.request({
        url: baseUrl + '/arch/updateArch',
        data: {
          houseId: changeHouseId, crops, temperatureT, temperatureL, temperatureS, humidityT, humidityL, humidityS, lightT, lightL, lightS
        },
        success(res) {
          console.log(res.data)
          if (res.data.code == '200') {
            _this.setData({
              show: false
            })
            wx.showToast({
              title: '更新成功',
              icon: 'success'
            })
          } else if (res.data.code == '-1') {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        },
        fail(err) {
          console.log(err)
        }
      })
    } else {
      wx.showToast({
        title: '数据不完整', icon: 'none'
      })
    }
  },
  // 下拉刷新事件
  onPullDownRefresh(){
    var _this = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.request({
      url: baseUrl + '/arch/getArch',
      success(res){
        let archHouse = res.data.archHouse
        wx.setStorageSync('archHouse', archHouse)
        _this.setData({
          archHouse
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail(err){
        console.log(err)
      }
    })
  }
})