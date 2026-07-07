// HootBeat's app-specific server logic as a beatlink-core plugin: audience
// members claim a band-member identity (`who`, carried as initials) and
// drive that member's lighting with flash/set-color. Each identity has a
// single holder — claiming an occupied one kicks the previous holder out.
//
// The band map is per-session (the legacy server kept one global map, so
// two rooms would fight over the same identities).

module.exports = function hootbeatPlugin(ctx) {
    ctx.defineAttributes({
        band: {} // who -> socketID of the current holder
    });

    ctx.onActivate((session, { socketID, initials }) => {
        const band = session.getAttribute('band');
        if (band[initials] && band[initials] !== socketID) {
            // Identity takeover: everyone (including the old holder, which
            // self-exits) learns about it — except the new claimant.
            ctx.io.to(session.name).except(socketID).emit('kick-out', { who: initials });
            ctx.logger.info(`#${session.name} @${initials} kicked out by ${socketID}`);
        }
        band[initials] = socketID;
        ctx.logger.info(`#${session.name} @${initials} joined session`);
    });

    ctx.onRelease((session, { socketID, initials }) => {
        const band = session.getAttribute('band');
        if (band[initials] === socketID) {
            delete band[initials];
        }
        ctx.io.to(session.name).except(socketID).emit('audience-exit', {
            who: initials,
            socketid: socketID
        });
        ctx.logger.info(`#${session.name} @${initials} (${socketID}) disconnected`);
    });

    ctx.on('kick-all-out', (socket, session, msg) => {
        if (!session) return;
        socket.broadcast.to(session.name).emit('kick-all-out', msg);
        ctx.logger.info(`#${session.name} Kicking everybody out!`);
    });

    // Lighting messages from the audience.
    ctx.on('flash', (socket, session, msg) => {
        if (!session) return;
        socket.broadcast.to(session.name).emit('flash', msg);
        ctx.logger.info(`#${session.name} @${msg && msg.who} (${socket.id}) flash! color:${msg && msg.color}`);
    });

    ctx.on('set-color', (socket, session, msg) => {
        if (!session) return;
        socket.broadcast.to(session.name).emit('set-color', msg);
        ctx.logger.info(`#${session.name} @${msg && msg.who} (${socket.id}) set color:${msg && msg.color}`);
    });
};
