/* src/components/IntroAnimation.js */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import '../styles/IntroAnimation.css';

const FloatingElements = () => {
  const elements = [];
  const { theme } = useTheme();
  
  // Create symbols to rotate through for floating elements
  const symbols = [
    '💜', // Purple heart
    '⭐', // Star
    '✨', // Sparkles
    '🎵', // Musical note
    '🎤', // Microphone
  ];
  
  // Create 30 floating elements with BTS symbols and images
  for (let i = 0; i < 30; i++) {
    const size = Math.random() * 40 + 20;
    const initialX = Math.random() * 100; // Use percentage of viewport width
    const initialY = Math.random() * 100; // Use percentage of viewport height
    const duration = Math.random() * 10 + 15;
    const delay = Math.random() * 5;
    
    elements.push(
      <motion.div
        key={i}
        className="floating-element"
        initial={{ 
          left: `${initialX}%`, 
          top: `${initialY}%`, 
          opacity: 0 
        }}
        animate={{
          left: [`${initialX}%`, `${initialX + (Math.random() * 20 - 10)}%`],
          top: [`${initialY}%`, `${initialY - (Math.random() * 20 + 5)}%`],
          opacity: [0, 0.7, 0]
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          position: 'absolute',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: i % 3 === 0 ? theme.primary : 'transparent', 
          borderRadius: i % 2 === 0 ? '50%' : '0%',
          fontSize: `${size/2}px`,
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {i % 4 === 0 && symbols[i % symbols.length]}
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
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoading(false);
      // Show button after animation completes
      setTimeout(() => setShowButton(true), 3000);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleContinue = () => {
    navigate('/journey');
  };
  
  return (
    <div className="intro-animation" style={{ backgroundColor: theme.background }}>
      <FloatingElements />
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" style={{ borderColor: theme.primary }}></div>
          <p style={{ color: theme.text }}>Loading BTS Surprise...</p>
        </div>
      ) : (
        <>
          <motion.h1 
            className="intro-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ color: theme.primary }}
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
            style={{ color: theme.text }}
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
                backgroundColor: theme.primary,
                color: theme.secondary
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