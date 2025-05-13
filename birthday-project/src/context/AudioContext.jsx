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
  error: null,
  isLoading: true,
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
  const [isLoading, setIsLoading] = useState(true);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const audioRef = useRef(new Audio());

  const fetchTracks = async () => {
    try {
      console.log('Fetching BTS tracks...');
      const tracks = await getBTSTopTracks();
      console.log('Tracks received:', tracks);

      if (!tracks || tracks.length === 0) {
        throw new Error('No tracks retrieved from Spotify.');
      }

      setTrackList(tracks);
      const urls = {};
      for (const track of tracks) {
        urls[track.id] = track.preview_url || null;
      }
      setPreviewUrls(urls);

      const firstPlayableTrack = tracks.find((track) => track.preview_url);
      if (firstPlayableTrack) {
        setCurrentTrack(firstPlayableTrack.id);
        playTrack(firstPlayableTrack.id);
      } else if (fetchAttempts < 3) {
        console.warn(`No tracks with previews, retrying (${fetchAttempts + 1}/3)...`);
        setFetchAttempts(fetchAttempts + 1);
        setTimeout(fetchTracks, 1000); // Retry after 1s
        return;
      } else {
        setError('No tracks with previews available. Try again later.');
      }
    } catch (err) {
      console.error('Error fetching BTS tracks:', err);
      setError('Failed to load tracks. Please check your connection and try again.');
    } finally {
      if (fetchAttempts >= 3 || trackList.some((track) => track.preview_url)) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
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

    const handleError = () => {
      setError('Failed to play track. Skipping to next...');
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
      nextTrack(); // Skip silently
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
      setError('Failed to play track. Skipping to next...');
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
    if (!trackList.length) {
      setError('No tracks available.');
      setIsPlaying(false);
      return;
    }

    const currentIndex = trackList.findIndex((track) => track.id === currentTrack);
    let nextIndex = (currentIndex + 1) % trackList.length;
    let attempts = 0;

    while (attempts < trackList.length && !previewUrls[trackList[nextIndex].id]) {
      nextIndex = (nextIndex + 1) % trackList.length;
      attempts++;
    }

    if (previewUrls[trackList[nextIndex].id]) {
      playTrack(trackList[nextIndex].id);
    } else {
      setError('No more playable tracks available.');
      setIsPlaying(false);
    }
  };

  const previousTrack = () => {
    if (!trackList.length) {
      setError('No tracks available.');
      setIsPlaying(false);
      return;
    }

    const currentIndex = trackList.findIndex((track) => track.id === currentTrack);
    let prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
    let attempts = 0;

    while (attempts < trackList.length && !previewUrls[trackList[prevIndex].id]) {
      prevIndex = (prevIndex - 1 + trackList.length) % trackList.length;
      attempts++;
    }

    if (previewUrls[trackList[prevIndex].id]) {
      playTrack(trackList[prevIndex].id);
    } else {
      setError('No more playable tracks available.');
      setIsPlaying(false);
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
        error,
        isLoading,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;