
const express = require('express');
const app = express();



app.use(express.static(__dirname + "/public")); //THIS IS NEEDED TO SERVE CSS, JS OR IMAGES fROM THE HTML. 

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.post("/sign-up", function(req,res) {
    console.log(req.body);
    res.json(req.body);
})

var server = app.listen(3000, function(err) {


    if(err) {
        console.log("something went wrong");
    }

    console.log("listening on port: " + server.address().port);
});