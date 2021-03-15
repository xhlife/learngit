const axios = require('axios')
// 创建axios实例
const instance = axios.create({
    // 连接地址
    // 不设置的话,默认: localhost:3000
    baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
    timeout: 5000,
    // 设置头部
    headers: {

    }
})

module.exports = instance