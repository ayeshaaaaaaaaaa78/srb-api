const mongoose = require('mongoose');
const slotSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, index: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  startHour: { type: Number, required: true, enum: [8, 10, 12, 14, 16] },
  seats: { type: Number, required: true, min: 1 },
  booked: { type: Number, default: 0, min: 0 }
}, { timestamps: true });
slotSchema.index({ roomCode: 1, date: 1, startHour: 1 }, { unique: true });
module.exports = mongoose.model('Slot', slotSchema);
