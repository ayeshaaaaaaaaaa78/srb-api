const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  regNo: { type: String, required: true, index: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true }
}, { timestamps: true });
bookingSchema.index({ regNo: 1, slotId: 1 }, { unique: true });
module.exports = mongoose.model('Booking', bookingSchema);
