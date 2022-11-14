const WebSocket = require('ws')

const ws = {
    ws: "",
    onEvent(channel, callback) {
        const ws = new WebSocket("wss://socket.viacometa.com.br/orchestrator/subscribe");
        ws.onopen = function () {
            ws.send(
                JSON.stringify({
                    request: {
                        method: "subscribe",
                        arguments: {
                            topics: [channel],
                        },
                    },
                })
            );
        };

        ws.onmessage = function (event) {
            let data = JSON.parse(event.data);
            if (data.request !== null) {
                ws.send(
                    JSON.stringify({
                        request: undefined,
                        response: {
                            result: "None",
                            result_type: "str",
                            call_id: data.request.call_id,
                        },
                    })
                );
                return callback(data);
            }
            return data;
        };
        this.ws = ws;
    },
    close() {
        this.ws.close();
    },
    emit(channel, data) {
        const ws = new WebSocket("wss://socket.viacometa.com.br/orchestrator/subscribe");
        ws.onopen = function () {
            ws.send(
                JSON.stringify({
                    request: {
                        method: "publish",
                        arguments: {
                            topics: [channel],
                            data: data
                        },
                    },
                })
            );
        };
    }
};

export default ws;