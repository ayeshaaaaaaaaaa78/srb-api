const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  building: { type: String, required: true, trim: true },
  seats: { type: Number, required: true, min: 1, validate: Number.isInteger }
}, { timestamps: true });
module.exports = mongoose.model('Room', roomSchema);
