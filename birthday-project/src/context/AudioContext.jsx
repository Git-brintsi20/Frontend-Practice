import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

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
  nextTrack: () => {},
  prevTrack: () => {},
  bgMusic: {
    isPlaying: false,
    volume: 0.3,
    play: () => {},
    pause: () => {},
    setVolume: () => {},
  },
  trackList: [],
  autoPlayNext: true,
  toggleAutoPlay: () => {},
  shuffle: false,
  toggleShuffle: () => {},
  shuffledQueue: [],
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState(null);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [shuffledQueue, setShuffledQueue] = useState([]);
  
  const audioRef = useRef(new Audio());
  const bgMusicRef = useRef(new Audio('/assets/audio/Life_Goes_On.mp3'));
  const [bgMusicPlaying, setBgMusicPlaying] = useState(false);
  const [bgMusicVolume, setBgMusicVolume] = useState(0.3);
  const initializedRef = useRef(false);
  const pendingPlayRef = useRef(false); // Flag to prevent race conditions

  // Full track list based on your audio files
  const [trackList] = useState([
    { id: 'autumn-leaves', name: 'Autumn Leaves', path: '/assets/audio/AutumnLeaves.mp3', tile: '/assets/tiles/AutumnLeaves.png', artist: 'BTS' },
    { id: 'blue-and-grey', name: 'Blue & Grey', path: '/assets/audio/BlueAndGrey.mp3', tile: '/assets/tiles/BlueAndGrey.png', artist: 'BTS' },
    { id: 'butterfly', name: 'Butterfly', path: '/assets/audio/Butterfly.mp3', tile: '/assets/tiles/Butterfly.png', artist: 'BTS' },
    { id: 'crystal-snow', name: 'Crystal Snow', path: '/assets/audio/CrystalSnow.mp3', tile: '/assets/tiles/CrystalSnow.png', artist: 'BTS' },
    { id: 'dimple', name: 'Dimple', path: '/assets/audio/Dimple.mp3', tile: '/assets/tiles/Dimple.png', artist: 'BTS' },
    { id: 'epiphany', name: 'Epiphany', path: '/assets/audio/Epiphany.mp3', tile: '/assets/tiles/Epiphany.png', artist: 'Jin' },
    { id: 'euphoria', name: 'Euphoria', path: '/assets/audio/Euphoria.mp3', tile: '/assets/tiles/Euphoria.png', artist: 'Jungkook' },
    { id: 'film-out', name: 'Film Out', path: '/assets/audio/FilmOut.mp3', tile: '/assets/tiles/FilmOut.png', artist: 'BTS' },
    { id: 'idol', name: 'IDOL', path: '/assets/audio/Idol.mp3', tile: '/assets/tiles/Idol.png', artist: 'BTS' },
    { id: 'intro-serendipity', name: 'Intro: Serendipity', path: '/assets/audio/IntroSerendipity.mp3', tile: '/assets/tiles/IntroSerendipity.png', artist: 'Jimin' },
    { id: 'jamais-vu', name: 'Jamais Vu', path: '/assets/audio/JamaisVu.mp3', tile: '/assets/tiles/JamaisVu.png', artist: 'BTS' },
    { id: 'just-one-day', name: 'Just One Day', path: '/assets/audio/JustOneDay.mp3', tile: '/assets/tiles/JustOneDay.png', artist: 'BTS' },
    { id: 'let-go', name: 'Let Go', path: '/assets/audio/LetGo.mp3', tile: '/assets/tiles/LetGo.png', artist: 'BTS' },
    { id: 'life-goes-on', name: 'Life Goes On', path: '/assets/audio/Life_Goes_On.mp3', tile: '/assets/tiles/LifeGoesOn.png', artist: 'BTS' },
    { id: 'magic-shop', name: 'Magic Shop', path: '/assets/audio/MagicShop.mp3', tile: '/assets/tiles/MagicShop.png', artist: 'BTS' },
    { id: 'make-it-right', name: 'Make It Right', path: '/assets/audio/MakeItRight.mp3', tile: '/assets/tiles/MakeItRight.png', artist: 'BTS' },
    { id: 'mic-drop', name: 'MIC Drop', path: '/assets/audio/MicDrop.mp3', tile: '/assets/tiles/MicDrop.png', artist: 'BTS' },
    { id: 'moon', name: 'Moon', path: '/assets/audio/Moon.mp3', tile: '/assets/tiles/Moon.png', artist: 'Jin' },
    { id: 'pied-piper', name: 'Pied Piper', path: '/assets/audio/PiedPiper.mp3', tile: '/assets/tiles/PiedPiper.png', artist: 'BTS' },
    { id: 'singularity', name: 'Singularity', path: '/assets/audio/Singularity.mp3', tile: '/assets/tiles/Singularity.png', artist: 'V' },
    { id: 'still-with-you', name: 'Still With You', path: '/assets/audio/StillWIthYou.mp3', tile: '/assets/tiles/StillWithYou.png', artist: 'Jungkook' },
    
  ]);

  // Initialize shuffle queue when shuffle mode changes or track list updates
  useEffect(() => {
    if (shuffle) {
      const currentIndex = currentTrack ? trackList.findIndex(t => t.id === currentTrack.id) : -1;
      let newQueue = [...trackList];
      
      // Remove current track from the shuffle
      if (currentIndex !== -1) {
        newQueue.splice(currentIndex, 1);
      }
      
      // Fisher-Yates shuffle algorithm
      for (let i = newQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]];
      }
      
      // Put current track at the beginning if there is one
      if (currentIndex !== -1) {
        newQueue.unshift(trackList[currentIndex]);
      }
      
      setShuffledQueue(newQueue);
    } else {
      setShuffledQueue([]); // Clear the shuffled queue when shuffle is off
    }
  }, [shuffle, trackList, currentTrack]);

  // Handle auto-playing background music for all pages except music room
  useEffect(() => {
    const isMusicRoom = location.pathname.includes('/music-room');
    
    if (!initializedRef.current) {
      // Only run this on first render
      if (!isMusicRoom) {
        playBgMusic();
      }
      initializedRef.current = true;
    } else {
      // For subsequent navigation
      if (isMusicRoom) {
        pauseBgMusic();
      } else if (!bgMusicPlaying) {
        playBgMusic();
      }
    }
  }, [location, bgMusicPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateSeek = () => {
      setSeek(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    
    const handleEnded = () => {
      if (autoPlayNext) {
        nextTrack();
      } else {
        setIsPlaying(false);
        pendingPlayRef.current = false; // Reset pendingPlayRef to allow future play attempts
      }
    };
    
    const handleError = (e) => {
      const audioError = audio.error;
      const errorMessage = `Audio Playback Error: ${audioError?.message || 'Unknown error'}. Try another track.`;
      console.error(errorMessage, e);
      setError(errorMessage);
      setIsPlaying(false);
      pendingPlayRef.current = false;
      
      // Try to play next track if current one fails
      if (autoPlayNext) {
        nextTrack();
      }
    };

    const handlePlay = () => {
      console.log('Audio started playing:', audio.src);
      setIsPlaying(true);
      pendingPlayRef.current = false;
    };

    const handlePause = () => {
      console.log('Audio paused:', audio.src);
      setIsPlaying(false);
      pendingPlayRef.current = false;
    };

    audio.addEventListener('timeupdate', updateSeek);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadedmetadata', updateSeek);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateSeek);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadedmetadata', updateSeek);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [autoPlayNext]);

  useEffect(() => {
    const bgMusic = bgMusicRef.current;
    bgMusic.loop = true;
    bgMusic.volume = bgMusicVolume;
    
    const handleBgMusicError = (e) => {
      console.warn('Background Music Error:', bgMusic.error, e);
      setBgMusicPlaying(false);
    };
    
    bgMusic.addEventListener('error', handleBgMusicError);
    
    return () => {
      bgMusic.removeEventListener('error', handleBgMusicError);
      bgMusic.pause();
    };
  }, []);

  // Update audio volume when volume state changes
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Update background music volume when bgMusicVolume state changes
  useEffect(() => {
    bgMusicRef.current.volume = bgMusicVolume;
  }, [bgMusicVolume]);

  const playTrack = async (trackId) => {
    if (pendingPlayRef.current) {
      console.log('Another play operation is pending, please wait.');
      return;
    }

    pendingPlayRef.current = true;
    try {
      const trackToPlay = trackList.find((t) => t.id === trackId);
      if (!trackToPlay) {
        console.error('Track not found:', trackId);
        setError('Track not found.');
        pendingPlayRef.current = false;
        return;
      }

      console.log('Attempting to play track:', trackToPlay.name, trackToPlay.path);
      console.log('Current track before update:', currentTrack ? currentTrack.name : 'None');
      setError(null);
      const audio = audioRef.current;

      // Fully reset the audio element
      audio.pause();
      audio.currentTime = 0;
      audio.src = ''; // Clear the current source

      // Pause background music when playing a track
      pauseBgMusic();

      // Always set the new track's source and update state
      audio.src = trackToPlay.path;
      setCurrentTrack(trackToPlay);
      setSeek(0);

      console.log('New audio source set to:', audio.src);

      await audio.load(); // Ensure the new source is loaded
      console.log('Audio loaded successfully for:', trackToPlay.name);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error('Audio play failed:', err);
          setError(`Playback error: ${err.message || 'Unknown error'}`);
          setIsPlaying(false);
          pendingPlayRef.current = false;
        });
      }
    } catch (err) {
      console.error("Playback error:", err);
      setError(`Playback error: ${err.message || 'Unknown error'}`);
      setIsPlaying(false);
      pendingPlayRef.current = false;
    }
  };

  const pauseTrack = () => {
    console.log('Pausing track');
    audioRef.current.pause();
    setIsPlaying(false);
    pendingPlayRef.current = false;
  };

  const seekTo = (time) => {
    const audio = audioRef.current;
    if (time >= 0 && time <= audio.duration && !isNaN(audio.duration)) {
      audio.currentTime = time;
      setSeek(time);
    }
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    
    if (shuffle) {
      const currentIndex = shuffledQueue.findIndex((t) => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % shuffledQueue.length;
      console.log('Playing next track (shuffle mode):', shuffledQueue[nextIndex]?.name);
      playTrack(shuffledQueue[nextIndex].id);
    } else {
      const currentIndex = trackList.findIndex((t) => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % trackList.length;
      console.log('Playing next track:', trackList[nextIndex].name);
      playTrack(trackList[nextIndex].id);
    }
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    
    if (seek > 3) {
      seekTo(0);
      return;
    }
    
    if (shuffle) {
      const currentIndex = shuffledQueue.findIndex((t) => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + shuffledQueue.length) % shuffledQueue.length;
      console.log('Playing previous track (shuffle mode):', shuffledQueue[prevIndex]?.name);
      playTrack(shuffledQueue[prevIndex].id);
    } else {
      const currentIndex = trackList.findIndex((t) => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
      console.log('Playing previous track:', trackList[prevIndex].name);
      playTrack(trackList[prevIndex].id);
    }
  };

  const playBgMusic = async () => {
    const bgMusic = bgMusicRef.current;
    if (bgMusic.paused) {
      try {
        await bgMusic.play();
        setBgMusicPlaying(true);
      } catch (err) {
        console.warn('Background Music Play Error:', err);
        setBgMusicPlaying(false);
      }
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

  const toggleAutoPlay = () => {
    setAutoPlayNext(prev => !prev);
    console.log('Auto Play Next toggled to:', !autoPlayNext);
  };

  const toggleShuffle = () => {
    setShuffle(prev => !prev);
    console.log('Shuffle mode toggled to:', !shuffle);
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
        nextTrack,
        prevTrack,
        error,
        bgMusic: {
          isPlaying: bgMusicPlaying,
          volume: bgMusicVolume,
          play: playBgMusic,
          pause: pauseBgMusic,
          setVolume: setBgVolume,
        },
        trackList,
        autoPlayNext,
        toggleAutoPlay,
        shuffle,
        toggleShuffle,
        shuffledQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};