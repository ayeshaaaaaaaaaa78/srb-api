const mongoose = require('mongoose');
const Student = require('../models/Student');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const httpError = require('../middleware/httpError');

async function emitUpdate(io, slot) {
  if (io && slot) io.to(slot.roomCode).emit('slot:updated', {
    slotId: String(slot._id), seatsLeft: Math.max(0, slot.seats - slot.booked)
  });
}
exports.book = async (regNo, slotId, io) => {
  const student = await Student.findOne({ regNo: regNo.toUpperCase() });
  if (!student) throw httpError(404, 'Student not found');
  if (!mongoose.isValidObjectId(slotId)) throw httpError(404, 'Slot not found');
  const slot = await Slot.findById(slotId);
  if (!slot) throw httpError(404, 'Slot not found');
  if (await Booking.exists({ regNo: student.regNo, slotId })) throw httpError(409, 'Student has already booked this slot');
  const updated = await Slot.findOneAndUpdate(
    { _id: slotId, $expr: { $lt: ['$booked', '$seats'] } },
    { $inc: { booked: 1 } }, { new: true }
  );
  if (!updated) throw httpError(409, 'SLOT_FULL');
  try {
    const booking = await Booking.create({ regNo: student.regNo, slotId });
    await emitUpdate(io, updated);
    return booking;
  } catch (err) {
    await Slot.updateOne({ _id: slotId }, { $inc: { booked: -1 } });
    if (err.code === 11000) throw httpError(409, 'Student has already booked this slot');
    throw err;
  }
};
exports.list = async regNo => {
  const student = await Student.findOne({ regNo: regNo.toUpperCase() });
  if (!student) throw httpError(404, 'Student not found');
  return Booking.aggregate([
    { $match: { regNo: student.regNo } },
    { $lookup: { from: 'slots', localField: 'slotId', foreignField: '_id', as: 'slot' } },
    { $unwind: '$slot' },
    { $lookup: { from: 'rooms', localField: 'slot.roomCode', foreignField: 'roomCode', as: 'room' } },
    { $unwind: '$room' },
    { $project: { _id: 1, regNo: 1, slotId: '$slot._id', roomName: '$room.name', roomCode: '$slot.roomCode', date: '$slot.date', startHour: '$slot.startHour' } }
  ]);
};
exports.cancel = async (regNo, slotId, io) => {
  const student = await Student.findOne({ regNo: regNo.toUpperCase() });
  if (!student) throw httpError(404, 'Student not found');
  const booking = await Booking.findOneAndDelete({ regNo: student.regNo, slotId });
  if (!booking) throw httpError(404, 'Booking not found');
  const slot = await Slot.findByIdAndUpdate(slotId, { $inc: { booked: -1 } }, { new: true });
  await emitUpdate(io, slot);
};
