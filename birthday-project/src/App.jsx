import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import IntroAnimation from './pages/Intro';
import JourneyPath from './pages/Journey';
import LetterPage from './pages/Letter';
import MusicRoom from './pages/MusicRoom';
import './App.css';

function App() {
  return (
    <Router>
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