const Client = require('socket.io-client');
const { server } = require('../index.js');

// Integration tests for HootBeat audience-control on beatlink-core:
// band-member identity claiming (single holder per `who`), lighting
// relays, and show-friendly session lifecycle.

describe('hootbeat server', () => {
    let port, clients = [];

    beforeAll((done) => {
        server.logger.transports.forEach(t => { t.silent = true; });
        server.httpServer.listen(0, () => {
            port = server.httpServer.address().port;
            done();
        });
    });

    afterEach(() => {
        clients.forEach(s => s.connected && s.disconnect());
        clients = [];
        server.sessions.all().forEach(s => server.sessions.remove(s.name));
    });

    afterAll(async () => {
        await server.close();
    });

    function connect(query) {
        const socket = Client(`http://localhost:${port}`, {
            query, forceNew: true, transports: ['websocket']
        });
        clients.push(socket);
        return socket;
    }

    function waitFor(socket, event) {
        return new Promise(resolve => socket.once(event, resolve));
    }

    function expectNoEvent(socket, event, ms) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                socket.off(event, onEvent);
                resolve();
            }, ms);
            const onEvent = (msg) => {
                clearTimeout(timer);
                reject(new Error(`Unexpected '${event}': ${JSON.stringify(msg)}`));
            };
            socket.once(event, onEvent);
        });
    }

    test('joining before any sequencer ever connected is refused (client retries)', async () => {
        const fan = connect({ session: 'h0', role: 'participant', initials: 'jp' });
        const refusal = await waitFor(fan, 'session-unavailable');
        expect(refusal.reason).toBeDefined();
    });

    test('claiming an occupied identity kicks the previous holder', async () => {
        const seq = connect({ session: 'h1', role: 'host', who: 'sequencer' });
        await waitFor(seq, 'host-accepted');

        const first = connect({ session: 'h1', role: 'participant', initials: 'jp', who: 'jp' });
        await waitFor(first, 'veil-on');

        const kickPromise = waitFor(first, 'kick-out');
        const second = connect({ session: 'h1', role: 'participant', initials: 'jp', who: 'jp' });
        const noSelfKick = expectNoEvent(second, 'kick-out', 200);

        const kicked = await kickPromise;
        expect(kicked.who).toBe('jp');
        await noSelfKick;

        expect(server.sessions.get('h1').getAttribute('band').jp).toBe(second.id);
    });

    test('audience disconnect emits audience-exit and frees the identity', async () => {
        const seq = connect({ session: 'h2', role: 'host', who: 'sequencer' });
        await waitFor(seq, 'host-accepted');
        const fan = connect({ session: 'h2', role: 'participant', initials: 'mauro', who: 'mauro' });
        await waitFor(fan, 'veil-on');

        const exitPromise = waitFor(seq, 'audience-exit');
        fan.disconnect();
        const exit = await exitPromise;
        expect(exit.who).toBe('mauro');
        expect(server.sessions.get('h2').getAttribute('band').mauro).toBeUndefined();
    });

    test('flash and set-color reach the room but not the sender', async () => {
        const seq = connect({ session: 'h3', role: 'host', who: 'sequencer' });
        await waitFor(seq, 'host-accepted');
        const fan = connect({ session: 'h3', role: 'participant', initials: 'daniel', who: 'daniel' });
        await waitFor(fan, 'veil-on');

        let senderGotIt = false;
        fan.on('flash', () => { senderGotIt = true; });

        const flashPromise = waitFor(seq, 'flash');
        fan.emit('flash', { who: 'daniel', color: '#ff0000' });
        expect(await flashPromise).toEqual({ who: 'daniel', color: '#ff0000' });
        expect(senderGotIt).toBe(false);

        const colorPromise = waitFor(fan, 'set-color');
        seq.emit('set-color', { who: 'daniel', color: '#00ff00' });
        expect((await colorPromise).color).toBe('#00ff00');
    });

    test('kick-all-out relays to everyone else', async () => {
        const seq = connect({ session: 'h4', role: 'host', who: 'sequencer' });
        await waitFor(seq, 'host-accepted');
        const fan = connect({ session: 'h4', role: 'participant', initials: 'jp', who: 'jp' });
        await waitFor(fan, 'veil-on');

        const kickPromise = waitFor(fan, 'kick-all-out');
        seq.emit('kick-all-out', {});
        await kickPromise;
    });

    test('sequencer reload preserves the session and the band map', async () => {
        const seq = connect({ session: 'h5', role: 'host', who: 'sequencer' });
        await waitFor(seq, 'host-accepted');
        const fan = connect({ session: 'h5', role: 'participant', initials: 'jp', who: 'jp' });
        await waitFor(fan, 'veil-on');

        const noEnd = expectNoEvent(fan, 'session-ended', 200);
        seq.disconnect();
        await noEnd;
        expect(server.sessions.get('h5').getAttribute('band').jp).toBe(fan.id);

        const reloaded = connect({ session: 'h5', role: 'host', who: 'sequencer' });
        await waitFor(reloaded, 'host-accepted');
    });

    test('identities are per-session: same who in two rooms coexists', async () => {
        const seqA = connect({ session: 'roomA', role: 'host', who: 'sequencer' });
        await waitFor(seqA, 'host-accepted');
        const seqB = connect({ session: 'roomB', role: 'host', who: 'sequencer' });
        await waitFor(seqB, 'host-accepted');

        const fanA = connect({ session: 'roomA', role: 'participant', initials: 'jp', who: 'jp' });
        await waitFor(fanA, 'veil-on');

        const noKick = expectNoEvent(fanA, 'kick-out', 200);
        const fanB = connect({ session: 'roomB', role: 'participant', initials: 'jp', who: 'jp' });
        await waitFor(fanB, 'veil-on');
        await noKick; // roomB's jp does not kick roomA's jp

        expect(server.sessions.get('roomA').getAttribute('band').jp).toBe(fanA.id);
        expect(server.sessions.get('roomB').getAttribute('band').jp).toBe(fanB.id);
    });
});
