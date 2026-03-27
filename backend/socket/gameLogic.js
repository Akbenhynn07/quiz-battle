const questions = require('../data/questions.json');

function handleGameEvents(io, socket) {
  socket.on('startGame', (roomId) => {
    const room = global.activeRooms[roomId];
    if (!room) return;
    
    if (room.currentQuestionIndex === undefined) {
      room.currentQuestionIndex = 0;
      room.answers = {};
      sendQuestion(io, roomId, room);
    }
  });

  socket.on('submitAnswer', (data) => {
    const { roomId, answerIndex, timeRemaining } = data;
    const room = global.activeRooms[roomId];
    if (!room) return;

    const question = questions[room.currentQuestionIndex];
    if (!question) return;

    let points = 0;
    if (answerIndex === question.correctAnswer) {
      points = 100 + (timeRemaining * 10);
    }

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.score += points;
    }

    room.answers[socket.id] = { answerIndex, points };

    if (Object.keys(room.answers).length === 2) {
      io.to(roomId).emit('roundResult', {
        correctAnswer: question.correctAnswer,
        players: room.players
      });

      setTimeout(() => {
        room.currentQuestionIndex++;
        if (room.currentQuestionIndex >= questions.length) {
          io.to(roomId).emit('gameFinished', room.players);
          delete global.activeRooms[roomId];
        } else {
          room.answers = {};
          sendQuestion(io, roomId, room);
        }
      }, 3000);
    }
  });

  socket.on('usePowerUp', (data) => {
    const { roomId, type } = data;
    socket.to(roomId).emit('powerUpUsed', { type, by: socket.id });
  });
}

function sendQuestion(io, roomId, room) {
  const q = questions[room.currentQuestionIndex];
  if (q) {
    io.to(roomId).emit('newQuestion', {
      question: q.question,
      options: q.options,
      questionIndex: room.currentQuestionIndex,
      totalQuestions: questions.length
    });
  }
}

module.exports = { handleGameEvents };
