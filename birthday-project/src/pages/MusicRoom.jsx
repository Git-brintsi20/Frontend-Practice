// MusicRoom.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import MusicPlayer from './MusicPlayer';
import '../styles/MusicRoom.css';

const MusicRoom = () => {
  const location = useLocation();
  const { theme, themeMode, changeThemeNew } = useTheme();
  const { trackList, error, playTrack, currentTrack } = useAudio();
  const [showConfetti, setShowConfetti] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(true);

  useEffect(() => {
    const selectedMember = location.state?.selectedMember || 'default';
    if (selectedMember !== themeMode) {
      changeThemeNew(selectedMember);
    }

    // Auto-play first track if none is playing
    if (trackList.length > 0 && !currentTrack) {
      playTrack(trackList[0].id);
    }
  }, [location.state, themeMode, changeThemeNew, trackList, currentTrack, playTrack]);

  useEffect(() => {
    setShowConfetti(true);
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
    const welcomeTimer = setTimeout(() => setWelcomeMessage(false), 3000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(welcomeTimer);
    };
  }, []);

  const handleRetry = () => {
    if (trackList.length > 0 && !currentTrack) {
      playTrack(trackList[0].id);
    }
  };

  if (!theme) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Loading theme...</div>;
  }

  return (
    <div
      className="music-room"
      style={{
        background: theme.gradient || `linear-gradient(135deg, ${theme.background}, ${theme.primary}22)`,
        fontFamily: theme.fontFamily,
        '--primary-color': theme.primary,
        '--secondary-color': theme.secondary,
        '--background-color': theme.background,
        '--text-color': theme.text,
        '--accent-color': theme.accent
      }}
    >
      <NavBar />
      <div className="navbar-spacer"></div>

      {showConfetti && (
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: i % 5 === 0 ? theme.primary :
                                i % 5 === 1 ? theme.accent :
                                i % 5 === 2 ? '#fff' :
                                i % 5 === 3 ? '#ffcd00' : '#ff69b4'
              }}
            ></div>
          ))}
        </div>
      )}

      {welcomeMessage && (
        <motion.div
          className="welcome-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>Welcome to the BTS Music Room! 💜</h1>
          <p>Let's celebrate your birthday with some amazing music!</p>
        </motion.div>
      )}

      <motion.div
        className="music-room-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: welcomeMessage ? 3 : 0 }}
      >
        {error && (
          <div className="error-message" style={{ color: theme.text }}>
            {error}
            <button
              className="retry-button"
              onClick={handleRetry}
              style={{ backgroundColor: theme.primary, color: theme.secondary }}
            >
              Retry
            </button>
          </div>
        )}

        <div className="room-header">
          <h1>BTS Music Room</h1>
          <p>Immerse yourself in a BTS music experience! 💜</p>
        </div>

        {trackList.length === 0 && !error ? (
          <div style={{ textAlign: 'center', color: theme.text }}>
            Loading tracks...
          </div>
        ) : (
          <MusicPlayer />
        )}

        <div className="birthday-message" style={{ color: theme.primary }}>
          <p>Happy Birthday! 🎂 Enjoy this BTS music room created just for you! 💜</p>
        </div>
      </motion.div>
    </div>
  );
};

export default MusicRoom;