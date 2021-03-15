class wsRequest {
    constructor(url){
        this.ws = new WebSocket(url)
        this.initListeners()
    }
    initListeners(){
        this.ws.onopen = _event => {
            console.log('client打开了ws');
        }
        this.ws.onclose = _event => {
            console.log('client close');
        }
    }

    send(content){
        this.ws.send(content)
    }
    close(){
        this.ws.close()
    }
    onmessage(callback){
        this.ws.onmessage = _event => {
            callback(_event)
        }
    }
}