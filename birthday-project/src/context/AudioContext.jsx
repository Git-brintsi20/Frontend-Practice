import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getBTSTopTracks } from '../utils/spotify';

const AudioContext = createContext({
  playTrack: () => {},
  pauseTrack: () => {},
  isPlaying: false,
  currentTrack: null,
  seek: 0,
  duration: 0,
  setVolume: () => {},
  volume: 1,
  nextTrack: () => {},
  previousTrack: () => {},
  seekTo: () => {},
  trackList: [],
  error: null
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [trackList, setTrackList] = useState([]);
  const [previewUrls, setPreviewUrls] = useState({});
  const [error, setError] = useState(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        console.log('Fetching BTS top tracks...');
        const tracks = await getBTSTopTracks();
        console.log('Tracks received:', tracks);

        if (!tracks || tracks.length === 0) {
          throw new Error('No tracks retrieved from Spotify.');
        }

        setTrackList(tracks);
        const urls = {};
        for (const track of tracks) {
          urls[track.id] = track.preview_url;
        }
        setPreviewUrls(urls);

        if (tracks.length > 0) {
          setCurrentTrack(tracks[0].id);
          playTrack(tracks[0].id);
        }
      } catch (err) {
        console.error('Error fetching BTS tracks:', err);
        setError('Failed to load BTS tracks. Please check your internet connection or try again later.');
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    const updateSeek = () => {
      setSeek(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };

    const handleError = (e) => {
      console.error('Audio playback error:', e);
      setError('Failed to play the track. Skipping to next track...');
      nextTrack();
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

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = async (trackId) => {
    const audio = audioRef.current;

    if (!previewUrls[trackId]) {
      console.error('No preview URL for track:', trackId);
      setError('This track is unavailable. Skipping to next track...');
      nextTrack();
      return;
    }

    if (currentTrack !== trackId) {
      audio.src = previewUrls[trackId];
      setCurrentTrack(trackId);
      setSeek(0);
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      console.error('Error playing track:', err);
      setError('Failed to play the track. Skipping to next track...');
      nextTrack();
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

  const nextTrack = () => {
    const currentIndex = trackList.findIndex(track => track.id === currentTrack);
    const nextIndex = (currentIndex + 1) % trackList.length;
    if (trackList[nextIndex]) {
      playTrack(trackList[nextIndex].id);
    } else if (trackList[0]) {
      playTrack(trackList[0].id);
    }
  };

  const previousTrack = () => {
    const currentIndex = trackList.findIndex(track => track.id === currentTrack);
    const prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
    if (trackList[prevIndex]) {
      playTrack(trackList[prevIndex].id);
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
        nextTrack,
        previousTrack,
        seekTo,
        trackList,
        error
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;