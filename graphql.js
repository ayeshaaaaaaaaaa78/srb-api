const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServer } = require('@apollo/server');
const Room = require('./models/Room');
const Slot = require('./models/Slot');
const Student = require('./models/Student');
const Booking = require('./models/Booking');
const bookingService = require('./services/bookingService');

const typeDefs = `#graphql
  type Room { roomCode: String!, name: String!, building: String!, seats: Int! }
  type Slot { id: ID!, roomCode: String!, date: String!, startHour: Int!, seats: Int!, booked: Int!, seatsLeft: Int! }
  type Booking { id: ID!, roomName: String!, date: String!, startHour: Int!, slotId: ID! }
  type Student { regNo: String!, name: String!, email: String!, bookings: [Booking!]! }
  type Query { rooms: [Room!]!, slots(roomCode: String, date: String): [Slot!]!, student(regNo: String!): Student }
  type Mutation { bookSlot(regNo: String!, slotId: ID!): Boolean!, cancelBooking(regNo: String!, slotId: ID!): Boolean! }
`;
const resolvers = {
  Query: {
    rooms: () => Room.find().sort({ roomCode: 1 }),
    slots: (_p, args) => Slot.find({ ...(args.roomCode ? { roomCode: args.roomCode.toUpperCase() } : {}), ...(args.date ? { date: args.date } : {}) }),
    student: (_p, args) => Student.findOne({ regNo: args.regNo.toUpperCase() })
  },
  Slot: { id: s => String(s._id), seatsLeft: s => Math.max(0, s.seats - s.booked) },
  Student: { bookings: async s => {
    const bs = await Booking.find({ regNo: s.regNo });
    const out = [];
    for (const b of bs) {
      const slot = await Slot.findById(b.slotId);
      if (!slot) continue;
      const room = await Room.findOne({ roomCode: slot.roomCode });
      out.push({ id: String(b._id), slotId: String(slot._id), roomName: room ? room.name : slot.roomCode, date: slot.date, startHour: slot.startHour });
    }
    return out;
  }},
  Booking: { id: b => b.id || String(b._id) },
  Mutation: {
    bookSlot: async (_p, a, ctx) => { await bookingService.book(a.regNo, a.slotId, ctx.io); return true; },
    cancelBooking: async (_p, a, ctx) => { await bookingService.cancel(a.regNo, a.slotId, ctx.io); return true; }
  }
};
let apolloPromise;
exports.createHandler = () => async (req, res, next) => {
  try {
    if (!apolloPromise) {
      apolloPromise = (async () => {
        const apollo = new ApolloServer({ typeDefs, resolvers });
        await apollo.start();
        return apollo;
      })();
    }
    const apollo = await apolloPromise;
    return expressMiddleware(apollo, { context: async () => ({ io: req.app.get('io') }) })(req, res, next);
  } catch (err) { next(err); }
};
