import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { searchTracks } from '../utils/spotify';

const AudioContext = createContext({
  playTrack: () => {},
  pauseTrack: () => {},
  isPlaying: false,
  currentTrack: null,
  seek: 0,
  duration: 0,
  setVolume: () => {},
  volume: 1,
  seekTo: () => {},
  searchResults: [],
  setSearchQuery: () => {},
  selectTrack: () => {},
  error: null,
  isLoading: false,
  // Background music controls
  bgMusic: {
    isPlaying: false,
    volume: 0.3,
    play: () => {},
    pause: () => {},
    setVolume: () => {},
  },
  trackList: [],
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(new Audio());
  const bgMusicRef = useRef(new Audio('/assets/audio/background-music.mp3'));
  const searchTimeoutRef = useRef(null);
  
  // Background music state
  const [bgMusicPlaying, setBgMusicPlaying] = useState(false);
  const [bgMusicVolume, setBgMusicVolume] = useState(0.3);
  
  // Track list for background music
  const [trackList, setTrackList] = useState([
    { id: 'background', name: 'Background Music', path: '/assets/audio/background-music.mp3' }
  ]);

  const setSearchQuery = async (query) => {
    setIsLoading(true);
    setError(null);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const tracks = await searchTracks(query);
        setSearchResults(tracks);
        if (tracks.length === 0 && query.trim() !== '') {
          setError('No tracks found with previews. Try another search.');
        }
      } catch (err) {
        setError('Failed to search tracks. Please try again.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const selectTrack = (track) => {
    setCurrentTrack(track);
    playTrack(track.id);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateSeek = () => {
      setSeek(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTrack(null);
    };

    const handleError = () => {
      setError('Failed to play track.');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateSeek);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateSeek);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Background music setup
  useEffect(() => {
    const bgMusic = bgMusicRef.current;
    bgMusic.loop = true;
    bgMusic.volume = bgMusicVolume;
    
    // Set up event listeners for background music
    const handleBgMusicError = () => {
      console.error('Failed to play background music');
      setBgMusicPlaying(false);
    };
    
    bgMusic.addEventListener('error', handleBgMusicError);
    
    return () => {
      bgMusic.removeEventListener('error', handleBgMusicError);
      bgMusic.pause();
    };
  }, []);

  // Update background music volume when it changes
  useEffect(() => {
    bgMusicRef.current.volume = bgMusicVolume;
  }, [bgMusicVolume]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = async (trackId) => {
    const audio = audioRef.current;
    const track = searchResults.find((t) => t.id === trackId);

    if (!track || !track.preview_url) {
      setError('No preview available for this track.');
      return;
    }

    if (currentTrack?.id !== trackId) {
      audio.src = track.preview_url;
      setCurrentTrack(track);
      setSeek(0);
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      setError('Failed to play track.');
      setIsPlaying(false);
    }
  };

  const pauseTrack = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const seekTo = (time) => {
    const audio = audioRef.current;
    if (time >= 0 && time <= audio.duration) {
      audio.currentTime = time;
      setSeek(time);
    }
  };

  // Background music controls
  const playBgMusic = async () => {
    const bgMusic = bgMusicRef.current;
    
    try {
      await bgMusic.play();
      setBgMusicPlaying(true);
    } catch (err) {
      console.error('Failed to play background music', err);
    }
  };
  
  const pauseBgMusic = () => {
    bgMusicRef.current.pause();
    setBgMusicPlaying(false);
  };
  
  const setBgVolume = (value) => {
    if (value >= 0 && value <= 1) {
      setBgMusicVolume(value);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        playTrack,
        pauseTrack,
        isPlaying,
        currentTrack,
        seek,
        duration,
        setVolume,
        volume,
        seekTo,
        searchResults,
        setSearchQuery,
        selectTrack,
        error,
        isLoading,
        bgMusic: {
          isPlaying: bgMusicPlaying,
          volume: bgMusicVolume,
          play: playBgMusic,
          pause: pauseBgMusic,
          setVolume: setBgVolume,
        },
        trackList,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;