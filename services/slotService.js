const Slot = require('../models/Slot');
const Room = require('../models/Room');
const httpError = require('../middleware/httpError');
exports.create = async data => {
  const room = await Room.findOne({ roomCode: String(data.roomCode || '').toUpperCase() });
  if (!room) throw httpError(404, 'Room not found');
  if (!data.date || ![8,10,12,14,16].includes(Number(data.startHour))) throw httpError(422, 'A valid date and startHour (8, 10, 12, 14, 16) are required');
  return Slot.create({ roomCode: room.roomCode, date: data.date, startHour: Number(data.startHour), seats: room.seats, booked: 0 });
};
exports.get = async id => {
  const slot = await Slot.findById(id);
  if (!slot) throw httpError(404, 'Slot not found');
  return slot;
};
exports.list = async query => {
  const filter = {};
  if (query.roomCode) filter.roomCode = query.roomCode.toUpperCase();
  if (query.date) filter.date = query.date;
  if (query.hasSeats === 'true') filter.$expr = { $lt: ['$booked', '$seats'] };
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '10', 10), 1), 100);
  const [items, total] = await Promise.all([
    Slot.find(filter).sort({ date: 1, startHour: 1 }).skip((page - 1) * limit).limit(limit),
    Slot.countDocuments(filter)
  ]);
  return { page, limit, total, items };
};
