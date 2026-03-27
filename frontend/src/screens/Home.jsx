import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { Play, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [username, setUsername] = useState('');
  const socket = useSocket();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!username.trim() || !socket) return;
    socket.emit('createRoom', { username });
    
    socket.once('roomCreated', (roomId) => {
      navigate(`/lobby/${roomId}`, { state: { username, isHost: true } });
    });
  };

  const handleFindMatch = () => {
    if (!username.trim() || !socket) return;
    navigate(`/lobby/random`, { state: { username, isSearching: true } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-md w-full p-8 flex flex-col items-center"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neonBlue to-neonPurple flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,243,255,0.4)]">
          <Trophy size={40} className="text-white drop-shadow-lg" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neonBlue to-neonPurple mb-8 text-center uppercase tracking-wider drop-shadow-sm">
          Quiz Battle
        </h1>

        <div className="w-full space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Player Name</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your alias..."
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonBlue focus:ring-1 focus:ring-neonBlue transition-all placeholder-gray-600"
            />
          </div>

          <div className="space-y-4 pt-4">
            <button 
              onClick={handleFindMatch}
              disabled={!username.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-neonBlue to-blue-600 hover:from-blue-500 hover:to-neonBlue text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]"
            >
              <Play size={20} />
              <span>Find Random Match</span>
            </button>

            <button 
              onClick={handleCreateRoom}
              disabled={!username.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              <Users size={20} />
              <span>Create Private Room</span>
            </button>

            <button 
              onClick={() => navigate('/leaderboard')}
              className="w-full flex items-center justify-center space-x-2 bg-transparent border border-white/10 hover:border-neonPurple text-gray-400 hover:text-white font-bold py-3 px-6 rounded-xl transition-all shadow-none mt-2"
            >
              <Trophy size={18} className="text-neonPurple" />
              <span>Global Leaderboard</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
