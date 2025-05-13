
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import '../styles/MusicPlayer.css';

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
    error,
  } = useAudio();

  const [currentSong, setCurrentSong] = useState(null);
  const [visualizerBars, setVisualizerBars] = useState([]);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  useEffect(() => {
    if (!currentTrack) {
      setCurrentSong(null);
      return;
    }

    setCurrentSong({
      id: currentTrack.id,
      name: currentTrack.name,
      artist: currentTrack.artists.map((artist) => artist.name).join(', '),
      album: currentTrack.album.name,
      cover: currentTrack.album.images[0]?.url || '/assets/images/bts/group/bts-main.jpeg',
    });

    const bars = Array.from({ length: 20 }, () => Math.random() * 50 + 5);
    setVisualizerBars(bars);

    let visualizerInterval;
    if (isPlaying) {
      visualizerInterval = setInterval(() => {
        setVisualizerBars((prev) => prev.map(() => Math.random() * 50 + 5));
      }, 200);
    }

    return () => {
      if (visualizerInterval) clearInterval(visualizerInterval);
    };
  }, [currentTrack, isPlaying]);

  const handleProgressClick = (e) => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const seekTime = percentage * duration;

    if (seekTime >= 0 && seekTime <= duration) {
      seekTo(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    if (!volumeRef.current) return;

    const rect = volumeRef.current.getBoundingClientRect();
    const newVolume = (e.clientX - rect.left) / rect.width;

    if (newVolume >= 0 && newVolume <= 1) {
      setVolume(newVolume);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentSong) {
      playTrack(currentSong.id);
    }
  };

  if (error && !currentSong) {
    return (
      <div className="music-player-container">
        <div className="error-message" style={{ textAlign: 'center', color: '#fff' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!currentSong) {
    return (
      <div className="music-player-container">
        <div style={{ textAlign: 'center', color: '#fff' }}>
          Search for a song to start playing!
        </div>
      </div>
    );
  }

  return (
    <div className="music-player-container">
      <div className="music-player-bg"></div>

      <motion.div
        className="music-player"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="player-header">
          <h2>BTS Music Room</h2>
          <p>Happy Birthday! 생일 축하해요! 🎉</p>
        </div>

        <motion.div
          className="album-cover"
          animate={{
            rotate: isPlaying ? 360 : 0,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <img src={currentSong.cover} alt={`${currentSong.name} Album Cover`} />
        </motion.div>

        <div className="track-info">
          <div className="track-name">{currentSong.name}</div>
          <div className="track-artist">{currentSong.artist}</div>
          <div className="track-album">{currentSong.album}</div>
        </div>

        <div className="progress-container">
          <div className="progress-bar" ref={progressRef} onClick={handleProgressClick}>
            <div
              className="progress"
              style={{ width: `${(seek / duration) * 100 || 0}%` }}
            ></div>
          </div>
          <div className="time-info">
            <span>{formatTime(seek)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-controls">
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
        </div>

        <div className="volume-container">
          <div className="volume-icon">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </div>
          <div className="volume-slider" ref={volumeRef} onClick={handleVolumeChange}>
            <div
              className="volume-progress"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="visualizer">
          {visualizerBars.map((height, index) => (
            <motion.div
              key={index}
              className="visualizer-bar"
              animate={{ height: isPlaying ? `${height}px` : '5px' }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;
