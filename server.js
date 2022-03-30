// http://127.0.0.1:9008
//run command : node server / node server --ssl
const fs = require('fs');
var httpServer = require('http');
var runner = require("child_process");

const ioServer = require('socket.io');
const RTCMultiConnectionServer = require('./node_scripts/index.js');

var PORT = 9008;
var isUseHTTPs = true;

const jsonPath = {
    config: 'config.json',
    logs: 'logs.json'
};

var clients=[];

const BASH_COLORS_HELPER = RTCMultiConnectionServer.BASH_COLORS_HELPER;
const getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;
const getBashParameters = RTCMultiConnectionServer.getBashParameters;

var config = getValuesFromConfigJson(jsonPath);
config = getBashParameters(config, BASH_COLORS_HELPER);

if(PORT === 9008) {
    PORT = config.port;
}
if(isUseHTTPs === false) {
    isUseHTTPs = config.isUseHTTPs;
}

function serverHandler(request, response) {
    // to make sure we always get valid info from json file
    // even if external codes are overriding it
    config = getValuesFromConfigJson(jsonPath);
    config = getBashParameters(config, BASH_COLORS_HELPER);
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.write('RTCMultiConnection Socket.io Server.\n\n' + 'https://github.com/muaz-khan/RTCMultiConnection-Server\n\n' + 'npm install RTCMultiConnection-Server');
    response.end();
}

function deleteRoomUser(pspacename, usernamespaceid){
    var phpScriptPath = "D:/xampp/htdocs/ug/nodeRes.php";
    var argsString = pspacename + ',' + usernamespaceid;
    runner.exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
        if(err) console.log(err); /* log error */
        if(phpResponse.indexOf("ok") !== -1)
        {
            var user = phpResponse.split(",")[1];
            for(var i=0; i < clients.length; i++){
                var client = clients[i];
                var sp = client.handshake.query.sessionid;
                var userid = client.handshake.query.userid;
                if(sp === pspacename && userid === usernamespaceid){
                    clients.slice(i,1);
                    break;
                }
            }
            console.log(user + ' was Sing out');
            /*
            var type = phpResponse.split(",")[1];
            if(type=="owner")
            {
              for(var i=0; i < clients.length; i++){
                  var client = clients[i];
                  var sp = client.handshake.query.sessionid;
                  if(sp == pspacename){
                     // console.log("요놈");
                      client.disconnect(true);
                      clients.slice(i,1);
                  }
              }
            }
            */
        }
        else
        console.log( phpResponse );
    });
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
        pfx = config.sslKey.indexOf('.pfx') !== -1;
        options.key = fs.readFileSync(config.sslKey);
    }

    if (!fs.existsSync(config.sslCert)) {
        console.log(BASH_COLORS_HELPER.getRedFG(), 'sslCert:\t ' + config.sslCert + ' does not exist.');
    } else {
        options.cert = fs.readFileSync(config.sslCert);
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

    httpApp = httpServer.createServer(options, serverHandler);
} else {
    httpApp = httpServer.createServer(serverHandler);
}

RTCMultiConnectionServer.beforeHttpListen(httpApp, config);
httpApp = httpApp.listen(process.env.PORT || PORT, process.env.IP || "0.0.0.0", function() {
    RTCMultiConnectionServer.afterHttpListen(httpApp, config);
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
    // ----------------------
    // below code is optional
    clients.push(socket);//add ckd
    const params = socket.handshake.query;

    if (!params.socketCustomEvent) {
        params.socketCustomEvent = 'custom-message';
    }

    socket.on(params.socketCustomEvent, function(message) {
        socket.broadcast.emit(params.socketCustomEvent, message);
    });

    socket.on('disconnect', function() {
        var ps = socket.handshake.query;//add ckd
        deleteRoomUser(ps.sessionid, socket.userid);//add ckd
    });

});
