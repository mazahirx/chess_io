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
let currPlayer = 'w';

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res) =>{
    res.render('index');
});

io.on("connection",(uniqueSocket) =>{   //socket connection
    console.log("connected");
    
    if(!players.white){
        players.white = uniqueSocket.id;
        uniqueSocket.emit("playerRole","w");
    }
    else if(!players.black){
        players.black = uniqueSocket.id;
        uniqueSocket.emit("playerRole","b");
    }
    else{
        uniqueSocket.emit("spectator");
    }

    uniqueSocket.on("disconnect",()=>{
        if(uniqueSocket.id == players.white){
            delete players.white;
        }
        else if(uniqueSocket.id == players.black){
            delete players.black;
        }
    })

    uniqueSocket.on("move",(move)=>{
        try {
            if(chess.turn() == "w" && uniqueSocket.id !== players.white ) return;
            if(chess.turn() == "b" && uniqueSocket.id !== players.black ) return;
            
            const result = chess.move(move);

            if(result){
                currPlayer = chess.turn();
                io.emit("move",move);
                io.emit("boardState",chess.fen());
            }else{
                console.log("Something went wrong ! ");
                uniqueSocket.emit("Invalid Move : ",move);
            }
        } catch (err) {
            console.log(err);
            uniqueSocket.emit("Invalid Move : ", move);
        }
    })
})

server.listen(3000);
