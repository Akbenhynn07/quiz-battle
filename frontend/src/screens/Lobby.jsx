import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { Share2, Users, Loader2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Lobby() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  const [players, setPlayers] = useState([]);
  
  const isRandom = roomId === 'random';
  const username = location.state?.username;
  const isHost = location.state?.isHost;

  useEffect(() => {
    if (!socket || !username) {
      navigate('/');
      return;
    }

    if (isRandom) {
      socket.emit('findMatch', { username });
      socket.on('matchFound', (id) => {
        navigate(`/lobby/${id}`, { state: { username, isHost: false }, replace: true });
      });
    } else {
      if (!isHost) {
        socket.emit('joinRoom', { roomId, username });
      } else {
        setPlayers([{ id: socket.id, username, score: 0 }]);
      }

      socket.on('playerJoined', (updatedPlayers) => {
        setPlayers(updatedPlayers);
      });

      socket.on('gameStarting', () => {
        navigate(`/game/${roomId}`, { state: { username } });
      });

      socket.on('error', (msg) => {
        alert(msg);
        navigate('/');
      });
    }

    return () => {
      socket.off('matchFound');
      socket.off('playerJoined');
      socket.off('gameStarting');
      socket.off('error');
    };
  }, [socket, username, roomId, isRandom, navigate, isHost]);

  const shareLink = `${window.location.origin}/lobby/${roomId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const shareWhatsApp = () => {
    const text = `Join my Quiz Battle! Click the link to play: ${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // If user navigated directly via URL without going through home screen
  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh]">
        <div className="glass-card p-8 flex flex-col items-center max-w-sm w-full space-y-4">
          <h2 className="text-xl font-bold text-center">Join Room {roomId}</h2>
          <input 
            type="text"
            id="guestName"
            placeholder="Enter your name"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonBlue"
          />
          <button 
            onClick={() => {
              const name = document.getElementById('guestName').value;
              if (name) {
                navigate(`/lobby/${roomId}`, { state: { username: name, isHost: false }, replace: true });
              }
            }}
            className="w-full bg-neonBlue text-black font-bold py-3 rounded-xl"
          >
            Join Match
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-lg w-full p-8 flex flex-col items-center"
      >
        <Loader2 size={48} className="text-neonBlue animate-spin mb-6" />
        
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
          {isRandom ? 'Finding Opponent...' : 'Waiting for Player 2...'}
        </h2>
        
        {!isRandom && (
          <p className="text-gray-400 mb-8 tracking-wide">Room ID: <span className="text-neonBlue font-mono">{roomId}</span></p>
        )}

        <div className="w-full bg-black/40 rounded-xl p-4 mb-8">
          <h3 className="text-sm text-gray-400 uppercase mb-4 flex items-center"><Users size={16} className="mr-2"/> Players Connected</h3>
          <div className="space-y-3">
            {players.map((p, i) => (
              <div key={p.id} className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-white/10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-neonBlue/20 text-neonBlue' : 'bg-neonPurple/20 text-neonPurple'}`}>
                  {p.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-white">{p.username} {p.id === socket.id && '(You)'}</span>
              </div>
            ))}
            {players.length === 1 && (
              <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-dashed border-white/20 opacity-50">
                <div className="w-8 h-8 rounded-full border border-dashed flex items-center justify-center border-gray-500">?</div>
                <span className="font-medium text-gray-500 italic">Waiting...</span>
              </div>
            )}
          </div>
        </div>

        {!isRandom && players.length < 2 && (
          <div className="w-full space-y-3">
            <button 
              onClick={copyLink}
              className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all"
            >
              <Copy size={18} />
              <span>Copy Invite Link</span>
            </button>
            <button 
              onClick={shareWhatsApp}
              className="w-full flex items-center justify-center space-x-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 font-medium py-3 px-4 rounded-xl transition-all"
            >
              <Share2 size={18} />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
