### 毕业设计项目 
>   基于物联网的农业大棚监控系统


### 环境
node 版本 v10.16.0 
koa2.x
原生小程序
redis和monogodb 
monogodb 数据库名称为 bs 
dbs:"mongodb://127.0.0.1:27017/`bs`"

> admin  网页端用户管理系统
启动服务
```javascript
npm i 
npm run dev
```
> client  

直接在微信开发者平台编译
注意  -->将小程序中ajax的本地地址替换,
     同时替换appid 和secret
```javascript
globalData: {
    baseUrl: "http://192.168.56.1:3000",
    wsUrl: "ws://192.168.56.1:3000"
    }
```

### 线上答辩视频演示
https://www.bilibili.com/video/BV1j5411W76z?t=27