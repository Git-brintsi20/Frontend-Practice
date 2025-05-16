// src/components/common/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Styled button component with animation
 * @param {Object} props - Component props
 * @param {string} props.children - Button text or content
 * @param {function} props.onClick - Click handler
 * @param {string} [props.variant='primary'] - Button style variant ('primary', 'secondary', 'outline')
 * @param {string} [props.size='medium'] - Button size ('small', 'medium', 'large')
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.className=''] - Additional CSS classes
 */
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();
  
  // Determine styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primary,
          color: '#ffffff',
          border: 'none'
        };
      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          color: theme.text,
          border: `2px solid ${theme.primary}`
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.primary,
          border: `2px solid ${theme.primary}`
        };
      default:
        return {
          backgroundColor: theme.primary,
          color: '#ffffff',
          border: 'none'
        };
    }
  };
  
  // Determine size classes
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'py-2 px-4 text-sm';
      case 'large': return 'py-4 px-8 text-lg';
      default: return 'py-3 px-6 text-base';
    }
  };
  
  const buttonStyles = getButtonStyles();
  const sizeClass = getSizeClass();
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`button ${sizeClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        ...buttonStyles,
        fontFamily: theme.fontFamily,
        borderRadius: '50px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease'
      }}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;