const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

const getApiAndEmit = "TODO"

let socketCount = 0;

io.on("connection", socket => {
    socketCount++;
    console.log("New client connected", socketCount);
    io.emit('new on', {count: socketCount});
    socket.on('chat message', msg => {
        console.log('new message');
        io.emit('chat message', msg);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        socketCount--;
        io.emit('new off', {count: socketCount});
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));