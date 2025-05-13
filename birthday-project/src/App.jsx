// App.jsx
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
  const { playTrack, pauseTrack, trackList, currentTrack } = useAudio();
  const location = useLocation();

  useEffect(() => {
    if (trackList.length === 0) return;

    // Pause music in Music Room to avoid overlap with MusicPlayer
    if (location.pathname === '/music-room') {
      pauseTrack();
    } else {
      if (!currentTrack) {
        playTrack(trackList[0].id);
      }
    }
  }, [location.pathname, trackList, currentTrack, playTrack, pauseTrack]);

  return null;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AudioProvider>
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