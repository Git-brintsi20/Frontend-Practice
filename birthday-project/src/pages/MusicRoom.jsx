import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import Confetti from '../components/Confetti';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';
import '../styles/MusicRoom.css';

const Visualizer3D = ({ isPlaying, theme }) => {
  const mountRef = useRef(null);
  const barsRef = useRef([]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 200, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, 200);
    mountRef.current.appendChild(renderer.domElement);

    const barCount = 30;
    const barWidth = 0.2;
    const barDepth = 0.2;
    const bars = [];

    for (let i = 0; i < barCount; i++) {
      const geometry = new THREE.BoxGeometry(barWidth, 1, barDepth);
      const material = new THREE.MeshBasicMaterial({ color: theme.primary });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = (i - barCount / 2) * (barWidth + 0.1);
      scene.add(bar);
      bars.push(bar);
    }

    barsRef.current = bars;
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      if (isPlaying) {
        bars.forEach(bar => {
          const height = Math.random() * 2 + 0.5;
          bar.scale.y = height;
          bar.position.y = height / 2;
        });
      } else {
        bars.forEach(bar => {
          bar.scale.y = 0.1;
          bar.position.y = 0.05;
        });
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, 200);
      camera.aspect = window.innerWidth / 200;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [isPlaying, theme.primary]);

  return <div ref={mountRef} className="visualizer-container" />;
};

const MusicRoom = () => {
  const location = useLocation();
  const { theme, themeMode, changeThemeNew } = useTheme();
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
    seekTo,
    trackList
  } = useAudio();
  
  const [activeTab, setActiveTab] = useState('all');
  const [currentSongDetails, setCurrentSongDetails] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const selectedMember = location.state?.selectedMember || 'default';
    if (selectedMember !== themeMode) {
      changeThemeNew(selectedMember);
    }
  }, [location.state, themeMode, changeThemeNew]);

  useEffect(() => {
    if (currentTrack) {
      const songDetails = trackList.find(song => song.id === currentTrack);
      if (songDetails) {
        setCurrentSongDetails({
          id: songDetails.id,
          name: songDetails.name,
          artist: songDetails.artists.map(artist => artist.name).join(', '),
          album: songDetails.album.name,
          cover: songDetails.album.images[0]?.url || '/assets/images/bts/bts-main.jpeg',
          recommended: themeMode === 'jungkook' && songDetails.artists.some(artist => artist.name === 'Jungkook') 
            ? ['jungkook']
            : themeMode === 'jin' && songDetails.artists.some(artist => artist.name === 'Jin') 
            ? ['jin']
            : ['default']
        });
      }
    }
  }, [currentTrack, trackList, themeMode]);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const filteredSongs = activeTab === 'all' 
    ? trackList.map(song => ({
        id: song.id,
        name: song.name,
        artist: song.artists.map(artist => artist.name).join(', '),
        album: song.album.name,
        cover: song.album.images[0]?.url || '/assets/images/bts/bts-main.jpeg',
        recommended: themeMode === 'jungkook' && song.artists.some(artist => artist.name === 'Jungkook') 
          ? ['jungkook']
          : themeMode === 'jin' && song.artists.some(artist => artist.name === 'Jin') 
          ? ['jin']
          : ['default']
      }))
    : trackList
        .filter(song => 
          (themeMode === 'jungkook' && song.artists.some(artist => artist.name === 'Jungkook')) ||
          (themeMode === 'jin' && song.artists.some(artist => artist.name === 'Jin')) ||
          (themeMode === 'default' && !song.artists.some(artist => ['Jungkook', 'Jin'].includes(artist.name))))
        .map(song => ({
          id: song.id,
          name: song.name,
          artist: song.artists.map(artist => artist.name).join(', '),
          album: song.album.name,
          cover: song.album.images[0]?.url || '/assets/images/bts/bts-main.jpeg',
          recommended: [themeMode]
        }));

  const handlePlaySong = (songId) => {
    playTrack(songId);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    } else if (filteredSongs.length > 0) {
      playTrack(filteredSongs[0].id);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const seekTime = percentage * duration;

    if (seekTime >= 0 && seekTime <= duration) {
      seekTo(seekTime);
    }
  };

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
      {showConfetti && <Confetti />}
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

            <Visualizer3D isPlaying={isPlaying} theme={theme} />
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