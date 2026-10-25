require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Slot = require('../models/Slot');
const Student = require('../models/Student');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URL);
  await Room.deleteMany({ roomCode: { $in: ['ROOM-01','ROOM-02','ROOM-03'] } });
  await Slot.deleteMany({ roomCode: { $in: ['ROOM-01','ROOM-02','ROOM-03'] } });
  await Student.updateOne({ regNo: 'FA23-BAI-009' }, { $set: { name: 'Ayesha Khizer', email: 'ayesha@example.com' } }, { upsert: true });
  const rooms = await Room.insertMany([
    { roomCode: 'ROOM-01', name: 'Quiet Study Room', building: 'Block A', seats: 6 },
    { roomCode: 'ROOM-02', name: 'Group Study Room', building: 'Block B', seats: 8 },
    { roomCode: 'ROOM-03', name: 'Reading Room', building: 'Block C', seats: 4 }
  ]);
  const today = new Date().toISOString().slice(0,10);
  const slots = [];
  for (const room of rooms) for (const hour of [8,10,12,14]) slots.push({ roomCode: room.roomCode, date: today, startHour: hour, seats: room.seats, booked: 0 });
  await Slot.insertMany(slots);
  console.log(`Seeded ${rooms.length} rooms and ${slots.length} slots`);
  await mongoose.disconnect();
}
seed().catch(e => { console.error(e); process.exit(1); });
