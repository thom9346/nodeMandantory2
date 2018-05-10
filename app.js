

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require("mongodb");
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const http = require('http').Server(app);
const io = require('socket.io')(http);

var path    = require("path");


var userLoggedIn = false;
var userName;
nicknames = [];
let dbPath = "mongodb://localhost:27017/nodeMandantory2"



app.use(express.static(__dirname + "/public")); //THIS IS NEEDED TO SERVE CSS, JS OR IMAGES fROM THE HTML. 
app.use(bodyParser.json()); // we need to be able to grab the ajax data, for that we need bodyparser.
app.use(bodyParser.urlencoded({ extended: false })); //without this, you'd only get the ID and not the rest of the data.


mongoose.connect('mongodb://localhost/nodeMandantory2', function(err) {
    if(err) {
        console.log(err);
    }
    else {
        console.log('connected to mongoDB!')
    }
});

var chatSchema = mongoose.Schema({
    nick: String,
    msg: String,
    createdAtTime: {type: Date, default: Date.now}
});


//Message will automatically be called Message(s) as a collection. Mongoose turns it into plural
var ChatModel = mongoose.model('Message', chatSchema);

//exporting for unit test purposes...
exports.model = ChatModel;


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});


//registeration
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

//attempt to login, this is called when trying to click the sign in button
app.post("/attemptLogin", function(req,res) {
    //connnect to mongo
    mongo.connect(dbPath, function(err, db) {
        //1st parameter of findOne specifices that it needs to find an my "email" attribute in the database, and see if there is a match for what i put into the textbox(what ajax sent back to me).
        //2nd parameter defines what attributes should be displayed. I want to know both the username, password and email. But not the _id attribute for instance.
            db.collection("users").findOne({email: req.body.email}, {username: 1, password: 1, email: 1}, function(err, user) {
                
                //gets in here if the user does not exsist.
                if(user === null) {
                    console.log("User doesn't exist in database") //(Yes, I know that the message should be the same no matter if the user exists or not, but this is for learning purposes.)
             
                }
                //gets in here if username and password matches in the database
                else if(user.email === req.body.email && user.password === req.body.password) {
                    console.log("YAY LOGGED IN");
                  
                
                    userName = user.username;
                    userLoggedIn = true;
                    
                     return res.redirect('/chat');

                 
                    //req.session.user = user;
                
                }

                //gets in here if user exsist but password is incorrect.
                else {
                    console.log("Credentials wrong!");
                  
                }

                
            } );
    });
});

// FUNCTIONALITY: this is called the moment a user connects to /chat.
//it only appears on /chat because in our chat.html we have this code:
//   <script src="/socket.io/socket.io.js"></script> ... + another script
io.on('connection', function(socket) {

//in our query we start by sorting at -createdAtTime so we sort by the newest ones.
//The we limit the amount of messages retrieved in the chat application to 10
//the problem would now still be, that after sorting we would have the oldest messages first
//this is fixed at the client side at socket.on('load old msgs')
    var query = ChatModel.find({});
    query.sort('-createdAtTime').limit(10).exec(function(err, docs) {
         if(err) throw err;

        socket.emit('load old msgs', docs);
    });



    console.log("a user connected!");

    //gives the specific socket a username.
            socket.nickname = userName;
            nicknames.push(socket.nickname);
            console.log(socket.nickname);
            io.sockets.emit('usernames', nicknames);
           
    

        socket.on('chat message', function(msg) {
            
            var newMsg = new ChatModel({msg: msg, nick: socket.nickname});
            newMsg.save(function(err) {
                if(err) throw err;
                     io.emit('chat message',  socket.nickname  + ": " +  msg); // this emits the chat message. We then on the client side with javascript show that message. (see chat.html)
     
            })
          //  io.emit('chat message', socket.nickname + ": " +  msg); // this emits the chat message. We then on the client side with javascript show that message. (see chat.html)
        })

    socket.on('disconnect', function() {
        console.log("A user disconnected!");
    });
});



app.get("/chat", function(req,res) {
  

    if(userLoggedIn) {
       
        res.sendFile(path.join(__dirname+'/chat.html'));
    }

else{
    console.log("You don't have access to this page.")
    res.status(401).send();
}
});


var server = http.listen(3000, function(err) {


    if(err) {
        console.log("something went wrong");
    }

    console.log("listening on port: " + server.address().port);
});