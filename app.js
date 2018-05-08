
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require("mongodb");
const session = require("express-session");

let dbPath = "mongodb://localhost:27017/nodeMandantory2"



app.use(express.static(__dirname + "/public")); //THIS IS NEEDED TO SERVE CSS, JS OR IMAGES fROM THE HTML. 
app.use(bodyParser.json()); // we need to be able to grab the ajax data, for that we need bodyparser.
app.use(bodyParser.urlencoded({ extended: false })); //without this, you'd only get the ID and not the rest of the data.

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.post("/sign-up", function(req,res) {
    var data = req.body; //req.body is usuable because of bodyParser
    console.log(data);


   mongo.connect(dbPath,function(err, db) {
       if(err) {
           console.log("Error running mongodb: ", err);
       }

       let collection = db.collection("users"); //name of the table we insert into
    

       collection.insert(data, function(err, success) {
           console.log(success);
           db.close();
       });
   });

});

var server = app.listen(3000, function(err) {


    if(err) {
        console.log("something went wrong");
    }

    console.log("listening on port: " + server.address().port);
});