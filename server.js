const express = require("express");
const app = express();
const http = require('http');
const path = require("path");
const server = http.createServer(app);
const{ Server } = require('socket.io')
const io = new Server(server);

//socket

io.on('connection',(socket)=>{
//    console.log(`A New Got Connected :- ${socket.id}`)
    socket.on('user-message',txt=>{
       // console.log(`user ${socket.id} sent :- ${txt} `);
        io.emit('broadcast',txt)
    })
})

app.use(express.static(path.join(__dirname,"public")))

server.listen(3000,()=>{
    console.log("Server is listening localhost:3000")
})


app.get("/",(req,res)=>{
        res.sendFile("index.html")
})

app.use("",(req,res)=>{
    let Path = path.join(__dirname,"public")
    Path += "/index.html"
    res.sendFile(Path);
})