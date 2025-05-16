
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({
  theme: {},
  themeMode: 'default',
  changeThemeNew: () => {}
});

const themes = {
  default: {
    primary: '#6A1B9A',
    secondary: '#AB47BC',
    background: '#4A148C',
    text: '#FFFFFF',
    accent: '#FF69B4',
    gradient: 'linear-gradient(135deg, #4A148C, #6A1B9A, #AB47BC)',
    fontFamily: "'Poppins', sans-serif"
  },
  jungkook: {
    primary: 'rgba(251, 14, 215, 0.85)',
    secondary: '#FFF9C4',
    background: '#FFFDE7',
    text: '#3E2723',
    accent: '#FFCA28',
    gradient: 'linear-gradient(135deg,rgba(251, 14, 215, 0.85), #FFF9C4)',
    fontFamily: "'Roboto', sans-serif"
  },
  jin: {
    primary: '#B3E5FC',
    secondary: '#E1F5FE',
    background: '#E3F2FD',
    text: '#01579B',
    accent: '#81D4FA',
    gradient: 'linear-gradient(135deg, #B3E5FC, #E1F5FE)',
    fontFamily: "'Lora', serif"
  }
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('default');
  const [theme, setTheme] = useState(themes.default);

  const changeThemeNew = (mode) => {
    setThemeMode(mode);
    setTheme(themes[mode] || themes.default);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, changeThemeNew }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
