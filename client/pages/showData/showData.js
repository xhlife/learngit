// pages/showData/showData.js
var wxCharts = require('../../utils/wxcharts-min.js')
var app = getApp()
var dataLineChart = null
var dataSocket = null  // 数据socket对象
/* var humidityLineChart = null
var lightLineChart = null */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arch_id: '',
    currentHouse: {},
    realTimeData: {
      temperature:{
        temperatureTime: ['08:12:01', '08:12:02', '08:12:03', '08:12:04'],
        temperatureData: ['-4', '31', '10', '20'],
      },
      humidity:{
        humidityTime: ['08:12:01', '08:12:02', '08:12:03', '08:12:04'],
        humidityData: ['60', '20', '40', '30']
      },
      light:{
        lightTime: ['08:12:01', '08:12:02', '08:12:03', '08:12:04'],
        lightData: ['40', '60', '80', '75']
      }
    },
    controlStatus:{  // 定义控制状态，默认全部不控制
      temperatureUp: {
        controlName: '升温',
        stop: '',
        ing: false
      }, 
      temperatureDown: {
        controlName: '通风降温',
        stop: '',
        ing: false
      },
      watering: {
        controlName: '浇水',
        stop: '',
        ing: false
      },
      fertilize: {
        controlName: '施肥',
        stop: '',
        ing: false
      },
      lightOn: {
        controlName: '开灯',
        stop: '关灯',
        ing: false
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this
    // 获取页面参数
    const pages = getCurrentPages();
    let currentPage = pages[pages.length - 1]
    const { id } = currentPage.options
    const archData = wx.getStorageSync('archHouse') || {}
    let currentHouse = archData.filter((item) => {
      return item['houseId'] == id
    })
    // 设置数据
    this.setData({
      currentHouse,
      arch_id: id
    })
    // 开启连接webSocket
    dataSocket = wx.connectSocket({
      url: `${app.globalData.wsUrl}/dataOrigin?archId:dataSender`,
      success(res) {
        console.log(res)
      }
    })
    
    // 接收socket数据
    dataSocket.onMessage((res) => {
      // console.log(res.data)
      let SocketData = JSON.parse(res.data)
      // console.log(SocketData)
      let curArchData = SocketData[_this.data.arch_id]
      // 获取data中的实时数据
      let realTimeData = this.data.realTimeData
      if (curArchData) {
        let curData = curArchData.realTimeData
        // 温度赋值
        if (realTimeData.temperature.temperatureData.length > 3) {
          realTimeData.temperature.temperatureData.shift();
          realTimeData.temperature.temperatureData.push(curData.temperature.temperatureData)

          realTimeData.temperature.temperatureTime.shift();
          realTimeData.temperature.temperatureTime.push(curData.temperature.temperatureTime)
        } else {
          realTimeData.temperature.temperatureData.push(curData.temperature.temperatureData)
          realTimeData.temperature.temperatureTime.push(curData.temperature.temperatureTime)
        }
        // 光照赋值
        if (realTimeData.light.lightData.length > 3) {
          realTimeData.light.lightData.shift();
          realTimeData.light.lightData.push(curData.light.lightData)
          realTimeData.light.lightTime.shift();
          realTimeData.light.lightTime.push(curData.light.lightTime)
        } else {
          realTimeData.light.lightData.push(curData.light.lightData)
          realTimeData.light.lightTime.push(curData.light.lightTime)
        }
        // 湿度赋值
        if (realTimeData.humidity.humidityData.length > 3) {
          realTimeData.humidity.humidityData.shift();
          realTimeData.humidity.humidityData.push(curData.humidity.humidityData)
          realTimeData.humidity.humidityTime.shift();
          realTimeData.humidity.humidityTime.push(curData.humidity.humidityTime)
        } else {
          realTimeData.humidity.humidityData.push(curData.humidity.humidityData)
          realTimeData.humidity.humidityTime.push(curData.humidity.humidityTime)
        }
      }
      // console.log(realTimeData)  
      this.setData({
        realTimeData
      })
      // 更新折线表数据
      let categories = this.data.realTimeData.temperature.temperatureTime;
      let series = [
        {
          name: '温度°C',
          data: this.data.realTimeData.temperature.temperatureData,//websocket接收到的数据
          format: function (val) {
            if (typeof val == "string") {
              val = parseFloat(val);
            }
            return val.toFixed(1) + '°C';
          }
        },
        {
          name: '湿度%rh',
          data: this.data.realTimeData.humidity.humidityData,//websocket接收到的数据
          format: function (val) {
            if (typeof val == "string") {
              val = parseFloat(val);
            }
            return val.toFixed(1) + '%rh';
          }
        },
        {
          name: '光照强度lx',
          data: this.data.realTimeData.light.lightData,//websocket接收到的数据
          format: function (val) {
            if (typeof val == "string") {
              val = parseFloat(val);
            }
            return val.toFixed(1) + 'lx';
          }
        }
      ]
      dataLineChart.updateData({
        categories,
        series
      });

    })

    // wxchart实例--数据监控
    dataLineChart = new wxCharts({
      canvasId: 'dataChart',//指定canvas的id
      animation: false,
      type: 'line',//类型是线形图
      categories: this.data.realTimeData.temperature.temperatureTime,

      series: [
        {
          name: '温度°C',
          data: this.data.realTimeData.temperature.temperatureData,//websocket接收到的数据
          format: function (val) {
            if (typeof val == "string") {
              val = parseFloat(val);
            }
            return val.toFixed(1) + '°C';
          }
        },
        {
          name: '湿度%rh',
          data: this.data.realTimeData.humidity.humidityData,//websocket接收到的数据
          format: function (val) {
            if (typeof val == "string") {
              val = parseFloat(val);
            }
            return val.toFixed(1) + '%rh';
          }
        },
        {
          name: '光照强度lx',
          data: this.data.realTimeData.light.lightData,//websocket接收到的数据
          format: function (val) {
            if (typeof val == "string") {
              val = parseFloat(val);
            }
            return val.toFixed(1) + 'lx';
          }
        }
      ],
      yAxis: {
        format: function (val) {
          return val.toFixed(1);
        },
        min: -10
      },
      extra: {
        lineStyle: 'curve' // (仅对line, area图表有效) 可选值：curve曲线，straight直线 (默认)
      },
      width: 320,
      height: 250
    });
  },
  /**
    * 升温事件
    */
  temperatureUp(){
    var _this = this;
    const controlStatus = this.data.controlStatus;  // 当前控制状态
    let currenttemperature = this.data.realTimeData.temperature.temperatureData[this.data.realTimeData.temperature.temperatureData.length - 1]; // 当前温度
    let suitable = this.data.currentHouse[0].temperature.suitable  // 最适温度
    // 温度小于最适温度的情况,且不为升温态
    if (!controlStatus.temperatureUp.ing) {
      wx.showModal({
        title: '提示',
        content: '是否确定升温？',
        success(res) {
          if (res.confirm) {
            console.log('用户确认')
            // webSocket发送升温请求

            // 更新数据
            controlStatus.temperatureUp.ing = !controlStatus.temperatureUp.ing
            _this.setData({
              controlStatus
            })
          }
        }
      })
    }
    // 如果当前为升温状态-停止升温
    if (controlStatus.temperatureUp.ing) {
      // webSocket发送停止升温请求


      // 请求成功之后，更新数据
      controlStatus.temperatureUp.ing = !controlStatus.temperatureUp.ing
      _this.setData({
        controlStatus
      })
    }
  },
  /* 
    通风降温事件 
  */
  temperatureDown(){
    var _this = this;
    const controlStatus = this.data.controlStatus;  // 当前控制状态
    let currenttemperature = this.data.realTimeData.temperature.temperatureData[this.data.realTimeData.temperature.temperatureData.length - 1]; // 当前温度
    let suitable = this.data.currentHouse[0].temperature.suitable  // 最适温度

    // 当前不为降温态
    if (!controlStatus.temperatureDown.ing) {
      wx.showModal({
        title: '提示',
        content: '是否确定降温？',
        success(res) {
          if (res.confirm) {
            // webSocket发送降温请求
            let dataCtrl = {
              houseId: _this.data.arch_id,
              controlName: 'temperatureDown',
              temperatureDown: true,
              to: 'dataSender'
            }

            dataSocket.send({
              data: JSON.stringify(dataCtrl)
            })
            // 更新数据
            controlStatus.temperatureDown.ing = !controlStatus.temperatureDown.ing
            _this.setData({
              controlStatus
            })
          }
        }
      })
    }
    // 如果当前为降温状态-停止降温
    if (controlStatus.temperatureDown.ing) {
      wx.showModal({
        title: '提示',
        content: '是否停止通风降温？',
        success(res){
          if (res.confirm) {
            // webSocket发送停止升温请求
            let dataCtrl = {
              houseId: _this.data.arch_id,
              controlName: 'temperatureDown',
              temperatureDown: false,
              to: 'dataSender'
            }

            dataSocket.send({
              data: JSON.stringify(dataCtrl)
            })
            // 请求成功之后，更新数据
            controlStatus.temperatureDown.ing = !controlStatus.temperatureDown.ing
            _this.setData({
              controlStatus
            })

          }
        }
      })
    }
  },
  /* 
    浇水事件
  */
  watering() {
    var _this = this;
    const controlStatus = this.data.controlStatus;  // 当前控制状态
    let currentHumidity = this.data.realTimeData.humidity.humidityData[this.data.realTimeData.humidity.humidityData.length - 1]; // 当前湿度
    let suitable = this.data.currentHouse[0].humidity.suitable  // 最适湿度

    // 湿度小于最适湿度
    if (!controlStatus.watering.ing) {
      wx.showModal({
        title: '提示',
        content: '是否确定浇水？',
        success(res) {
          if (res.confirm) {
            // webSocket发送浇水请求
            let dataCtrl = {
              houseId: _this.data.arch_id,
              controlName: 'watering',
              watering: true,
              to: 'dataSender'
            }
            
            dataSocket.send({
                data: JSON.stringify(dataCtrl)
            })
            controlStatus.watering.ing = !controlStatus.watering.ing
            _this.setData({
              controlStatus
            })
          }
        }
      })
      return
    }
    // 如果当前为浇水状态-停止浇水
    if (controlStatus.watering.ing) {
      wx.showModal({
        title: '提示',
        content: '是否停止浇水？',
        success(res){
          if (res.confirm) {
            let dataCtrl = {
              houseId: _this.data.arch_id,
              controlName: 'watering',
              watering: false,
              to: 'dataSender'
            }
            // webSocket发送停止浇水请求
            dataSocket.send({
              data: JSON.stringify(dataCtrl)
            })
            controlStatus.watering.ing = !controlStatus.watering.ing
            _this.setData({
              controlStatus
            })
          }
        }
      })
    }
  },
  /* 
    施肥事件 
  */
  fertilize() {
    var _this = this;
    const controlStatus = this.data.controlStatus;  // 当前控制状态

    // 如果不为施肥状态
    if (!controlStatus.fertilize.ing) {
      wx.showModal({
        title: '提示',
        content: '是否确定施肥？',
        success(res) {
          if (res.confirm) {
            // webSocket发送浇水请求
            let dataCtrl = {
              houseId: _this.data.arch_id,
              controlName: 'fertilize',
              fertilize: true,
              to: 'dataSender'
            }
            dataSocket.send({
              data: JSON.stringify(dataCtrl)
            })

            // 施肥操作成功，更新数据
            controlStatus.fertilize.ing = !controlStatus.fertilize.ing
            _this.setData({
              controlStatus
            })
          }
        }
      })
    }else{  // 如果为施肥状态
      wx.showModal({
        title: '提示',
        content: '是否停止施肥？',
        success(res){
          if (res.confirm) {
            let dataCtrl = {
              houseId: _this.data.arch_id,
              controlName: 'fertilize',
              fertilize: true,
              to: 'dataSender'
            }
            dataSocket.send({
              data: JSON.stringify(dataCtrl)
            })

            // 施肥操作成功，更新数据
            controlStatus.fertilize.ing = !controlStatus.fertilize.ing
            _this.setData({
              controlStatus
            })
          }
        }
      })
    }
  },
  /* 
    开灯和关灯 
  */
  lightOn(){
    var _this = this;
    const controlStatus = this.data.controlStatus;
    if (!controlStatus.lightOn.ing) {
      wx.showModal({
        title: '提示',
        content: '是否确定开灯？',
        success(res) {
          if (res.confirm) {
            // webSocket发送开灯请求
            let dataCtrl = {
              houseId: _this.data.arch_id,
              controlName: 'lightOn',
              lightOn: true,
              to: 'dataSender'
            }
            dataSocket.send({
              data: JSON.stringify(dataCtrl)
            })
            // 关灯操作成功，更新数据
            controlStatus.lightOn.ing = !controlStatus.lightOn.ing
            _this.setData({
              controlStatus
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '是否确定关灯？',
        success(res) {
          if (res.confirm) {
            // webSocket发送关灯请求
            let dataCtrl = {
              houseId: _this.data.arch_id,
              controlName: 'lightOn',
              lightOn: false,
              to: 'dataSender'
            }
            dataSocket.send({
              data: JSON.stringify(dataCtrl)
            })
            // 关灯操作成功，更新数据
            controlStatus.lightOn.ing = !controlStatus.lightOn.ing
            _this.setData({
              controlStatus
            })
          }
        }
      })
    }
  }
})
