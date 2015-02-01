// Include important JS helpers
require('./helpers.js');

var express = require('express'), // Include express engine
 serveStatic = require('serve-static'), // Serve static files
        app = express(), // create node server
 bodyParser = require('body-parser'),
 config = require('./config/app.js');

var server = require('http').createServer(app);
 var io = require('socket.io')(server);

// Default APP Configuration

  app.set('view engine', 'jade'); // uses JADE templating engine
  app.set('views', __dirname + '/views'); // default dir for views

 // configure app to use bodyParser()
// this will let us get the data from a POST
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(serveStatic('public/', {'index': ['index.html', 'index.htm']}))
// Index Route
app.get('/', function(req, res){ 
	res.render('index', {
		locals: {
			title: "Rumpetnode! It's Rumpetroll with a node backend"
		}
	});
});

// Auth Route
app.get('/auth', function(req, res){ 
	res.render('auth', {
		locals: {
			title: "Authenticate Twitter",
			twitter: config.twitter,
			layout: false
		}
	});
});


// Listen on this port
app.listen(8000);
  
// Socket Connection
var clients = []; // List of all connected Clients

// When user gets connected
io.on('connection', function(client){ 
	// new client is here! 
	var index = clients.push(client) - 1; // get array index of new client
	
	// On Message, send message to everyone
 	client.on('message', function(data){ 
		console.log('got message ==> ' + data);
		data = JSON.parse(data); // parse string data to json
		
		for(var i=0;i<clients.length;i++) {
			try {
				if(clients[i] != undefined)
					clients[i].send(data.msg); // send to all connected clients
			} catch(e) {
				console.log("doesn`t exist");
				continue; //if a client doesn`t exist, jus continue;
			}
		}
	});
  client.on('disconnect', function(){  
		clients.splice(index,1); // remove client from array
		console.log("after length ===> " +clients.length);
	});
});
