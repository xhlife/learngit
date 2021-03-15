window.onload = function () {
    // 获取管理员用户名
    let superUsername = document.getElementById('super-username').innerText
    // console.log(superUsername.innerText);
    
    // 1、激活当前导航栏
    let concat = document.getElementById('concat')
    concat.setAttribute('class', 'active')

    // 2、初始化聊天列表
        // 、获取联系人容器
        let userList = document.getElementById('user-list')
        let children
        //console.log(children);
    $.ajax({
        url: '/userList',
        type: 'post',
        success: function (data, status) {
            // console.log(data)
            for (const key in data.userMap) {
                if (data.userMap.hasOwnProperty(key)) {
                    // console.log(data.userMap[key].username);
                    let li = document.createElement('li')
                    li.setAttribute('class','concat_list_user')
                    li.innerHTML = data.userMap[key].username
                    userList.appendChild(li)
                }
            }
            children = userList.children
        },
        error: function (data, status) {

        }
    });
    //http://192.168.2.108:3000
    // 3、开启websocket
    const ws = new wsRequest(`ws://192.168.2.108:3000/concat?${superUsername}:${undefined}`)
     console.log(ws);
   
    
    // 4、点击联系人出现聊天窗口
         //获取聊天窗口 和联系人名称
    let concat_right = document.getElementsByClassName('concat_right')[0]  // 右边的一整块
    let username = document.getElementsByClassName('username')[0]  // 右边顶部用户名
    var msg_box = document.getElementsByClassName('concat_box')[0]  // 右边聊天窗口
    //监听li的点击采用事件冒泡处理 li 点击
    userList.addEventListener('click', function (e) {
        let ev = e || window.event
        let target = ev.target || ev.srcElement;
        // 修改聊天窗口上面的用户名称
        username.innerHTML = target.innerText;

        // 让左边当前用户处于激活妆台
        for (let index = 0; index < children.length; index++) {
            children[index].className = 'concat_list_user'
        }
        target.className += ' act'

        // 在localStorage中寻找聊天数据 
        var message = localStorage.getItem(target.innerText) || {};
        // if (message.userName != target.innerText) {
        //     message = {
        //         userName: target.innerText,
        //         message: [
        //             {
        //                 belong: 'super',
        //                 to: target.innerText,
        //                 msgId: '1',
        //                 content: '我是super',
        //                 isRead: false
        //             },
        //             {
        //                 belong: target.innerText,
        //                 to: 'super',
        //                 msgId: '1',
        //                 content: `我是${target.innerText}`,
        //                 isRead: false
        //             }]
        //     }
        //     localStorage.setItem(target.innerText, JSON.stringify(message))
        // }
        
        // 判断当前点击的是否为li标签
        if (target.tagName.toLowerCase() === 'li'  ) {
            // 显示聊天窗口
            concat_right.style.display = 'block'
            
            // 遍历用户信息添加到聊天窗口
            if (JSON.stringify(message) == '{}') {
                return
            }
            let content = JSON.parse(message).message
            // 清空前一个用户的信息
            msg_box.innerText = ''
            for (let index = 0; index < content.length; index++) {
                // 信息来自小程序客户
                if (content[index].belong == target.innerText) {
                    let div = document.createElement('div')
                    div.setAttribute('class', 'msg server_msg')
                    div.innerText = `${content[index].content}`
                    msg_box.appendChild(div)
                } else if (content[index].belong == 'super') { // 信息属于客服
                    let div = document.createElement('div')
                    div.setAttribute('class', 'msg user_msg')
                    div.innerText = `${content[index].content}`
                    msg_box.appendChild(div)
                    
                }
            }
            
        }
    })


    // 5、监听发送按钮的点击
    var msg_btn = document.getElementById('send_btn')  // 获取按钮
    var input = document.getElementById('input_msg') // 获取输入框div
    var user_content = input.children[0] // 获取 textarea 
    var input_tips = document.getElementById('input_tips')
   
    var timer = null
    msg_btn.addEventListener('click', function(e){
        console.log(username.innerText);
        
        // 判断输入内容是否为空
        clearTimeout(timer)
        if (!user_content.value.length) {
            input_tips.style.display = 'block'
            timer = setTimeout(() => {
                input_tips.style.display = 'none'
            }, 2000);
            return
        } 
        var content_div = document.createElement('div')
        content_div.innerHTML = `<div class="msg user_msg"><sapn>${user_content.value}</sapn>
                            </div>`
        // websocket 发送输入框的消息  
            // 定义消息格式
        let msgId = new Date().getTime().toString()
        let sendData = {
            belong: superUsername,
            to: username.innerText,
            msgId,
            content: user_content.value,
            isRead:false
        }                
        ws.send(JSON.stringify(sendData))  // 发送消息 
        msg_box.appendChild(content_div) // 将消息添加到消息框中
        user_content.value = ''     // 清空输入框内容
        
        // 将消息存入本地缓存
        let message = localStorage.getItem(username.innerText) || {}
        if (JSON.stringify(message) == '{}'){  // 如果是客服第一次发信息
            let data = {
                userName: username.innerText ,
                message: [sendData]
            }
            let msg = JSON.stringify(data)
            localStorage.setItem(username.innerText, msg)
            return
        }
        // 不是第一次发信息
        let msg = JSON.parse(message)
        msg.message.push(sendData)
        message = JSON.stringify(msg)
        localStorage.setItem(username.innerText, message)
    })

    // 6、监听websocket接收消息
   /*  ws.onmessage = _event => {
        console.dir(_event);
        let content = JSON.parse(_event.data)
        console.log(`来自服务器的信息：${_event.data}`);
    } */
    ws.onmessage(function(_event){
        let content = JSON.parse(_event.data)
        if (content.code == '200') {  // 如果是发送成功的回馈信息那么不处理
            return
        }
        let message = localStorage.getItem(content.belong) || {}
        if (JSON.stringify(message) == '{}') { // 如果localStorage中没有数据
             let data = {
                 userName: content.belong,
                 message: [content]
             }
             let msg = JSON.stringify(data)
            localStorage.setItem(content.belong, msg)

            if (username.innerText == content.belong) {
                let div = document.createElement('div')
                div.setAttribute('class', 'msg server_msg')
                div.innerText = `${content.content}`
                msg_box.appendChild(div)
                // console.log(`来自服务器的信息：${_event.data}`);
            }
            return
        }
        let msg = JSON.parse(message) 
        msg.message.push(content)
        message = JSON.stringify(msg)
        localStorage.setItem(content.belong,message)

        if (username.innerText == content.belong) {
            let div = document.createElement('div')
            div.setAttribute('class', 'msg server_msg')
            div.innerText = `${content.content}`
            msg_box.appendChild(div)
            // console.log(`来自服务器的信息：${_event.data}`);
        }
    })

}
// Create WebSocket connection.
/*  const socket = new WebSocket('ws://localhost:3000/concat');

 // Connection opened
 socket.addEventListener('open', function (event) {
     socket.send('Hello Server! 我是浏览器');
 });
 // Listen for messages
 socket.addEventListener('message', function (event) {
     console.log('Message from server ', event.data);
 });   */