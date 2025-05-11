// ThemeContext.jsx - Fix
// Add gradient functionality and ensure compatibility with older components

import React, { createContext, useContext, useState, useEffect } from 'react';

// BTS theme colors (from old)
const THEMES_OLD = {
  default: {
    primary: '#8a7de0', // BTS Purple
    secondary: '#f8f8ff',
    background: '#fafafa',
    text: '#333333',
    accent: '#ff0080', // Pink accent
    fontFamily: "'Montserrat', sans-serif",
  },
  jk: {
    primary: '#fb9ca1', // JK Pink
    secondary: '#000000',
    background: '#f0e6ef',
    text: '#222222',
    accent: '#ffbbc5',
    fontFamily: "'Poppins', sans-serif",
  },
  jin: {
    primary: '#f190b7', // Jin Pink
    secondary: '#ffffff',
    background: '#e8f5ff',
    text: '#222222',
    accent: '#91c1ff', // Blue accent
    fontFamily: "'Raleway', sans-serif",
  },
};

// BTS themed colors (from new)
const BTS_THEMES_NEW = {
  default: {
    primary: '#8a7de0', // BTS Purple
    secondary: '#f8f8ff',
    background: '#fafafa',
    text: '#333333',
    accent: '#ff0080',
    gradient: 'linear-gradient(135deg, #8a7de0 0%, #a67de0 100%)',
    backgroundImage: '/assets/images/backgrounds/purple-gradient.jpeg'
  },
  jungkook: {
    primary: '#ff0000', // JK's signature red
    secondary: '#121212',
    background: '#f5f5f5',
    text: '#1a1a1a',
    accent: '#ffdb58',
    gradient: 'linear-gradient(135deg, #ff0000 0%, #ff6b6b 100%)',
    backgroundImage: '/assets/images/backgrounds/jk-pattern.png'
  },
  jin: {
    primary: '#ffb6c1', // Jin's pinkish hue
    secondary: '#ffffff',
    background: '#f8f8ff',
    text: '#333333',
    accent: '#4169e1',
    gradient: 'linear-gradient(135deg, #ffb6c1 0%, #ffd1d1 100%)',
    backgroundImage: '/assets/images/backgrounds/jin-pattern.png'
  },
  dark: {
    primary: '#9370db',
    secondary: '#2a2a2a',
    background: '#121212',
    text: '#f5f5f5',
    accent: '#8a2be2',
    gradient: 'linear-gradient(135deg, #121212 0%, #2d2d2d 100%)',
    backgroundImage: '/assets/images/backgrounds/dark-pattern.png'
  }
};

const ThemeContext = createContext({
  theme: BTS_THEMES_NEW.default, // Default to the new default theme
  themeModeOld: 'default',
  setThemeModeOld: () => {},
  currentThemeNew: 'default',
  changeThemeNew: () => {},
  // Add these for backwards compatibility with old components
  themeMode: 'default',
  setThemeMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // State from old
  const [themeModeOld, _setThemeModeOld] = useState('default');

  // State from new
  const [currentThemeNew, setCurrentThemeNew] = useState('default');

  // Combined theme object (prioritizing new but including old properties)
  const theme = {
    ...BTS_THEMES_NEW[currentThemeNew] || BTS_THEMES_NEW.default,
    fontFamily: THEMES_OLD[themeModeOld]?.fontFamily, // Include fontFamily from old
  };

  // Apply theme to document root for global CSS access
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--background-color', theme.background);
    document.documentElement.style.setProperty('--text-color', theme.text);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    document.documentElement.style.setProperty('--gradient', theme.gradient);
    document.documentElement.style.setProperty('--font-family', theme.fontFamily);
    
    // Set background image if available
    if (theme.backgroundImage) {
      document.body.style.backgroundImage = `url(${theme.backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
    } else {
      document.body.style.backgroundImage = 'none';
    }
  }, [theme]);

  const changeThemeNew = (themeName) => {
    if (BTS_THEMES_NEW[themeName]) {
      setCurrentThemeNew(themeName);
      // Legacy mapping for old components
      if (themeName === 'jungkook') _setThemeModeOld('jk');
      else if (themeName === 'jin') _setThemeModeOld('jin');
      else _setThemeModeOld('default');
    }
  };

  const setThemeModeOld = (mode) => {
    if (THEMES_OLD[mode]) {
      _setThemeModeOld(mode);
      // Update new theme state to match
      if (mode === 'jk') setCurrentThemeNew('jungkook');
      else if (mode === 'jin') setCurrentThemeNew('jin');
      else setCurrentThemeNew('default');
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeModeOld, 
      setThemeModeOld, 
      currentThemeNew, 
      changeThemeNew,
      // Add these for backwards compatibility
      themeMode: themeModeOld,
      setThemeMode: setThemeModeOld
    }}>
      <div
        className={`theme theme-${currentThemeNew} theme-old-${themeModeOld}`}
        style={{
          '--primary-color': theme.primary,
          '--secondary-color': theme.secondary,
          '--background-color': theme.background,
          '--text-color': theme.text,
          '--accent-color': theme.accent,
          '--gradient': theme.gradient,
          '--font-family': theme.fontFamily,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

