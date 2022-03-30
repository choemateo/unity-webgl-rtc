// http://ng.local.com:9008/
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const url = require('url');
var httpServer = require('http');
const app = express();

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Requested-With, X-Auth-Token, Origin, Application");
    next();
});

//================== rtc socket ========================//
const ioServer = require('socket.io');
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
var PORT = 9008;
var isUseHTTPs = true;
const jsonPath = {
    config: 'config.json',
    logs: 'logs.json'
};
const rjsonPath = {
    config: 'rconfig.json',
    logs: 'logs.json'
};
const BASH_COLORS_HELPER = RTCMultiConnectionServer.BASH_COLORS_HELPER;
const getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;
const getBashParameters = RTCMultiConnectionServer.getBashParameters;

var config = getValuesFromConfigJson(jsonPath);
config = getBashParameters(config, BASH_COLORS_HELPER);

var rconfig = getValuesFromConfigJson(rjsonPath);
rconfig = getBashParameters(rconfig, BASH_COLORS_HELPER);

if(isUseHTTPs === false) {
    isUseHTTPs = config.isUseHTTPs;
}
/*
function TransUpdateXY () {
    for(var idx=0; idx < clients.length; idx++) {
        var client = clients[idx];
        if(client.udid === undefined || client.udid === "")
            continue;
        var otherPlayers = Object.keys(players).filter(udid => udid !== client.udid);
        //console.log("client.otherPlayers is " , JSON.stringify(otherPlayers));
        if(JSON.stringify(otherPlayers).length > 2)
        {
            var otherPlayinfos = otherPlayers.map(udid => players[udid]);
            var jsonpf = JSON.stringify(otherPlayinfos);
            client.broadcast.emit('TransXY', jsonpf);
            //client.send('TransXY', jsonpf);
            //console.log(client.userid + " send -> " + jsonpf);
        }

    }
}
*/
function serverHandler(request, response) {
    console.log("account is ", 'ok');
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization, X-Requested-With, X-Auth-Token, Origin, Application",
        "Access-Control-Allow-Origin": "*",
        //"Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    };
    response.writeHead(200, headers);
    response.write('hello world\n');
    response.end();
}

var httpApp;
if (isUseHTTPs) {
    httpServer = require('https');
    // See how to use a valid certificate:
    // https://github.com/muaz-khan/WebRTC-Experiment/issues/62
    var options = {
        key: null,
        cert: null,
        ca: null
    };

    var pfx = false;
    if (!fs.existsSync(config.sslKey)) {
        console.log(BASH_COLORS_HELPER.getRedFG(), 'sslKey:\t ' + config.sslKey + ' does not exist.');
    } else {
        pfx = rconfig.sslKey.indexOf('.pfx') !== -1;
        options.key = fs.readFileSync(rconfig.sslKey);
        //options.key.replace(/\\n/gm, '\n');
    }

    if (!fs.existsSync(config.sslCert)) {
        console.log(BASH_COLORS_HELPER.getRedFG(), 'sslCert:\t ' + config.sslCert + ' does not exist.');
    } else {
        options.cert = fs.readFileSync(config.sslCert);
        //options.cert.replace(/\\n/gm, '\n');
    }

    if (config.sslCabundle) {
        if (!fs.existsSync(config.sslCabundle)) {
            console.log(BASH_COLORS_HELPER.getRedFG(), 'sslCabundle:\t ' + config.sslCabundle + ' does not exist.');
        }
        options.ca = fs.readFileSync(config.sslCabundle);
    }

    if (pfx === true) {
        options = {
            pfx: sslKey
        };
    }
    //console.log("www options=>");
    httpApp = httpServer.createServer(options, serverHandler);
} else {
    httpApp = httpServer.createServer(serverHandler);
}

RTCMultiConnectionServer.beforeHttpListen(httpApp, config);
httpApp = httpApp.listen(process.env.PORT || PORT, "0.0.0.0", function() {
    RTCMultiConnectionServer.afterHttpListen(httpApp, config);
    // setInterval(TransUpdateXY, 150);
    console.log('Rtc Listening on https://ug.local.com:9008/');
});
// --------------------------
// socket.io codes goes below
ioServer(httpApp, {
    cors: {
        origin: "*",
        methods: "*",
        headers: "*"
    }
}).on('connection', function(socket) {
    RTCMultiConnectionServer.addSocket(socket, config);
    //console.log("server message =>" , socket.userid);
    const params = socket.handshake.query;
    if (!params.socketCustomEvent) {
        params.socketCustomEvent = 'custom-message';
    }
    socket.on(params.socketCustomEvent, function(message) {
        socket.broadcast.emit(params.socketCustomEvent, message);
    });
});
