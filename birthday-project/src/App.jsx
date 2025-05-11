import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import Intro from './pages/Intro';
import Journey from './pages/Journey';
import Letter from './pages/Letter';
import MusicRoom from './pages/MusicRoom';
import './styles/global.css';
import './App.css';

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <img
            src="/assets/images/bts/logo-animation.gif"
            alt="BTS Logo"
            className="bts-logo-animation"
          />
        </div>
        <p className="loading-text">Loading your special BTS birthday surprise...</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AudioProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/letter" element={<Letter />} />
            <Route path="/music-room" element={<MusicRoom />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AudioProvider>
    </ThemeProvider>
  );
};

export default App;