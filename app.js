const express = require('express');       //required frameworks
const socket = require('socket.io');
const http = require('http');
const path = require('path');
const {Chess} = require('chess.js');

const app = express();      //server setup
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess;
let players = {};
let currPlayer = 'W';

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res) =>{
    res.render('index');
});

io.on("connection",(uniqueSocket) =>{   //socket connection
    console.log("connected");
    
    if(!players.white){
        players.white = uniqueSocket.id;
        uniqueSocket.emit("playerRole","W");
    }
    else if(!players.black){
        players.black = uniqueSocket.id;
        uniqueSocket.emit("playerRole","B");
    }
    else{
        uniqueSocket.emit("Spectator");
    }

    uniqueSocket.on("disconnet",()=>{
        if(uniqueSocket.id == player.white){
            delete player.white;
        }
        else if(uniqueSocket.id == player.black){
            delete player.black;
        }
    })
})

server.listen(3000);
