import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import MusicPlayer from './MusicPlayer';
import '../styles/MusicRoom.css';

const MusicRoom = () => {
  const location = useLocation();
  const { theme, themeMode, changeThemeNew } = useTheme();
  const { trackList, playTrack, currentTrack, isPlaying } = useAudio();
  const [showConfetti, setShowConfetti] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState(true);
  const [sortedTracks, setSortedTracks] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAnimating, setIsAnimating] = useState(false);

  // Update theme based on selected member
  useEffect(() => {
    const selectedMember = location.state?.selectedMember || 'default';
    if (selectedMember !== themeMode) {
      changeThemeNew(selectedMember);
    }
  }, [location.state, themeMode, changeThemeNew]);

  // Initial animations and timers
  useEffect(() => {
    const confettiTimer = setTimeout(() => setShowConfetti(false), 6000);
    const welcomeTimer = setTimeout(() => setWelcomeMessage(false), 4000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(welcomeTimer);
    };
  }, []);

  // Sort tracks by various criteria
  useEffect(() => {
    let sorted = [...trackList];
    
    if (activeCategory === 'solo') {
      sorted = sorted.filter(track => 
        ['Jin', 'Jungkook', 'Jimin', 'V'].includes(track.artist)
      );
    } else if (activeCategory === 'group') {
      sorted = sorted.filter(track => 
        track.artist === 'BTS' || track.artist.includes('BTS feat.')
      );
    } else if (activeCategory === 'featured') {
      sorted = sorted.filter(track => 
        track.artist.includes('feat.')
      );
    }
    
    setSortedTracks(sorted);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  }, [trackList, activeCategory]);

  if (!theme) {
    return <div className="music-room-loading">Loading theme...</div>;
  }

  const handleCategoryChange = (category) => {
    if (category !== activeCategory) {
      setActiveCategory(category);
    }
  };

  return (
    <div
      className="music-room"
      style={{
        background: theme.gradient || `linear-gradient(135deg, ${theme.background}, ${theme.primary}33)`,
        fontFamily: theme.fontFamily,
        '--primary-color': theme.primary,
        '--secondary-color': theme.secondary,
        '--background-color': theme.background,
        '--text-color': theme.text,
        '--accent-color': theme.accent,
      }}
    >
      <NavBar />

      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20 + 10}px`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animationDuration: `${Math.random() * 4 + 2}s`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor:
                  i % 5 === 0
                    ? theme.primary
                    : i % 5 === 1
                    ? theme.accent
                    : i % 5 === 2
                    ? '#ffffff'
                    : i % 5 === 3
                    ? '#ffcd00'
                    : '#ff69b4',
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            ></div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {welcomeMessage && (
          <motion.div
            className="welcome-overlay"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Welcome to the BTS Music Room! 💜
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Enjoy our favorite songs and celebrate with the Bangtan Boys!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="music-room-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: welcomeMessage ? 4 : 0 }}
      >
        <div className="room-header">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            BTS Music Room
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Choose a song and vibe with BTS! 💜
          </motion.p>
          
          <motion.div 
            className="filter-categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              All Songs
            </button>
            <button 
              className={`category-btn ${activeCategory === 'group' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('group')}
            >
              Group Songs
            </button>
            <button 
              className={`category-btn ${activeCategory === 'solo' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('solo')}
            >
              Solo Songs
            </button>
            <button 
              className={`category-btn ${activeCategory === 'featured' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('featured')}
            >
              Featured
            </button>
          </motion.div>
        </div>

        <motion.div 
          className="song-grid"
          initial={{ opacity: 1 }}
          animate={{ opacity: isAnimating ? 0.6 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {sortedTracks.map((track, index) => (
              <motion.div
                key={track.id}
                className={`song-tile ${currentTrack?.id === track.id && isPlaying ? 'playing' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ 
                  scale: 1.08, 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  zIndex: 10
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playTrack(track.id)}
              >
                <div className="song-tile-image-wrapper">
                  <img src={track.tile} alt={track.name} className="song-tile-image" />
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="playing-wave">
                      {[...Array(4)].map((_, i) => (
                        <span key={i}></span>
                      ))}
                    </div>
                  )}
                  <div className="tile-overlay">
                    <button className="play-button-large">
                      <svg viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="song-tile-info">
                  <h3>{track.name}</h3>
                  <p>{track.artist}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        <div className="birthday-message-container">
          <motion.div 
            className="birthday-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p>Happy Birthday! 🎂 Enjoy your special day with BTS! 💜</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="floating-elements">
        {[...Array(10)].map((_, i) => (
          <motion.img
            key={i}
            src={i % 3 === 0 ? '/assets/images/bts/symbols/icon-4.jpg' : 
                 i % 3 === 1 ? '/assets/images/bts/symbols/icon-5.jpg' : 
                 '/assets/images/bts/symbols/icon-6.jpg'}
            alt="BTS Element"
            className="floating-element"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.4, 0.8, 0.4], 
              scale: [0.8, 1.2, 0.8],
              x: [`${Math.random() * 20}px`, `${-Math.random() * 20}px`, `${Math.random() * 20}px`],
              y: [`${Math.random() * 20}px`, `${-Math.random() * 20}px`, `${Math.random() * 20}px`],
            }}
            transition={{ 
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
          />
        ))}
      </div>

      <MusicPlayer />
    </div>
  );
};

export default MusicRoom;