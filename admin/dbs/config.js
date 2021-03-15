module.exports = {
    dbs:"mongodb://127.0.0.1:27017/bs",
    redis:{
        get host(){
            return '127.0.0.1'
        },
        get port(){
            return 6379
        }
    },
    smtp:{
        get host(){
            return 'smtp.163.com'
        },
        get user(){
            return '13437593806@163.com'
        },
        get pass(){
            return 'xxxxxxx' // 填写邮件的授权密码
        },
        get code(){
            return () =>{
                return Math.random().toString(16).slice(2,6).toLowerCase()
            }
        },
        get expire(){
            return () => {
                return new Date().getTime() +  60 * 1000
            }
        }
    }
}
