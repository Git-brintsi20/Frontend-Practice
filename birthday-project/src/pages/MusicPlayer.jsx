import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { 
  MdPlayArrow, 
  MdPause, 
  MdSkipPrevious, 
  MdSkipNext, 
  MdShuffle, 
  MdRepeat, 
  MdVolumeOff, 
  MdVolumeMute, 
  MdVolumeDown, 
  MdVolumeUp, 
  MdExpandMore, 
  MdExpandLess, 
  MdMusicNote 
} from 'react-icons/md';

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

  const [isExpanded, setIsExpanded] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

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
            <MdMusicNote />
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
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="music-player-bg"></div>
      <div className="music-player">
        <div className="player-expand-toggle" onClick={togglePlayerExpand}>
          {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
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
                <MdShuffle />
              </button>
              <button 
                className={`control-button ${autoPlayNext ? 'active' : ''}`}
                onClick={toggleAutoPlay}
                title="Auto Play Next"
              >
                <MdRepeat />
              </button>
            </div>
            
            <div className="main-controls">
              <button className="control-button prev-button" onClick={prevTrack}>
                <MdSkipPrevious />
              </button>
              <button className="play-button" onClick={handlePlayPause}>
                {isPlaying ? <MdPause /> : <MdPlayArrow />}
              </button>
              <button className="control-button next-button" onClick={nextTrack}>
                <MdSkipNext />
              </button>
            </div>
            
            <div className="right-controls">
              <div className="volume-control">
                <button 
                  className="volume-icon" 
                  onClick={toggleVolumeSlider}
                >
                  {volume === 0 ? (
                    <MdVolumeOff />
                  ) : volume < 0.3 ? (
                    <MdVolumeMute />
                  ) : volume < 0.7 ? (
                    <MdVolumeDown />
                  ) : (
                    <MdVolumeUp />
                  )}
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
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(MusicPlayer);