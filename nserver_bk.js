const crypto = require('crypto');
const cors = require('cors');
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');
const app = express();
const corsOptions={
    origin:'192.168.0.15',
    credentials:true,
};
app.use(cors(corsOptions));
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// empty object to store all players
var players = {};
wss.on('error', function error (error) {
  console.error('WebSocket error', error)
})
wss.on('connection', function(client) {
     console.log('New Client Connected');
	  // on new message recieved
     client.on('message', function incoming(data) {
		 // get data from string
        if (typeof(data) === "string") {
            //console.log("string received from client -> " + data + "");
           try
           {
				let jsonData = JSON.parse(data);

				let udid = jsonData.spacename+"_"+jsonData.username;
				 players[udid] = {
					 playinfo:{
						 uid: parseInt(jsonData.uid),
						 spaceid: parseInt(jsonData.spaceid),
						 spacename: jsonData.spacename,
						 username: jsonData.username,
						 buildname: jsonData.buildname,
						 floors: jsonData.floors,
						 avatar: jsonData.avatar,
						 type: jsonData.type,
						 action: jsonData.action,
						 pos: jsonData.pos,
						 rot: jsonData.rot
					       }
						 };
				 client.udid = udid;
				 //console.log(JSON.stringify(players));
            }
            catch (e) {
                console.log("error received from client -> '" + data + "  : error is " + e + "'");
            }
            finally {}

        } else {
            console.log("binary received from client -> " + Array.from(data).join(", ") + "");
        }

    });
    client.on('close', function(data) {
		console.log("client close => " + JSON.parse(data));
		if(client.udid !==undefined)
		 delete players[client.udid];

    });
});

function broadcastUpdate () {
  // broadcast messages to all clients
  wss.clients.forEach(function each (client) {
    // filter disconnected clients
    if (client.readyState !== WebSocket.OPEN) return;
    // filter out current player by client.udid
    var otherPlayers = Object.keys(players).filter(udid => udid !== client.udid)
    // create array from the rest
    var otherPlayinfos = otherPlayers.map(udid => players[udid]);
    client.send(JSON.stringify(otherPlayinfos));

	console.log(client.udid + " send -> " + JSON.stringify(otherPlayinfos));
  })
}

server.listen(9009, function() {
    console.log('Listening on http://192.168.0.15:9009');
	setInterval(broadcastUpdate, 100);
});
/*
function resolveURL(url) {
    var isWin = !!process.platform.match(/^win/);
    if (!isWin) return url;
    return url.replace(/\//g, '\\');
}

const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const server = https.createServer({
    cert: fs.readFileSync(resolveURL("./fake-keys/server.crt")),
    key: fs.readFileSync(resolveURL("./fake-keys/server.key"))
});


const wss = new WebSocket.Server({server});
wss.on('connection', function connection(ws) {
    console.log("new client connected!");
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    ws.send('something');
});

server.listen(9009,"192.168.0.15",function () {
    console.log('Listening on http://192.168.0.15:9009');
});
*/
