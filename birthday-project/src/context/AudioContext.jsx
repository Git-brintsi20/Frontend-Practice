import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getTrackPreviewUrl, getBTSTopTracks, BTS_ARTIST_ID } from '../utils/spotify';

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
  seekTo: () => {}
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [trackList, setTrackList] = useState([]);
  const [previewUrls, setPreviewUrls] = useState({});
  const audioRef = useRef(new Audio());

  // Fetch BTS top tracks on mount
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const tracks = await getBTSTopTracks();
        const filteredTracks = tracks.filter(track => track.preview_url); // Only include tracks with preview URLs
        setTrackList(filteredTracks);

        // Fetch and store preview URLs
        const urls = {};
        for (const track of filteredTracks) {
          const previewUrl = await getTrackPreviewUrl(track.id);
          if (previewUrl) {
            urls[track.id] = previewUrl;
          }
        }
        setPreviewUrls(urls);
      } catch (error) {
        console.error('Error fetching BTS tracks:', error);
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    const updateSeek = () => {
      setSeek(audio.currentTime);
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateSeek);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateSeek);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = async (trackId) => {
    const audio = audioRef.current;

    if (!previewUrls[trackId]) {
      console.error('No preview URL available for track:', trackId);
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
    } catch (error) {
      console.error('Error playing track:', error);
      setIsPlaying(false);
    }
  };

  const pauseTrack = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const seekTo = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setSeek(time);
  };

  const nextTrack = () => {
    const currentIndex = trackList.findIndex(track => track.id === currentTrack);
    const nextIndex = (currentIndex + 1) % trackList.length;
    if (trackList[nextIndex]) {
      playTrack(trackList[nextIndex].id);
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
        trackList
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;