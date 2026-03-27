import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const players = location.state?.players || [];
  const username = location.state?.username;

  if (players.length === 0) {
    return <div className="text-center mt-20">No game data. <button onClick={() => navigate('/')}>Go Home</button></div>;
  }

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const isDraw = sortedPlayers[0].score === sortedPlayers[1]?.score;

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="glass-card max-w-md w-full p-8 flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-0 w-full h-full bg-gradient-to-b from-neonBlue/10 to-transparent pointer-events-none" />

        <div className="w-32 h-32 rounded-full border-4 border-neonBlue flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(0,243,255,0.6)] bg-black/50 z-10">
          <Trophy size={60} className="text-neonBlue drop-shadow-lg" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neonBlue to-white mb-2 z-10 text-center uppercase tracking-wider">
          {isDraw ? "It's a Draw!" : `${winner.username} Wins!`}
        </h1>
        <p className="text-gray-400 mb-8 z-10 uppercase tracking-widest text-sm">Match Completed</p>

        <div className="w-full space-y-4 mb-8 z-10">
          {sortedPlayers.map((p, i) => (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              key={p.id} 
              className={`flex justify-between items-center p-4 rounded-xl border ${i === 0 ? 'bg-neonBlue/10 border-neonBlue/50' : 'bg-white/5 border-white/10'}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-gray-500">#{i + 1}</span>
                <span className="text-lg font-bold">
                  {p.username} {p.username === username && '(You)'}
                </span>
              </div>
              <span className={`text-2xl font-bold ${i === 0 ? 'text-neonBlue' : 'text-gray-300'}`}>
                {p.score} <span className="text-sm font-normal text-gray-500">pts</span>
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex space-x-4 w-full z-10">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-neonBlue to-blue-600 hover:from-blue-500 hover:to-neonBlue text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home size={18} />
            <span>Return to Menu</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
