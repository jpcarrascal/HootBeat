const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { AllRooms } = require("./scripts/roomsObj.js");
const config = require('./scripts/config.js');
var cookie = require("cookie")

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${message}`;
});

const logger = createLogger({
  format: combine(
    label({ label: 'countmein' }),
    timestamp(),
    myFormat
  ),
  transports: [
      new transports.Console(),
      new transports.File({ filename: 'info.log' })
    ]
});

var rooms = new AllRooms(config.NUM_TRACKS, config.MAX_NUM_ROUNDS);

var band = {
    jp: null,
    daniel: null,
    mauro: null,
    "left-tube": null,
    "right-tube": null
};

app.get('/', (req, res) => {
    if(req.query.room && req.query.who)
        var page = '/html/index-audience.html';
    else
        var page = '/html/out.html';
    res.sendFile(__dirname + page);
});

app.get('/out', (req, res) => {
    var page = '/html/out.html';
    res.sendFile(__dirname + page);
});

app.get('/sequencer', (req, res) => {
    if(req.query.room || (req.hostname === 'localhost' || req.hostname === '127.0.0.1') )
        var page = '/html/sequencer.html';
    else
        var page = '/html/out.html';
    res.sendFile(__dirname + page);
});

app.get('/favicon.ico', (req, res) => {
    var page = '/images/favicon.ico';
    res.sendFile(__dirname + page);
});

app.get('/latency', (req, res) => {
    var page = '/html/latency.html';
    res.sendFile(__dirname + page);
});

app.get('/qr-code', (req, res) => {
    var page = '/html/qr-code.html';
    res.sendFile(__dirname + page);
});

app.use('/scripts', express.static(__dirname + '/scripts/'));
app.use('/css', express.static(__dirname + '/css/'));
app.use('/images', express.static(__dirname + '/images/'));
app.use('/sounds', express.static(__dirname + '/sounds/'));
app.use('/tone', express.static(__dirname + '/node_modules/tone/build/'));

io.on('connection', (socket) => {
    var seq = false;
    if(socket.handshake.headers.referer.includes("sequencer"))
        seq = true;
    else if(socket.handshake.headers.referer.includes("conductor"))
        conductor = true;
    var room = socket.handshake.query.room;
    //var room = "spacebarman";
    var who = socket.handshake.query.who;
    var allocationMethod = socket.handshake.query.method || "random";
    socket.join(room);
    if(seq) {
        var cookief = socket.handshake.headers.cookie; 
        var cookies = cookie.parse(socket.handshake.headers.cookie);    
        //const exists = rooms.findRoom(room);
        logger.info("#" + room + " @SEQUENCER joined session.");
        //rooms.setSeqID(room,socket.id);
        socket.on('disconnect', () => {
            logger.info("#" + room + " @SEQUENCER disconnected (sequencer). Clearing session");
            socket.broadcast.to(room).emit('exit session',{reason: "Sequencer exited!"});
            //rooms.clearRoom(room);
        });
    }  else {
        if(band[who] !== null) {
            band[who] = null;
            socket.broadcast.to(room).emit('kick-out', {who: who});
            logger.info("#" + room + " @" + who + " kicked out by " + socket.id);
        }
        logger.info("#" + room + " @" + who + " joined session");
        band[who] = socket.id;
        console.log(band);
        socket.on('disconnect', () => {
            logger.info("#" + room + " @" + who + " (" + socket.id + ") disconnected");
            if(band[who] == socket.id)
                band[who] = null;
            console.log(band);
            socket.broadcast.to(room).emit('audience-exit', { who: who, socketid: socket.id });
        });

    }

    socket.on('ping', (msg) => {
        io.to(socket.id).emit('pong', msg);
    });

    socket.on('kick-all-out', (msg) => {
        socket.broadcast.to(room).emit('kick-all-out', msg);
        logger.info("#" + room + " Kicking everybody out!");
    });

    // Messages from audience:
    socket.on('flash', (msg) => {
        socket.broadcast.to(room).emit('flash', msg);
        logger.info("#" + room + " @" + msg.who + " (" + socket.id + ") flash! color:" + msg.color);
    });

    socket.on('set-color', (msg) => {
        socket.broadcast.to(room).emit('set-color', msg);
        logger.info("#" + room + " @" + msg.who + " (" + socket.id + ") set color:" + msg.color);
    });

});

var port = process.env.PORT || 3001;
server.listen(port, () => {
  logger.info('listening on *:' + port);
});


function exitHandler(options, exitCode) {
    logger.info("Bye!!!")
    if (options.cleanup) logger.info('clean');
    if (exitCode || exitCode === 0) logger.info(exitCode);
    if (options.exit) process.exit();
}

process.on('SIGINT', exitHandler.bind(null, {exit:true}));