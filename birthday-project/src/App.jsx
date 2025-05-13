import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider, useAudio } from './context/AudioContext';
import IntroAnimation from './pages/Intro';
import JourneyPath from './pages/Journey';
import LetterPage from './pages/Letter';
import MusicRoom from './pages/MusicRoom';
import './App.css';

const AudioController = () => {
  const { bgMusic } = useAudio();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/music-room') {
      bgMusic.pause();
    } else {
      if (!bgMusic.isPlaying) {
        bgMusic.play().catch((err) => {
          console.error('Failed to play background music:', err);
        });
      }
    }
  }, [location.pathname, bgMusic]);

  return null;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AudioProvider>
          <AudioController />
          <div className="App">
            <Routes>
              <Route path="/" element={<IntroAnimation />} />
              <Route path="/journey" element={<JourneyPath />} />
              <Route path="/letter" element={<LetterPage />} />
              <Route path="/music-room" element={<MusicRoom />} />
            </Routes>
          </div>
        </AudioProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;