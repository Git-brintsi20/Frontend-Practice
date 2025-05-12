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
    nextTrack,
    previousTrack,
    seekTo,
    trackList,
    error
  } = useAudio();

  const [currentSong, setCurrentSong] = useState(null);
  const [visualizerBars, setVisualizerBars] = useState([]);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  useEffect(() => {
    if (!trackList.length || !currentTrack) {
      setCurrentSong(null);
      return;
    }

    const song = trackList.find(song => song.id === currentTrack);
    if (song) {
      setCurrentSong({
        id: song.id,
        name: song.name,
        artist: song.artists.map(artist => artist.name).join(', '),
        album: song.album.name,
        cover: song.album.images[0]?.url || '/assets/images/bts/bts-main.jpeg'
      });
    }

    const bars = Array.from({ length: 20 }, () => Math.random() * 50 + 5);
    setVisualizerBars(bars);

    let visualizerInterval;
    if (isPlaying) {
      visualizerInterval = setInterval(() => {
        setVisualizerBars(prev =>
          prev.map(() => Math.random() * 50 + 5)
        );
      }, 200);
    }

    return () => {
      if (visualizerInterval) clearInterval(visualizerInterval);
    };
  }, [currentTrack, isPlaying, trackList]);

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

  const handleSongSelect = (songId) => {
    playTrack(songId);
  };

  const handleRetry = () => {
    if (trackList.length > 0 && !currentTrack) {
      playTrack(trackList[0].id);
    }
  };

  if (error || !trackList.length) {
    return (
      <div className="music-player-container">
        <div className="error-message" style={{ textAlign: 'center', color: '#fff' }}>
          {error || 'No tracks available. Please try again later.'}
          <button className="button" onClick={handleRetry} style={{ marginTop: '10px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentSong) {
    return (
      <div className="music-player-container">
        <div style={{ textAlign: 'center', color: '#fff' }}>
          Loading track...
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
          <h2>BTS Birthday Playlist</h2>
          <p>Happy Birthday! 생일 축하해요! 🎉</p>
        </div>

        <motion.div
          className="album-cover"
          animate={{
            rotate: isPlaying ? 360 : 0
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
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
          <div
            className="progress-bar"
            ref={progressRef}
            onClick={handleProgressClick}
          >
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
          <button className="control-button" onClick={previousTrack}>
            <svg viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
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

          <button className="control-button" onClick={nextTrack}>
            <svg viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        <div className="volume-container">
          <div className="volume-icon">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </div>
          <div
            className="volume-slider"
            ref={volumeRef}
            onClick={handleVolumeChange}
          >
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

        <div className="playlist-container">
          <div className="playlist-title">Birthday Playlist</div>
          <ul className="playlist">
            {trackList.map(song => (
              <li
                key={song.id}
                className={`playlist-item ${currentSong?.id === song.id ? 'active' : ''}`}
                onClick={() => handleSongSelect(song.id)}
              >
                <img
                  src={song.album.images[0]?.url || '/assets/images/bts/bts-main.jpeg'}
                  alt={song.name}
                  className="playlist-item-image"
                />
                <div className="playlist-item-info">
                  <div className="playlist-item-name">{song.name}</div>
                  <div className="playlist-item-artist">
                    {song.artists.map(artist => artist.name).join(', ')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;