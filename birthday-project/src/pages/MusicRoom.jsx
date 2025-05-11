// MusicRoom.jsx - Fixed version
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import '../styles/MusicRoom.css';

// BTS songs list with Spotify IDs and theme-specific recommendations
const BTS_SONGS = [
  {
    id: '0WNGsQ1oAuHzNTk8jivBKW', // "Still With You" - Jungkook
    name: 'Still With You',
    artist: 'Jungkook',
    album: 'Solo Release',
    cover: '/assets/images/bts/jk/album-art.jpeg',
    recommended: ['jk']
  },
  {
    id: '5nTnCfI5oIWR9InXG3caP5', // "Epiphany" - Jin
    name: 'Epiphany',
    artist: 'Jin',
    album: 'Love Yourself: Answer',
    cover: '/assets/images/bts/jin/album-art.jpeg',
    recommended: ['jin']
  },
  {
    id: '2FugYpDRl2aVGb5YK6L1Kr', // "Life Goes On"
    name: 'Life Goes On',
    artist: 'BTS',
    album: 'BE',
    cover: '/assets/images/bts/life-goes-on.jpg',
    recommended: ['default']
  },
  {
    id: '5Y7RdUWJCF3sLglHfuVjOZ', // "Blue & Grey"
    name: 'Blue & Grey',
    artist: 'BTS',
    album: 'BE',
    cover: '/assets/images/bts/blue-and-grey.jpg',
    recommended: ['default']
  },
  {
    id: '3OBVr1aNHr5IiNZAWOgfQc', // "Dynamite"
    name: 'Dynamite',
    artist: 'BTS',
    album: 'Dynamite (DayTime Version)',
    cover: '/assets/images/bts/dynamite.jpg',
    recommended: ['default', 'jk', 'jin']
  },
  {
    id: '7AR0Kc4GrpKDPuVTsOC4Wv', // "Euphoria" - Jungkook
    name: 'Euphoria',
    artist: 'Jungkook',
    album: 'Love Yourself: Answer',
    cover: '/assets/images/bts/jk/euphoria.jpg',
    recommended: ['jk']
  },
  {
    id: '6oHyMGMzxpx8mX4QEgUBDV', // "Moon" - Jin
    name: 'Moon',
    artist: 'Jin',
    album: 'Map of the Soul: 7',
    cover: '/assets/images/bts/jin/moon.jpg',
    recommended: ['jin']
  }
];

