import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { Timer, Zap, Shield, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Game() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  const username = location.state?.username;

  const [questionData, setQuestionData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [showRoundResult, setShowRoundResult] = useState(false);

  useEffect(() => {
    if (!socket || !username) {
      navigate('/');
      return;
    }

    socket.emit('startGame', roomId);

    socket.on('newQuestion', (data) => {
      setQuestionData(data);
      setTimeLeft(15);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
      setShowRoundResult(false);
    });

    socket.on('roundResult', (data) => {
      setCorrectAnswer(data.correctAnswer);
      setPlayers(data.players);
      setShowRoundResult(true);
    });

    socket.on('gameFinished', (finalPlayers) => {
      navigate(`/results/${roomId}`, { state: { players: finalPlayers, username } });
    });

    return () => {
      socket.off('newQuestion');
      socket.off('roundResult');
      socket.off('gameFinished');
    };
  }, [socket, roomId, username, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !showRoundResult && questionData) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && selectedAnswer === null && !showRoundResult && questionData) {
      handleSelectOption(-1);
    }
  }, [timeLeft, showRoundResult, questionData, selectedAnswer]);

  const handleSelectOption = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    socket.emit('submitAnswer', { roomId, answerIndex: index, timeRemaining: timeLeft });
  };

  if (!questionData) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <h2 className="text-3xl font-bold text-neonBlue animate-pulse">Initializing Game...</h2>
      </div>
    );
  }

  const me = players.find(p => p.username === username);
  const opponent = players.find(p => p.username !== username);

  return (
    <div className="flex flex-col items-center justify-start min-h-[90vh] py-8 px-4 max-w-4xl mx-auto space-y-8">
      
      <div className="w-full flex justify-between items-center glass-card p-4">
        <div className="flex flex-col items-start w-1/3">
          <span className="text-sm text-gray-400">You ({username})</span>
          <span className="text-xl font-bold text-neonBlue">{me?.score || 0} pts</span>
        </div>
        
        <div className="flex flex-col items-center w-1/3">
          <div className="w-16 h-16 rounded-full border-4 border-white/10 flex items-center justify-center relative shadow-[0_0_15px_rgba(57,255,20,0.2)]">
            <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
              <circle cx="32" cy="32" r="28" stroke="#39ff14" strokeWidth="4" fill="none" 
                strokeDasharray="176" 
                strokeDashoffset={176 - (176 * (timeLeft / 15))} 
                className="transition-all duration-1000 linear" />
            </svg>
            <span className="text-2xl font-bold">{timeLeft}</span>
          </div>
          <span className="text-xs text-gray-500 mt-2 uppercase tracking-wide">Time</span>
        </div>

        <div className="flex flex-col items-end w-1/3 text-right">
          <span className="text-sm text-gray-400">Opponent ({opponent?.username || 'P2'})</span>
          <span className="text-xl font-bold text-neonPurple">{opponent?.score || 0} pts</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={questionData.questionIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale:  1.05 }}
          className="w-full max-w-2xl bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
            <div 
              className="h-full bg-gradient-to-r from-neonBlue to-neonPurple transition-all duration-500"
              style={{ width: `${((questionData.questionIndex + 1) / questionData.totalQuestions) * 100}%` }}
            />
          </div>

          <h3 className="text-gray-400 mb-6 uppercase text-sm font-semibold tracking-widest text-center mt-2">
            Question {questionData.questionIndex + 1} / {questionData.totalQuestions}
          </h3>
          
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 leading-relaxed text-white drop-shadow-md">
            {questionData.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {questionData.options.map((option, idx) => {
              let btnStatus = "border-white/10 bg-white/5 hover:bg-white/10";
              if (selectedAnswer === idx) {
                btnStatus = "border-neonBlue bg-neonBlue/20 shadow-[0_0_15px_rgba(0,243,255,0.4)] text-white";
              }
              if (showRoundResult) {
                if (correctAnswer === idx) {
                  btnStatus = "border-neonGreen bg-neonGreen/20 shadow-[0_0_15px_rgba(57,255,20,0.4)] font-bold";
                } else if (selectedAnswer === idx) {
                  btnStatus = "border-neonRed bg-neonRed/20 shadow-[0_0_15px_rgba(255,0,60,0.4)] opacity-75";
                } else {
                  btnStatus = "border-white/5 bg-white/5 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedAnswer !== null || showRoundResult}
                  onClick={() => handleSelectOption(idx)}
                  className={`relative overflow-hidden text-left p-4 rounded-xl border-2 transition-all duration-300 transform ${btnStatus} ${selectedAnswer === null ? 'hover:-translate-y-1' : ''}`}
                >
                  <span className="relative z-10 text-lg">{option}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mock Powerups Component */}
      <div className="flex gap-4 p-4 glass-card">
        <button disabled className="p-3 rounded-full bg-white/5 opacity-50 border border-white/10"><Zap className="text-amber-400" size={24}/></button>
        <button disabled className="p-3 rounded-full bg-white/5 opacity-50 border border-white/10"><Shield className="text-neonBlue" size={24}/></button>
        <button disabled className="p-3 rounded-full bg-white/5 opacity-50 border border-white/10"><Star className="text-neonPurple" size={24}/></button>
      </div>

    </div>
  );
}
