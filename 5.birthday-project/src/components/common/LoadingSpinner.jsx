// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const LoadingSpinner = ({ size = 60, text = 'Loading...', showText = true }) => {
  const { theme } = useTheme();
  
  return (
    <div className="loading-spinner-container">
      <motion.div
        className="loading-spinner"
        style={{ 
          width: size, 
          height: size,
          borderColor: theme.primary,
          borderTopColor: 'transparent'
        }}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1,
          ease: "linear",
          repeat: Infinity
        }}
      />
      
      {showText && (
        <motion.p 
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ color: theme.text }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;