const MusicRoom = () => {
  const { theme, themeMode } = useTheme();
  const { 
    playTrack, 
    pauseTrack, 
    isPlaying, 
    currentTrack, 
    seek, 
    duration, 
    setVolume, 
    volume,
    nextTrack, 
    previousTrack,
    seekTo 
  } = useAudio();
  
  const [activeTab, setActiveTab] = useState('all');
  const [currentSongDetails, setCurrentSongDetails] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [visualizerBars, setVisualizerBars] = useState([]);
  
  // Effect to update currently playing song details
  useEffect(() => {
    if (currentTrack) {
      const songDetails = BTS_SONGS.find(song => song.id === currentTrack);
      if (songDetails) {
        setCurrentSongDetails(songDetails);
      }
    }
  }, [currentTrack]);
  
  // Effect to create and animate visualizer bars
  useEffect(() => {
    // Create visualizer bars
    const bars = Array.from({ length: 30 }, () => Math.random() * 60 + 5);
    setVisualizerBars(bars);
    
    // Animate visualizer when track is playing
    let visualizerInterval;
    if (isPlaying) {
      visualizerInterval = setInterval(() => {
        setVisualizerBars(prev => 
          prev.map(() => Math.random() * 60 + 5)
        );
      }, 250);
    }
    
    return () => {
      if (visualizerInterval) clearInterval(visualizerInterval);
    };
  }, [isPlaying]);
  
  // Filter songs based on active tab
  const filteredSongs = activeTab === 'all' 
    ? BTS_SONGS 
    : BTS_SONGS.filter(song => song.recommended.includes(activeTab));
  
  // Play a song from the playlist
  const handlePlaySong = (songId) => {
    playTrack(songId);
  };
  
  // Handle play/pause button
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    } else if (filteredSongs.length > 0) {
      // If no song is currently selected, play the first in the filtered list
      playTrack(filteredSongs[0].id);
    }
  };
  
  // Format time for display (mm:ss)
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle seeking in the progress bar
  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const seekTime = percentage * duration;
    
    if (seekTime >= 0 && seekTime <= duration) {
      seekTo(seekTime);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const newVolume = (e.clientX - rect.left) / rect.width;
    
    if (newVolume >= 0 && newVolume <= 1) {
      setVolume(newVolume);
    }
  };
  
  return (
    <div className="music-room" style={{
      background: theme.gradient || `linear-gradient(135deg, ${theme.background}, ${theme.primary}22)`,
      fontFamily: theme.fontFamily
    }}>
      <motion.div 
        className="music-player-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="player-header">
          <h1>BTS Birthday Playlist</h1>
          <p>A special selection of songs just for you! 💜</p>
        </div>
        
        <div className="music-content">
          <div className="music-player">
            <div className="now-playing">
              <motion.div 
                className="album-cover"
                animate={{ 
                  rotate: isPlaying ? 360 : 0 
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                {currentSongDetails ? (
                  <img 
                    src={currentSongDetails.cover} 
                    alt={`${currentSongDetails.name} Album Cover`} 
                  />
                ) : (
                  <div className="placeholder-cover" style={{ backgroundColor: theme.primary }}>
                    <span>BTS</span>
                  </div>
                )}
              </motion.div>
              
              <div className="song-info">
                <h2>{currentSongDetails?.name || 'Select a song'}</h2>
                <p>{currentSongDetails?.artist || 'BTS'}</p>
                <p className="album-name">{currentSongDetails?.album || ''}</p>
              </div>
            </div>
            
            <div className="player-controls">
              <div className="progress-bar-container">
                <div className="time">{formatTime(seek)}</div>
                <div 
                  className="progress-bar" 
                  onClick={handleSeek}
                  style={{ backgroundColor: `${theme.primary}33` }}
                >
                  <div 
                    className="progress" 
                    style={{ 
                      width: `${(seek / duration) * 100 || 0}%`,
                      backgroundColor: theme.primary 
                    }}
                  ></div>
                </div>
                <div className="time">{formatTime(duration)}</div>
              </div>
              
              <div className="control-buttons">
                <button 
                  className="control-button" 
                  onClick={previousTrack}
                  disabled={!currentTrack}
                >
                  <svg viewBox="0 0 24 24" fill={theme.primary}>
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>
                
                <button 
                  className="play-button" 
                  onClick={handlePlayPause}
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.secondary
                  }}
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                
                <button 
                  className="control-button" 
                  onClick={nextTrack}
                  disabled={!currentTrack}
                >
                  <svg viewBox="0 0 24 24" fill={theme.primary}>
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>
              </div>
              
              <div className="volume-control">
                <svg viewBox="0 0 24 24" fill={theme.primary} width="20" height="20">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
                <div 
                  className="volume-slider" 
                  onClick={handleVolumeChange}
                  style={{ backgroundColor: `${theme.primary}33` }}
                >
                  <div 
                    className="volume-level" 
                    style={{ 
                      width: `${volume * 100}%`,
                      backgroundColor: theme.primary 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="visualizer-container">
              {visualizerBars.map((height, index) => (
                <motion.div
                  key={index}
                  className="visualizer-bar"
                  animate={{ 
                    height: isPlaying ? `${height}px` : '3px' 
                  }}
                  transition={{ 
                    duration: 0.2 
                  }}
                  style={{ backgroundColor: theme.primary }}
                />
              ))}
            </div>
          </div>
          
          <div className={`playlist-section ${showPlaylist ? 'show' : ''}`}>
            <div className="playlist-header">
              <h3>Your Birthday Playlist</h3>
              <div className="playlist-tabs">
                <button 
                  className={`tab ${activeTab === 'all' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('all')}
                  style={{
                    borderColor: activeTab === 'all' ? theme.primary : 'transparent',
                    color: activeTab === 'all' ? theme.primary : theme.text
                  }}
                >
                  All Songs
                </button>
                <button 
                  className={`tab ${activeTab === themeMode ? 'active' : ''}`} 
                  onClick={() => setActiveTab(themeMode)}
                  style={{
                    borderColor: activeTab === themeMode ? theme.primary : 'transparent',
                    color: activeTab === themeMode ? theme.primary : theme.text
                  }}
                >
                  Recommended
                </button>
              </div>
            </div>
            
            <ul className="playlist">
              {filteredSongs.map((song) => (
                <li 
                  key={song.id}
                  className={`playlist-item ${currentTrack === song.id ? 'active' : ''}`}
                  onClick={() => handlePlaySong(song.id)}
                  style={{
                    backgroundColor: currentTrack === song.id ? `${theme.primary}22` : 'transparent',
                    borderLeft: currentTrack === song.id ? `4px solid ${theme.primary}` : '4px solid transparent'
                  }}
                >
                  <img src={song.cover} alt={song.name} />
                  <div className="song-details">
                    <span className="song-name">{song.name}</span>
                    <span className="song-artist">{song.artist}</span>
                  </div>
                  {currentTrack === song.id && isPlaying && (
                    <div className="playing-indicator">
                      <div className="bar bar1" style={{ backgroundColor: theme.primary }}></div>
                      <div className="bar bar2" style={{ backgroundColor: theme.primary }}></div>
                      <div className="bar bar3" style={{ backgroundColor: theme.primary }}></div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <button 
          className="toggle-playlist-button"
          onClick={() => setShowPlaylist(!showPlaylist)}
          style={{
            backgroundColor: theme.primary,
            color: theme.secondary
          }}
        >
          {showPlaylist ? 'Hide Playlist' : 'Show Playlist'}
        </button>
        
        <div className="birthday-message" style={{ color: theme.primary }}>
          <p>Happy Birthday! 🎂 We hope these BTS songs bring you joy on your special day! 💜</p>
        </div>
      </motion.div>
    </div>
  );
};

export default MusicRoom;