const Room = require('../models/Room');
const httpError = require('../middleware/httpError');
exports.list = () => Room.find().sort({ roomCode: 1 });
exports.get = async code => {
  const room = await Room.findOne({ roomCode: code.toUpperCase() });
  if (!room) throw httpError(404, 'Room not found');
  return room;
};
exports.create = async data => {
  if (!data.roomCode || !data.name || !data.building || data.seats == null) throw httpError(400, 'roomCode, name, building and seats are required');
  if (!Number.isInteger(data.seats) || data.seats < 1) throw httpError(422, 'seats must be a positive integer');
  return Room.create(data);
};
exports.replace = async (code, data) => {
  if (data.roomCode && data.roomCode.toUpperCase() !== code.toUpperCase()) throw httpError(422, 'roomCode cannot be changed');
  delete data.roomCode;
  const room = await Room.findOneAndUpdate({ roomCode: code.toUpperCase() }, data, { new: true, runValidators: true, overwrite: true });
  if (!room) throw httpError(404, 'Room not found');
  return room;
};
exports.patch = async (code, data) => {
  if (data.roomCode && data.roomCode.toUpperCase() !== code.toUpperCase()) throw httpError(422, 'roomCode cannot be changed');
  delete data.roomCode;
  const room = await Room.findOneAndUpdate({ roomCode: code.toUpperCase() }, { $set: data }, { new: true, runValidators: true });
  if (!room) throw httpError(404, 'Room not found');
  return room;
};
exports.remove = async code => {
  const result = await Room.deleteOne({ roomCode: code.toUpperCase() });
  if (!result.deletedCount) throw httpError(404, 'Room not found');
};
