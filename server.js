var fs = require('fs'),
    http = require('http');

const WebSocket = require('ws');

var server = http.createServer(function (req, res) {
  var file = "public/index.html";
  if (req.url === "/favicon.ico") {
  	file = "public/favicon/favicon.ico"
  }

  fs.readFile(file, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
})

server.listen(8080);

const wss = new WebSocket.Server({ port: 5000 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log("received: '%s'", message);
    if ("request play" === message) {
    	broadcast("command play");
    } else if ("request pause" === message) {
        broadcast("command pause");
    } else if (message.startsWith("status pos")) {
    	var correct = gclock() 
    	var current = parseFloat(message.substring(10));
    	var drift = correct-current;
    	if (drift > 1) {
    		console.log("drift = " + correct + " " + current + " " + drift);
    		ws.send('command seek ' + correct);
    	}
    }
  });

  var seek = gclock();
  ws.send('server_start ' + seek);
});

function gclock() {
	return Math.floor((new Date().getTime() / 1000) % 166);
}

console.log("Setup complete.");

function broadcast (message) {
	wss.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
		    client.send(message);
	  	} else {
	  		console.log("Invalid state for one of the clients.....");
	  	}
	});
}