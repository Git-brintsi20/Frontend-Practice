import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/NavBar.css';

const NavBar = () => {
  const { theme } = useTheme();

  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink 
          to="/" 
          style={{ color: theme.secondary }} 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Intro
        </NavLink>
        <NavLink 
          to="/journey" 
          style={{ color: theme.secondary }} 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Journey
        </NavLink>
        <NavLink 
          to="/letter" 
          style={{ color: theme.secondary }} 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Letter
        </NavLink>
        <NavLink 
          to="/music-room" 
          style={{ color: theme.secondary }} 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Music Room
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;