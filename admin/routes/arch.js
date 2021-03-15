const router = require('koa-router')()
const arch = require('../dbs/models/bigArch')
const axios = require('./utils/axios')

router.prefix('/arch')

// 获取所有大棚
router.get('/getArch', async (ctx, next) => {
  let archHouse = await arch.find()
  ctx.body = {
    archHouse
  }
})

router.get('/addArch', async (ctx, next) => {
  // console.log(ctx.query)
  const { houseId, crops, temperatureT, temperatureL, temperatureS, humidityT, humidityL, humidityS, lightT, lightL, lightS} = ctx.query
  let id = await arch.find({ houseId })
  if (id.length) {
    ctx.body = {
      code: '-1',
      msg: '大棚已存在'
    }
    return
  }
  let temperature = {
    top: temperatureT,
    low: temperatureL,
    suitable: temperatureS
  }
  let humidity = {
    top: humidityT,
    low: humidityL,
    suitable: humidityS,
  }
  let light = {
    top: lightT,
    low: lightL,
    suitable: lightS,
  }
  let newHouse = await arch.create({
    houseId,crops,temperature,light,humidity
  })
  if (newHouse) {
    ctx.body = {
      code: '200',
      msg: '添加成功'
    }
  }
})

router.get('/deleteArch', async (ctx, next) => {
  const {houseId} = ctx.query
  let house = await arch.find({houseId})
  console.log(house)
  if (house.length) {
    await arch.deleteOne({houseId},function(err) {
      if (!err) {
        ctx.body = {
          code: '200',
          msg: '删除成功'
        }
      }
    })
  }else{
    ctx.body = {
      code: '-1',
      msg: '该大棚不存在'
    }
  }
})
router.get('/updateArch', async (ctx, next) => {
  // console.log(ctx.query)
  const { houseId, crops, temperatureT, temperatureL, temperatureS, humidityT, humidityL, humidityS, lightT, lightL, lightS } = ctx.query
  let id = await arch.find({ houseId })
  if (id.length) {
    let temperature = {
      top: temperatureT,
      low: temperatureL,
      suitable: temperatureS
    }
    let humidity = {
      top: humidityT,
      low: humidityL,
      suitable: humidityS,
    }
    let light = {
      top: lightT,
      low: lightL,
      suitable: lightS,
    }

  arch.update({
      houseId, crops, temperature, light, humidity
    }, err => {
      if (!err) {
        ctx.body = {
          code: '200',
          msg: '更新成功'
        }
      }
    })
    
  }else{
    ctx.body = {
      code: '-1',
      msg: '大棚不存在'
    }
  }
})
module.exports = router


