const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

var cors = require('cors');

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(cors());
app.use(index);
app.use('/static', express.static('public'));

const server = http.createServer(app);

const io = socketIo(server);

let socketCount = {
    '/salon1': 0,
    '/salon2': 0,
    '/salon3': 0,
    '/salon4': 0,
    '/salon5': 0
};

let msgSave = {
    '/salon1': [],
    '/salon2': [],
    '/salon3': [],
    '/salon4': [],
    '/salon5': []
}

const saveMsg = (chan, msg) => {
    msgSave[chan].push(msg);
}

const editMsg = (chan, msg) => {
    let edit = msgSave[chan].find(data => data.uid === msg.uid);
    let ind = msgSave[chan].indexOf(edit);
    msgSave[chan][ind].text = msg.text;
}

const delMsg = (chan, msg) => {
    let copy = msgSave[chan].filter(data => data.uid !== msg.uid)
    msgSave[chan] = copy;
}

const watcher = (socket) => {
    let chan = socket.nsp;
    socketCount[chan.name] += 1;
    chan.emit('new on', {count: socketCount[chan.name]});
    socket.emit('history', {save: msgSave[chan.name].slice(-7)})
    socket.on('chat message', msg => {
        console.log('new message');
        saveMsg(chan.name, msg);
        chan.emit('chat message', msg);
    });
    socket.on('delete message', data => {
        console.log('message deleted');
        delMsg(chan.name, data);
        chan.emit('delete message', data)
    });
    socket.on('edit message', data => {
        console.log('message edited');
        editMsg(chan.name, data);        
        chan.emit('edit message', data)
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        socketCount[chan.name] -= 1;
        chan.emit('new off', {count: socketCount[chan.name]});
    });
    socket.on('history', data => {
        socket.emit('history', {save: msgSave[chan.name].slice(-data.len)})
    });
};

const nsp1 = io.of('/salon1').on('connection', watcher)
const nsp2 = io.of('/salon2').on('connection', watcher)
const nsp3 = io.of('/salon3').on('connection', watcher)
const nsp4 = io.of('/salon4').on('connection', watcher)
const nsp5 = io.of('/salon5').on('connection', watcher)

server.listen(port, () => console.log(`Listening on port ${port}`));