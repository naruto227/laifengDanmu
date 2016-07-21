/**
 * Created by hzq on 16-7-21.
 */
var upload = require('./upload');
function LaiFeng(room_id) {
    this.room_id = room_id;
    this.start()
}
module.exports = LaiFeng;
LaiFeng.prototype.start = function () {
    var roomid = this.room_id;
    var host = "";
    var token = "";
    var touristId = "";
    var options2 = {
        method: 'GET',
        // encoding: null,
        // url: 'http://dispatcher.notify.laifeng.com/60900'
        url: 'http://v.laifeng.com/' + roomid + '/m'
        // url: 'http://v.laifeng.com/' + roomid
    };
    var request = require('request');
    //6767 返回500
    request(options2, function (err, response, body) {
        if (err) {
            return console.log(err);
        }
        var str = body.substring(body.indexOf("<title>") + 7, body.indexOf("<title>") + 13);
        if ("我们非常抱歉" == str) {
            return console.log(roomid + "很抱歉，您所访问的页面未能找到或出现了未知错误！");
        }
        if (body.indexOf("token") < 0) {
            return console.log(roomid + ' 主播现在不在，无弹窗消息 ');//
        }

        token = body.substring(body.indexOf("token") + 7, body.indexOf("token") + 84);
        touristId = body.substring(body.indexOf("touristId:'") + 11, body.indexOf("touristId:'") + 21);
        // console.log(roomid + ": " + token + ' ' + token.length);
        // console.log("touristId: " + touristId);

        // token=token.replace("MA==","");

        var options1 = {
            method: 'GET',
            // encoding: null,
            url: 'http://dispatcher.notify.laifeng.com/' + roomid
            // url: 'http://v.laifeng.com/60900/m'
            // url: 'http://v.laifeng.com/' + room_id
        };
        request(options1, function (err, response, body) {
            if (err) {
                return console.log(err);
            }
            var data = JSON.parse(body);
            host = data.host;

            var values = [];

            var WebSocketClient = require('websocket').client;
            // console.log(roomid + ": " + host);

            var client = new WebSocketClient();

            client.on('connectFailed', function (error) {
                console.log('Connect Error: ' + error.toString());
            });

            client.on('connect', function (connection) {

                console.log('WebSocket Client Connected');
                connection.on('error', function (error) {
                    console.log("Connection Error: " + error.toString());
                });
                connection.on('close', function () {
                    console.log('echo-protocol Connection Closed');
                });
                connection.on('message', function (message) {
                    if (message.type === 'utf8') {
                        // console.log("-----------------" + roomid +
                        //     "------------------" + message.utf8Data);
                        var utf8Data = message.utf8Data;
                        // var data = utf8Data.substring(4);
                        if (utf8Data.indexOf('0:::') == 0) {
                            console.log("error")
                        } else if (utf8Data.indexOf('1:::') == 0) {
                            console.log("connect");
                            // console.log(token);
                            setTimeout(sendData("5:::" + String(JSON.stringify({
                                    "name": "enter",
                                    "args": [{
                                        token: token,
                                        uid: touristId,
                                        roomid: roomid,
                                        //ad1967764ff745308a23413926d9f497_     ct_,dt_1_1003|0|762cc02450c3470baf3f3024f488afb2_
                                        endpointtype: "ct_,dt_1_1003|0|762cc02450c3470baf3f3024f488afb2_" + new Date().getTime()
                                    }]
                                }))), 1000);
                        } else if (utf8Data.indexOf('2:::') == 0) {
                            //heart beat 跟进

                            setTimeout(sendData(String('2::')), 1000);


                        } else if (utf8Data.indexOf('3:::') == 0) {
                            console.log("buqingchu")
                        } else if (utf8Data.indexOf('4:::') == 0) {
                            console.log("buqingchu")
                        } else if (utf8Data.indexOf('5:::') == 0) {
                            var data = JSON.parse(message.utf8Data.substring(4));
                            switch (data.name) {
                                case "enterMessage":
                                case "chatMessage":
                                case "sendStar":
                                case "sendBigGift":
                                case "globalHornMessage":
                                case "sendGift":
                                {
                                    data.ctime = new Date().getTime();
                                    values.push(data);
                                    if (values.length > 20) {
                                        upload.uploadServe(roomid, 'laifeng', values);
                                        values = [];
                                    }
                                }
                                    break;
                                default:
                                    break;
                            }

                            // console.log("data");
                        }

                        /* var data = JSON.parse(utf8Data);
                         data.ctime = new Date().getTime();*/
                    }
                });
                function sendData(data) {
                    try {
                        if (connection.connected) {
                            connection.sendUTF(data);
                            // setTimeout(sendData, 1000);//(String('2::'))
                        }
                    } catch (e) {
                        console.log(e.message);
                    }

                }


            });
            client.connect('ws://' + host + '/socket.io/1/websocket/');

        });

    });
};