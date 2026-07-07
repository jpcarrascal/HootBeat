const path = require('path');
const express = require('express');
const { createServer } = require('beatlink-core');
const hootbeatPlugin = require('./server/hootbeatPlugin.js');

const server = createServer({
    roles: ['host', 'public', 'participant'],
    session: {
        numParticipants: 32,
        allocation: 'sequential',
        hostDisconnect: 'preserve', // band page reloads must not end the show
        hostOptional: true          // audience can join before the sequencer is up
    },
    plugins: [hootbeatPlugin],
    logging: { label: 'hootbeat' }
});

const { app } = server;

app.get('/', (req, res) => {
    const page = (req.query.room && req.query.who) ? 'html/index-audience.html' : 'html/out.html';
    res.sendFile(path.join(__dirname, page));
});

app.get('/out', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/out.html'));
});

app.get('/sequencer', (req, res) => {
    const allowed = req.query.room || req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    res.sendFile(path.join(__dirname, allowed ? 'html/sequencer.html' : 'html/out.html'));
});

app.get('/latency', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/latency.html'));
});

app.get('/qr-code', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/qr-code.html'));
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'images/favicon.ico'));
});

app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
app.use('/tone', express.static(path.join(__dirname, 'node_modules/tone/build')));

if (require.main === module) {
    server.listen(process.env.PORT || 3000);
}

module.exports = { server };
