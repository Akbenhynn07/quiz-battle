const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const { handleMatchmaking } = require('./socket/matchmaking');
const { handleGameEvents } = require('./socket/gameLogic');

// In-memory global state mapping rooms to game sessions
// In a real app we might use Redis
global.activeRooms = {};
global.waitingPlayers = [];

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  handleMatchmaking(io, socket);
  handleGameEvents(io, socket);

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    // We should clean up waiting queues or active matches on disconnect
    global.waitingPlayers = global.waitingPlayers.filter(p => p.id !== socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
