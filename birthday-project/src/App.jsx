import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider, useAudio } from './context/AudioContext';
import IntroAnimation from './pages/Intro';
import JourneyPath from './pages/Journey';
import LetterPage from './pages/Letter';
import MusicRoom from './pages/MusicRoom';
import './App.css';

const AudioController = () => {
  const { bgMusic } = useAudio(); // bgMusic object from context has .play, .pause, .isPlaying
  const location = useLocation();
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!userInteracted) { // Ensure it only sets state once
          console.log("User has interacted with the document for the first time.");
          setUserInteracted(true);
      }
    };
    // Add event listeners for the first interaction, ensure they are removed
    window.addEventListener('click', handleFirstInteraction, { once: true, capture: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true, capture: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, capture: true });
    
    // Cleanup function for when AudioController unmounts (though unlikely for this component)
    return () => {
      window.removeEventListener('click', handleFirstInteraction, { once: true, capture: true });
      window.removeEventListener('keydown', handleFirstInteraction, { once: true, capture: true });
      window.removeEventListener('touchstart', handleFirstInteraction, { once: true, capture: true });
    };
  }, [userInteracted]); // Depend on userInteracted to avoid re-adding listeners if it's already true

  useEffect(() => {
    if (location.pathname === '/music-room') {
      if (bgMusic.isPlaying) {
        bgMusic.pause();
      }
    } else {
      if (userInteracted && !bgMusic.isPlaying) {
        // Only attempt to play if user has interacted and music is not already playing
        bgMusic.play(); // The play function in AudioContext already has a catch block
      } else if (!userInteracted) {
        console.log("AudioController: Background music ready, waiting for user interaction.");
      }
    }
  }, [location.pathname, bgMusic, userInteracted]);

  return null;
};

function App() {
  // ... (rest of App.js is the same)
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