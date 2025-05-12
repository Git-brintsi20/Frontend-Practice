// LetterPage.jsx
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import NavBar from '../components/NavBar';
import '../styles/LetterPage.css';

// [letterContents remains unchanged]

const LetterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, themeMode, changeThemeNew } = useTheme();
  const [isRevealed, setIsRevealed] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const letterRef = useRef(null);

  useEffect(() => {
    const selectedMember = location.state?.selectedMember || 'default';
    if (selectedMember !== themeMode) {
      changeThemeNew(selectedMember);
    }
  }, [location.state, themeMode, changeThemeNew]);

  const letterContent = letterContents[themeMode] || letterContents.default;

// In LetterPage.jsx, update the revealLetter function
const revealLetter = () => {
  setIsRevealed(true);
  setConfetti(true);
  setTimeout(() => {
    letterRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }, 500);
  setTimeout(() => {
    setConfetti(false);
  }, 5000);
};

  const goToMusicRoom = () => {
    navigate('/music-room', { state: { selectedMember: themeMode } });
  };

  if (!theme) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Loading theme...</div>;
  }

  return (
    <div
      className="letter-page"
      style={{
        background: theme.gradient || `linear-gradient(to bottom, ${theme.background || '#F5F5F5'}, ${theme.primary || '#E1BEE7'}22)`,
        fontFamily: theme.fontFamily || "'Poppins', sans-serif"
      }}
    >
      <NavBar />
      {confetti && (
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: i % 5 === 0 ? theme.primary || '#E1BEE7' :
                               i % 5 === 1 ? theme.accent || '#CE93D8' :
                               i % 5 === 2 ? '#fff' :
                               i % 5 === 3 ? '#ffcd00' : '#ff69b4'
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="letter-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!isRevealed ? (
          <div className="envelope-container">
            <motion.div
              className="envelope"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                borderColor: theme.primary || '#E1BEE7',
                backgroundColor: theme.secondary || '#F3E5F5'
              }}
            >
              <div className="envelope-flap" />
              <div
                className="envelope-content"
                style={{ color: theme.text || '#4A148C' }}
              >
                <h2>A Special Birthday Message</h2>
                <p>Click to open</p>
              </div>
              <button
                className="open-button"
                onClick={revealLetter}
                style={{
                  backgroundColor: theme.primary || '#E1BEE7',
                  color: theme.secondary || '#F3E5F5'
                }}
              >
                Open Letter
              </button>
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="letter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            ref={letterRef}
            style={{
              backgroundColor: theme.secondary || '#F3E5F5',
              color: theme.text || '#4A148C',
              boxShadow: `0 5px 15px rgba(0,0,0,0.1), 0 0 0 3px ${theme.primary || '#E1BEE7'}33`
            }}
          >
            <div className="letter-content">
              <div className="letter-header">
                <img
                  src={
                    themeMode === 'jungkook' ? "/assets/images/bts/jk/jk-profile.jpeg" :
                    themeMode === 'jin' ? "/assets/images/bts/jin/jin-profile.jpeg" :
                    "/assets/images/bts/bts-main.jpeg"
                  }
                  alt="BTS"
                  className="letter-image"
                />
              </div>

              <div className="letter-body">
                <h2 className="letter-greeting" style={{ color: theme.primary || '#E1BEE7' }}>
                  {letterContent.greeting}
                </h2>

                <p className="letter-message">
                  {letterContent.body}
                </p>

                <p className="letter-closing">
                  {letterContent.closing}<br/>
                  <span className="signature">{letterContent.signature}</span>
                </p>
              </div>

              <motion.button
                className="music-room-button"
                onClick={goToMusicRoom}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  backgroundColor: theme.primary || '#E1BEE7',
                  color: theme.secondary || '#F3E5F5'
                }}
              >
                Go to Music Room
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LetterPage;