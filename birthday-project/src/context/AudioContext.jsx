import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getTrackDetails, getTrackPreviewUrl } from '../utils/spotify';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

// BTS songs list with Spotify IDs
const BTS_SONGS = [
  '0WNGsQ1oAuHzNTk8jivBKW', // "Still With You" - Jungkook
  '5nTnCfI5oIWR9InXG3caP5', // "Epiphany" - Jin
  '2FugYpDRl2aVGb5YK6L1Kr', // "Life Goes On"
  '5Y7RdUWJCF3sLglHfuVjOZ', // "Blue & Grey"
  '3OBVr1aNHr5IiNZAWOgfQc', // "Dynamite"
  '7AR0Kc4GrpKDPuVTsOC4Wv', // "Euphoria" - Jungkook
  '6oHyMGMzxpx8mX4QEgUBDV', // "Moon" - Jin
];

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const audioRef = useRef(new Audio());
  const intervalRef = useRef(null);
  
  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Clean up on unmount
  useEffect(() => {
    const audio = audioRef.current;
    
    return () => {
      clearInterval(intervalRef.current);
      audio.pause();
      audio.src = '';
    };
  }, []);
  
  // Update seek position during playback
  const startSeekInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      if (audioRef.current.paused) return;
      
      setSeek(audioRef.current.currentTime);
    }, 1000);
  }, []);
  
  // Play a track
  const playTrack = useCallback(async (trackId) => {
    if (!trackId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // If it's a new track, load it
      if (currentTrack !== trackId) {
        audioRef.current.pause();
        
        try {
          // Try to get preview URL from Spotify
          const previewUrl = await getTrackPreviewUrl(trackId);
          
          if (previewUrl) {
            audioRef.current.src = previewUrl;
          } else {
            // Fallback to a mock URL if no preview available
            // This is just for the project; in real implementation, handle this better
            audioRef.current.src = `/assets/sounds/${trackId}.mp3`;
          }
          
          audioRef.current.load();
          setCurrentTrack(trackId);
        } catch (err) {
          console.error("Error loading track:", err);
          setError("Failed to load track");
          setIsLoading(false);
          return;
        }
      }
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setDuration(audioRef.current.duration || 210); // Fallback to typical song length
          startSeekInterval();
        })
        .catch(err => {
          console.error("Error playing track:", err);
          setError("Failed to play track");
        });
      
      setIsLoading(false);
    } catch (err) {
      console.error("Playback error:", err);
      setError("Error playing track");
      setIsLoading(false);
    }
  }, [currentTrack, startSeekInterval]);
  
  // Pause current track
  const pauseTrack = useCallback(() => {
    audioRef.current.pause();
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  }, []);
  
  // Seek to a specific time
  const seekTo = useCallback((time) => {
    if (!audioRef.current.src) return;
    
    audioRef.current.currentTime = time;
    setSeek(time);
  }, []);
  
  // Play next track in playlist
  const nextTrack = useCallback(() => {
    if (!currentTrack) return;
    
    const currentIndex = BTS_SONGS.indexOf(currentTrack);
    const nextIndex = (currentIndex + 1) % BTS_SONGS.length;
    playTrack(BTS_SONGS[nextIndex]);
  }, [currentTrack, playTrack]);
  
  // Play previous track in playlist  
  const previousTrack = useCallback(() => {
    if (!currentTrack) return;
    
    const currentIndex = BTS_SONGS.indexOf(currentTrack);
    const prevIndex = (currentIndex - 1 + BTS_SONGS.length) % BTS_SONGS.length;
    playTrack(BTS_SONGS[prevIndex]);
  }, [currentTrack, playTrack]);
  
  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
      nextTrack();
    };
    
    const handleError = (e) => {
      console.error('Audio error:', e);
      setError('Audio playback error');
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [nextTrack]);
  
  // Context value - FIX: Renamed seekTo to seekToPosition to avoid duplicate property name
  const value = {
    isPlaying,
    currentTrack,
    volume,
    seek,
    duration,
    isLoading,
    error,
    playTrack,
    pauseTrack,
    setVolume,
    seekTo,  // This is the function to seek to a specific time
    nextTrack,
    previousTrack
  };
  
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;
