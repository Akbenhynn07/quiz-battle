import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Medal } from 'lucide-react';

export default function Leaderboard() {
  const navigate = useNavigate();
  // Mock data for leaderboard
  const topPlayers = [
    { rank: 1, username: 'CodeNinja', elo: 1450, tier: 'Gold' },
    { rank: 2, username: 'ReactMaster', elo: 1320, tier: 'Silver' },
    { rank: 3, username: 'ViteSpeed', elo: 1210, tier: 'Bronze' },
    { rank: 4, username: 'TailwindGod', elo: 1100, tier: 'Iron' },
    { rank: 5, username: 'SocketFan', elo: 1050, tier: 'Iron' },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-[90vh] py-12 px-4 max-w-2xl mx-auto space-y-8">
      <div className="w-full flex items-center justify-between mb-4">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white flex items-center bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neonBlue to-yellow-400 flex items-center tracking-wider uppercase">
          <Trophy className="mr-3 text-yellow-400" /> Global Top 5
        </h1>
        <div className="w-24"></div> {/* spacer */}
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full glass-card p-6"
      >
        <div className="flex text-sm text-gray-500 uppercase tracking-widest pl-4 mb-4 font-bold border-b border-white/10 pb-2">
          <div className="w-16">Rank</div>
          <div className="flex-1">Player</div>
          <div className="w-24 text-right">Rating</div>
        </div>

        <div className="space-y-3">
          {topPlayers.map((p, i) => (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              key={p.rank}
              className={`flex items-center p-4 rounded-xl border ${i === 0 ? 'bg-yellow-500/10 border-yellow-500/50' : i === 1 ? 'bg-gray-300/10 border-gray-300/50' : i === 2 ? 'bg-amber-600/10 border-amber-600/50' : 'bg-white/5 border-white/10'}`}
            >
              <div className="w-16 font-extrabold text-xl text-gray-400 flex items-center">
                #{p.rank}
                {i < 3 && <Medal className={`ml-1 ${i===0?'text-yellow-400':i===1?'text-gray-300':'text-amber-600'}`} size={16}/>}
              </div>
              <div className="flex-1 font-bold text-lg text-white tracking-wide">
                {p.username}
                <span className={`ml-3 text-[10px] px-2 py-1 rounded-sm uppercase tracking-widest font-black ${i === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-black/40 text-gray-400'}`}>
                  {p.tier}
                </span>
              </div>
              <div className="w-24 text-right font-mono text-neonBlue font-bold text-lg">{p.elo}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
