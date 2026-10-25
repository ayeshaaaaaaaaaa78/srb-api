const Slot = require('../models/Slot');
module.exports.registerSockets = io => {
  io.on('connection', socket => {
    socket.on('join:room', async (roomCode, ack) => {
      try {
        const code = String(roomCode || '').toUpperCase();
        await socket.join(code);
        const slots = await Slot.find({ roomCode: code }).sort({ date: 1, startHour: 1 }).lean();
        const data = slots.map(s => ({ slotId: String(s._id), date: s.date, startHour: s.startHour, seatsLeft: Math.max(0, s.seats - s.booked) }));
        if (typeof ack === 'function') ack({ slots: data });
      } catch (_e) {
        if (typeof ack === 'function') ack({ error: 'Could not load slots' });
      }
    });
  });
  const admin = io.of('/admin');
  admin.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.adminKey === process.env.ADMIN_KEY) return next();
    next(new Error('Unauthorized: invalid adminKey'));
  });
  admin.on('connection', socket => {
    socket.on('announce', payload => {
      const message = typeof payload === 'string' ? payload : String(payload && payload.message || '');
      io.emit('admin:announcement', { message });
    });
  });
};
