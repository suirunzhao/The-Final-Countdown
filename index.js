let express = require("express");
let app = express();

app.use('/', express.static('public'));

//Parse JSON data
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//database initialization
let Datastore = require('nedb');
let db = new Datastore('info.db');
db.loadDatabase();


/*------ROUTES------*/

//create a POST route to recieve the data
app.post('/infoSave', (req, res) => {
    console.log("Received a POST request!");
    console.log(req.body);

    let objToSave = req.body;
    db.insert(objToSave);

    //respond to the client
    let message = { "status": "success" };
    res.json(message);
});

//create a GET route to send the data
app.get('/data', (req, res) => {
    console.log("A GET req for the data")

    db.find({}, (err, docs) => {
        console.log(docs);
        let allInfo = { "data": docs };
        //Send a response back to the client
        res.json(allInfo);
    })
    
    /* ------Try to sort nedb data-------*/


    // .sort({ createdAt: -1 }, (data) => {
    //     console.log(data)
    //     response.json(data)
    //   });
});



//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

//Listen for individual clients/users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for a message named 'msg' from this client
    socket.on('msg', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'msg' event");
        console.log(data);

        //Send a response to all clients, including this one
        io.sockets.emit('msg', data);

        //Send a response to all other clients, not including this one
        // socket.broadcast.emit('msg', data);

        //Send a response to just this client
        // socket.emit('msg', data);
    });

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});