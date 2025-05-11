import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({
  theme: {},
  themeMode: 'default',
  changeThemeNew: () => {}
});

const themes = {
  default: {
    primary: '#E1BEE7',
    secondary: '#F3E5F5',
    background: '#F5F5F5',
    text: '#4A148C',
    accent: '#CE93D8',
    gradient: 'linear-gradient(135deg, #E1BEE7, #F3E5F5)',
    fontFamily: "'Poppins', sans-serif"
  },
  jungkook: {
    primary: '#FFD700',
    secondary: '#FFF9C4',
    background: '#FFFDE7',
    text: '#3E2723',
    accent: '#FFCA28',
    gradient: 'linear-gradient(135deg, #FFD700, #FFF9C4)',
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