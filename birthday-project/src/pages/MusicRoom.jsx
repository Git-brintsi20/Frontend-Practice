
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
  const { searchResults, setSearchQuery, selectTrack, isLoading, error } = useAudio();
  const [searchQuery, setSearchQueryLocal] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(true);

  const btsSuggestions = [
    "Try 'Dynamite' by BTS!",
    "Search for 'Butter' by BTS!",
    "How about 'Euphoria' by Jungkook?",
    "Listen to 'Moon' by Jin!",
    "Check out 'Boy With Luv' by BTS!",
    "Find 'Blood Sweat & Tears' by BTS!",
  ];

  useEffect(() => {
    const selectedMember = location.state?.selectedMember || 'default';
    if (selectedMember !== themeMode) {
      changeThemeNew(selectedMember);
    }
  }, [location.state, themeMode, changeThemeNew]);

  useEffect(() => {
    setShowConfetti(true);
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
    const welcomeTimer = setTimeout(() => setWelcomeMessage(false), 3000);

    const suggestionInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * btsSuggestions.length);
      setSuggestion(btsSuggestions[randomIndex]);
    }, 5000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(welcomeTimer);
      clearInterval(suggestionInterval);
    };
  }, []);

  useEffect(() => {
    setSearchQuery(searchQuery);
  }, [searchQuery, setSearchQuery]);

  const handleSearchChange = (e) => {
    setSearchQueryLocal(e.target.value);
  };

  if (!theme) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Loading theme...</div>;
  }

  return (
    <div
      className="music-room wave-background"
      style={{
        background: theme.gradient || `linear-gradient(135deg, ${theme.background}, ${theme.primary}22)`,
        fontFamily: theme.fontFamily,
        '--primary-color': theme.primary,
        '--secondary-color': theme.secondary,
        '--background-color': theme.background,
        '--text-color': theme.text,
        '--accent-color': theme.accent,
        overflowY: 'auto',
        height: '100vh',
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
                backgroundColor:
                  i % 5 === 0
                    ? theme.primary
                    : i % 5 === 1
                    ? theme.accent
                    : i % 5 === 2
                    ? '#fff'
                    : i % 5 === 3
                    ? '#ffcd00'
                    : '#ff69b4',
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
          <p>Search for your favorite songs and celebrate your birthday!</p>
        </motion.div>
      )}

      <motion.div
        className="music-room-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: welcomeMessage ? 3 : 0 }}
      >
        <div className="room-header">
          <h1>BTS Music Room</h1>
          <p>Search for any song and enjoy the BTS vibe! 💜</p>
        </div>

        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for a song..."
            className="search-input"
          />
          <p className="suggestion-text">{suggestion}</p>
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', color: theme.text }}>Searching...</div>
        )}

        {error && (
          <div className="error-message" style={{ color: theme.text }}>
            {error}
            <button
              className="button"
              onClick={() => setSearchQuery(searchQuery)}
              style={{ backgroundColor: theme.primary, color: theme.secondary, marginTop: '10px' }}
            >
              Retry
            </button>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="search-results">
            <ul>
              {searchResults.map((track) => (
                <li
                  key={track.id}
                  className="search-result-item"
                  onClick={() => selectTrack(track)}
                >
                  <img
                    src={track.album.images[0]?.url || '/assets/images/bts/group/bts-main.jpeg'}
                    alt={track.name}
                    className="search-result-image"
                  />
                  <div className="search-result-info">
                    <div className="search-result-name">{track.name}</div>
                    <div className="search-result-artist">
                      {track.artists.map((artist) => artist.name).join(', ')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <MusicPlayer />

        <div className="birthday-message" style={{ color: theme.primary }}>
          <p>Happy Birthday! 🎂 Enjoy your BTS-inspired music room! 💜</p>
        </div>
      </motion.div>

      <div className="floating-elements">
        {[...Array(5)].map((_, i) => (
          <img
            key={i}
            src={i % 2 === 0 ? '/assets/images/bts/symbols/icon-4.png' : '/assets/images/bts/symbols/icon-5.png'}
            alt="BTS Element"
            className="floating-element"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MusicRoom;
