import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import MusicPlayer from './MusicPlayer';
import { MdPlayArrow, MdPause } from 'react-icons/md';
import '../styles/MusicRoom.css';

// Memoized SongTile component to prevent unnecessary re-renders
const SongTile = memo(({ track, isPlaying, isCurrentTrack, onPlay, onPause }) => {
  return (
    <motion.div
      className={`music-room-song-tile ${isCurrentTrack && isPlaying ? 'playing' : ''}`}
      transition={{ duration: 0.3 }}
    >
      <div className="music-room-song-tile-image-wrapper">
        <img src={track.tile} alt={track.name} className="music-room-song-tile-image" />
        <div className="music-room-tile-overlay">
          <button 
            className="music-room-play-button-large"
            onClick={() => {
              if (isCurrentTrack && isPlaying) {
                onPause();
              } else {
                onPlay(track.id);
              }
            }}
          >
            {isCurrentTrack && isPlaying ? <MdPause /> : <MdPlayArrow />}
          </button>
        </div>
      </div>
      <div className="music-room-song-tile-info">
        <h3>{track.name}</h3>
        <p>{track.artist}</p>
      </div>
    </motion.div>
  );
});

// Memoized floating element to optimize animations
const FloatingElement = memo(({ index, delay }) => {
  return (
    <img
      src={index % 2 === 0 ? '/assets/images/bts/symbols/icon-4.jpg' : '/assets/images/bts/symbols/icon-5.jpg'}
      alt="BTS Element"
      className="music-room-floating-element"
      style={{
        top: `${20 + index * 20}%`,
        left: `${15 + index * 20}%`,
        animationDelay: `${delay}s`,
      }}
      onError={(e) => {
        e.target.style.display = 'none'; // Hide broken images
      }}
    />
  );
});

const MusicRoom = () => {
  const location = useLocation();
  const { theme, themeMode, changeThemeNew } = useTheme();
  const { trackList, playTrack, pauseTrack, currentTrack, isPlaying } = useAudio();
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAnimating, setIsAnimating] = useState(false);

  // Update theme based on selected member - memoized to prevent unnecessary theme changes
  useEffect(() => {
    const selectedMember = location.state?.selectedMember || 'default';
    if (selectedMember !== themeMode) {
      changeThemeNew(selectedMember);
    }
  }, [location.state, themeMode, changeThemeNew]);

  // Initial animations and timers with cleanup
  useEffect(() => {
    const welcomeTimer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(welcomeTimer);
  }, []);

  // Memoized filtered tracks to prevent unnecessary recalculations
  const sortedTracks = useMemo(() => {
    let sorted = [...(trackList || [])];
    
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
    
    return sorted;
  }, [trackList, activeCategory]);

  // Animation effect with single state update
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Memoized handler
  const handleCategoryChange = useCallback((category) => {
    if (category !== activeCategory) {
      setActiveCategory(category);
      setIsAnimating(true);
    }
  }, [activeCategory]);

  // Memoized handler for playing tracks
  const handlePlayTrack = useCallback((trackId) => {
    if (currentTrack && currentTrack.id !== trackId && isPlaying) {
      pauseTrack();
    }
    playTrack(trackId);
  }, [playTrack, pauseTrack, currentTrack, isPlaying]);

  // Memoized handler for pausing tracks
  const handlePauseTrack = useCallback(() => {
    pauseTrack();
  }, [pauseTrack]);

  if (!theme) {
    return <div className="music-room-loading">Loading theme...</div>;
  }

  // Create memoized array of floating elements
  const floatingElements = useMemo(() => {
    return Array(4).fill().map((_, i) => (
      <FloatingElement key={i} index={i} delay={i * 1.5} />
    ));
  }, []);

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
      <NavBar className="music-room-navbar" />
      <div className="music-room-navbar-spacer"></div>
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="music-room-welcome-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <motion.h1>
              Welcome to the BTS Music Room! 💜
            </motion.h1>
            <motion.p>
              Enjoy our favorite songs and celebrate with the Bangtan Boys!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="music-room-content">
        <div className="music-room-container">
          <div className="music-room-header">
            <p>(:)</p>
            <h1>BTS Music Room</h1>
            <p>Choose a song and vibe with BTS! 💜</p>
            
            <div className="music-room-filter-categories">
              <button 
                className={`music-room-category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                All Songs
              </button>
              <button 
                className={`music-room-category-btn ${activeCategory === 'group' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('group')}
              >
                Group Songs
              </button>
              <button 
                className={`music-room-category-btn ${activeCategory === 'solo' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('solo')}
              >
                Solo Songs
              </button>
              <button 
                className={`music-room-category-btn ${activeCategory === 'featured' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('featured')}
              >
                Featured
              </button>
            </div>
          </div>

          <motion.div 
            className="music-room-song-grid"
            animate={{ opacity: isAnimating ? 0.8 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {sortedTracks.length > 0 ? (
              sortedTracks.map((track) => (
                <SongTile
                  key={track.id}
                  track={track}
                  isPlaying={isPlaying}
                  isCurrentTrack={currentTrack?.id === track.id}
                  onPlay={handlePlayTrack}
                  onPause={handlePauseTrack}
                />
              ))
            ) : (
              <div className="music-room-no-tracks-message">
                No tracks available. Please try again later.
              </div>
            )}
          </motion.div>
          
          <div className="music-room-birthday-message-container">
            <div className="music-room-birthday-message">
              <p>Happy Birthday! 🎂 Enjoy your special day with BTS! 💜</p>
            </div>
          </div>
        </div>
        <div className="music-player-right-wrapper">
          <MusicPlayer className="music-player-container-right" />
        </div>
      </div>

      <div className="music-room-floating-elements">
        {floatingElements}
      </div>
    </div>
  );
};

export default React.memo(MusicRoom);