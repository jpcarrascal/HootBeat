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
};

app.get('/', (req, res) => {
    var page = '/html/index.html';
    res.sendFile(__dirname + page);
});

app.get('/out', (req, res) => {
    var page = '/html/out.html';
    res.sendFile(__dirname + page);
});

app.get('/sequencer', (req, res) => {
    var page = '/html/sequencer.html';
    res.sendFile(__dirname + page);
});

app.get('/conductor', (req, res) => {
    if(req.query.room)
        var page = '/html/conductor.html';
    else
        var page = '/html/index-conductor.html';
    res.sendFile(__dirname + page);
});

app.get('/track', (req, res) => {
    if(req.query.room && (req.query.initials || req.query.initials==="") )
        var page = '/html/track.html';
    else
        var page = '/html/index-track.html';
    res.sendFile(__dirname + page);
});

app.get('/favicon.ico', (req, res) => {
    // req.query.seq
    var page = '/images/favicon.ico';
    res.sendFile(__dirname + page);
});

app.get('/latency', (req, res) => {
    // req.query.seq
    var page = '/html/latency.html';
    res.sendFile(__dirname + page);
});

app.use('/scripts', express.static(__dirname + '/scripts/'));
app.use('/css', express.static(__dirname + '/css/'));
app.use('/images', express.static(__dirname + '/images/'));
app.use('/sounds', express.static(__dirname + '/sounds/'));

io.on('connection', (socket) => {
    var seq = false;
    if(socket.handshake.headers.referer.includes("sequencer"))
        seq = true;
    else if(socket.handshake.headers.referer.includes("conductor"))
        conductor = true;
    //var room = socket.handshake.query.room;
    var room = "spacebarman";
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
        logger.info("#" + room + " @" + who + " joined session on track ");
        band[who] = socket.id;
        console.log(band);
        socket.broadcast.to(room).emit('track joined', { initials: who, socketid: socket.id });
        socket.on('disconnect', () => {
            //var track2delete = rooms.getParticipantNumber(room, socket.id);
            //rooms.releaseParticipant(room, socket.id);
            //io.to(room).emit('clear track', {track: track2delete, initials: who});
            logger.info("#" + room + " @" + who + " (" + socket.id + ") disconnected");
            if(band[who] == socket.id)
                band[who] = null;
            console.log(band);
        });
        //io.to(socket.id).emit('create track', {});

    }

    socket.on('step update', (msg) => { // Send step values
        io.to(room).emit('step update', msg);
        rooms.participantStartCounting(room, socket.id);
        let initials = rooms.getParticipantInitials(room, socket.id);
        if(seq) initials = "seq";
        logger.info("#" + room + " @" + initials + " step_update event: " + msg.action +
                        " track: " + msg.track + " step: " +msg.step +
                        " note: " + msg.note + " value: " +msg.value);
    });

    socket.on('track notes', (msg) => { // Send all notes from track
        io.to(msg.socketid).emit('update track', msg);
    });

    socket.on('step tick', (msg) => { // Visual sync
        socket.broadcast.to(room).emit('step tick', msg);
        var expired = new Array();
        if(msg.counter == config.NUM_STEPS-1) {
            expired = rooms.incrementAllCounters(room);
        }
        if(expired.length > 0) {
            for(var i=0; i<expired.length; i++) {
                logger.info("#" + room + " @"+expired[i].initials + " session expired!");
                io.to(expired[i].socketID).emit('exit session', {reason: "Join again?"});
            }
        }
    });

    socket.on('play', (msg) => {
        socket.broadcast.to(room).emit('play', msg);
        logger.info("#" + room + " Playing...");
    });

    socket.on('stop', (msg) => {
        socket.broadcast.to(room).emit('stop', msg);
        logger.info("#" + room + " Stopped.");
    });

    socket.on('ping', (msg) => {
        io.to(socket.id).emit('pong', msg);
    });

    socket.on('track mute', (msg) => {
        console.log(msg)
        socket.broadcast.to(room).emit('track mute', msg);
    }); 

    socket.on('track solo', (msg) => {
        console.log("Solo: " + msg.value);
    });

    socket.on('track volume', (msg) => {
        socket.broadcast.to(room).emit('track volume', msg);
        console.log(msg);
    });

    socket.on('hide toggle', (msg) => {
        socket.broadcast.to(room).emit('hide toggle track', {value: msg.value});
    });

    socket.on('flash', (msg) => {
        socket.broadcast.to(room).emit('flash', msg);
        logger.info("#" + room + " @" + msg.who + " (" + socket.id + ") flash! color:" + msg.color);
    });

    socket.on('set-color', (msg) => {
        socket.broadcast.to(room).emit('set-color', msg);
        logger.info("#" + room + " @" + msg.who + " (" + socket.id + ") set color:" + msg.color);
    });

});

var port = process.env.PORT || 3000;
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