import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import ParticleBackground from './components/ParticleBackground';
import Home from './screens/Home';
import Lobby from './screens/Lobby';
import Game from './screens/Game';
import Results from './screens/Results';
import Leaderboard from './screens/Leaderboard';

function App() {
  return (
    <SocketProvider>
      <ParticleBackground />
      <Router>
        <div className="min-h-screen text-white relative z-10 font-sans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby/:roomId" element={<Lobby />} />
            <Route path="/game/:roomId" element={<Game />} />
            <Route path="/results/:roomId" element={<Results />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
