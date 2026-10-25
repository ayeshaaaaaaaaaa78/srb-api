const students = require('../services/studentService');
const bookings = require('../services/bookingService');
exports.create = async (req,res) => res.status(201).json(await students.create(req.body));
exports.get = async (req,res) => res.json(await students.get(req.params.regNo));
exports.book = async (req,res) => res.status(201).json(await bookings.book(req.params.regNo, req.body.slotId, req.app.get('io')));
exports.listBookings = async (req,res) => res.json(await bookings.list(req.params.regNo));
exports.cancel = async (req,res) => { await bookings.cancel(req.params.regNo, req.params.slotId, req.app.get('io')); res.status(204).end(); };
