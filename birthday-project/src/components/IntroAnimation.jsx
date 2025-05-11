import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import NavBar from '../components/NavBar';
import '../styles/IntroAnimation.css';

const FloatingElements = () => {
  const { theme } = useTheme();
  const symbols = ['💜', '⭐', '✨', '🎵', '🎤'];
  const elements = [];
  const numberOfElements = 20;

  for (let i = 0; i < numberOfElements; i++) {
    const initialX = Math.random() * 100;
    const initialY = Math.random() * 100;
    const delay = Math.random() * 6;
    const size = 20 + Math.random() * 30;
    const randX = Math.random() * 2 - 1;
    const randY = Math.random() * 2 - 1;

    elements.push(
      <motion.div
        key={i}
        className="floating-element"
        initial={{ left: `${initialX}%`, top: `${initialY}%`, opacity: 0.8 }}
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${size / 2.2}px`,
          pointerEvents: 'none',
          zIndex: 1,
          animationDelay: `${delay}s`,
          '--size': `${size}px`,
          '--rand-x': randX,
          '--rand-y': randY
        }}
      >
        {symbols[i % symbols.length]}
      </motion.div>
    );
  }

  return <div className="floating-elements-container">{elements}</div>;
};

const IntroAnimation = () => {
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowButton(true), 3000);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleContinue = () => {
    navigate('/journey');
  };
  
  return (
    <div className="intro-animation">
      <NavBar />
      <div className="navbar-spacer"></div>
      <FloatingElements />
      
      {loading ? (
        <div className="loading-spinner">
          <div 
            className="spinner" 
            style={{ 
              border: `4px solid ${theme.primary}`,
              borderTop: `4px solid ${theme.secondary}`
            }}
          ></div>
          <p style={{ color: theme.text }}>Loading BTS Surprise...</p>
        </div>
      ) : (
        <>
          <motion.h1 
            className="intro-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Happy Birthday!
          </motion.h1>
          
          <motion.div
            className="intro-image"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <img src="/assets/images/bts/group/bts-main.jpeg" alt="BTS" />
          </motion.div>
          
          <motion.p
            className="intro-subtitle"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            A special BTS surprise awaits you!
          </motion.p>
          
          {showButton && (
            <motion.button
              className="intro-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              style={{ 
                background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                color: 'black'
              }}
            >
              Begin Your Journey
            </motion.button>
          )}
        </>
      )}
    </div>
  );
};

export default IntroAnimation;