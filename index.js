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
    });
});



let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('listening at ', port);
});
