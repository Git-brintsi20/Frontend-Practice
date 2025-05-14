import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';

// Memoized visualizer bar component to prevent unnecessary re-renders
const VisualizerBar = memo(({ height, index, isPlaying }) => {
  return (
    <motion.div
      className="visualizer-bar"
      animate={{ 
        height: isPlaying ? `${height}px` : '8px',
        backgroundColor: isPlaying ? 
          (index % 3 === 0 ? 'var(--primary-color)' : 
           index % 3 === 1 ? 'var(--accent-color)' : 
           'var(--secondary-color)') : 
          'var(--primary-color)'
      }}
      // Use slower transitions for better performance
      transition={{ duration: 0.25 }}
    />
  );
});

// Memoized track info component
const TrackInfo = memo(({ currentTrack, isExpanded }) => {
  if (!isExpanded) {
    return (
      <div className="mini-player-info">
        <img src={currentTrack.tile} alt={`${currentTrack.name} Mini`} className="mini-cover" />
        <div className="mini-text">
          <div className="track-name">{currentTrack.name}</div>
          <div className="track-artist">{currentTrack.artist}</div>
        </div>
      </div>
    );
  }
  return null;
});

// Main component
const MusicPlayer = () => {
  const {
    playTrack,
    pauseTrack,
    isPlaying,
    currentTrack,
    seek,
    duration,
    setVolume,
    volume,
    seekTo,
    nextTrack,
    prevTrack,
    error,
    autoPlayNext,
    toggleAutoPlay,
    shuffle,
    toggleShuffle,
  } = useAudio();

  const [visualizerBars, setVisualizerBars] = useState(() => 
    Array.from({ length: 28 }, () => Math.random() * 60 + 10)
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);
  const visualizerTimerRef = useRef(null);

  // Generate visualizer bars - now with optimized animation frequency
  useEffect(() => {
    // Clear any existing interval
    if (visualizerTimerRef.current) {
      clearInterval(visualizerTimerRef.current);
    }
    
    // Only set up interval if playing
    if (isPlaying) {
      // Reduced frequency to 350ms from 150ms (less than half as frequent)
      visualizerTimerRef.current = setInterval(() => {
        setVisualizerBars(Array.from({ length: 28 }, () => Math.random() * 60 + 10));
      }, 350);
    }

    return () => {
      if (visualizerTimerRef.current) {
        clearInterval(visualizerTimerRef.current);
      }
    };
  }, [isPlaying]);

  // Memoize handlers with useCallback to prevent recreation on render
  const handleProgressClick = useCallback((e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const seekTime = percentage * duration;
    if (seekTime >= 0 && seekTime <= duration) {
      seekTo(seekTime);
    }
  }, [duration, seekTo]);

  const handleVolumeChange = useCallback((e) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const newVolume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(newVolume);
  }, [setVolume]);

  const formatTime = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack.id);
    }
  }, [isPlaying, currentTrack, pauseTrack, playTrack]);

  const togglePlayerExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const toggleVolumeSlider = useCallback(() => {
    setShowVolumeSlider(prev => !prev);
  }, []);

  if (error && !currentTrack) {
    return (
      <div className="music-player-error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <motion.div 
        className="music-player-placeholder"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="placeholder-message">
          <div className="placeholder-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
            </svg>
          </div>
          <span>Select a song to start your BTS journey! 💜</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`music-player-container ${isExpanded ? 'expanded' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      // Slower animation for initial load
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="music-player-bg"></div>
      <div className="music-player">
        <div className="player-expand-toggle" onClick={togglePlayerExpand}>
          <svg viewBox="0 0 24 24">
            <path d={isExpanded ? "M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" : "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"} />
          </svg>
        </div>
        
        <div className="player-header">
          <h2>BTS Music Room</h2>
          <div className="header-decorations">
            <span className="purple-heart">💜</span>
            <span className="sparkle">✨</span>
            <span className="purple-heart">💜</span>
          </div>
        </div>

        <div className="player-content">
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                className="expanded-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Changed from continuous rotation to gentle pulse for better performance */}
                <motion.div
                  className="album-cover"
                  animate={isPlaying ? {
                    scale: [1, 1.03, 1],
                    rotate: [0, 2, -2, 0]
                  } : {}}
                  transition={isPlaying ? {
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                  } : {}}
                >
                  <img src={currentTrack.tile} alt={`${currentTrack.name} Cover`} />
                </motion.div>

                <div className="track-info-expanded">
                  <div className="track-name">{currentTrack.name}</div>
                  <div className="track-artist">{currentTrack.artist}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Memoized component for mini player info */}
          <TrackInfo currentTrack={currentTrack} isExpanded={isExpanded} />

          <div className="progress-container">
            <div className="time-info">
              <span>{formatTime(seek)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="progress-bar" ref={progressRef} onClick={handleProgressClick}>
              <div 
                className="progress" 
                style={{ width: `${(seek / duration) * 100 || 0}%` }}
              />
              <div 
                className="progress-handle" 
                style={{ left: `${(seek / duration) * 100 || 0}%` }}
              />
            </div>
          </div>

          <div className="player-controls">
            <div className="left-controls">
              <button 
                className={`control-button ${shuffle ? 'active' : ''}`} 
                onClick={toggleShuffle}
                title="Shuffle"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm0.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                </svg>
              </button>
              <button 
                className={`control-button ${autoPlayNext ? 'active' : ''}`}
                onClick={toggleAutoPlay}
                title="Auto Play Next"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                  <path d="M18 18l0-12" strokeWidth="2" />
                </svg>
              </button>
            </div>
            
            <div className="main-controls">
              <button className="control-button prev-button" onClick={prevTrack}>
                <svg viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              <button className="play-button" onClick={handlePlayPause}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button className="control-button next-button" onClick={nextTrack}>
                <svg viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>
            
            <div className="right-controls">
              <div className="volume-control">
                <button 
                  className="volume-icon" 
                  onClick={toggleVolumeSlider}
                >
                  <svg viewBox="0 0 24 24">
                    {volume === 0 ? (
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    ) : volume < 0.3 ? (
                      <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
                    ) : volume < 0.7 ? (
                      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                    ) : (
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    )}
                  </svg>
                </button>
                
                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div 
                      className="volume-slider-container"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: '100px' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="volume-slider" ref={volumeRef} onClick={handleVolumeChange}>
                        <div className="volume-track"></div>
                        <div className="volume-progress" style={{ width: `${volume * 100}%` }}></div>
                        <div className="volume-handle" style={{ left: `${volume * 100}%` }}></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Optimized visualizer with fewer updates and memoized components */}
          <div className="visualizer">
            {visualizerBars.map((height, index) => (
              <VisualizerBar
                key={index}
                height={height}
                index={index}
                isPlaying={isPlaying}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(MusicPlayer);