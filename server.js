require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const app = require('./app');
const { registerSockets } = require('./services/socketService');

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  console.error('MONGODB_URL is missing. Copy .env.example to .env and configure it.');
  process.exit(1);
}

async function start() {
  await mongoose.connect(MONGODB_URL);
  console.log('Connected to MongoDB');
  const server = http.createServer(app);
  const io = new Server(server);
  app.set('io', io);
  registerSockets(io);
  server.listen(PORT, () => console.log(`SRB API listening on port ${PORT}`));
}
start().catch(err => { console.error(err); process.exit(1); });
