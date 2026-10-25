const express = require('express');
const requestLogger = require('./middleware/requestLogger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const roomRoutes = require('./routes/roomRoutes');
const slotRoutes = require('./routes/slotRoutes');
const studentRoutes = require('./routes/studentRoutes');
const { createHandler } = require('./graphql');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(requestLogger);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/slots', slotRoutes);
app.use('/api/v1/students', studentRoutes);
app.post('/graphql', createHandler());

app.use(notFound);
app.use(errorHandler);
module.exports = app;
