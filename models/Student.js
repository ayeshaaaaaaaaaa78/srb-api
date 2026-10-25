const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
}, { timestamps: true });
module.exports = mongoose.model('Student', studentSchema);
