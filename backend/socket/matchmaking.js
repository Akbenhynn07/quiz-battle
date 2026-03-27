const { v4: uuidv4 } = require('uuid');

function handleMatchmaking(io, socket) {
  socket.on('createRoom', (data) => {
    const roomId = uuidv4().slice(0, 8);
    socket.join(roomId);
    
    global.activeRooms[roomId] = {
      id: roomId,
      players: [{ id: socket.id, username: data.username, score: 0 }],
      state: 'waiting'
    };
    
    socket.emit('roomCreated', roomId);
  });

  socket.on('joinRoom', (data) => {
    const { roomId, username } = data;
    const room = global.activeRooms[roomId];
    
    if (room && room.state === 'waiting' && room.players.length < 2) {
      socket.join(roomId);
      room.players.push({ id: socket.id, username, score: 0 });
      
      socket.emit('roomJoined', roomId);
      io.to(roomId).emit('playerJoined', room.players);
      
      if (room.players.length === 2) {
        room.state = 'playing';
        io.to(roomId).emit('gameStarting');
      }
    } else {
      socket.emit('error', 'Room not found or game already started');
    }
  });

  socket.on('findMatch', (data) => {
    global.waitingPlayers.push({ id: socket.id, username: data.username });
    
    if (global.waitingPlayers.length >= 2) {
      const p1 = global.waitingPlayers.shift();
      const p2 = global.waitingPlayers.shift();
      
      const roomId = uuidv4().slice(0, 8);
      
      const socketP1 = io.sockets.sockets.get(p1.id);
      const socketP2 = io.sockets.sockets.get(p2.id);
      
      if (socketP1 && socketP2) {
        socketP1.join(roomId);
        socketP2.join(roomId);
        
        global.activeRooms[roomId] = {
          id: roomId,
          players: [
            { id: p1.id, username: p1.username, score: 0 },
            { id: p2.id, username: p2.username, score: 0 }
          ],
          state: 'playing'
        };
        
        io.to(roomId).emit('matchFound', roomId);
        io.to(roomId).emit('gameStarting');
      }
    } else {
      socket.emit('waitingForMatch');
    }
  });
}

module.exports = { handleMatchmaking };
